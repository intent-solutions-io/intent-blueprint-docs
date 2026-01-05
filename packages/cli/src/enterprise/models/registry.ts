/**
 * Model Registry
 * Unified interface for managing multiple model providers
 */

import type {
  ModelProvider,
  ModelConfig,
  IModelProvider,
  CompletionRequest,
  CompletionResponse,
  StreamChunk,
  ModelInfo,
} from './types.js';
import { MODEL_ALIASES } from './types.js';
import { ClaudeProvider } from './claude.js';
import { OpenAIProvider } from './openai.js';
import { GeminiProvider } from './gemini.js';
import { OllamaProvider } from './ollama.js';

export interface RegistryConfig {
  /** Default provider to use */
  defaultProvider?: ModelProvider;
  /** Provider-specific configurations */
  providers?: {
    claude?: Partial<ModelConfig>;
    openai?: Partial<ModelConfig>;
    gemini?: Partial<ModelConfig>;
    ollama?: Partial<ModelConfig>;
  };
}

export class ModelRegistry {
  private providers: Map<ModelProvider, IModelProvider> = new Map();
  private defaultProvider: ModelProvider = 'claude';
  private configs: Map<ModelProvider, ModelConfig> = new Map();

  constructor(config: RegistryConfig = {}) {
    this.defaultProvider = config.defaultProvider || 'claude';
    this.initializeProviders(config.providers);
  }

  /**
   * Initialize all providers with configurations
   */
  private initializeProviders(configs?: RegistryConfig['providers']): void {
    // Claude
    const claudeConfig: ModelConfig = {
      provider: 'claude',
      model: configs?.claude?.model || 'claude-sonnet-4-20250514',
      apiKey: configs?.claude?.apiKey,
      baseUrl: configs?.claude?.baseUrl,
    };
    this.configs.set('claude', claudeConfig);
    this.providers.set('claude', new ClaudeProvider(claudeConfig));

    // OpenAI
    const openaiConfig: ModelConfig = {
      provider: 'openai',
      model: configs?.openai?.model || 'gpt-4o',
      apiKey: configs?.openai?.apiKey,
      baseUrl: configs?.openai?.baseUrl,
      organization: configs?.openai?.organization,
    };
    this.configs.set('openai', openaiConfig);
    this.providers.set('openai', new OpenAIProvider(openaiConfig));

    // Gemini
    const geminiConfig: ModelConfig = {
      provider: 'gemini',
      model: configs?.gemini?.model || 'gemini-2.0-flash',
      apiKey: configs?.gemini?.apiKey,
      baseUrl: configs?.gemini?.baseUrl,
      projectId: configs?.gemini?.projectId,
      region: configs?.gemini?.region,
    };
    this.configs.set('gemini', geminiConfig);
    this.providers.set('gemini', new GeminiProvider(geminiConfig));

    // Ollama
    const ollamaConfig: ModelConfig = {
      provider: 'ollama',
      model: configs?.ollama?.model || 'llama3.2',
      baseUrl: configs?.ollama?.baseUrl,
    };
    this.configs.set('ollama', ollamaConfig);
    this.providers.set('ollama', new OllamaProvider(ollamaConfig));
  }

  /**
   * Get a provider by name
   */
  getProvider(name: ModelProvider): IModelProvider | undefined {
    return this.providers.get(name);
  }

  /**
   * Get the default provider
   */
  getDefaultProvider(): IModelProvider {
    return this.providers.get(this.defaultProvider)!;
  }

  /**
   * Set the default provider
   */
  setDefaultProvider(name: ModelProvider): void {
    if (!this.providers.has(name)) {
      throw new Error(`Unknown provider: ${name}`);
    }
    this.defaultProvider = name;
  }

  /**
   * List all available providers
   */
  listProviders(): Array<{ name: ModelProvider; configured: boolean }> {
    return Array.from(this.providers.entries()).map(([name, provider]) => ({
      name,
      configured: provider.isConfigured(),
    }));
  }

  /**
   * List configured (ready to use) providers
   */
  listConfiguredProviders(): ModelProvider[] {
    return Array.from(this.providers.entries())
      .filter(([_, provider]) => provider.isConfigured())
      .map(([name]) => name);
  }

  /**
   * Complete using a specific provider or default
   */
  async complete(
    request: CompletionRequest,
    providerName?: ModelProvider
  ): Promise<CompletionResponse> {
    const provider = providerName
      ? this.providers.get(providerName)
      : this.getDefaultProvider();

    if (!provider) {
      throw new Error(`Provider not found: ${providerName}`);
    }

    if (!provider.isConfigured()) {
      throw new Error(`Provider ${provider.name} is not configured`);
    }

    return provider.complete(request);
  }

