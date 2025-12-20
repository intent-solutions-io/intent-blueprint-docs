#!/usr/bin/env node

/**
 * vibe-prd PDF Export Tool
 *
 * Converts generated project documentation from completed-docs/ into professional PDFs.
 * Uses Puppeteer for HTML-to-PDF conversion with professional styling.
 *
 * Usage:
 *   node exports/export.js [project-name]
 *   npm run export [project-name]
 *
 * If no project name is provided, exports all projects in completed-docs/
 */

const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');

// Check if puppeteer is available, fallback to manual instructions
let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (err) {
  console.log('⚠️  Puppeteer not installed. Run: npm install puppeteer');
  console.log('📋 Or use alternative: Install a markdown-to-PDF tool manually');
  process.exit(1);
}

const COMPLETED_DOCS_DIR = path.join(__dirname, '..', 'completed-docs');
const EXPORTS_DIR = path.join(__dirname);

/**
 * Get all project directories from completed-docs/
 */
async function getProjectDirectories() {
  try {
    const entries = await fs.readdir(COMPLETED_DOCS_DIR, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
  } catch (err) {
    console.error('❌ Error reading completed-docs directory:', err.message);
    return [];
  }
}

/**
 * Read and process all markdown files in a project directory
 */
async function readProjectFiles(projectName) {
  const projectDir = path.join(COMPLETED_DOCS_DIR, projectName);

  try {
    const files = await fs.readdir(projectDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    const documents = [];

    for (const file of markdownFiles) {
      const filePath = path.join(projectDir, file);
      const content = await fs.readFile(filePath, 'utf8');

      documents.push({
        filename: file,
        title: extractTitle(content) || file.replace('.md', ''),
        content: content
      });
    }

    // Sort documents with index.md first, then alphabetically
    documents.sort((a, b) => {
      if (a.filename === 'index.md') return -1;
      if (b.filename === 'index.md') return 1;
      return a.filename.localeCompare(b.filename);
    });

    return documents;
  } catch (err) {
    console.error(`❌ Error reading project files for ${projectName}:`, err.message);
    return [];
  }
}

/**
 * Extract title from markdown content
 */
function extractTitle(content) {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1] : null;
}

/**
 * Generate HTML from project documents
 */
function generateHTML(projectName, documents) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName} - Project Documentation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .title-page {
            text-align: center;
            page-break-after: always;
            padding: 200px 0;
        }

        .title-page h1 {
            font-size: 2.5em;
            color: #2c3e50;
            margin-bottom: 20px;
        }

        .title-page .subtitle {
            font-size: 1.2em;
            color: #7f8c8d;
            margin-bottom: 40px;
        }

        .title-page .meta {
            font-size: 1em;
            color: #95a5a6;
        }

        .document {
            page-break-before: always;
            margin-bottom: 60px;
        }

        .document:first-of-type {
            page-break-before: auto;
        }

        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            margin-top: 0;
        }

        h2 {
            color: #2980b9;
            border-bottom: 1px solid #ecf0f1;
            padding-bottom: 5px;
        }

        h3 {
            color: #2980b9;
        }

        code {
            background-color: #f8f9fa;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }

        pre {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #3498db;
            overflow-x: auto;
        }

        pre code {
            background: none;
            padding: 0;
        }

        blockquote {
            border-left: 4px solid #3498db;
            margin: 0;
            padding: 10px 20px;
            background-color: #f8f9fa;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }

        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }

        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ecf0f1;
            font-size: 0.9em;
            color: #7f8c8d;
            text-align: center;
        }

        @media print {
            body { font-size: 12pt; }
            .title-page { padding: 150px 0; }
        }
    </style>
</head>
<body>
    <div class="title-page">
        <h1>${projectName}</h1>
        <div class="subtitle">Project Documentation</div>
        <div class="meta">
            Generated: ${new Date().toLocaleDateString()}<br>
            Documents: ${documents.length}<br>
            Generated by vibe-prd
        </div>
    </div>

    ${documents.map(doc => `
        <div class="document">
            ${marked(doc.content)}
        </div>
    `).join('')}

    <div class="footer">
        Generated by <strong>vibe-prd</strong> — AI Documentation Generator<br>
        <a href="https://github.com/jeremylongshore/vibe-prd">https://github.com/jeremylongshore/vibe-prd</a>
    </div>
</body>
</html>`;

  return html;
}

/**
 * Convert HTML to PDF using Puppeteer
 */
async function generatePDF(projectName, html) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfPath = path.join(EXPORTS_DIR, `${projectName}.pdf`);

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="font-size: 10px; text-align: center; width: 100%; color: #666; margin: 0 20mm;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `
    });

    console.log(`✅ PDF exported: ${pdfPath}`);
    return pdfPath;

  } finally {
    await browser.close();
  }
}

/**
 * Export a single project to PDF
 */
async function exportProject(projectName) {
  console.log(`📄 Exporting ${projectName}...`);

  const documents = await readProjectFiles(projectName);

  if (documents.length === 0) {
    console.log(`⚠️  No markdown files found in ${projectName}`);
    return null;
  }

  console.log(`📋 Found ${documents.length} documents`);

  const html = generateHTML(projectName, documents);
  const pdfPath = await generatePDF(projectName, html);

  return pdfPath;
}

/**
 * Main execution function
 */
async function main() {
  const projectName = process.argv[2];

  console.log('🚀 vibe-prd PDF Export Tool');
  console.log('================================');

  // Ensure exports directory exists
  await fs.mkdir(EXPORTS_DIR, { recursive: true });

  if (projectName) {
    // Export specific project
    const projectPath = path.join(COMPLETED_DOCS_DIR, projectName);

    try {
      await fs.access(projectPath);
      await exportProject(projectName);
    } catch (err) {
      console.error(`❌ Project '${projectName}' not found in completed-docs/`);
      console.log('\n📋 Available projects:');
      const projects = await getProjectDirectories();
      projects.forEach(p => console.log(`   - ${p}`));
      process.exit(1);
    }
  } else {
    // Export all projects
    const projects = await getProjectDirectories();

    if (projects.length === 0) {
      console.log('⚠️  No projects found in completed-docs/');
      console.log('💡 Generate some documentation first using /new-project');
      process.exit(0);
    }

    console.log(`📁 Found ${projects.length} projects to export`);

    for (const project of projects) {
      await exportProject(project);
    }
  }

  console.log('\n✅ Export completed!');
  console.log(`📁 PDFs saved to: ${EXPORTS_DIR}`);
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error.message);
  process.exit(1);
});

// Run the export tool
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { exportProject, generateHTML, readProjectFiles };