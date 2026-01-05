/**
 * Audit Trail System
 * Track document generation events with timestamps, users, and metadata
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync } from 'fs';
import { join, dirname } from 'path';
import { randomUUID } from 'crypto';
import type { AuditEntry, TeamConfig } from '../templates/types.js';

const AUDIT_FILENAME = '.blueprint-audit.jsonl';

export interface AuditOptions {
  /** Directory to store audit logs */
  logDir?: string;
  /** Whether to enable audit logging */
  enabled?: boolean;
  /** Retention period in days */
  retention?: number;
  /** Remote destination for audit logs */
  destination?: string;
}

export class AuditTrail {
  private logPath: string;
  private enabled: boolean;
  private retention: number;
  private destination?: string;

  constructor(options: AuditOptions = {}) {
    this.logPath = options.logDir
      ? join(options.logDir, AUDIT_FILENAME)
      : join(process.cwd(), AUDIT_FILENAME);
    this.enabled = options.enabled ?? true;
    this.retention = options.retention ?? 90;
    this.destination = options.destination;
  }

  /**
   * Create from team config
   */
  static fromTeamConfig(config: TeamConfig, projectPath?: string): AuditTrail {
    const logDir = projectPath || process.cwd();
    return new AuditTrail({
      logDir,
      enabled: config.audit?.enabled ?? true,
      retention: config.audit?.retention ?? 90,
      destination: config.audit?.destination,
    });
  }

  /**
   * Log a document generation event
   */
  logGeneration(params: {
    user?: string;
    template: string;
    variables: Record<string, unknown>;
    output?: string;
    duration?: number;
    success: boolean;
    error?: string;
  }): AuditEntry {
    return this.log({
      action: 'generate',
      ...params,
    });
  }

  /**
   * Log a document export event
   */
  logExport(params: {
    user?: string;
    template: string;
    variables: Record<string, unknown>;
    output?: string;
    duration?: number;
    success: boolean;
    error?: string;
  }): AuditEntry {
    return this.log({
      action: 'export',
      ...params,
    });
  }

  /**
   * Log a template customization event
   */
  logCustomization(params: {
    user?: string;
    template: string;
    variables: Record<string, unknown>;
    output?: string;
    duration?: number;
    success: boolean;
    error?: string;
  }): AuditEntry {
    return this.log({
      action: 'customize',
      ...params,
    });
  }

  /**
   * Log a template creation event
   */
  logCreation(params: {
    user?: string;
    template: string;
    variables: Record<string, unknown>;
    output?: string;
    duration?: number;
    success: boolean;
    error?: string;
  }): AuditEntry {
    return this.log({
      action: 'create',
      ...params,
    });
  }

  /**
   * Log an audit entry
   */
  private log(params: {
    action: AuditEntry['action'];
    user?: string;
    template: string;
    variables: Record<string, unknown>;
    output?: string;
    duration?: number;
    success: boolean;
    error?: string;
  }): AuditEntry {
    const entry: AuditEntry = {
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      user: params.user || this.getCurrentUser(),
      action: params.action,
      template: params.template,
      variables: params.variables,
      output: params.output,
      duration: params.duration,
      success: params.success,
      error: params.error,
    };

    if (this.enabled) {
      this.writeEntry(entry);
    }

    return entry;
  }

  /**
   * Write entry to audit log
   */
  private writeEntry(entry: AuditEntry): void {
    const dir = dirname(this.logPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const line = JSON.stringify(entry) + '\n';
    appendFileSync(this.logPath, line);

    // Send to remote destination if configured
    if (this.destination) {
      this.sendToDestination(entry).catch(err => {
        console.warn(`Failed to send audit entry to ${this.destination}:`, err);
      });
    }
  }

  /**
   * Send entry to remote destination
   */
  private async sendToDestination(entry: AuditEntry): Promise<void> {
    if (!this.destination) return;

    // Support HTTP(S) endpoints
    if (this.destination.startsWith('http://') || this.destination.startsWith('https://')) {
      await fetch(this.destination, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    }
  }

  /**
   * Get current user from environment
   */
  private getCurrentUser(): string {
    return process.env.USER || process.env.USERNAME || 'unknown';
  }

  /**
   * Read all audit entries
   */
  readAll(): AuditEntry[] {
    if (!existsSync(this.logPath)) {
      return [];
    }

    const content = readFileSync(this.logPath, 'utf-8');
    const lines = content.trim().split('\n').filter(line => line.trim());

    return lines.map(line => JSON.parse(line) as AuditEntry);
  }

  /**
   * Read entries within a date range
   */
  readRange(startDate: Date, endDate: Date): AuditEntry[] {
    return this.readAll().filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= startDate && entryDate <= endDate;
    });
  }

  /**
   * Read entries by user
   */
  readByUser(user: string): AuditEntry[] {
    return this.readAll().filter(entry => entry.user === user);
  }

