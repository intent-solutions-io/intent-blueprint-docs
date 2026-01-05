/**
 * Gemini Provider (Google)
 * Implementation for Gemini models via Google AI API
 */

import type {
  IModelProvider,
  ModelConfig,
  CompletionRequest,
  CompletionResponse,
  StreamChunk,
  ModelInfo,
} from './types.js';

const GOOGLE_AI_API_URL = 'https://generativelanguage.googleapis.com/v1beta';

export class GeminiProvider implements IModelProvider {
  readonly name = 'gemini' as const;
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor(config: ModelConfig) {
    this.apiKey = config.apiKey || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || '';
    this.model = config.model || 'gemini-2.0-flash';
    this.baseUrl = config.baseUrl || GOOGLE_AI_API_URL;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async complete(request: CompletionRequest): Promise<CompletionResponse> {
    const contents = this.buildContents(request);

    const response = await fetch(
      `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: request.system ? { parts: [{ text: request.system }] } : undefined,
          generationConfig: {
            temperature: request.temperature,
            maxOutputTokens: request.maxTokens,
            stopSequences: request.stopSequences,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json() as GeminiResponse;

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const usage = data.usageMetadata;

    return {
      content,
      model: this.model,
      usage: usage ? {
        promptTokens: usage.promptTokenCount || 0,
        completionTokens: usage.candidatesTokenCount || 0,
        totalTokens: usage.totalTokenCount || 0,
      } : undefined,
      finishReason: this.mapFinishReason(data.candidates?.[0]?.finishReason),
    };
  }

  async *stream(request: CompletionRequest): AsyncGenerator<StreamChunk> {
    const contents = this.buildContents(request);

    const response = await fetch(
      `${this.baseUrl}/models/${this.model}:streamGenerateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: request.system ? { parts: [{ text: request.system }] } : undefined,
          generationConfig: {
            temperature: request.temperature,
            maxOutputTokens: request.maxTokens,
            stopSequences: request.stopSequences,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
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

      // Gemini streams JSON objects separated by newlines
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          // Remove leading comma and brackets from streamed response
          let jsonStr = line.trim();
          if (jsonStr.startsWith('[')) jsonStr = jsonStr.slice(1);
          if (jsonStr.startsWith(',')) jsonStr = jsonStr.slice(1);
          if (jsonStr.endsWith(']')) jsonStr = jsonStr.slice(0, -1);

          const event = JSON.parse(jsonStr) as GeminiStreamEvent;
          const text = event.candidates?.[0]?.content?.parts?.[0]?.text || '';

          if (text) {
            yield { content: text, done: false };
          }

          if (event.candidates?.[0]?.finishReason) {
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
      const response = await fetch(
        `${this.baseUrl}/models?key=${this.apiKey}`,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (!response.ok) {
        return this.getKnownModels();
      }

      const data = await response.json() as { models: Array<{ name: string; displayName: string }> };

      return data.models
        .filter(m => m.name.includes('gemini'))
        .map(m => ({
          id: m.name.replace('models/', ''),
          name: m.displayName,
          provider: 'gemini' as const,
        }));
    } catch {
      return this.getKnownModels();
    }
  }

  async getModelInfo(model: string): Promise<ModelInfo | null> {
    const models = this.getKnownModels();
    return models.find(m => m.id === model) || null;
  }

  private buildContents(request: CompletionRequest): Array<{ role: string; parts: Array<{ text: string }> }> {
    return request.messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));
  }

  private mapFinishReason(reason?: string): CompletionResponse['finishReason'] {
    switch (reason) {
      case 'STOP':
        return 'stop';
      case 'MAX_TOKENS':
        return 'length';
      case 'SAFETY':
        return 'content_filter';
      default:
        return 'stop';
    }
  }

  private getKnownModels(): ModelInfo[] {
    return [
      {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        provider: 'gemini',
        contextWindow: 1000000,
        maxOutput: 8192,
        capabilities: ['text', 'vision', 'code'],
        pricing: { input: 0.075, output: 0.3 },
      },
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        provider: 'gemini',
        contextWindow: 2000000,
        maxOutput: 8192,
        capabilities: ['text', 'vision', 'code', 'audio'],
        pricing: { input: 1.25, output: 5 },
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        provider: 'gemini',
        contextWindow: 1000000,
        maxOutput: 8192,
        capabilities: ['text', 'vision', 'code', 'audio'],
        pricing: { input: 0.075, output: 0.3 },
      },
    ];
  }
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
    finishReason?: string;
  }>;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
}

interface GeminiStreamEvent {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
    finishReason?: string;
  }>;
}

/**
 * Create a Gemini provider instance
 */
export function createGeminiProvider(config: Partial<ModelConfig> = {}): GeminiProvider {
  return new GeminiProvider({
    provider: 'gemini',
    model: config.model || 'gemini-2.0-flash',
    ...config,
  });
}
