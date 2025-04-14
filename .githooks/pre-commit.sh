#!/bin/bash

# Navigate to the frontend directory
cd frontend

# Check if commitlint is installed globally
if ! command -v prettier &> /dev/null; then
  echo "prettier not found. Installing globally..."
  npm install -g prettier
fi

if ! command -v next &> /dev/null; then
  echo "next not found. Installing globally..."
  npm install -g next
fi

# Run linting and formatting checks
npx prettier --config .prettierrc "**/*.{js,jsx,ts,tsx,css,json,mjs,cjs,yml,yaml}" --ignore-path .gitignore --ignore-path .prettierignore
npx next lint

# Check the exit status of the commands
if [ $? -ne 0 ]; then
  echo "Linting or formatting failed. Please fix the issues before pushing."
  exit 1
fi