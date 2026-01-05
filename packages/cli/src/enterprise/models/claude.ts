/**
 * Claude Provider (Anthropic)
 * Implementation for Claude models via Anthropic API
 */

import type {
  IModelProvider,
  ModelConfig,
  CompletionRequest,
  CompletionResponse,
  StreamChunk,
  ModelInfo,
} from './types.js';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1';
const ANTHROPIC_VERSION = '2023-06-01';

export class ClaudeProvider implements IModelProvider {
  readonly name = 'claude' as const;
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor(config: ModelConfig) {
    this.apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY || '';
    this.model = config.model || 'claude-sonnet-4-20250514';
    this.baseUrl = config.baseUrl || ANTHROPIC_API_URL;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async complete(request: CompletionRequest): Promise<CompletionResponse> {
    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: request.maxTokens || 4096,
        temperature: request.temperature,
        system: request.system,
        messages: request.messages.filter(m => m.role !== 'system').map(m => ({
          role: m.role,
          content: m.content,
        })),
        stop_sequences: request.stopSequences,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${error}`);
    }

    const data = await response.json() as ClaudeResponse;

    return {
      content: data.content[0]?.text || '',
      model: data.model,
      usage: {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
      },
      finishReason: this.mapStopReason(data.stop_reason),
      meta: { id: data.id },
    };
  }

  async *stream(request: CompletionRequest): AsyncGenerator<StreamChunk> {
    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: request.maxTokens || 4096,
        temperature: request.temperature,
        system: request.system,
        messages: request.messages.filter(m => m.role !== 'system').map(m => ({
          role: m.role,
          content: m.content,
        })),
        stop_sequences: request.stopSequences,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${error}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6);
        if (data === '[DONE]') {
          yield { content: '', done: true };
          return;
        }

        try {
          const event = JSON.parse(data) as ClaudeStreamEvent;
          if (event.type === 'content_block_delta' && event.delta?.text) {
            yield { content: event.delta.text, done: false };
          }
          if (event.type === 'message_stop') {
            yield { content: '', done: true };
            return;
          }
        } catch {
          // Ignore parse errors
        }
      }
    }
  }

  async listModels(): Promise<ModelInfo[]> {
    // Anthropic doesn't have a models endpoint, return known models
    return [
      {
        id: 'claude-opus-4-20250514',
        name: 'Claude Opus 4',
        provider: 'claude',
        contextWindow: 200000,
        maxOutput: 32000,
        capabilities: ['text', 'vision', 'code'],
        pricing: { input: 15, output: 75 },
      },
      {
        id: 'claude-sonnet-4-20250514',
        name: 'Claude Sonnet 4',
        provider: 'claude',
        contextWindow: 200000,
        maxOutput: 64000,
        capabilities: ['text', 'vision', 'code'],
        pricing: { input: 3, output: 15 },
      },
      {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude 3.5 Haiku',
        provider: 'claude',
        contextWindow: 200000,
        maxOutput: 8192,
        capabilities: ['text', 'vision', 'code'],
        pricing: { input: 0.8, output: 4 },
      },
    ];
  }

  async getModelInfo(model: string): Promise<ModelInfo | null> {
    const models = await this.listModels();
    return models.find(m => m.id === model) || null;
  }

  private mapStopReason(reason?: string): CompletionResponse['finishReason'] {
    switch (reason) {
      case 'end_turn':
      case 'stop_sequence':
        return 'stop';
      case 'max_tokens':
        return 'length';
      default:
        return 'stop';
    }
  }
}

interface ClaudeResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{ type: string; text: string }>;
  model: string;
  stop_reason?: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface ClaudeStreamEvent {
  type: string;
  delta?: { text?: string };
}

/**
 * Create a Claude provider instance
 */
export function createClaudeProvider(config: Partial<ModelConfig> = {}): ClaudeProvider {
  return new ClaudeProvider({
    provider: 'claude',
    model: config.model || 'claude-sonnet-4-20250514',
    ...config,
  });
}
