#!/usr/bin/env bash
set -euo pipefail
dir="professional-templates"
shopt -s nullglob
files=("$dir"/*.md)
count=${#files[@]}
echo "Template check: found ${count} *.md in ${dir}"
if (( count < 22 )); then
  echo "ERROR: need at least 22 templates." >&2
  exit 1
fi