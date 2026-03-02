#!/bin/bash

# Master Automation Deployment Script (Instagram Edition)
# Run: bash master-deploy.sh <project-name>

PROJECT_NAME=$1
if [ -z "$PROJECT_NAME" ]; then
    echo "❌ Project name is required. Usage: bash master-deploy.sh my-instagram-clone"
    exit 1
fi

# Load Secrets
source ~/.gemini_secrets.env

# Check if GH_TOKEN is set
if [ -z "$GH_TOKEN" ]; then
    echo "❌ GH_TOKEN not found in ~/.gemini_secrets.env"
    exit 1
fi

export GH_TOKEN=$GH_TOKEN

# 1. GitHub Repo Setup
echo "🚀 Syncing with GitHub Repository: $PROJECT_NAME..."
git init 2>/dev/null
git add .
git commit -m "Automated update: Instagram MERN Clone" --allow-empty

CURRENT_GH_USER=${GH_USER:-$(gh auth status -h 2>&1 | grep 'Logged in to github.com as' | awk '{print $NF}')}

# Create repo if not exists
gh repo create "$PROJECT_NAME" --public --source=. --remote=origin 2>/dev/null || echo "✅ Repo already exists."

# Correct remote
git remote remove origin 2>/dev/null
git remote add origin "https://$GH_TOKEN@github.com/$CURRENT_GH_USER/$PROJECT_NAME.git"

echo "⬆️ Pushing to GitHub..."
git push -u origin main --force

# 3. Deploy Frontend (Netlify)
if [ -d "client" ]; then
    echo "🚀 Deploying Frontend to Netlify..."
    cd client
    npm install && npm run build
    
    # Use simple deploy
    echo "🏗️ Deploying to Netlify..."
    # Netlify auto-links if we provide the token
    npx netlify deploy --prod --dir=dist --auth=$NETLIFY_TOKEN
    cd ..
fi

echo "------------------------------------------------"
echo "🎉 SAB KUCH READY HAI!"
echo "------------------------------------------------"
