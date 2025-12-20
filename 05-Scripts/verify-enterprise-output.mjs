#!/usr/bin/env node
import fs from 'fs'; import path from 'path';
const project = process.argv[2]; if(!project){console.error('usage: verify <project>');process.exit(2)}
const dir = path.join(process.cwd(),'completed-docs',project);
if(!fs.existsSync(dir)) { console.error('missing output dir'); process.exit(1); }
const files = fs.readdirSync(dir);
const md = files.filter(f=>f.endsWith('.md'));
const hasIndex = files.includes('index.md');
const hasLog = fs.existsSync(path.join(dir,'.metadata','generation-log.json'));
const expectedMin = 23; // 22 docs + index.md
if(md.length < expectedMin || !hasIndex || !hasLog){
  console.error(JSON.stringify({mdCount:md.length,hasIndex,hasLog},null,2));
  process.exit(1);
}
console.log(JSON.stringify({ok:true,mdCount:md.length,hasIndex,hasLog},null,2));
