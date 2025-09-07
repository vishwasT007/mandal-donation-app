# ⚡ Quick Reference Guide

## 🧪 **Quick Testing**

### **Environment URLs**
- **Development**: http://localhost:5173/ (run `npm run dev`)
- **Staging**: https://mandal-app-staging.web.app
- **Production**: https://mandal-app-87305.web.app

### **Test Accounts**
| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | admin@mandal.com | admin123 | Full access |
| **Volunteer** | volunteer@mandal.com | volunteer123 | Dashboard access |
| **Public** | user@mandal.com | user123 | Home page only |

### **Quick Test Commands**
```bash
# Start development
npm run dev

# Set up dummy data
npm run setup:dev        # Development
npm run setup:staging    # Staging

# Clear and reset data
npm run reset:dev        # Development
npm run reset:staging    # Staging

# Deploy
npm run deploy:staging   # Deploy to staging
```

## 🛡️ **Safe Development Workflow**

### **Quick Start**
```bash
# 1. Start from develop branch
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Start development
npm run dev
```

### **Complete Workflow**
For detailed workflow instructions, see **[SAFE_WORKFLOW_GUIDE.md](./SAFE_WORKFLOW_GUIDE.md)**

## 🚀 Daily Commands

### **Start Development**
```bash
git checkout develop
git pull origin develop
npm run dev
```

### **Create New Feature**
```bash
git checkout -b feature/feature-name
# Make changes...
git add .
git commit -m "feat: add feature description"
git push origin feature/feature-name
```

### **Deploy to Staging**
```bash
git checkout staging
git merge develop
git push origin staging
npm run deploy:staging
```

### **Deploy to Production**
```bash
git checkout main
git merge staging
git push origin main
npm run deploy:production
```

## 🔧 Environment Switching

```bash
firebase use dev      # Switch to development
firebase use staging  # Switch to staging
firebase use prod     # Switch to production
```

## 📊 Build Commands

```bash
npm run dev              # Development server
npm run build            # Build for dev
npm run build:staging    # Build for staging
npm run build:production # Build for production
npm run lint             # Run linter
```

## 🚨 Emergency Commands

### **Quick Rollback**
```bash
git checkout main
git reset --hard HEAD~1
git push origin main --force
npm run deploy:production
```

### **Check Status**
```bash
git status
firebase use
firebase projects:list
```

## 🌐 URLs

- **Development**: http://localhost:5173
- **Staging**: https://mandal-app-staging.web.app
- **Production**: https://tiroracharaja.in

## 📁 Important Files

- `.env.development` - Dev environment config
- `.env.staging` - Staging environment config
- `.env.production` - Production environment config
- `firebase.json` - Firebase configuration
- `.firebaserc` - Project aliases

## 🔑 Environment Variables

All environments use these variables:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_ENVIRONMENT`

## 📋 Git Workflow

```
feature/branch → develop → staging → main → production
```

## 🛠️ Troubleshooting

### **Build Issues**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Firebase Issues**
```bash
firebase login
firebase use
firebase projects:list
```

### **Git Issues**
```bash
git status
git log --oneline
git reset --hard HEAD~1
```
