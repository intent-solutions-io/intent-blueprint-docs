/**
 * Interview Questions with Adaptive Logic
 */

import type { Question, QuestionGroup, InterviewAnswers } from './types.js';

export const QUESTION_GROUPS: QuestionGroup[] = [
  {
    id: 'core',
    name: 'Project Basics',
    description: 'Tell us about your project',
    questions: [
      {
        id: 'projectName',
        text: 'What is the name of your project?',
        type: 'text',
        required: true,
        validate: (v) => (typeof v === 'string' && v.length > 0) || 'Project name is required',
      },
      {
        id: 'projectDescription',
        text: 'Describe your project in detail. What problem does it solve? Who is it for?',
        type: 'editor',
        required: true,
        hint: 'The more detail you provide, the better the documentation will be tailored to your needs.',
        validate: (v) =>
          (typeof v === 'string' && v.length >= 20) ||
          'Please provide at least a few sentences describing your project',
      },
      {
        id: 'projectType',
        text: 'What type of project is this?',
        type: 'select',
        required: true,
        options: [
          'SaaS Web Application',
          'Mobile App (iOS/Android)',
          'API / Backend Service',
          'CLI Tool',
          'Library / SDK',
          'Desktop Application',
          'E-commerce Platform',
          'Marketplace',
          'AI/ML Application',
          'IoT System',
          'Blockchain / Web3',
          'Game',
          'Other',
        ],
        transform: (v) => {
          const map: Record<string, string> = {
            'SaaS Web Application': 'saas-web',
            'Mobile App (iOS/Android)': 'mobile-app',
            'API / Backend Service': 'api-backend',
            'CLI Tool': 'cli-tool',
            'Library / SDK': 'library-sdk',
            'Desktop Application': 'desktop-app',
            'E-commerce Platform': 'ecommerce',
            'Marketplace': 'marketplace',
            'AI/ML Application': 'ai-ml',
            'IoT System': 'iot',
            'Blockchain / Web3': 'blockchain',
            'Game': 'gaming',
            'Other': 'other',
          };
          return map[v as string] || 'other';
        },
      },
    ],
  },
  {
    id: 'technical',
    name: 'Technical Details',
    description: 'Help us understand the technical aspects',
    questions: [
      {
        id: 'techStack',
        text: 'What technologies are you using or planning to use?',
        type: 'multiselect',
        required: false,
        options: [
          'TypeScript',
          'JavaScript',
          'Python',
          'Go',
          'Rust',
          'Java',
          'C#',
          'Ruby',
          'React',
          'Vue',
          'Angular',
          'Next.js',
          'Node.js',
          'Django',
          'FastAPI',
          'PostgreSQL',
          'MongoDB',
          'Redis',
          'AWS',
          'GCP',
          'Azure',
          'Docker',
          'Kubernetes',
        ],
        hint: 'Select all that apply',
      },
      {
        id: 'hasFrontend',
        text: 'Does your project have a user interface (web, mobile, or desktop)?',
        type: 'confirm',
        required: true,
        default: true,
        condition: (a) => !['cli-tool', 'library-sdk', 'api-backend'].includes(a.projectType || ''),
      },
      {
        id: 'hasBackend',
        text: 'Does your project require a backend/server?',
        type: 'confirm',
        required: true,
        default: true,
        condition: (a) => a.projectType !== 'library-sdk',
      },
      {
        id: 'hasDatabase',
        text: 'Will your project use a database?',
        type: 'confirm',
        required: true,
        default: true,
        condition: (a) => a.hasBackend !== false,
      },
      {
        id: 'hasAuth',
        text: 'Does your project need user authentication?',
        type: 'confirm',
        required: true,
        default: true,
        condition: (a) =>
          a.hasBackend !== false &&
          !['cli-tool', 'library-sdk'].includes(a.projectType || ''),
      },
      {
        id: 'hasPayments',
        text: 'Will your project handle payments or subscriptions?',
        type: 'confirm',
        required: false,
        default: false,
        condition: (a) =>
          ['saas-web', 'ecommerce', 'marketplace'].includes(a.projectType || ''),
      },
      {
        id: 'deploymentTarget',
        text: 'Where will this be deployed?',
        type: 'select',
        required: false,
        options: [
          'Cloud (AWS/GCP/Azure)',
          'Self-hosted / On-premise',
          'Serverless',
          'Edge / CDN',
          'App Stores (iOS/Android)',
          'Package Registry (npm/PyPI)',
          'Not sure yet',
        ],
      },
    ],
  },
  {
    id: 'business',
    name: 'Business Context',
    description: 'Tell us about your business goals',
    questions: [
      {
        id: 'audience',
        text: 'Who is your target audience?',
        type: 'select',
        required: true,
        options: [
          'Startup - Move fast, iterate quickly',
          'Business - Balanced approach',
          'Enterprise - Thorough, compliance-ready',
        ],
        transform: (v) => {
          if (typeof v === 'string') {
            if (v.includes('Startup')) return 'startup';
            if (v.includes('Enterprise')) return 'enterprise';
          }
          return 'business';
        },
      },
      {
        id: 'teamSize',
        text: 'How large is your team?',
        type: 'select',
        required: false,
        options: ['Solo (1)', 'Small (2-5)', 'Medium (6-15)', 'Large (16-50)', 'Enterprise (50+)'],
      },
      {
        id: 'timeline',
        text: 'What is your target timeline?',
        type: 'select',
        required: false,
        options: [
          'ASAP / Hackathon',
          '1-2 weeks',
          '1-3 months',
          '3-6 months',
          '6-12 months',
          '12+ months',
          'Ongoing / No deadline',
        ],
      },
      {
        id: 'hasCompetitors',
        text: 'Are there existing competitors or similar products?',
        type: 'confirm',
        required: false,
        default: false,
      },
      {
        id: 'competitorNames',
        text: 'Who are your main competitors?',
        type: 'text',
        required: false,
        hint: 'Comma-separated list',
        condition: (a) => a.hasCompetitors === true,
        transform: (v) =>
          typeof v === 'string'
            ? v.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
      },
      {
        id: 'monetization',
        text: 'How will this project generate revenue?',
        type: 'select',
        required: false,
        options: [
          'Subscription (SaaS)',
          'One-time purchase',
          'Freemium',
          'Advertising',
          'Transaction fees',
          'Enterprise licensing',
          'Open source (donations/sponsorship)',
          'Internal tool (no direct revenue)',
          'Not sure yet',
        ],
        condition: (a) => a.audience !== 'startup' || a.projectType !== 'cli-tool',
      },
    ],
  },
  {
    id: 'scope',
    name: 'Documentation Scope',
    description: 'How comprehensive should the documentation be?',
    questions: [
      {
        id: 'scope',
        text: 'How comprehensive should the documentation be?',
        type: 'select',
        required: true,
        options: [
          'MVP (4 docs) - Just the essentials to get started',
          'Standard (12 docs) - Core product and technical docs',
          'Comprehensive (22 docs) - Full enterprise documentation suite',
        ],
        transform: (v) => {
          if (typeof v === 'string') {
            if (v.includes('MVP')) return 'mvp';
            if (v.includes('Comprehensive')) return 'comprehensive';
          }
          return 'standard';
        },
      },
      {
        id: 'priorityFeatures',
        text: 'What are the most important features to document?',
        type: 'text',
        required: false,
        hint: 'Comma-separated list of key features',
        condition: (a) => a.scope !== 'mvp',
        transform: (v) =>
          typeof v === 'string'
            ? v.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
      },
    ],
  },
  {
    id: 'compliance',
    name: 'Compliance & Security',
    description: 'Security and regulatory requirements',
    condition: (a) => a.audience === 'enterprise' || a.hasPayments === true,
    questions: [
      {
        id: 'needsCompliance',
        text: 'Does your project have compliance requirements?',
        type: 'confirm',
        required: false,
        default: false,
      },
      {
        id: 'complianceTypes',
        text: 'Which compliance standards apply?',
        type: 'multiselect',
        required: false,
        options: ['SOC 2', 'HIPAA', 'GDPR', 'PCI-DSS', 'ISO 27001', 'FedRAMP', 'CCPA'],
        condition: (a) => a.needsCompliance === true,
      },
    ],
  },
];

/**
 * Get all questions flattened, respecting conditions
 */
export function getActiveQuestions(answers: InterviewAnswers): Question[] {
  const questions: Question[] = [];

  for (const group of QUESTION_GROUPS) {
    // Check group condition
    if (group.condition && !group.condition(answers)) {
      continue;
    }

    for (const question of group.questions) {
      // Check question condition
      if (question.condition && !question.condition(answers)) {
        continue;
      }
      questions.push(question);
    }
  }

  return questions;
}

/**
 * Get the next unanswered question
 */
export function getNextQuestion(answers: InterviewAnswers): Question | null {
  const questions = getActiveQuestions(answers);

  for (const q of questions) {
    if (answers[q.id] === undefined) {
      return q;
    }
  }

  return null;
}

/**
 * Get interview progress
 */
export function getProgress(answers: InterviewAnswers): {
  answered: number;
  total: number;
  percentage: number;
} {
  const questions = getActiveQuestions(answers);
  const answered = questions.filter((q) => answers[q.id] !== undefined).length;

  return {
    answered,
    total: questions.length,
    percentage: Math.round((answered / questions.length) * 100),
  };
}
