# 🔧 Troubleshooting Guide

## 🚨 Common Issues & Solutions

### **Build Issues**

#### **Build Fails with Module Not Found**
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### **TypeScript Errors**
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Update type definitions
npm install @types/react @types/react-dom --save-dev
```

#### **Vite Build Errors**
```bash
# Check Vite configuration
cat vite.config.js

# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

### **Firebase Issues**

#### **Authentication Errors**
```bash
# Re-authenticate
firebase logout
firebase login

# Check project access
firebase projects:list
firebase use
```

#### **Deployment Failures**
```bash
# Check Firebase configuration
cat firebase.json
cat .firebaserc

# Verify project permissions
firebase projects:list

# Deploy specific service
firebase deploy --only hosting
```

#### **Function Deployment Errors**
```bash
# Check function logs
firebase functions:log

# Verify function configuration
cat functions/package.json

# Deploy functions only
firebase deploy --only functions
```

### **Environment Issues**

#### **Environment Variables Not Loading**
```bash
# Check environment files exist
ls -la .env.*

# Verify file format
cat .env.development

# Rebuild with specific environment
npm run build:staging
```

#### **Wrong Environment Configuration**
```bash
# Check current Firebase project
firebase use

# Switch to correct environment
firebase use dev
firebase use staging
firebase use prod
```

### **Git Issues**

#### **Merge Conflicts**
```bash
# Check conflict status
git status

# Resolve conflicts manually
# Edit conflicted files
git add .
git commit -m "resolve merge conflicts"
```

#### **Branch Issues**
```bash
# Check current branch
git branch

# Switch to correct branch
git checkout develop
git checkout staging
git checkout main

# Create new branch
git checkout -b feature/new-feature
```

#### **Push Failures**
```bash
# Check remote configuration
git remote -v

# Force push (use carefully)
git push origin branch-name --force

# Reset to last working commit
git reset --hard HEAD~1
```

### **Performance Issues**

#### **Slow Build Times**
```bash
# Check build output
npm run build -- --verbose

# Analyze bundle size
npm run build -- --analyze

# Optimize dependencies
npm run build -- --mode production
```

#### **Slow Development Server**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart development server
npm run dev

# Check for memory issues
npm run dev -- --host
```

### **Database Issues**

#### **Firestore Connection Errors**
```bash
# Check Firestore rules
cat firestore.rules

# Verify database location
firebase firestore:indexes

# Test connection
firebase firestore:export ./test-export
```

#### **Data Sync Issues**
```bash
# Check Firestore indexes
firebase firestore:indexes

# Rebuild indexes
firebase firestore:indexes --rebuild

# Check security rules
firebase firestore:rules
```

### **Authentication Issues**

#### **Login Failures**
```bash
# Check authentication configuration
cat src/firebase.js

# Verify API keys
echo $VITE_FIREBASE_API_KEY

# Test authentication
firebase auth:export users.json
```

#### **Role-based Access Issues**
```bash
# Check user roles in Firestore
firebase firestore:query users

# Verify security rules
cat firestore.rules

# Test user permissions
firebase auth:export users.json
```

## 🔍 Debugging Commands

### **General Debugging**
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Firebase CLI version
firebase --version

# Check Git version
git --version
```

### **Project Status**
```bash
# Check Git status
git status
git log --oneline -5

# Check Firebase status
firebase use
firebase projects:list

# Check package status
npm ls
npm outdated
```

### **Environment Debugging**
```bash
# Check environment variables
env | grep VITE

# Check build environment
npm run build -- --mode staging

# Check development environment
npm run dev
```

## 🚨 Emergency Procedures

### **Production Down**
```bash
# 1. Quick rollback
git checkout main
git reset --hard HEAD~1
git push origin main --force
npm run deploy:production

# 2. Check status
firebase hosting:channel:list

# 3. Monitor logs
firebase functions:log
```

### **Database Issues**
```bash
# 1. Check database status
firebase firestore:indexes

# 2. Restore from backup
gcloud firestore import gs://mandal-app-87305-backup/backup-YYYYMMDD-HHMMSS

# 3. Verify data integrity
firebase firestore:export ./verification-export
```

### **Authentication Down**
```bash
# 1. Check authentication service
firebase auth:export users.json

# 2. Verify API keys
cat .env.production

# 3. Test authentication
firebase auth:export test-users.json
```

## 📊 Monitoring Commands

### **Application Health**
```bash
# Check hosting status
firebase hosting:channel:list

# Check function status
firebase functions:log

# Check database status
firebase firestore:indexes
```

### **Performance Monitoring**
```bash
# Check build size
npm run build -- --analyze

# Check bundle size
npm run build -- --mode production

# Check dependencies
npm ls --depth=0
```

## 🛠️ Recovery Procedures

### **Complete Reset**
```bash
# 1. Backup current state
git stash
firebase firestore:export ./backup-$(date +%Y%m%d-%H%M%S)

# 2. Reset to last working commit
git reset --hard HEAD~1

# 3. Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# 4. Rebuild and deploy
npm run build
npm run deploy:production
```

### **Environment Reset**
```bash
# 1. Switch to correct environment
firebase use prod

# 2. Redeploy all services
firebase deploy

# 3. Verify deployment
firebase hosting:channel:list
```

## 📞 Getting Help

### **Logs and Debugging**
```bash
# Application logs
firebase functions:log

# Build logs
npm run build -- --verbose

# Development logs
npm run dev -- --debug
```

### **Support Resources**
- **Firebase Documentation**: https://firebase.google.com/docs
- **React Documentation**: https://react.dev/
- **Vite Documentation**: https://vitejs.dev/
- **GitHub Issues**: https://github.com/vishwasT007/mandal-donation-app/issues

### **Contact Information**
- **Developer**: Vishwas Tarende
- **Email**: business.vishwas24@gmail.com
- **GitHub**: @vishwasT007

---

**Remember**: Always backup before making major changes! 🚀
