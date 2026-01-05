/**
 * Interview Answer Analyzer
 * Detects project type, complexity, and provides gap analysis
 */

import type {
  InterviewAnswers,
  DetectedContext,
  GapAnalysis,
  ProjectType,
  Complexity,
  Scope,
  Audience,
} from './types.js';

// Keywords for project type detection
const PROJECT_TYPE_KEYWORDS: Record<ProjectType, string[]> = {
  'saas-web': ['saas', 'subscription', 'dashboard', 'portal', 'web app', 'webapp', 'platform'],
  'mobile-app': ['mobile', 'ios', 'android', 'app store', 'react native', 'flutter', 'swift'],
  'api-backend': ['api', 'backend', 'rest', 'graphql', 'microservice', 'server'],
  'cli-tool': ['cli', 'command line', 'terminal', 'shell', 'script'],
  'library-sdk': ['library', 'sdk', 'package', 'npm', 'pip', 'module'],
  'desktop-app': ['desktop', 'electron', 'native', 'windows', 'macos', 'linux app'],
  'ecommerce': ['ecommerce', 'shop', 'store', 'cart', 'checkout', 'products'],
  'marketplace': ['marketplace', 'multi-vendor', 'buyers', 'sellers', 'listings'],
  'ai-ml': ['ai', 'machine learning', 'ml', 'model', 'neural', 'llm', 'gpt', 'training'],
  'iot': ['iot', 'sensors', 'devices', 'embedded', 'hardware', 'mqtt'],
  'blockchain': ['blockchain', 'web3', 'smart contract', 'crypto', 'nft', 'defi', 'solidity'],
  'gaming': ['game', 'gaming', 'unity', 'unreal', 'multiplayer', 'player'],
  'other': [],
};

// Technology keywords for detection
const TECH_KEYWORDS: Record<string, string[]> = {
  'TypeScript': ['typescript', 'ts', '.ts'],
  'JavaScript': ['javascript', 'js', 'node'],
  'Python': ['python', 'django', 'flask', 'fastapi', 'pytorch', 'tensorflow'],
  'Go': ['golang', 'go'],
  'Rust': ['rust', 'cargo'],
  'React': ['react', 'jsx', 'next.js', 'nextjs'],
  'Vue': ['vue', 'nuxt'],
  'PostgreSQL': ['postgres', 'postgresql', 'pg'],
  'MongoDB': ['mongodb', 'mongo'],
  'Redis': ['redis', 'cache'],
  'AWS': ['aws', 'amazon', 's3', 'lambda', 'ec2'],
  'GCP': ['gcp', 'google cloud', 'firebase'],
  'Docker': ['docker', 'container'],
  'Kubernetes': ['kubernetes', 'k8s', 'helm'],
};

// Feature keywords
const FEATURE_KEYWORDS: Record<string, string[]> = {
  'authentication': ['auth', 'login', 'signup', 'oauth', 'sso', 'password'],
  'payments': ['payment', 'stripe', 'billing', 'subscription', 'checkout'],
  'real-time': ['real-time', 'realtime', 'websocket', 'live', 'notifications'],
  'file-upload': ['upload', 'files', 'images', 'documents', 'storage'],
  'search': ['search', 'elasticsearch', 'algolia', 'full-text'],
  'analytics': ['analytics', 'tracking', 'metrics', 'dashboard'],
  'admin': ['admin', 'backoffice', 'management', 'cms'],
  'api': ['api', 'rest', 'graphql', 'endpoints'],
  'notifications': ['email', 'sms', 'push', 'notifications'],
  'integrations': ['integration', 'webhook', 'third-party', 'api'],
};

/**
 * Detect project characteristics from description
 */
export function analyzeDescription(description: string): {
  projectType: ProjectType;
  technologies: string[];
  features: string[];
  confidence: number;
} {
  const text = description.toLowerCase();
  const result = {
    projectType: 'other' as ProjectType,
    technologies: [] as string[],
    features: [] as string[],
    confidence: 0,
  };

  // Detect project type
  let maxScore = 0;
  for (const [type, keywords] of Object.entries(PROJECT_TYPE_KEYWORDS)) {
    const score = keywords.filter((kw) => text.includes(kw)).length;
    if (score > maxScore) {
      maxScore = score;
      result.projectType = type as ProjectType;
    }
  }
  result.confidence = Math.min(maxScore * 20, 90);

  // Detect technologies
  for (const [tech, keywords] of Object.entries(TECH_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) {
      result.technologies.push(tech);
    }
  }

  // Detect features
  for (const [feature, keywords] of Object.entries(FEATURE_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) {
      result.features.push(feature);
    }
  }

  return result;
}

