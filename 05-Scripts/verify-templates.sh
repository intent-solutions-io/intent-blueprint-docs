#!/usr/bin/env bash
set -euo pipefail
dir="professional-templates"
shopt -s nullglob globstar
files=("$dir"/**/*.md)
count=${#files[@]}
echo "Template check: found ${count} *.md in ${dir}/ (recursive)"
if (( count < 22 )); then
  echo "ERROR: need at least 22 templates, found ${count}." >&2
  exit 1
fi
echo "✅ Template count OK (${count} >= 22)"
