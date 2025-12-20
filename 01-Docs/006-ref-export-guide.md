# 📄 Export Guide - PDF Generation for vibe-prd

This guide explains how to export your generated project documentation to professional PDF format.

## Quick Start

### 1. Install Dependencies
```bash
cd ~/ai-dev/vibe-prd
npm install
```

### 2. Export All Projects
```bash
npm run export
```

### 3. Export Specific Project
```bash
npm run export my-project-name
```

PDFs will be saved to the `exports/` directory.

---

## How It Works

The export system converts your generated markdown documentation into professionally formatted PDFs using:

- **Puppeteer** for HTML-to-PDF conversion
- **Marked** for markdown parsing
- **Professional styling** with proper typography and layout
- **Title pages** with project metadata
- **Page numbering** and consistent formatting

## Export Features

### Professional Layout
- **Title Page:** Project name, generation date, document count
- **Consistent Typography:** Professional fonts and spacing
- **Page Breaks:** Each document starts on a new page
- **Headers/Footers:** Page numbering and branding
- **Responsive Tables:** Properly formatted data tables

### Document Processing
- **Auto-Discovery:** Finds all `.md` files in project directories
- **Smart Ordering:** Index file first, then alphabetical
- **Title Extraction:** Automatic title detection from markdown headers
- **Cross-References:** Maintains internal linking where possible

### Output Quality
- **A4 Format:** Standard professional document size
- **Print-Ready:** Optimized margins and typography
- **High Resolution:** Vector graphics and crisp text
- **Color Preservation:** Maintains syntax highlighting and colors

---

## Usage Examples

### Export All Projects
```bash
# Generate PDFs for all projects in completed-docs/
npm run export

# Output example:
# 🚀 vibe-prd PDF Export Tool
# ================================
# 📁 Found 3 projects to export
# 📄 Exporting customer-support-saas...
# 📋 Found 12 documents
# ✅ PDF exported: exports/customer-support-saas.pdf
# 📄 Exporting agri-sensor-network...
# 📋 Found 22 documents
# ✅ PDF exported: exports/agri-sensor-network.pdf
```

### Export Specific Project
```bash
# Export only the specified project
npm run export customer-support-saas

# Output:
# 📄 Exporting customer-support-saas...
# 📋 Found 12 documents
# ✅ PDF exported: exports/customer-support-saas.pdf
```

### Check Available Projects
```bash
# If project doesn't exist, tool shows available options
npm run export non-existent-project

# Output:
# ❌ Project 'non-existent-project' not found in completed-docs/
# 📋 Available projects:
#    - customer-support-saas
#    - agri-sensor-network
#    - chat-ai-demo
```

---

## File Structure

```
vibe-prd/
├── completed-docs/           # Generated project documentation
│   ├── my-project/          # Project directory
│   │   ├── index.md         # Project overview (appears first in PDF)
│   │   ├── 01_prd.md        # Individual documents
│   │   ├── 02_adr.md
│   │   └── ...
├── exports/                 # PDF output directory
│   ├── my-project.pdf       # Generated PDF files
│   └── export.js            # Export script
├── package.json             # Node.js dependencies
└── EXPORT_GUIDE.md          # This guide
```

## PDF Structure

Each generated PDF includes:

1. **Title Page**
   - Project name
   - Generation date
   - Document count
   - vibe-prd branding

2. **Document Sections**
   - Index/overview (if present)
   - All markdown files in alphabetical order
   - Proper page breaks between documents
   - Maintained formatting and styling

3. **Footer**
   - Page numbering
   - vibe-prd attribution and repository link

---

## Troubleshooting

### Common Issues

#### Dependencies Not Installed
```bash
# Error: Cannot find module 'puppeteer'
npm install
```

#### No Projects Found
```bash
# Error: No projects found in completed-docs/
# Solution: Generate documentation first
/new-project
```

#### Permission Issues
```bash
# Error: Permission denied
# Solution: Ensure write permissions to exports/ directory
chmod 755 exports/
```

#### Memory Issues (Large Projects)
```bash
# For very large documentation sets, increase Node.js memory
node --max-old-space-size=4096 exports/export.js
```

### Advanced Configuration

#### Custom Styling
Edit `exports/export.js` and modify the CSS in the `generateHTML` function to customize:
- Fonts and typography
- Colors and branding
- Page layout and margins
- Header/footer content

#### PDF Options
Modify the `page.pdf()` options in `generatePDF` function:
```javascript
await page.pdf({
  format: 'Letter',     // Change page size
  landscape: true,      // Landscape orientation
  margin: '10mm',       // Adjust margins
  printBackground: false // Disable background graphics
});
```

---

## Dependencies

### Required Node.js Packages

| Package | Version | Purpose |
|---------|---------|---------|
| **puppeteer** | ^22.0.0 | HTML-to-PDF conversion |
| **marked** | ^12.0.0 | Markdown parsing |

### System Requirements

- **Node.js** 16.0.0 or higher
- **Available disk space** for PDF output (typically 1-5MB per project)
- **Internet connection** for Puppeteer Chromium download (first time only)

### Installation Troubleshooting

#### Puppeteer Installation Issues
```bash
# If Puppeteer fails to install, try:
npm install puppeteer --no-sandbox

# Or use system Chrome instead:
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
npm install puppeteer
```

---

## Integration Examples

### CI/CD Pipeline
```yaml
# .github/workflows/export-docs.yml
name: Export Documentation
on:
  push:
    paths: ['completed-docs/**']

jobs:
  export:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm install
      - run: npm run export
      - uses: actions/upload-artifact@v4
        with:
          name: documentation-pdfs
          path: exports/*.pdf
```

### Automated Documentation Delivery
```bash
#!/bin/bash
# Generate docs and immediately export to PDF
/new-project
cd ~/ai-dev/vibe-prd
npm run export
# Send PDFs to stakeholders via email/Slack/etc.
```

---

## Best Practices

### Document Organization
- **Use clear file names:** `01_prd.md`, `02_architecture.md`
- **Include index.md:** Provides project overview and navigation
- **Consistent formatting:** Use standard markdown conventions
- **Reasonable length:** Break very long documents into sections

### PDF Quality
- **Test export regularly** during documentation generation
- **Review PDFs** before sharing with stakeholders
- **Consider page breaks** when writing long sections
- **Use tables sparingly** - they may not format well across pages

### Workflow Integration
- **Export after generation** as part of standard workflow
- **Version control PDFs** for important milestones
- **Automate delivery** to stakeholders via CI/CD
- **Archive exports** for project historical records

---

## Support

For issues with PDF export:

1. **Check dependencies:** Ensure Node.js and npm packages are installed
2. **Verify file permissions:** Ensure write access to exports/ directory
3. **Test with simple project:** Try exporting a basic generated project first
4. **Check console output:** Export tool provides detailed error messages

**Repository:** [jeremylongshore/vibe-prd](https://github.com/jeremylongshore/vibe-prd)
**Issues:** [GitHub Issues](https://github.com/jeremylongshore/vibe-prd/issues)