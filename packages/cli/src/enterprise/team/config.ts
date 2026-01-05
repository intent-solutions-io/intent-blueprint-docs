/**
 * Team Configuration System
 * Manage team settings, member access, and shared template libraries
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import yaml from 'js-yaml';
import type { TeamConfig, TeamMember, TemplateLibrary } from '../templates/types.js';

const CONFIG_FILENAME = '.blueprint-team.yaml';
const GLOBAL_CONFIG_DIR = join(process.env.HOME || '~', '.config', 'blueprint');

export class TeamConfigManager {
  private config: TeamConfig | null = null;
  private configPath: string;

  constructor(projectPath?: string) {
    this.configPath = projectPath
      ? join(projectPath, CONFIG_FILENAME)
      : this.findConfigFile();
  }

  /**
   * Find config file by walking up directory tree
   */
  private findConfigFile(): string {
    let dir = process.cwd();

    while (dir !== '/') {
      const configPath = join(dir, CONFIG_FILENAME);
      if (existsSync(configPath)) {
        return configPath;
      }
      dir = dirname(dir);
    }

    // Fall back to global config
    return join(GLOBAL_CONFIG_DIR, CONFIG_FILENAME);
  }

  /**
   * Load team configuration
   */
  load(): TeamConfig | null {
    if (this.config) return this.config;

    if (!existsSync(this.configPath)) {
      return null;
    }

    try {
      const content = readFileSync(this.configPath, 'utf-8');
      this.config = yaml.load(content) as TeamConfig;
      return this.config;
    } catch (error) {
      console.warn(`Failed to load team config: ${error}`);
      return null;
    }
  }

  /**
   * Save team configuration
   */
  save(config: TeamConfig): void {
    const dir = dirname(this.configPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const content = yaml.dump(config, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
    });

    writeFileSync(this.configPath, content);
    this.config = config;
  }

  /**
   * Initialize a new team configuration
   */
  init(teamId: string, teamName: string): TeamConfig {
    const config: TeamConfig = {
      id: teamId,
      name: teamName,
      members: [],
      libraries: [],
      defaults: {
        scope: 'standard',
        audience: 'business',
      },
      audit: {
        enabled: true,
        retention: 90,
      },
    };

    this.save(config);
    return config;
  }

  /**
   * Get current configuration
   */
  get(): TeamConfig | null {
    return this.load();
  }

  /**
   * Add a team member
   */
  addMember(member: TeamMember): void {
    const config = this.load();
    if (!config) {
      throw new Error('No team configuration found. Run `blueprint team init` first.');
    }

    config.members = config.members || [];

    // Check for duplicate
    const existing = config.members.findIndex(m => m.id === member.id);
    if (existing !== -1) {
      config.members[existing] = member;
    } else {
      config.members.push(member);
    }

    this.save(config);
  }

  /**
   * Remove a team member
   */
  removeMember(memberId: string): boolean {
    const config = this.load();
    if (!config || !config.members) return false;

    const index = config.members.findIndex(m => m.id === memberId);
    if (index === -1) return false;

    config.members.splice(index, 1);
    this.save(config);
    return true;
  }

  /**
   * Get a team member
   */
  getMember(memberId: string): TeamMember | undefined {
    const config = this.load();
    return config?.members?.find(m => m.id === memberId);
  }

  /**
   * List all team members
   */
  listMembers(): TeamMember[] {
    const config = this.load();
    return config?.members || [];
  }

  /**
   * Add a template library
   */
  addLibrary(library: TemplateLibrary): void {
    const config = this.load();
    if (!config) {
      throw new Error('No team configuration found. Run `blueprint team init` first.');
    }

    config.libraries = config.libraries || [];

    // Check for duplicate
    const existing = config.libraries.findIndex(l => l.name === library.name);
    if (existing !== -1) {
      config.libraries[existing] = library;
    } else {
      config.libraries.push(library);
    }

    this.save(config);
  }

  /**
   * Remove a template library
   */
  removeLibrary(libraryName: string): boolean {
    const config = this.load();
    if (!config || !config.libraries) return false;

    const index = config.libraries.findIndex(l => l.name === libraryName);
    if (index === -1) return false;

    config.libraries.splice(index, 1);
    this.save(config);
    return true;
  }

  /**
   * Get a template library
   */
  getLibrary(libraryName: string): TemplateLibrary | undefined {
    const config = this.load();
    return config?.libraries?.find(l => l.name === libraryName);
  }

  /**
   * List all template libraries
   */
  listLibraries(): TemplateLibrary[] {
    const config = this.load();
    return config?.libraries || [];
  }

  /**
   * Update default settings
   */
  updateDefaults(defaults: Partial<TeamConfig['defaults']>): void {
    const config = this.load();
    if (!config) {
      throw new Error('No team configuration found. Run `blueprint team init` first.');
    }

    config.defaults = { ...config.defaults, ...defaults };
    this.save(config);
  }

  /**
   * Update audit settings
   */
  updateAuditSettings(audit: Partial<TeamConfig['audit']>): void {
    const config = this.load();
    if (!config) {
      throw new Error('No team configuration found. Run `blueprint team init` first.');
    }

    config.audit = { ...config.audit, ...audit };
    this.save(config);
  }

  /**
   * Check if a member has access to a category
   */
  hasAccess(memberId: string, category: string): boolean {
    const member = this.getMember(memberId);
    if (!member) return false;

    // Owners and admins have full access
    if (member.role === 'owner' || member.role === 'admin') {
      return true;
    }

    // Viewers have no access
    if (member.role === 'viewer') {
      return false;
    }

    // Members check allowed categories
    if (!member.allowedCategories || member.allowedCategories.length === 0) {
      return true; // No restrictions
    }

    return member.allowedCategories.includes(category);
  }

  /**
   * Get the config file path
   */
  getConfigPath(): string {
    return this.configPath;
  }
}

/**
 * Create a team config manager instance
 */
export function createTeamConfigManager(projectPath?: string): TeamConfigManager {
  return new TeamConfigManager(projectPath);
}
