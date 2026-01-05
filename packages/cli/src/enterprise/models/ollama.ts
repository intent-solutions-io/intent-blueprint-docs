/**
 * Ollama Provider
 * Implementation for local models via Ollama
 */

import type {
  IModelProvider,
  ModelConfig,
  CompletionRequest,
  CompletionResponse,
  StreamChunk,
  ModelInfo,
} from './types.js';

const OLLAMA_DEFAULT_URL = 'http://localhost:11434';

export class OllamaProvider implements IModelProvider {
  readonly name = 'ollama' as const;
  private model: string;
  private baseUrl: string;

  constructor(config: ModelConfig) {
    this.model = config.model || 'llama3.2';
    this.baseUrl = config.baseUrl || process.env.OLLAMA_HOST || OLLAMA_DEFAULT_URL;
  }

  isConfigured(): boolean {
    // Ollama doesn't require API keys, check if server is reachable
    return true;
  }

  async complete(request: CompletionRequest): Promise<CompletionResponse> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages: this.buildMessages(request),
        options: {
          temperature: request.temperature,
          num_predict: request.maxTokens,
          stop: request.stopSequences,
        },
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ollama API error: ${response.status} - ${error}`);
    }

    const data = await response.json() as OllamaResponse;

    return {
      content: data.message?.content || '',
      model: data.model,
      usage: {
        promptTokens: data.prompt_eval_count || 0,
        completionTokens: data.eval_count || 0,
        totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
      },
      finishReason: data.done ? 'stop' : 'length',
      meta: {
        totalDuration: data.total_duration,
        loadDuration: data.load_duration,
        evalDuration: data.eval_duration,
      },
    };
  }

  async *stream(request: CompletionRequest): AsyncGenerator<StreamChunk> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages: this.buildMessages(request),
        options: {
          temperature: request.temperature,
          num_predict: request.maxTokens,
          stop: request.stopSequences,
        },
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ollama API error: ${response.status} - ${error}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        yield { content: '', done: true };
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const event = JSON.parse(line) as OllamaStreamEvent;
          const content = event.message?.content || '';

          if (content) {
            yield { content, done: false };
          }

          if (event.done) {
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
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);

      if (!response.ok) {
        return this.getKnownModels();
      }

      const data = await response.json() as { models: OllamaModel[] };

      return data.models.map(m => ({
        id: m.name,
        name: m.name,
        provider: 'ollama' as const,
        contextWindow: this.getContextWindow(m.name),
        capabilities: ['text', 'code'],
      }));
    } catch {
      return this.getKnownModels();
    }
  }

  async getModelInfo(model: string): Promise<ModelInfo | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/show`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: model }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json() as OllamaModelInfo;

      return {
        id: model,
        name: model,
        provider: 'ollama',
        contextWindow: data.model_info?.['llama.context_length'] || this.getContextWindow(model),
        capabilities: ['text', 'code'],
      };
    } catch {
      return null;
    }
  }

  /**
   * Pull a model from Ollama registry
   */
  async pullModel(model: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: model }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to pull model: ${error}`);
    }

    // Wait for pull to complete
    const reader = response.body?.getReader();
    if (!reader) return;

    while (true) {
      const { done } = await reader.read();
      if (done) break;
    }
  }

  /**
   * Check if Ollama server is running
   */
  async isServerRunning(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/version`);
      return response.ok;
    } catch {
      return false;
    }
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

  private getContextWindow(model: string): number {
    // Return known context windows for popular models
    if (model.includes('llama3')) return 8192;
    if (model.includes('llama2')) return 4096;
    if (model.includes('mistral')) return 8192;
    if (model.includes('mixtral')) return 32768;
    if (model.includes('codellama')) return 16384;
    if (model.includes('phi')) return 2048;
    if (model.includes('gemma')) return 8192;
    if (model.includes('qwen')) return 32768;
    return 4096; // Default
  }

  private getKnownModels(): ModelInfo[] {
    return [
      {
        id: 'llama3.2',
        name: 'Llama 3.2',
        provider: 'ollama',
        contextWindow: 8192,
        capabilities: ['text', 'code'],
      },
      {
        id: 'llama3.1',
        name: 'Llama 3.1',
        provider: 'ollama',
        contextWindow: 8192,
        capabilities: ['text', 'code'],
      },
      {
        id: 'mistral',
        name: 'Mistral',
        provider: 'ollama',
        contextWindow: 8192,
        capabilities: ['text', 'code'],
      },
      {
        id: 'mixtral',
        name: 'Mixtral',
        provider: 'ollama',
        contextWindow: 32768,
        capabilities: ['text', 'code'],
      },
      {
        id: 'codellama',
        name: 'Code Llama',
        provider: 'ollama',
        contextWindow: 16384,
        capabilities: ['code'],
      },
      {
        id: 'phi3',
        name: 'Phi-3',
        provider: 'ollama',
        contextWindow: 4096,
        capabilities: ['text', 'code'],
      },
      {
        id: 'gemma2',
        name: 'Gemma 2',
        provider: 'ollama',
        contextWindow: 8192,
        capabilities: ['text', 'code'],
      },
      {
        id: 'qwen2.5',
        name: 'Qwen 2.5',
        provider: 'ollama',
        contextWindow: 32768,
        capabilities: ['text', 'code'],
      },
    ];
  }
}

interface OllamaResponse {
  model: string;
  message?: { role: string; content: string };
  done: boolean;
  prompt_eval_count?: number;
  eval_count?: number;
  total_duration?: number;
  load_duration?: number;
  eval_duration?: number;
}

interface OllamaStreamEvent {
  model: string;
  message?: { role: string; content: string };
  done: boolean;
}

interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
}

interface OllamaModelInfo {
  model_info?: {
    'llama.context_length'?: number;
  };
}

/**
 * Create an Ollama provider instance
 */
export function createOllamaProvider(config: Partial<ModelConfig> = {}): OllamaProvider {
  return new OllamaProvider({
    provider: 'ollama',
    model: config.model || 'llama3.2',
    ...config,
  });
}
