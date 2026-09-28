#!/bin/bash

# Check if a commit message was passed
if [ -z "$1" ]; then
  echo "❌ Error: No commit message provided."
  echo "Usage: bash sync.sh \"Your commit message here\""
  exit 1
fi

# Step 1: Add and commit on 'first' branch
git add .
git commit -m "$1"
git push origin first

# Step 2: Switch to 'main' and update it
git switch main
git pull origin main

# Step 3: Merge 'first' into 'main' and push
git merge first
git push origin main

# Step 4: Switch back to 'first'
git switch first