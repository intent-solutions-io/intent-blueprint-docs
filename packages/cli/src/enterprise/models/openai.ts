/**
 * OpenAI Provider
 * Implementation for GPT-4 and other OpenAI models
 */

import type {
  IModelProvider,
  ModelConfig,
  CompletionRequest,
  CompletionResponse,
  StreamChunk,
  ModelInfo,
} from './types.js';

const OPENAI_API_URL = 'https://api.openai.com/v1';

export class OpenAIProvider implements IModelProvider {
  readonly name = 'openai' as const;
  private apiKey: string;
  private model: string;
  private baseUrl: string;
  private organization?: string;

  constructor(config: ModelConfig) {
    this.apiKey = config.apiKey || process.env.OPENAI_API_KEY || '';
    this.model = config.model || 'gpt-4o';
    this.baseUrl = config.baseUrl || OPENAI_API_URL;
    this.organization = config.organization || process.env.OPENAI_ORG_ID;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async complete(request: CompletionRequest): Promise<CompletionResponse> {
    const messages = this.buildMessages(request);

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify({
        model: this.model,
        messages,
        max_tokens: request.maxTokens,
        temperature: request.temperature,
        stop: request.stopSequences,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json() as OpenAIResponse;

    return {
      content: data.choices[0]?.message?.content || '',
      model: data.model,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      } : undefined,
      finishReason: this.mapFinishReason(data.choices[0]?.finish_reason),
      meta: { id: data.id },
    };
  }

  async *stream(request: CompletionRequest): AsyncGenerator<StreamChunk> {
    const messages = this.buildMessages(request);

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify({
        model: this.model,
        messages,
        max_tokens: request.maxTokens,
        temperature: request.temperature,
        stop: request.stopSequences,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
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
          const event = JSON.parse(data) as OpenAIStreamEvent;
          const content = event.choices[0]?.delta?.content || '';
          const done = event.choices[0]?.finish_reason !== null;

          if (content) {
            yield { content, done: false };
          }
          if (done) {
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
    const response = await fetch(`${this.baseUrl}/models`, {
      headers: this.buildHeaders(),
    });

    if (!response.ok) {
      // Return known models if API fails
      return this.getKnownModels();
    }

    const data = await response.json() as { data: Array<{ id: string }> };

    // Filter to chat models
    const chatModels = data.data
      .filter(m => m.id.includes('gpt') || m.id.includes('o1'))
      .map(m => ({
        id: m.id,
        name: m.id,
        provider: 'openai' as const,
      }));

    return chatModels.length > 0 ? chatModels : this.getKnownModels();
  }

  async getModelInfo(model: string): Promise<ModelInfo | null> {
    const models = this.getKnownModels();
    return models.find(m => m.id === model) || null;
  }

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    };

    if (this.organization) {
      headers['OpenAI-Organization'] = this.organization;
    }

    return headers;
  }

  private buildMessages(request: CompletionRequest): Array<{ role: string; content: string }> {
    const messages: Array<{ role: string; content: string }> = [];

    if (request.system) {
      messages.push({ role: 'system', content: request.system });
    }

    for (const msg of request.messages) {
      messages.push({ role: msg.role, content: msg.content });
    }

    return messages;
  }

  private mapFinishReason(reason?: string): CompletionResponse['finishReason'] {
    switch (reason) {
      case 'stop':
        return 'stop';
      case 'length':
        return 'length';
      case 'content_filter':
        return 'content_filter';
      default:
        return 'stop';
    }
  }

  private getKnownModels(): ModelInfo[] {
    return [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'openai',
        contextWindow: 128000,
        maxOutput: 16384,
        capabilities: ['text', 'vision', 'code'],
        pricing: { input: 2.5, output: 10 },
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        provider: 'openai',
        contextWindow: 128000,
        maxOutput: 4096,
        capabilities: ['text', 'vision', 'code'],
        pricing: { input: 10, output: 30 },
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        contextWindow: 16385,
        maxOutput: 4096,
        capabilities: ['text', 'code'],
        pricing: { input: 0.5, output: 1.5 },
      },
      {
        id: 'o1',
        name: 'o1',
        provider: 'openai',
        contextWindow: 200000,
        maxOutput: 100000,
        capabilities: ['text', 'code', 'reasoning'],
        pricing: { input: 15, output: 60 },
      },
      {
        id: 'o1-mini',
        name: 'o1-mini',
        provider: 'openai',
        contextWindow: 128000,
        maxOutput: 65536,
        capabilities: ['text', 'code', 'reasoning'],
        pricing: { input: 3, output: 12 },
      },
    ];
  }
}

interface OpenAIResponse {
  id: string;
  model: string;
  choices: Array<{
    message: { role: string; content: string };
    finish_reason?: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface OpenAIStreamEvent {
  choices: Array<{
    delta: { content?: string };
    finish_reason: string | null;
  }>;
}

/**
 * Create an OpenAI provider instance
 */
export function createOpenAIProvider(config: Partial<ModelConfig> = {}): OpenAIProvider {
  return new OpenAIProvider({
    provider: 'openai',
    model: config.model || 'gpt-4o',
    ...config,
  });
}
