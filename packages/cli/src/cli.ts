#!/usr/bin/env node
/**
 * Intent Blueprint CLI
 * Generate enterprise documentation from the command line
 */

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import {
  listTemplates,
  generateAllDocuments,
  writeDocuments,
  getTemplatesForScope,
  type TemplateContext,
  SCOPES,
  AUDIENCES,
} from '@intentsolutions/blueprint-core';

const program = new Command();

program
  .name('blueprint')
  .description('Intent Blueprint - Enterprise AI Documentation Generator')
  .version('2.0.0');

// Init command
program
  .command('init')
  .description('Initialize Intent Blueprint in your project')
  .action(async () => {
    console.log(chalk.blue('\n🚀 Intent Blueprint - Project Initialization\n'));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        validate: (input: string) => input.length > 0 || 'Project name is required',
      },
      {
        type: 'input',
        name: 'projectDescription',
        message: 'Brief project description:',
        validate: (input: string) => input.length > 0 || 'Description is required',
      },
      {
        type: 'list',
        name: 'scope',
        message: 'Documentation scope:',
        choices: [
          { name: 'MVP (4 essential docs)', value: 'mvp' },
          { name: 'Standard (12 core docs)', value: 'standard' },
          { name: 'Comprehensive (22 docs)', value: 'comprehensive' },
        ],
        default: 'standard',
      },
      {
        type: 'list',
        name: 'audience',
        message: 'Target audience:',
        choices: [
          { name: 'Startup (lean, fast)', value: 'startup' },
          { name: 'Business (balanced)', value: 'business' },
          { name: 'Enterprise (thorough)', value: 'enterprise' },
        ],
        default: 'business',
      },
    ]);

    const spinner = ora('Generating documentation...').start();

    try {
      const context: TemplateContext = {
        projectName: answers.projectName,
        projectDescription: answers.projectDescription,
        scope: answers.scope,
        audience: answers.audience,
      };

      const docs = generateAllDocuments(context);
      const outputDir = `./docs/${answers.projectName.toLowerCase().replace(/\s+/g, '-')}`;
      const files = writeDocuments(docs, outputDir);

      spinner.succeed(chalk.green(`Generated ${docs.length} documents!`));
      console.log(chalk.dim(`\nOutput: ${outputDir}`));
      console.log(chalk.dim(`Files: ${files.length}`));
    } catch (error) {
      spinner.fail(chalk.red('Failed to generate documentation'));
      console.error(error);
      process.exit(1);
    }
  });

// Generate command
program
  .command('generate')
  .description('Generate documentation with options')
  .option('-n, --name <name>', 'Project name')
  .option('-d, --description <desc>', 'Project description')
  .option('-s, --scope <scope>', 'Scope: mvp, standard, comprehensive', 'standard')
  .option('-a, --audience <audience>', 'Audience: startup, business, enterprise', 'business')
  .option('-o, --output <dir>', 'Output directory')
  .action(async (options) => {
    let projectName = options.name;
    let projectDescription = options.description;

    if (!projectName || !projectDescription) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'Project name:',
          when: !projectName,
          validate: (input: string) => input.length > 0 || 'Required',
        },
        {
          type: 'input',
          name: 'projectDescription',
          message: 'Project description:',
          when: !projectDescription,
          validate: (input: string) => input.length > 0 || 'Required',
        },
      ]);
      projectName = projectName || answers.projectName;
      projectDescription = projectDescription || answers.projectDescription;
    }

    const spinner = ora('Generating documentation...').start();

    try {
      const context: TemplateContext = {
        projectName,
        projectDescription,
        scope: options.scope as 'mvp' | 'standard' | 'comprehensive',
        audience: options.audience as 'startup' | 'business' | 'enterprise',
      };

      const docs = generateAllDocuments(context);
      const outputDir = options.output || `./docs/${projectName.toLowerCase().replace(/\s+/g, '-')}`;
      const files = writeDocuments(docs, outputDir);

      spinner.succeed(chalk.green(`Generated ${docs.length} documents!`));
      console.log(chalk.dim(`\nOutput: ${outputDir}`));
    } catch (error) {
      spinner.fail(chalk.red('Generation failed'));
      console.error(error);
      process.exit(1);
    }
  });

