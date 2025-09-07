# Environment Setup Guide

## 1. Create Multiple Firebase Projects

### Production (Current)
- Project ID: `mandal-app-87305`
- Domain: `tiroracharaja.in`

### Staging (New)
- Project ID: `mandal-app-staging`
- Domain: `staging.tiroracharaja.in`

### Development (New)
- Project ID: `mandal-app-dev`
- Domain: `dev.tiroracharaja.in`

## 2. Environment Variables

### .env.local (Development)
```env
VITE_FIREBASE_API_KEY=your_dev_api_key
VITE_FIREBASE_AUTH_DOMAIN=mandal-app-dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mandal-app-dev
VITE_FIREBASE_STORAGE_BUCKET=mandal-app-dev.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_dev_sender_id
VITE_FIREBASE_APP_ID=your_dev_app_id
VITE_ENVIRONMENT=development
```

### .env.staging (Staging)
```env
VITE_FIREBASE_API_KEY=your_staging_api_key
VITE_FIREBASE_AUTH_DOMAIN=mandal-app-staging.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mandal-app-staging
VITE_FIREBASE_STORAGE_BUCKET=mandal-app-staging.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_staging_sender_id
VITE_FIREBASE_APP_ID=your_staging_app_id
VITE_ENVIRONMENT=staging
```

### .env.production (Production)
```env
VITE_FIREBASE_API_KEY=your_prod_api_key
VITE_FIREBASE_AUTH_DOMAIN=mandal-app-87305.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mandal-app-87305
VITE_FIREBASE_STORAGE_BUCKET=mandal-app-87305.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_prod_sender_id
VITE_FIREBASE_APP_ID=your_prod_app_id
VITE_ENVIRONMENT=production
```
