# Laxmi Cycles Store — Setup Guide

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (copy from `.env.example`):
```
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key"
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev    # Start backend with auto-reload
# or
npm start      # Production start
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file (copy from `.env.example`):
```
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_WHATSAPP_NUMBER=919876543210
```

```bash
npm run dev    # Start frontend dev server
npm run build  # Production build
```

---

## Service Setup

### MongoDB Atlas
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user with read/write permissions
4. Add `0.0.0.0/0` to IP whitelist (for Render deployment)
5. Get the connection string → paste into `MONGODB_URI`

### Firebase
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create project → Enable **Email/Password** authentication
3. Frontend config: Project Settings → Your Apps → Web App → copy SDK config
4. Admin SDK: Project Settings → Service Accounts → Generate new private key
5. Set admin claim on your admin user (use Firebase Admin SDK or Cloud Functions):
   ```js
   // Run once via Node script
   admin.auth().setCustomUserClaims(uid, { admin: true })
   ```

### Cloudinary
1. Go to [cloudinary.com](https://cloudinary.com) and sign up free
2. Dashboard → copy Cloud Name, API Key, API Secret

### Create Admin User
1. Go to Firebase Console → Authentication → Users → Add user
2. Note the UID
3. Run this script once to set admin claim:

```js
// scripts/setAdminClaim.js
const admin = require('firebase-admin');
require('dotenv').config({ path: './backend/.env' });
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

admin.auth().setCustomUserClaims('YOUR_USER_UID_HERE', { admin: true })
  .then(() => { console.log('Admin claim set!'); process.exit(0); })
  .catch(console.error);
```

---

## Deployment

### Backend → Render
1. Push to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo → set `Root Directory: backend`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add all environment variables from `.env`
7. Set `FRONTEND_URL` to your Vercel domain

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo → set `Root Directory: frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add all `VITE_*` environment variables
6. Set `VITE_API_URL` to your Render backend URL

---

## Admin Panel Access
- URL: `yourdomain.com/admin/login`
- Login with the Firebase email/password of your admin user

---

## File Structure
```
Cycles store/
├── backend/
│   ├── src/
│   │   ├── config/        # database, cloudinary, firebase
│   │   ├── models/        # Cycle, Enquiry, Review
│   │   ├── controllers/   # business logic
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # auth, upload, error handler
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── api/           # axios instance
    │   ├── components/    # layout, home, cycles, ui
    │   ├── context/       # AuthContext, CompareContext
    │   ├── pages/         # public + admin pages
    │   ├── firebase.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── tailwind.config.js
    └── package.json
```
