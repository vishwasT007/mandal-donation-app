# 🛡️ **Safe Development Workflow Guide**

## 📋 **Overview**

This guide outlines the complete safe development workflow for the Mandal Donation App. This workflow ensures that production remains stable while allowing for safe development and testing of new features.

## 🎯 **Workflow Principles**

1. **🛡️ Production Safety**: Never work directly on production
2. **🧪 Test First**: Always test in development and staging
3. **📝 Document Changes**: Clear commit messages and documentation
4. **🔄 Incremental Deployment**: Deploy through environments progressively
5. **🚨 Rollback Ready**: Always have rollback plans

## 🌐 **Environment Strategy**

### **Environment Flow**
```
Development → Staging → Production
     ↓           ↓         ↓
   Local Dev   Testing   Live Users
```

| Environment | Purpose | URL | Data | Users |
|-------------|---------|-----|------|-------|
| **Development** | Local development | http://localhost:5173/ | Dummy data | Test accounts |
| **Staging** | Pre-production testing | https://mandal-app-staging.web.app | Dummy data | Test accounts |
| **Production** | Live application | https://mandal-app-87305.web.app | Live data | Real users |

## 🌿 **Git Branching Strategy**

### **Branch Structure**
```
main (production)
├── staging (staging environment)
├── develop (development integration)
└── feature/* (individual features)
```

### **Branch Purposes**

| Branch | Purpose | Deployment | Data |
|--------|---------|------------|------|
| **`main`** | Production code | Auto-deploy to production | Live data |
| **`staging`** | Pre-production testing | Auto-deploy to staging | Dummy data |
| **`develop`** | Development integration | Manual deploy to staging | Dummy data |
| **`feature/*`** | Individual features | Local development only | Dummy data |

## 🚀 **Complete Development Workflow**

### **Step 1: Start Development**

```bash
# 1. Switch to develop branch
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Start development server
npm run dev
```

**Example:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/add-user-profile
npm run dev
```

### **Step 2: Develop Your Feature**

```bash
# Work on your feature
# Edit files, add components, etc.

# Test in development
# Visit: http://localhost:5173/
# Use test accounts: admin@mandal.com / admin123
```

**Development Best Practices:**
- ✅ Test frequently in development
- ✅ Use test accounts for authentication
- ✅ Check browser console for errors
- ✅ Test responsive design
- ✅ Verify all features work

### **Step 3: Commit Your Changes**

```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "feat: add user profile management

- Add UserProfile component
- Implement profile editing
- Add profile image upload
- Update user dashboard"

# Push feature branch
git push origin feature/your-feature-name
```

**Commit Message Format:**
```
type: brief description

Detailed description of changes:
- What was added
- What was changed
- What was fixed

Types: feat, fix, docs, style, refactor, test, chore
```

### **Step 4: Test in Staging**

```bash
# Merge feature to develop
git checkout develop
git merge feature/your-feature-name
git push origin develop

# Deploy to staging
npm run deploy:staging

# Test in staging
# Visit: https://mandal-app-staging.web.app
```

**Staging Testing Checklist:**
- [ ] Feature works as expected
- [ ] No console errors
- [ ] Responsive design works
- [ ] Authentication still works
- [ ] All existing features still work
- [ ] Performance is acceptable

### **Step 5: Deploy to Production**

```bash
# Merge develop to staging
git checkout staging
git merge develop
git push origin staging

# Wait for staging deployment to complete
# Test staging thoroughly

# Merge staging to main (production)
git checkout main
git merge staging
git push origin main

# Production will auto-deploy
```

## 🔄 **Daily Workflow**

### **Morning Routine**
```bash
# 1. Check current branch
git branch

# 2. Switch to develop
git checkout develop
git pull origin develop

# 3. Start development
npm run dev
```

### **Feature Development**
```bash
# 1. Create feature branch
git checkout -b feature/feature-name

# 2. Develop and test
npm run dev

# 3. Commit frequently
git add .
git commit -m "feat: implement feature X"

# 4. Push to remote
git push origin feature/feature-name
```

### **End of Day**
```bash
# 1. Commit any remaining changes
git add .
git commit -m "feat: complete feature X implementation"

# 2. Push to remote
git push origin feature/feature-name

# 3. Switch back to develop
git checkout develop
```

## 🧪 **Testing Workflow**

### **Development Testing**
```bash
# Start development server
npm run dev

# Test URLs:
# Home: http://localhost:5173/
# Login: http://localhost:5173/login
# Dashboard: http://localhost:5173/dashboard
# Admin: http://localhost:5173/admin
# Gallery: http://localhost:5173/gallery

# Test accounts:
# Admin: admin@mandal.com / admin123
# Volunteer: volunteer@mandal.com / volunteer123
# User: user@mandal.com / user123
```

### **Staging Testing**
```bash
# Deploy to staging
npm run deploy:staging

# Test URLs:
# Home: https://mandal-app-staging.web.app/
# Login: https://mandal-app-staging.web.app/login
# Dashboard: https://mandal-app-staging.web.app/dashboard
# Admin: https://mandal-app-staging.web.app/admin
# Gallery: https://mandal-app-staging.web.app/gallery

# Same test accounts as development
```

## 🚨 **Emergency Procedures**

### **Rollback Production**
```bash
# 1. Identify last stable commit
git log --oneline main

# 2. Reset main to stable commit
git checkout main
git reset --hard <stable-commit-hash>
git push origin main --force

# 3. Notify team
# 4. Investigate issue
# 5. Fix in development
```

### **Hotfix Workflow**
```bash
# 1. Create hotfix branch from main
git checkout main
git checkout -b hotfix/critical-fix

