# Step-by-Step Free Hosting Process for Rutika's Bakery

## ✅ Completed Setup
- [x] Updated README.md with deployment guide
- [x] Modified frontend/script.js for production API URLs
- [x] Created backend/.env for testing

## 🚀 Deployment Steps (Follow in Order)

### Step 1: Set up MongoDB Atlas (Database)
1. Go to https://www.mongodb.com/atlas
2. Create free account → Create cluster (free tier)
3. Set up database user (read/write permissions)
4. Configure network access (allow 0.0.0.0/0)
5. Get connection string (replace <password> with your user password)

### Step 2: Push Code to GitHub
1. Create new GitHub repository
2. Push your current code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/rutikas-bakery.git
   git push -u origin main
   ```

### Step 3: Deploy Backend to Render
1. Go to https://render.com → Create account
2. Click "New +" → "Web Service"
3. Connect GitHub → Select your repository
4. Configure:
   - Name: rutikas-bakery-backend
   - Environment: Node
   - Build Command: npm install
   - Start Command: node server.js
5. Add environment variables:
   - MONGODB_URI: your_mongodb_atlas_connection_string
   - JWT_SECRET: your_secure_random_string
   - PORT: 10000
6. Deploy → Get your backend URL (e.g., https://rutikas-bakery-backend.onrender.com)

### Step 4: Update Frontend API URL
1. In frontend/script.js, replace the placeholder:
   ```javascript
   const API_BASE_URL = process.env.NODE_ENV === 'production'
       ? 'https://your-actual-render-backend-url.onrender.com/api'  // Replace this
       : 'http://localhost:3000/api';
   ```
2. Commit and push the change to GitHub

### Step 5: Deploy Frontend to Vercel
1. Go to https://vercel.com → Create account
2. Click "New Project" → Import GitHub repo
3. Configure:
   - Framework Preset: Other
   - Root Directory: frontend
   - Build Settings: Leave default (no build needed)
4. Deploy → Get your frontend URL

### Step 6: Test Production Deployment
1. Visit your Vercel frontend URL
2. Test user registration/login
3. Test menu loading
4. Test admin panel

## 📊 Free Tier Limits to Monitor
- Render: 750 hours/month (resets monthly)
- Vercel: 100GB bandwidth/month
- MongoDB Atlas: 512MB storage free

## 🔧 Troubleshooting
- If API calls fail: Check CORS settings in backend
- If database connection fails: Verify MongoDB Atlas IP whitelist
- If deployment fails: Check Render/Vercel build logs
