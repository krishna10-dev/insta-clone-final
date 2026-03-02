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
# Git initialize if not already
[ ! -d .git ] && git init
git add .
git commit -m "Automated update: Instagram MERN Clone" --allow-empty

# Handle remote origin
git remote remove origin 2>/dev/null
gh repo create "$PROJECT_NAME" --public --source=. --remote=origin 2>/dev/null || echo "✅ Repo already exists on GitHub."
git remote add origin "https://github.com/$(gh auth status -h 2>&1 | grep 'Logged in to github.com as' | awk '{print $NF}')/$PROJECT_NAME.git" 2>/dev/null || true

echo "⬆️ Pushing to GitHub..."
git push -u origin main --force

# 2. Deploy Backend (Render)
echo "🚀 Backend Setup..."
echo "✅ MongoDB URI and Discord Webhook are ready."
echo "👉 Connect this repo to Render.com manually (one-time) and set these variables:"
echo "   MONGO_URI=$MONGO_URI"
echo "   DISCORD_WEBHOOK=$DISCORD_WEBHOOK"

# 3. Deploy Frontend (Netlify)
if [ -d "client" ]; then
    echo "🚀 Deploying Frontend to Netlify..."
    cd client
    # Install dependencies and build
    npm install && npm run build
    # Use Netlify CLI to deploy
    # Note: Using the provided NETLIFY_TOKEN
    npx netlify deploy --prod --dir=dist --auth=$NETLIFY_TOKEN --name="$PROJECT_NAME-frontend"
    cd ..
fi

echo "------------------------------------------------"
echo "🎉 SAB KUCH READY HAI!"
echo "------------------------------------------------"
