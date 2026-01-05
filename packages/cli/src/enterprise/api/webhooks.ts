/**
 * Webhook System
 * Subscribe to events and receive HTTP callbacks
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { randomUUID } from 'crypto';
import { createHmac } from 'crypto';

/**
 * Webhook event types
 */
export type WebhookEvent =
  | 'generation.started'
  | 'generation.completed'
  | 'generation.failed'
  | 'export.started'
  | 'export.completed'
  | 'export.failed'
  | 'template.created'
  | 'template.updated'
  | 'template.deleted'
  | 'audit.entry';

/**
 * Webhook configuration
 */
export interface Webhook {
  /** Unique webhook ID */
  id: string;
  /** Webhook name */
  name: string;
  /** Target URL */
  url: string;
  /** Events to subscribe to */
  events: WebhookEvent[];
  /** Secret for signature verification */
  secret?: string;
  /** Whether webhook is active */
  active: boolean;
  /** Retry configuration */
  retry?: {
    maxAttempts: number;
    backoffMs: number;
  };
  /** Created timestamp */
  createdAt: string;
  /** Last triggered timestamp */
  lastTriggeredAt?: string;
  /** Failure count */
  failureCount: number;
}

/**
 * Webhook payload
 */
export interface WebhookPayload<T = unknown> {
  /** Event type */
  event: WebhookEvent;
  /** Event timestamp */
  timestamp: string;
  /** Webhook ID */
  webhookId: string;
  /** Delivery ID */
  deliveryId: string;
  /** Event data */
  data: T;
}

/**
 * Webhook delivery result
 */
export interface DeliveryResult {
  webhookId: string;
  deliveryId: string;
  success: boolean;
  statusCode?: number;
  error?: string;
  duration: number;
  attempt: number;
}

/**
 * Generation event data
 */
export interface GenerationEventData {
  templateId: string;
  templateName: string;
  variables: Record<string, unknown>;
  output?: string;
  duration?: number;
  error?: string;
}

/**
 * Export event data
 */
export interface ExportEventData {
  target: string;
  templateId: string;
  resourceCount: number;
  resources: Array<{ type: string; id: string; title: string }>;
  error?: string;
}

/**
 * Template event data
 */
export interface TemplateEventData {
  templateId: string;
  templateName: string;
  version: string;
  action: 'created' | 'updated' | 'deleted';
}

const WEBHOOKS_FILENAME = '.blueprint-webhooks.json';

export class WebhookManager {
  private webhooks: Map<string, Webhook> = new Map();
  private storagePath: string;
  private deliveryQueue: Array<{ webhook: Webhook; payload: WebhookPayload }> = [];
  private processing = false;

  constructor(storagePath?: string) {
    this.storagePath = storagePath
      ? join(storagePath, WEBHOOKS_FILENAME)
      : join(process.cwd(), WEBHOOKS_FILENAME);
    this.load();
  }

  /**
   * Load webhooks from storage
   */
  private load(): void {
    if (!existsSync(this.storagePath)) return;

    try {
      const content = readFileSync(this.storagePath, 'utf-8');
      const data = JSON.parse(content) as Webhook[];
      for (const webhook of data) {
        this.webhooks.set(webhook.id, webhook);
      }
    } catch {
      // Ignore load errors
    }
  }

