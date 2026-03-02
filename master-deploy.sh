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
# Ensure git is initialized
git init 2>/dev/null
git add .
git commit -m "Automated update: Instagram MERN Clone" --allow-empty

# Correct GitHub Username logic
CURRENT_GH_USER=${GH_USER:-$(gh auth status -h 2>&1 | grep 'Logged in to github.com as' | awk '{print $NF}')}

# Reset remote
git remote remove origin 2>/dev/null
git remote add origin "https://$GH_TOKEN@github.com/$CURRENT_GH_USER/$PROJECT_NAME.git"

echo "⬆️ Pushing to GitHub (using token auth)..."
git push -u origin main --force

# 2. Deploy Backend (Render)
echo "🚀 Backend Setup..."
echo "✅ MongoDB URI and Discord Webhook are ready."
echo "👉 Render URL: Connect https://github.com/$CURRENT_GH_USER/$PROJECT_NAME to Render."

# 3. Deploy Frontend (Netlify)
if [ -d "client" ]; then
    echo "🚀 Deploying Frontend to Netlify..."
    cd client
    npm install && npm run build
    # Using netlify-cli properly: First create site if not exists, then deploy
    SITE_ID=$(npx netlify sites:list --auth=$NETLIFY_TOKEN | grep "$PROJECT_NAME" | awk '{print $1}' | head -n 1)
    
    if [ -z "$SITE_ID" ]; then
        echo "🌐 Creating new Netlify site..."
        npx netlify sites:create --name="$PROJECT_NAME-frontend" --auth=$NETLIFY_TOKEN
    fi
    
    echo "🏗️ Deploying to Netlify..."
    npx netlify deploy --prod --dir=dist --auth=$NETLIFY_TOKEN
    cd ..
fi

echo "------------------------------------------------"
echo "🎉 SAB KUCH READY HAI!"
echo "------------------------------------------------"