# 2. Make minimal fix
# 3. Test thoroughly
# 4. Commit fix
git add .
git commit -m "hotfix: fix critical issue"

# 5. Deploy to production
git checkout main
git merge hotfix/critical-fix
git push origin main

# 6. Merge back to develop
git checkout develop
git merge hotfix/critical-fix
git push origin develop
```

## 🔧 **Environment Management**

### **Switch Environments**
```bash
# Check current environment
firebase use

# Switch to development
firebase use dev

# Switch to staging
firebase use staging

# Switch to production
firebase use prod
```

### **Environment-Specific Commands**
```bash
# Development
npm run setup:dev        # Set up dummy data
npm run clear:dev        # Clear dummy data
npm run reset:dev        # Reset environment

# Staging
npm run setup:staging    # Set up dummy data
npm run clear:staging    # Clear dummy data
npm run reset:staging    # Reset environment
npm run deploy:staging   # Deploy to staging

# Production
npm run deploy:production # Deploy to production
```

## 📊 **Quality Assurance**

### **Pre-Deployment Checklist**
- [ ] **Code Review**: All changes reviewed
- [ ] **Testing**: Feature tested in development
- [ ] **Staging Test**: Deployed and tested in staging
- [ ] **Documentation**: Changes documented
- [ ] **Performance**: No performance regressions
- [ ] **Security**: No security vulnerabilities
- [ ] **Compatibility**: Works across browsers
- [ ] **Mobile**: Responsive design works

### **Post-Deployment Checklist**
- [ ] **Production Test**: Feature works in production
- [ ] **Monitoring**: No errors in logs
- [ ] **User Feedback**: Monitor user feedback
- [ ] **Performance**: Monitor performance metrics
- [ ] **Rollback Plan**: Ready if issues arise

## 🛠️ **Development Tools**

### **Essential Commands**
```bash
# Git operations
git status                    # Check status
git log --oneline            # View commit history
git diff                     # View changes
git stash                    # Stash changes
git stash pop                # Restore stashed changes

# Development
npm run dev                  # Start development
npm run build                # Build for production
npm run lint                 # Run linting
npm run test                 # Run tests

# Firebase
firebase login               # Login to Firebase
firebase projects:list       # List projects
firebase use <project>       # Switch project
firebase deploy              # Deploy to current project
```

### **Useful Scripts**
```bash
# Quick environment setup
npm run setup:dev            # Set up development
npm run setup:staging        # Set up staging

# Quick deployment
npm run deploy:staging       # Deploy to staging
npm run deploy:production    # Deploy to production

# Quick reset
npm run reset:dev            # Reset development
npm run reset:staging        # Reset staging
```

## 📝 **Documentation Standards**

### **Code Documentation**
- **Comments**: Explain complex logic
- **README**: Update for new features
- **API Docs**: Document new endpoints
- **Component Docs**: Document new components

### **Commit Documentation**
- **Clear Messages**: Descriptive commit messages
- **Change Log**: Update CHANGELOG.md
- **Release Notes**: Document new features
- **Migration Guides**: For breaking changes

## 🚀 **Best Practices**

### **Development**
- ✅ **Small Commits**: Make frequent, small commits
- ✅ **Test Early**: Test features as you develop
- ✅ **Code Review**: Have code reviewed before merging
- ✅ **Documentation**: Keep documentation updated
- ✅ **Error Handling**: Implement proper error handling

### **Deployment**
- ✅ **Staging First**: Always test in staging first
- ✅ **Gradual Rollout**: Deploy gradually if possible
- ✅ **Monitor**: Monitor after deployment
- ✅ **Rollback Ready**: Always have rollback plan
- ✅ **Communication**: Communicate changes to team

### **Security**
- ✅ **Environment Variables**: Use environment variables for secrets
- ✅ **Authentication**: Test authentication thoroughly
- ✅ **Authorization**: Verify role-based access
- ✅ **Input Validation**: Validate all inputs
- ✅ **HTTPS**: Always use HTTPS in production

## 📞 **Support & Troubleshooting**

### **Common Issues**
- **Deployment Fails**: Check Firebase logs, verify environment
- **Authentication Issues**: Verify Firebase Auth is enabled
- **Data Not Loading**: Check Firestore rules and data setup
- **Build Errors**: Check for linting errors, fix and retry

### **Getting Help**
1. **Check Documentation**: Review relevant .md files
2. **Check Logs**: Browser console, Firebase logs
3. **Test Environment**: Verify environment setup
4. **Contact**: business.vishwas24@gmail.com

## 🎯 **Workflow Summary**

### **Visual Workflow**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │    │     Staging     │    │   Production    │
│                 │    │                 │    │                 │
│  Local Testing  │───▶│  Pre-Prod Test  │───▶│   Live Users    │
│  Dummy Data     │    │  Dummy Data     │    │   Live Data     │
│  Test Accounts  │    │  Test Accounts  │    │   Real Users    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Feature Branch │    │   Develop       │    │     Main        │
│  feature/*      │───▶│   develop       │───▶│     main        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Step-by-Step Flow**
```
1. Create Feature Branch (feature/new-feature)
   ↓
2. Develop & Test Locally (npm run dev)
   ↓
3. Commit & Push Feature Branch
   ↓
4. Merge to Develop Branch
   ↓
5. Deploy to Staging (npm run deploy:staging)
   ↓
6. Test in Staging Environment
   ↓
7. Merge to Staging Branch
   ↓
8. Merge to Main Branch
   ↓
9. Auto-Deploy to Production
   ↓
10. Monitor Production
```

---

**Remember: Safety first! Always test thoroughly before deploying to production.** 🛡️
