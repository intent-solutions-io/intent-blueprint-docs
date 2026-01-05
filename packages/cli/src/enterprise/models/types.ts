/**
 * Multi-Model Support Types
 * Unified interface for Claude, GPT-4, Gemini, and Ollama
 */

/**
 * Supported model providers
 */
export type ModelProvider = 'claude' | 'openai' | 'gemini' | 'ollama';

/**
 * Model configuration
 */
export interface ModelConfig {
  /** Provider type */
  provider: ModelProvider;
  /** Model name/ID */
  model: string;
  /** API key or credentials */
  apiKey?: string;
  /** API base URL (for Ollama or custom endpoints) */
  baseUrl?: string;
  /** Default temperature */
  temperature?: number;
  /** Default max tokens */
  maxTokens?: number;
  /** Organization ID (OpenAI) */
  organization?: string;
  /** Project ID (Google Cloud) */
  projectId?: string;
  /** Region (Google Cloud) */
  region?: string;
}

/**
 * Completion request
 */
export interface CompletionRequest {
  /** System prompt */
  system?: string;
  /** User messages */
  messages: Message[];
  /** Temperature (0-2) */
  temperature?: number;
  /** Max tokens to generate */
  maxTokens?: number;
  /** Stop sequences */
  stopSequences?: string[];
  /** Stream responses */
  stream?: boolean;
}

/**
 * Message in conversation
 */
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Completion response
 */
export interface CompletionResponse {
  /** Generated content */
  content: string;
  /** Model used */
  model: string;
  /** Token usage */
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  /** Finish reason */
  finishReason?: 'stop' | 'length' | 'content_filter' | 'error';
  /** Response metadata */
  meta?: Record<string, unknown>;
}

/**
 * Streaming chunk
 */
export interface StreamChunk {
  /** Content delta */
  content: string;
  /** Whether this is the final chunk */
  done: boolean;
}

/**
 * Model provider interface
 */
export interface IModelProvider {
  /** Provider name */
  readonly name: ModelProvider;

  /** Check if provider is configured */
  isConfigured(): boolean;

  /** Complete a prompt */
  complete(request: CompletionRequest): Promise<CompletionResponse>;

  /** Stream a completion */
  stream(request: CompletionRequest): AsyncGenerator<StreamChunk>;

  /** List available models */
  listModels(): Promise<ModelInfo[]>;

  /** Get model information */
  getModelInfo(model: string): Promise<ModelInfo | null>;
}

/**
 * Model information
 */
export interface ModelInfo {
  /** Model ID */
  id: string;
  /** Display name */
  name: string;
  /** Provider */
  provider: ModelProvider;
  /** Context window size */
  contextWindow?: number;
  /** Max output tokens */
  maxOutput?: number;
  /** Capabilities */
  capabilities?: string[];
  /** Pricing info */
  pricing?: {
    input: number; // per 1M tokens
    output: number; // per 1M tokens
  };
}

/**
 * Model registry entry
 */
export interface ModelRegistryEntry {
  config: ModelConfig;
  provider: IModelProvider;
}

/**
 * Default model configurations
 */
export const DEFAULT_MODELS: Record<ModelProvider, string> = {
  claude: 'claude-sonnet-4-20250514',
  openai: 'gpt-4o',
  gemini: 'gemini-2.0-flash',
  ollama: 'llama3.2',
};

/**
 * Model aliases for user convenience
 */
export const MODEL_ALIASES: Record<string, { provider: ModelProvider; model: string }> = {
  // Claude
  'claude': { provider: 'claude', model: 'claude-sonnet-4-20250514' },
  'claude-sonnet': { provider: 'claude', model: 'claude-sonnet-4-20250514' },
  'claude-opus': { provider: 'claude', model: 'claude-opus-4-20250514' },
  'claude-haiku': { provider: 'claude', model: 'claude-3-5-haiku-20241022' },

  // OpenAI
  'gpt-4': { provider: 'openai', model: 'gpt-4o' },
  'gpt-4o': { provider: 'openai', model: 'gpt-4o' },
  'gpt-4-turbo': { provider: 'openai', model: 'gpt-4-turbo' },
  'gpt-3.5': { provider: 'openai', model: 'gpt-3.5-turbo' },
  'o1': { provider: 'openai', model: 'o1' },
  'o1-mini': { provider: 'openai', model: 'o1-mini' },

  // Gemini
  'gemini': { provider: 'gemini', model: 'gemini-2.0-flash' },
  'gemini-pro': { provider: 'gemini', model: 'gemini-1.5-pro' },
  'gemini-flash': { provider: 'gemini', model: 'gemini-2.0-flash' },

  // Ollama
  'llama': { provider: 'ollama', model: 'llama3.2' },
  'llama3': { provider: 'ollama', model: 'llama3.2' },
  'mistral': { provider: 'ollama', model: 'mistral' },
  'codellama': { provider: 'ollama', model: 'codellama' },
};