// Interview command
program
  .command('interview')
  .description('Interactive AI-guided documentation interview')
  .action(async () => {
    console.log(chalk.blue('\n🎤 Intent Blueprint - AI Interview Mode\n'));
    console.log(chalk.dim('Answer the following questions to generate tailored documentation.\n'));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: chalk.cyan('What is the name of your project?'),
        validate: (input: string) => input.length > 0 || 'Required',
      },
      {
        type: 'editor',
        name: 'projectDescription',
        message: chalk.cyan('Describe your project in detail (opens editor):'),
      },
      {
        type: 'list',
        name: 'projectType',
        message: chalk.cyan('What type of project is this?'),
        choices: ['SaaS Web App', 'Mobile App', 'API/Backend', 'CLI Tool', 'Library/SDK', 'Desktop App', 'Other'],
      },
      {
        type: 'checkbox',
        name: 'techStack',
        message: chalk.cyan('Select your tech stack:'),
        choices: ['TypeScript', 'Python', 'Go', 'Rust', 'React', 'Vue', 'Node.js', 'PostgreSQL', 'MongoDB', 'Redis', 'AWS', 'GCP', 'Docker', 'Kubernetes'],
      },
      {
        type: 'list',
        name: 'scope',
        message: chalk.cyan('How comprehensive should the documentation be?'),
        choices: [
          { name: 'MVP - Just the essentials (4 docs)', value: 'mvp' },
          { name: 'Standard - Core documentation (12 docs)', value: 'standard' },
          { name: 'Comprehensive - Full enterprise suite (22 docs)', value: 'comprehensive' },
        ],
      },
      {
        type: 'list',
        name: 'audience',
        message: chalk.cyan('Who is your target audience?'),
        choices: [
          { name: 'Startup - Move fast, iterate often', value: 'startup' },
          { name: 'Business - Balanced approach', value: 'business' },
          { name: 'Enterprise - Thorough, compliance-ready', value: 'enterprise' },
        ],
      },
      {
        type: 'input',
        name: 'timeline',
        message: chalk.cyan('What is your target launch timeline?'),
        default: 'TBD',
      },
      {
        type: 'input',
        name: 'team',
        message: chalk.cyan('How large is your team?'),
        default: '1-5',
      },
    ]);

    console.log(chalk.green('\n✅ Interview complete!\n'));

    const { proceed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Generate documentation now?',
        default: true,
      },
    ]);

    if (proceed) {
      const spinner = ora('Generating documentation...').start();

      try {
        const context: TemplateContext = {
          projectName: answers.projectName,
          projectDescription: answers.projectDescription,
          scope: answers.scope,
          audience: answers.audience,
          projectType: answers.projectType,
          techStack: answers.techStack,
          timeline: answers.timeline,
          team: answers.team,
        };

        const docs = generateAllDocuments(context);
        const outputDir = `./docs/${answers.projectName.toLowerCase().replace(/\s+/g, '-')}`;
        const files = writeDocuments(docs, outputDir);

        spinner.succeed(chalk.green(`Generated ${docs.length} documents!`));
        console.log(chalk.dim(`\nOutput: ${outputDir}`));
        console.log(chalk.dim(`Files: ${files.length}`));
      } catch (error) {
        spinner.fail(chalk.red('Generation failed'));
        console.error(error);
        process.exit(1);
      }
    }
  });

// List command
program
  .command('list')
  .description('List available templates')
  .option('-s, --scope <scope>', 'Filter by scope: mvp, standard, comprehensive')
  .action((options) => {
    console.log(chalk.blue('\n📚 Available Templates\n'));

    const templates = options.scope ? getTemplatesForScope(options.scope) : listTemplates();

    const grouped = templates.reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = [];
      acc[t.category].push(t);
      return acc;
    }, {} as Record<string, typeof templates>);

    for (const [category, temps] of Object.entries(grouped)) {
      console.log(chalk.yellow(`\n${category}`));
      for (const t of temps) {
        console.log(`  ${chalk.cyan(t.id.padEnd(25))} ${t.name}`);
      }
    }

    console.log(chalk.dim(`\nTotal: ${templates.length} templates`));
  });

// Export command (placeholder)
program
  .command('export <target>')
  .description('Export to GitHub, Linear, Jira, or Notion')
  .option('-p, --project <name>', 'Project name')
  .action((target, options) => {
    console.log(chalk.yellow(`\n⚠️  Export to ${target} coming soon!\n`));
    console.log(chalk.dim('For now, use the generated markdown files directly.'));
  });

// Sync command (placeholder)
program
  .command('sync')
  .description('Bi-directional sync with project management tools')
  .action(() => {
    console.log(chalk.yellow('\n⚠️  Sync feature coming soon!\n'));
  });

program.parse();
