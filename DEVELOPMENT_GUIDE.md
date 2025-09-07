# 🚀 Mandal Donation App - Development Guide

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Environment Setup](#environment-setup)
3. [Development Workflow](#development-workflow)
4. [Deployment Process](#deployment-process)
5. [Daily Operations](#daily-operations)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)
8. [Emergency Procedures](#emergency-procedures)

---

## 🏗️ Project Overview

### **Architecture**
- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Firebase (Firestore, Functions, Storage, Hosting)
- **Authentication**: Firebase Auth with role-based access
- **Deployment**: Multi-environment setup (Dev, Staging, Production)

### **Environments**
| Environment | Project ID | URL | Purpose |
|-------------|------------|-----|---------|
| **Development** | `mandal-app-dev` | Local | Feature development |
| **Staging** | `mandal-app-staging` | https://mandal-app-staging.web.app | Testing & QA |
| **Production** | `mandal-app-87305` | https://tiroracharaja.in | Live application |

### **Git Branches**
- `main` → Production deployment
- `staging` → Staging deployment  
- `develop` → Integration branch
- `feature/*` → Feature development
- `hotfix/*` → Emergency fixes

---

## 🔧 Environment Setup

### **Prerequisites**
```bash
# Required tools
node --version  # v18+
npm --version   # v8+
firebase --version  # v12+
git --version   # v2.30+
```

### **Initial Setup**
```bash
# 1. Clone repository
git clone https://github.com/vishwasT007/mandal-donation-app.git
cd mandal-donation-app

# 2. Install dependencies
npm install

# 3. Login to Firebase
firebase login

# 4. Verify project aliases
firebase use
# Should show: dev, staging, prod aliases
```

### **Environment Configuration**
The project uses environment-specific configuration files:

- `.env.development` - Development environment
- `.env.staging` - Staging environment  
- `.env.production` - Production environment

**Never commit these files to Git!** They contain sensitive API keys.

---

## 💻 Development Workflow

### **Starting a New Feature**

#### 1. Create Feature Branch
```bash
# Switch to develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name
# Examples:
# git checkout -b feature/typescript-migration
# git checkout -b feature/new-dashboard
# git checkout -b feature/payment-integration
```

#### 2. Development Commands
```bash
# Start development server (uses .env.development)
npm run dev

# Build for development
npm run build

# Run linter
npm run lint

# Preview production build locally
npm run preview
```

#### 3. Commit and Push
```bash
# Add changes
git add .

# Commit with descriptive message
git commit -m "feat: add TypeScript configuration and type definitions"

# Push feature branch
git push origin feature/your-feature-name
```

#### 4. Create Pull Request
- Go to GitHub repository
- Create PR from `feature/your-feature-name` to `develop`
- Add description, screenshots, testing notes
- Request code review

### **Testing in Staging**

#### 1. Merge to Staging
```bash
# Switch to staging branch
git checkout staging
git pull origin staging

# Merge develop branch
git merge develop

# Push to staging
git push origin staging
```

#### 2. Deploy to Staging
```bash
# Deploy to staging environment
npm run deploy:staging

# Or deploy specific services
firebase deploy --only hosting --project staging
firebase deploy --only firestore --project staging
firebase deploy --only functions --project staging
```

#### 3. Test Staging Environment
- **URL**: https://mandal-app-staging.web.app
- **Console**: https://console.firebase.google.com/project/mandal-app-staging/overview
- Test all functionality thoroughly
- Verify data integrity
- Check performance
- Test on different devices/browsers

### **Production Deployment**

#### 1. Create Release Branch
```bash
# Create release branch from staging
git checkout -b release/v1.1.0
git push origin release/v1.1.0
```

#### 2. Final Testing
- Comprehensive testing in staging
- User acceptance testing
- Performance testing
- Security review

#### 3. Deploy to Production
```bash
# Merge to main
git checkout main
git pull origin main
git merge release/v1.1.0

# Tag the release
git tag v1.1.0
git push origin main --tags

# Deploy to production
npm run deploy:production
```

#### 4. Post-Deployment
- Monitor application health
- Check error rates
- Verify all features working
- Monitor user feedback

---

## 🚀 Deployment Process

### **Available Commands**

#### Development
```bash
npm run dev              # Start development server
npm run build            # Build for development
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

#### Staging
```bash
npm run build:staging    # Build for staging
npm run deploy:staging   # Deploy to staging
```

#### Production
```bash
npm run build:production # Build for production
npm run deploy:production # Deploy to production
```

### **Firebase Commands**

#### Project Management
```bash
firebase use                    # Show current project
firebase use dev               # Switch to dev
firebase use staging           # Switch to staging
firebase use prod              # Switch to production
firebase projects:list         # List all projects
```

#### Deployment
```bash
firebase deploy                # Deploy all services
firebase deploy --only hosting # Deploy only hosting
firebase deploy --only firestore # Deploy only Firestore
firebase deploy --only functions # Deploy only functions
firebase deploy --only storage # Deploy only storage
```

#### Monitoring
```bash
firebase functions:log         # View function logs
firebase hosting:channel:list  # List hosting channels
firebase firestore:indexes     # View Firestore indexes
```

---

## 📅 Daily Operations

### **Morning Routine**
```bash
# 1. Check current status
git status
firebase use

# 2. Pull latest changes
git checkout develop
git pull origin develop

# 3. Check for any issues
npm run lint
npm run build
```

### **Feature Development**
```bash
# 1. Create feature branch
git checkout -b feature/daily-feature

# 2. Develop feature
npm run dev
# Make changes...

# 3. Test locally
npm run build
npm run lint

# 4. Commit and push
git add .
git commit -m "feat: implement daily feature"
git push origin feature/daily-feature
```

### **End of Day**
```bash
# 1. Commit any remaining work
git add .
git commit -m "chore: end of day commit"
git push origin feature/your-feature

# 2. Update documentation if needed
# 3. Plan next day's tasks
```

### **Weekly Tasks**
- Review and merge completed features
- Deploy to staging for testing
- Update dependencies
- Review performance metrics
- Backup production data

---

## 🔍 Troubleshooting

### **Common Issues**

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for version conflicts
npm ls

# Update dependencies
npm update
```

#### Firebase Errors
```bash
# Check authentication
firebase login

# Verify project access
firebase projects:list

# Check project configuration
firebase use
cat .firebaserc
```

#### Environment Issues
```bash
# Verify environment files exist
ls -la .env.*

# Check environment variables
echo $VITE_FIREBASE_PROJECT_ID

# Rebuild with specific environment
npm run build:staging
```

#### Git Issues
```bash
# Reset to last working commit
git reset --hard HEAD~1

# Force push (use carefully)
git push origin branch-name --force

# Clean working directory
git clean -fd
```

### **Performance Issues**

#### Slow Builds
```bash
# Check build output
npm run build -- --verbose

# Analyze bundle size
npm run build -- --analyze

# Optimize dependencies
npm run build -- --mode production
```

#### Slow Deployments
```bash
# Deploy specific services only
firebase deploy --only hosting

# Use parallel deployment
firebase deploy --parallel

# Check deployment logs
firebase hosting:channel:list
```

---

## ✅ Best Practices

### **Code Quality**
- Write descriptive commit messages
- Use TypeScript for type safety
- Follow ESLint rules
- Write unit tests for critical functions
- Document complex logic

### **Git Workflow**
- Keep feature branches small and focused
- Use conventional commit messages
- Create PRs for all changes
- Review code before merging
- Use meaningful branch names

### **Security**
- Never commit API keys or secrets
- Use environment variables for configuration
- Implement proper authentication
- Validate all user inputs
- Keep dependencies updated

### **Performance**
- Optimize images and assets
- Use lazy loading for components
- Implement proper caching
- Monitor bundle size
- Use CDN for static assets

### **Monitoring**
- Set up error tracking
- Monitor performance metrics
- Track user analytics
- Set up alerts for critical issues
- Regular backup verification

---

## 🚨 Emergency Procedures

### **Production Issues**

#### Immediate Response
```bash
# 1. Quick rollback
git checkout main
git reset --hard HEAD~1
git push origin main --force
npm run deploy:production

# 2. Notify team
# Send Slack/Teams message
# Update status page

# 3. Investigate
# Check error logs
# Analyze metrics
# Identify root cause
```

#### Full Rollback
```bash
# 1. Rollback code
./scripts/quick-rollback.sh

# 2. Restore database (if needed)
gcloud firestore import gs://mandal-app-87305-backup/backup-YYYYMMDD-HHMMSS

# 3. Verify functionality
# Test critical features
# Monitor error rates
```

### **Data Recovery**
```bash
# List available backups
gsutil ls gs://mandal-app-87305-backup/

# Restore specific backup
gcloud firestore import gs://mandal-app-87305-backup/backup-20240101-120000

# Verify data integrity
firebase firestore:indexes
```

### **Communication Plan**
1. **Immediate**: Notify team via Slack/Teams
2. **Public**: Update status page
3. **Stakeholders**: Send email notification
4. **Users**: Social media update if needed

---

## 📚 Additional Resources

### **Documentation**
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

### **Tools**
- [Firebase Console](https://console.firebase.google.com/)
- [GitHub Repository](https://github.com/vishwasT007/mandal-donation-app)
- [Staging Environment](https://mandal-app-staging.web.app)
- [Production Environment](https://tiroracharaja.in)

### **Support**
- **Developer**: Vishwas Tarende
- **Email**: business.vishwas24@gmail.com
- **GitHub**: @vishwasT007

---

## 🔄 Workflow Summary

### **Feature Development**
```
feature/branch → develop → staging → main → production
```

### **Hotfix Process**
```
hotfix/branch → main → production
```

### **Release Process**
```
develop → staging → release/v1.x.x → main → production
```

---

**Remember**: Always test in staging before deploying to production. Your users depend on a stable, reliable application! 🚀

---

*Last updated: January 2025*
*Version: 1.0.0*