/**
 * Calculate project complexity
 */
export function calculateComplexity(answers: InterviewAnswers): Complexity {
  let score = 0;

  // Base complexity from project type
  const typeComplexity: Record<string, number> = {
    'saas-web': 3,
    'marketplace': 4,
    'ecommerce': 3,
    'ai-ml': 4,
    'blockchain': 4,
    'iot': 4,
    'mobile-app': 3,
    'api-backend': 2,
    'desktop-app': 3,
    'cli-tool': 1,
    'library-sdk': 2,
    'gaming': 3,
    'other': 2,
  };
  score += typeComplexity[answers.projectType || 'other'] || 2;

  // Add complexity for features
  if (answers.hasAuth) score += 1;
  if (answers.hasPayments) score += 2;
  if (answers.needsCompliance) score += 2;
  if (answers.hasDatabase) score += 1;
  if ((answers.techStack?.length || 0) > 5) score += 1;

  // Team size factor
  const teamComplexity: Record<string, number> = {
    'Solo (1)': 0,
    'Small (2-5)': 0,
    'Medium (6-15)': 1,
    'Large (16-50)': 2,
    'Enterprise (50+)': 3,
  };
  score += teamComplexity[answers.teamSize || ''] || 0;

  // Compliance adds complexity
  if (answers.complianceTypes && answers.complianceTypes.length > 0) {
    score += answers.complianceTypes.length;
  }

  // Map score to complexity
  if (score <= 3) return 'simple';
  if (score <= 6) return 'moderate';
  if (score <= 10) return 'complex';
  return 'enterprise';
}

/**
 * Suggest scope based on answers
 */
export function suggestScope(answers: InterviewAnswers, complexity: Complexity): Scope {
  // If explicitly set, respect it
  if (answers.scope) return answers.scope;

  // Timeline-based suggestions
  const timeline = answers.timeline || '';
  if (timeline.includes('ASAP') || timeline.includes('1-2 weeks')) {
    return 'mvp';
  }

  // Audience-based suggestions
  if (answers.audience === 'enterprise') {
    return 'comprehensive';
  }
  if (answers.audience === 'startup') {
    return complexity === 'simple' ? 'mvp' : 'standard';
  }

  // Complexity-based
  if (complexity === 'enterprise') return 'comprehensive';
  if (complexity === 'complex') return 'comprehensive';
  if (complexity === 'simple') return 'mvp';

  return 'standard';
}

/**
 * Suggest audience based on answers
 */
export function suggestAudience(answers: InterviewAnswers): Audience {
  if (answers.audience) return answers.audience;

  const teamSize = answers.teamSize || '';
  if (teamSize.includes('Enterprise') || teamSize.includes('Large')) {
    return 'enterprise';
  }
  if (teamSize.includes('Solo') || teamSize.includes('Small')) {
    return 'startup';
  }

  if (answers.needsCompliance) return 'enterprise';
  if (answers.complianceTypes && answers.complianceTypes.length > 0) return 'enterprise';

  return 'business';
}

/**
 * Analyze answers and detect context
 */
export function detectContext(answers: InterviewAnswers): DetectedContext {
  const reasoning: string[] = [];

  // Analyze description if available
  const descriptionAnalysis = answers.projectDescription
    ? analyzeDescription(answers.projectDescription)
    : null;

  // Determine project type
  let projectType = answers.projectType || descriptionAnalysis?.projectType || 'other';
  if (descriptionAnalysis && !answers.projectType) {
    reasoning.push(`Detected project type "${projectType}" from description`);
  }

  // Merge technologies
  const detectedTechnologies = [
    ...(answers.techStack || []),
    ...(descriptionAnalysis?.technologies || []),
  ].filter((v, i, a) => a.indexOf(v) === i);

  // Calculate complexity
  const complexity = calculateComplexity(answers);
  reasoning.push(`Calculated complexity: ${complexity}`);

  // Suggest scope and audience
  const suggestedScope = suggestScope(answers, complexity);
  const suggestedAudience = suggestAudience(answers);

  if (!answers.scope) {
    reasoning.push(`Suggested scope: ${suggestedScope} (based on complexity and timeline)`);
  }
  if (!answers.audience) {
    reasoning.push(`Suggested audience: ${suggestedAudience} (based on team size and requirements)`);
  }

  // Calculate confidence
  let confidence = 50;
  if (answers.projectDescription && answers.projectDescription.length > 100) confidence += 15;
  if (answers.projectType) confidence += 10;
  if (answers.techStack && answers.techStack.length > 0) confidence += 10;
  if (answers.audience) confidence += 5;
  if (answers.scope) confidence += 5;
  confidence = Math.min(confidence, 95);

  return {
    projectType: projectType as ProjectType,
    complexity,
    suggestedScope,
    suggestedAudience,
    detectedTechnologies,
    detectedFeatures: descriptionAnalysis?.features || [],
    confidence,
    reasoning,
  };
}