  /**
   * Stream using a specific provider or default
   */
  stream(
    request: CompletionRequest,
    providerName?: ModelProvider
  ): AsyncGenerator<StreamChunk> {
    const provider = providerName
      ? this.providers.get(providerName)
      : this.getDefaultProvider();

    if (!provider) {
      throw new Error(`Provider not found: ${providerName}`);
    }

    if (!provider.isConfigured()) {
      throw new Error(`Provider ${provider.name} is not configured`);
    }

    return provider.stream(request);
  }

  /**
   * Complete with automatic provider selection based on model alias
   */
  async completeWithAlias(
    alias: string,
    request: CompletionRequest
  ): Promise<CompletionResponse> {
    const { provider, model } = this.resolveAlias(alias);

    // Temporarily set the model for this request
    const providerInstance = this.providers.get(provider);
    if (!providerInstance) {
      throw new Error(`Provider not found: ${provider}`);
    }

    // Create a new provider with the specific model
    const config = this.configs.get(provider)!;
    const tempConfig = { ...config, model };

    const tempProvider = this.createProvider(tempConfig);
    return tempProvider.complete(request);
  }

  /**
   * Resolve a model alias to provider and model
   */
  resolveAlias(alias: string): { provider: ModelProvider; model: string } {
    // Check aliases first
    const aliasEntry = (MODEL_ALIASES as Record<string, { provider: ModelProvider; model: string }>)[alias];
    if (aliasEntry) {
      return aliasEntry;
    }

    // Check if it's a full model ID
    if (alias.includes('claude')) {
      return { provider: 'claude', model: alias };
    }
    if (alias.includes('gpt') || alias.includes('o1')) {
      return { provider: 'openai', model: alias };
    }
    if (alias.includes('gemini')) {
      return { provider: 'gemini', model: alias };
    }

    // Assume it's an Ollama model
    return { provider: 'ollama', model: alias };
  }

  /**
   * Create a provider instance
   */
  private createProvider(config: ModelConfig): IModelProvider {
    switch (config.provider) {
      case 'claude':
        return new ClaudeProvider(config);
      case 'openai':
        return new OpenAIProvider(config);
      case 'gemini':
        return new GeminiProvider(config);
      case 'ollama':
        return new OllamaProvider(config);
      default:
        throw new Error(`Unknown provider: ${config.provider}`);
    }
  }

  /**
   * List all available models across all providers
   */
  async listAllModels(): Promise<ModelInfo[]> {
    const allModels: ModelInfo[] = [];

    for (const [_, provider] of this.providers) {
      try {
        const models = await provider.listModels();
        allModels.push(...models);
      } catch {
        // Skip providers that fail to list models
      }
    }

    return allModels;
  }

  /**
   * Get model info by ID (searches all providers)
   */
  async getModelInfo(modelId: string): Promise<ModelInfo | null> {
    const { provider } = this.resolveAlias(modelId);
    const providerInstance = this.providers.get(provider);

    if (!providerInstance) return null;

    return providerInstance.getModelInfo(modelId);
  }

  /**
   * Auto-select best available provider
   */
  selectBestProvider(): ModelProvider {
    // Priority: Claude > OpenAI > Gemini > Ollama
    const priority: ModelProvider[] = ['claude', 'openai', 'gemini', 'ollama'];

    for (const provider of priority) {
      const instance = this.providers.get(provider);
      if (instance?.isConfigured()) {
        return provider;
      }
    }

    return 'ollama'; // Fallback to local
  }

  /**
   * Configure a provider at runtime
   */
  configure(provider: ModelProvider, config: Partial<ModelConfig>): void {
    const existing = this.configs.get(provider);
    const newConfig: ModelConfig = {
      ...existing!,
      ...config,
      provider,
    };

    this.configs.set(provider, newConfig);
    this.providers.set(provider, this.createProvider(newConfig));
  }
}

/**
 * Create a model registry instance
 */
export function createModelRegistry(config?: RegistryConfig): ModelRegistry {
  return new ModelRegistry(config);
}

/**
 * Singleton registry instance
 */
let globalRegistry: ModelRegistry | null = null;

/**
 * Get or create the global registry
 */
export function getGlobalRegistry(): ModelRegistry {
  if (!globalRegistry) {
    globalRegistry = createModelRegistry();
  }
  return globalRegistry;
}

/**
 * Configure the global registry
 */
export function configureGlobalRegistry(config: RegistryConfig): void {
  globalRegistry = createModelRegistry(config);
}