  /**
   * Read entries by template
   */
  readByTemplate(template: string): AuditEntry[] {
    return this.readAll().filter(entry => entry.template === template);
  }

  /**
   * Read entries by action type
   */
  readByAction(action: AuditEntry['action']): AuditEntry[] {
    return this.readAll().filter(entry => entry.action === action);
  }

  /**
   * Get generation statistics
   */
  getStats(): AuditStats {
    const entries = this.readAll();

    const stats: AuditStats = {
      totalGenerations: 0,
      successfulGenerations: 0,
      failedGenerations: 0,
      averageDuration: 0,
      byTemplate: {},
      byUser: {},
      byAction: {
        generate: 0,
        export: 0,
        customize: 0,
        create: 0,
      },
      recentActivity: [],
    };

    if (entries.length === 0) return stats;

    let totalDuration = 0;
    let durationCount = 0;

    for (const entry of entries) {
      stats.totalGenerations++;

      if (entry.success) {
        stats.successfulGenerations++;
      } else {
        stats.failedGenerations++;
      }

      if (entry.duration !== undefined) {
        totalDuration += entry.duration;
        durationCount++;
      }

      // By template
      stats.byTemplate[entry.template] = (stats.byTemplate[entry.template] || 0) + 1;

      // By user
      if (entry.user) {
        stats.byUser[entry.user] = (stats.byUser[entry.user] || 0) + 1;
      }

      // By action
      stats.byAction[entry.action]++;
    }

    stats.averageDuration = durationCount > 0 ? totalDuration / durationCount : 0;

    // Get last 10 activities
    stats.recentActivity = entries.slice(-10).reverse();

    return stats;
  }

  /**
   * Clean up old entries based on retention policy
   */
  cleanup(): number {
    const entries = this.readAll();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.retention);

    const remainingEntries = entries.filter(entry => {
      return new Date(entry.timestamp) >= cutoffDate;
    });

    const removedCount = entries.length - remainingEntries.length;

    if (removedCount > 0) {
      // Rewrite the file with remaining entries
      const content = remainingEntries.map(e => JSON.stringify(e)).join('\n') + '\n';
      writeFileSync(this.logPath, content);
    }

    return removedCount;
  }

  /**
   * Export audit log to various formats
   */
  export(format: 'json' | 'csv' | 'html'): string {
    const entries = this.readAll();

    switch (format) {
      case 'json':
        return JSON.stringify(entries, null, 2);

      case 'csv':
        return this.toCsv(entries);

      case 'html':
        return this.toHtml(entries);

      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Convert entries to CSV format
   */
  private toCsv(entries: AuditEntry[]): string {
    const headers = ['id', 'timestamp', 'user', 'action', 'template', 'output', 'duration', 'success', 'error'];
    const lines = [headers.join(',')];

    for (const entry of entries) {
      const row = [
        entry.id,
        entry.timestamp,
        entry.user || '',
        entry.action,
        entry.template,
        entry.output || '',
        entry.duration?.toString() || '',
        entry.success.toString(),
        entry.error || '',
      ];
      lines.push(row.map(v => `"${v.replace(/"/g, '""')}"`).join(','));
    }

    return lines.join('\n');
  }

  /**
   * Convert entries to HTML table
   */
  private toHtml(entries: AuditEntry[]): string {
    const rows = entries.map(entry => `
      <tr>
        <td>${entry.id}</td>
        <td>${entry.timestamp}</td>
        <td>${entry.user || '-'}</td>
        <td>${entry.action}</td>
        <td>${entry.template}</td>
        <td>${entry.success ? '✓' : '✗'}</td>
        <td>${entry.duration ? `${entry.duration}ms` : '-'}</td>
        <td>${entry.error || '-'}</td>
      </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
  <title>Blueprint Audit Log</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f5f5f5; }
    tr:nth-child(even) { background: #fafafa; }
  </style>
</head>
<body>
  <h1>Blueprint Audit Log</h1>
  <p>Generated: ${new Date().toISOString()}</p>
  <p>Total entries: ${entries.length}</p>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Timestamp</th>
        <th>User</th>
        <th>Action</th>
        <th>Template</th>
        <th>Success</th>
        <th>Duration</th>
        <th>Error</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</body>
</html>
    `.trim();
  }

  /**
   * Get the audit log file path
   */
  getLogPath(): string {
    return this.logPath;
  }

  /**
   * Check if audit logging is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}

export interface AuditStats {
  totalGenerations: number;
  successfulGenerations: number;
  failedGenerations: number;
  averageDuration: number;
  byTemplate: Record<string, number>;
  byUser: Record<string, number>;
  byAction: Record<AuditEntry['action'], number>;
  recentActivity: AuditEntry[];
}

/**
 * Create an audit trail instance
 */
export function createAuditTrail(options?: AuditOptions): AuditTrail {
  return new AuditTrail(options);
}