/**
 * Perform gap analysis on answers
 */
export function analyzeGaps(answers: InterviewAnswers): GapAnalysis {
  const missingRequired: string[] = [];
  const missingRecommended: string[] = [];
  const assumptions: Array<{ field: string; assumption: string; confidence: number }> = [];
  const suggestions: string[] = [];

  // Check required fields
  if (!answers.projectName) missingRequired.push('Project name');
  if (!answers.projectDescription) missingRequired.push('Project description');
  if (!answers.projectType) missingRequired.push('Project type');
  if (!answers.audience) missingRequired.push('Target audience');
  if (!answers.scope) missingRequired.push('Documentation scope');

  // Check recommended fields
  if (!answers.techStack || answers.techStack.length === 0) {
    missingRecommended.push('Technology stack');
  }
  if (!answers.timeline) {
    missingRecommended.push('Project timeline');
  }
  if (!answers.teamSize) {
    missingRecommended.push('Team size');
  }

  // Make assumptions for missing data
  if (!answers.hasBackend && answers.projectType !== 'library-sdk') {
    assumptions.push({
      field: 'hasBackend',
      assumption: 'Project requires a backend server',
      confidence: 70,
    });
  }

  if (!answers.hasDatabase && answers.hasBackend !== false) {
    assumptions.push({
      field: 'hasDatabase',
      assumption: 'Project uses a database for data persistence',
      confidence: 80,
    });
  }

  if (!answers.hasAuth && ['saas-web', 'mobile-app', 'ecommerce', 'marketplace'].includes(answers.projectType || '')) {
    assumptions.push({
      field: 'hasAuth',
      assumption: 'Project requires user authentication',
      confidence: 85,
    });
  }

  // Generate suggestions
  if (answers.projectDescription && answers.projectDescription.length < 100) {
    suggestions.push('Consider providing a more detailed project description for better documentation');
  }

  if (answers.audience === 'enterprise' && !answers.needsCompliance) {
    suggestions.push('Enterprise projects often have compliance requirements - consider reviewing SOC 2, GDPR, etc.');
  }

  if (answers.hasPayments && !answers.complianceTypes?.includes('PCI-DSS')) {
    suggestions.push('Projects handling payments typically require PCI-DSS compliance');
  }

  if (answers.scope === 'mvp' && answers.audience === 'enterprise') {
    suggestions.push('Enterprise audiences typically expect comprehensive documentation');
  }

  // Calculate completeness
  const requiredCount = 5;
  const answeredRequired = requiredCount - missingRequired.length;
  const completenessScore = Math.round((answeredRequired / requiredCount) * 100);

  return {
    missingRequired,
    missingRecommended,
    assumptions,
    suggestions,
    completenessScore,
  };
}

/**
 * Generate a summary of the interview
 */
export function generateSummary(answers: InterviewAnswers, detected: DetectedContext): string {
  const lines: string[] = [];

  lines.push(`# Project Summary: ${answers.projectName || 'Untitled'}`);
  lines.push('');

  if (answers.projectDescription) {
    lines.push(`## Overview`);
    lines.push(answers.projectDescription);
    lines.push('');
  }

  lines.push(`## Classification`);
  lines.push(`- **Type:** ${detected.projectType}`);
  lines.push(`- **Complexity:** ${detected.complexity}`);
  lines.push(`- **Audience:** ${answers.audience || detected.suggestedAudience}`);
  lines.push(`- **Scope:** ${answers.scope || detected.suggestedScope} (${getScopeDocCount(answers.scope || detected.suggestedScope)} documents)`);
  lines.push('');

  if (detected.detectedTechnologies.length > 0) {
    lines.push(`## Technologies`);
    lines.push(detected.detectedTechnologies.map((t) => `- ${t}`).join('\n'));
    lines.push('');
  }

  if (detected.detectedFeatures.length > 0) {
    lines.push(`## Key Features`);
    lines.push(detected.detectedFeatures.map((f) => `- ${f}`).join('\n'));
    lines.push('');
  }

  lines.push(`## Analysis Confidence: ${detected.confidence}%`);

  return lines.join('\n');
}

function getScopeDocCount(scope: Scope): number {
  return { mvp: 4, standard: 12, comprehensive: 22 }[scope] || 12;
}
