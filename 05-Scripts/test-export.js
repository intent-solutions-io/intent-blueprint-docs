#!/usr/bin/env node

/**
 * Export system smoke test - validates structure without heavy dependencies
 */

const fs = require('fs').promises;
const path = require('path');

const COMPLETED_DOCS_DIR = path.join(__dirname, '..', 'completed-docs');
const EXPORTS_DIR = path.join(__dirname);

async function smokeTest() {
  console.log('🧪 Export System Smoke Test');
  console.log('============================');

  let passed = 0;
  let total = 0;

  // Test 1: Check export.js exists and is readable
  total++;
  try {
    const exportScript = path.join(__dirname, 'export.js');
    await fs.access(exportScript);
    console.log('✅ export.js exists and is accessible');
    passed++;
  } catch (err) {
    console.log('❌ export.js missing or not accessible');
  }

  // Test 2: Check completed-docs directory exists
  total++;
  try {
    await fs.access(COMPLETED_DOCS_DIR);
    console.log('✅ completed-docs directory exists');
    passed++;
  } catch (err) {
    console.log('❌ completed-docs directory missing');
  }

  // Test 3: Check exports directory exists
  total++;
  try {
    await fs.access(EXPORTS_DIR);
    console.log('✅ exports directory exists');
    passed++;
  } catch (err) {
    console.log('❌ exports directory missing');
  }

  // Test 4: Check for test project
  total++;
  try {
    const testProject = path.join(COMPLETED_DOCS_DIR, 'test-export');
    await fs.access(testProject);
    console.log('✅ test-export project found');
    passed++;
  } catch (err) {
    console.log('❌ test-export project missing');
  }

  // Test 5: Check package.json has export script
  total++;
  try {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageContent = await fs.readFile(packagePath, 'utf8');
    const pkg = JSON.parse(packageContent);

    if (pkg.scripts && pkg.scripts.export) {
      console.log('✅ package.json export script configured');
      passed++;
    } else {
      console.log('❌ package.json missing export script');
    }
  } catch (err) {
    console.log('❌ package.json missing or invalid');
  }

  // Test 6: Validate export.js structure
  total++;
  try {
    const exportScript = path.join(__dirname, 'export.js');
    const content = await fs.readFile(exportScript, 'utf8');

    const hasRequiredFunctions = [
      'generateHTML',
      'generatePDF',
      'exportProject',
      'readProjectFiles'
    ].every(fn => content.includes(fn));

    if (hasRequiredFunctions) {
      console.log('✅ export.js contains required functions');
      passed++;
    } else {
      console.log('❌ export.js missing required functions');
    }
  } catch (err) {
    console.log('❌ Could not validate export.js structure');
  }

  // Summary
  console.log('\n📊 Test Results');
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`📈 Success Rate: ${Math.round(passed/total*100)}%`);

  if (passed === total) {
    console.log('\n🎉 Export system structure validated!');
    console.log('💡 Run "npm install" to enable full PDF export functionality');
    return true;
  } else {
    console.log('\n⚠️  Some tests failed - check export system setup');
    return false;
  }
}

if (require.main === module) {
  smokeTest().catch(console.error);
}

module.exports = { smokeTest };