  /**
   * Save webhooks to storage
   */
  private save(): void {
    const dir = dirname(this.storagePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const data = Array.from(this.webhooks.values());
    writeFileSync(this.storagePath, JSON.stringify(data, null, 2));
  }

  /**
   * Create a new webhook
   */
  create(params: {
    name: string;
    url: string;
    events: WebhookEvent[];
    secret?: string;
    retry?: { maxAttempts: number; backoffMs: number };
  }): Webhook {
    const webhook: Webhook = {
      id: randomUUID(),
      name: params.name,
      url: params.url,
      events: params.events,
      secret: params.secret,
      active: true,
      retry: params.retry || { maxAttempts: 3, backoffMs: 1000 },
      createdAt: new Date().toISOString(),
      failureCount: 0,
    };

    this.webhooks.set(webhook.id, webhook);
    this.save();
    return webhook;
  }

  /**
   * Get a webhook by ID
   */
  get(id: string): Webhook | undefined {
    return this.webhooks.get(id);
  }

  /**
   * List all webhooks
   */
  list(): Webhook[] {
    return Array.from(this.webhooks.values());
  }

  /**
   * Update a webhook
   */
  update(id: string, updates: Partial<Omit<Webhook, 'id' | 'createdAt'>>): Webhook | undefined {
    const webhook = this.webhooks.get(id);
    if (!webhook) return undefined;

    const updated = { ...webhook, ...updates };
    this.webhooks.set(id, updated);
    this.save();
    return updated;
  }

  /**
   * Delete a webhook
   */
  delete(id: string): boolean {
    const deleted = this.webhooks.delete(id);
    if (deleted) this.save();
    return deleted;
  }

  /**
   * Activate a webhook
   */
  activate(id: string): boolean {
    const webhook = this.webhooks.get(id);
    if (!webhook) return false;
    webhook.active = true;
    webhook.failureCount = 0;
    this.save();
    return true;
  }

  /**
   * Deactivate a webhook
   */
  deactivate(id: string): boolean {
    const webhook = this.webhooks.get(id);
    if (!webhook) return false;
    webhook.active = false;
    this.save();
    return true;
  }

  /**
   * Trigger an event
   */
  async trigger<T>(event: WebhookEvent, data: T): Promise<DeliveryResult[]> {
    const results: DeliveryResult[] = [];

    // Find webhooks subscribed to this event
    const subscribers = Array.from(this.webhooks.values())
      .filter(w => w.active && w.events.includes(event));

    // Deliver to each subscriber
    for (const webhook of subscribers) {
      const deliveryId = randomUUID();
      const payload: WebhookPayload<T> = {
        event,
        timestamp: new Date().toISOString(),
        webhookId: webhook.id,
        deliveryId,
        data,
      };

      const result = await this.deliver(webhook, payload);
      results.push(result);

      // Update webhook status
      webhook.lastTriggeredAt = new Date().toISOString();
      if (!result.success) {
        webhook.failureCount++;
        // Auto-deactivate after 10 consecutive failures
        if (webhook.failureCount >= 10) {
          webhook.active = false;
        }
      } else {
        webhook.failureCount = 0;
      }
    }

    this.save();
    return results;
  }

  /**
   * Deliver a webhook payload
   */
  private async deliver(webhook: Webhook, payload: WebhookPayload): Promise<DeliveryResult> {
    const startTime = Date.now();
    const maxAttempts = webhook.retry?.maxAttempts || 3;
    const backoffMs = webhook.retry?.backoffMs || 1000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await this.sendRequest(webhook, payload);

        return {
          webhookId: webhook.id,
          deliveryId: payload.deliveryId,
          success: response.ok,
          statusCode: response.status,
          duration: Date.now() - startTime,
          attempt,
        };
      } catch (error) {
        const isLastAttempt = attempt === maxAttempts;

        if (isLastAttempt) {
          return {
            webhookId: webhook.id,
            deliveryId: payload.deliveryId,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            duration: Date.now() - startTime,
            attempt,
          };
        }

        // Wait before retry
        await this.sleep(backoffMs * attempt);
      }
    }

    return {
      webhookId: webhook.id,
      deliveryId: payload.deliveryId,
      success: false,
      error: 'Max retries exceeded',
      duration: Date.now() - startTime,
      attempt: maxAttempts,
    };
  }

  /**
   * Send HTTP request
   */
  private async sendRequest(webhook: Webhook, payload: WebhookPayload): Promise<Response> {
    const body = JSON.stringify(payload);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Webhook-Event': payload.event,
      'X-Webhook-Delivery': payload.deliveryId,
    };

    // Add signature if secret is configured
    if (webhook.secret) {
      const signature = this.sign(body, webhook.secret);
      headers['X-Webhook-Signature'] = signature;
    }

    return fetch(webhook.url, {
      method: 'POST',
      headers,
      body,
    });
  }

  /**
   * Sign payload with HMAC-SHA256
   */
  private sign(payload: string, secret: string): string {
    const hmac = createHmac('sha256', secret);
    hmac.update(payload);
    return `sha256=${hmac.digest('hex')}`;
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Convenience methods for specific events

  /**
   * Trigger generation started event
   */
  async onGenerationStarted(data: GenerationEventData): Promise<DeliveryResult[]> {
    return this.trigger('generation.started', data);
  }

  /**
   * Trigger generation completed event
   */
  async onGenerationCompleted(data: GenerationEventData): Promise<DeliveryResult[]> {
    return this.trigger('generation.completed', data);
  }

  /**
   * Trigger generation failed event
   */
  async onGenerationFailed(data: GenerationEventData): Promise<DeliveryResult[]> {
    return this.trigger('generation.failed', data);
  }

  /**
   * Trigger export started event
   */
  async onExportStarted(data: ExportEventData): Promise<DeliveryResult[]> {
    return this.trigger('export.started', data);
  }

  /**
   * Trigger export completed event
   */
  async onExportCompleted(data: ExportEventData): Promise<DeliveryResult[]> {
    return this.trigger('export.completed', data);
  }

  /**
   * Trigger export failed event
   */
  async onExportFailed(data: ExportEventData): Promise<DeliveryResult[]> {
    return this.trigger('export.failed', data);
  }

  /**
   * Trigger template created event
   */
  async onTemplateCreated(data: TemplateEventData): Promise<DeliveryResult[]> {
    return this.trigger('template.created', data);
  }

  /**
   * Trigger template updated event
   */
  async onTemplateUpdated(data: TemplateEventData): Promise<DeliveryResult[]> {
    return this.trigger('template.updated', data);
  }

  /**
   * Trigger template deleted event
   */
  async onTemplateDeleted(data: TemplateEventData): Promise<DeliveryResult[]> {
    return this.trigger('template.deleted', data);
  }
}

/**
 * Create a webhook manager instance
 */
export function createWebhookManager(storagePath?: string): WebhookManager {
  return new WebhookManager(storagePath);
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = createHmac('sha256', secret).update(payload).digest('hex');
  return signature === `sha256=${expected}`;
}
