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
} from './core/index.js';

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

// Interview command - Adaptive AI-guided interview
program
  .command('interview')
  .description('Adaptive AI-guided documentation interview with smart detection')
  .option('-q, --quick', 'Quick mode - just name and description')
  .action(async (options) => {
    console.log(chalk.blue('\n🎤 Intent Blueprint - Adaptive Interview\n'));
    console.log(chalk.dim('Answer questions to generate tailored documentation.'));
    console.log(chalk.dim('Questions adapt based on your answers.\n'));

    const { InterviewEngine } = await import('./interview/index.js');
    const engine = new InterviewEngine();

    if (options.quick) {
      // Quick mode - just essentials
      const basicAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: chalk.cyan('Project name:'),
          validate: (input: string) => input.length > 0 || 'Required',
        },
        {
          type: 'editor',
          name: 'projectDescription',
          message: chalk.cyan('Describe your project (opens editor):'),
        },
      ]);

      engine.setAnswers(basicAnswers);
    } else {
      // Full adaptive interview
      const groups = engine.getQuestionGroups();

      for (const group of groups) {
        if (!group.isActive || group.questions.length === 0) continue;

        console.log(chalk.yellow(`\n━━━ ${group.name} ━━━`));
        console.log(chalk.dim(group.description + '\n'));

        for (const question of group.questions) {
          // Skip if already answered or condition not met
          const state = engine.getState();
          if (state.answers[question.id] !== undefined) continue;

          const promptConfig: Record<string, unknown> = {
            name: 'answer',
            message: chalk.cyan(question.text),
          };

          if (question.hint) {
            promptConfig.message += chalk.dim(` (${question.hint})`);
          }

          switch (question.type) {
            case 'text':
              promptConfig.type = 'input';
              if (question.default) promptConfig.default = question.default;
              break;
            case 'editor':
              promptConfig.type = 'editor';
              break;
            case 'select':
              promptConfig.type = 'list';
              promptConfig.choices = question.options || [];
              break;
            case 'multiselect':
              promptConfig.type = 'checkbox';
              promptConfig.choices = question.options || [];
              break;
            case 'confirm':
              promptConfig.type = 'confirm';
              promptConfig.default = question.default ?? false;
              break;
            case 'number':
              promptConfig.type = 'number';
              if (question.default) promptConfig.default = question.default;
              break;
          }

          try {
            const { answer } = await inquirer.prompt([promptConfig]);
            engine.answer(question.id, answer);
          } catch {
            // User cancelled
            break;
          }
        }
      }
    }

    // Complete interview and show results
    const result = engine.complete();

    console.log(chalk.green('\n✅ Interview complete!\n'));

    // Show detected context
    console.log(chalk.yellow('━━━ Analysis ━━━'));
    console.log(`  Project Type: ${chalk.cyan(result.detected.projectType)}`);
    console.log(`  Complexity: ${chalk.cyan(result.detected.complexity)}`);
    console.log(`  Suggested Scope: ${chalk.cyan(result.detected.suggestedScope)}`);
    console.log(`  Confidence: ${chalk.cyan(result.detected.confidence + '%')}`);

    if (result.detected.detectedTechnologies.length > 0) {
      console.log(`  Technologies: ${chalk.cyan(result.detected.detectedTechnologies.join(', '))}`);
    }

    // Show gap analysis
    if (result.gaps.missingRecommended.length > 0) {
      console.log(chalk.yellow('\n━━━ Recommendations ━━━'));
      for (const missing of result.gaps.missingRecommended) {
        console.log(`  ${chalk.dim('•')} Consider adding: ${missing}`);
      }
    }

    if (result.gaps.suggestions.length > 0) {
      for (const suggestion of result.gaps.suggestions) {
        console.log(`  ${chalk.dim('•')} ${suggestion}`);
      }
    }

    // Confirm generation
    const { proceed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: '\nGenerate documentation now?',
        default: true,
      },
    ]);

    if (proceed) {
      const spinner = ora('Generating documentation...').start();

      try {
        const context = engine.toTemplateContext();
        const docs = generateAllDocuments(context);
        const outputDir = `./docs/${context.projectName.toLowerCase().replace(/\s+/g, '-')}`;
        const files = writeDocuments(docs, outputDir);

        spinner.succeed(chalk.green(`Generated ${docs.length} documents!`));
        console.log(chalk.dim(`\nOutput: ${outputDir}`));
        console.log(chalk.dim(`Files: ${files.length}`));

        // Show what was generated
        console.log(chalk.yellow('\n━━━ Documents Generated ━━━'));
        for (const doc of docs) {
          console.log(`  ${chalk.dim('•')} ${doc.name} (${doc.category})`);
        }
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
