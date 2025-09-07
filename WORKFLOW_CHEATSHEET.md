# 🚀 **Workflow Cheat Sheet**

## 🎯 **Quick Commands**

### **Start New Feature**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/feature-name
npm run dev
```

### **Commit & Push**
```bash
git add .
git commit -m "feat: add feature description"
git push origin feature/feature-name
```

### **Deploy to Staging**
```bash
git checkout develop
git merge feature/feature-name
git push origin develop
npm run deploy:staging
```

### **Deploy to Production**
```bash
git checkout staging
git merge develop
git push origin staging
git checkout main
git merge staging
git push origin main
```

## 🌐 **Environment URLs**

| Environment | URL | Test Accounts |
|-------------|-----|---------------|
| **Development** | http://localhost:5173/ | admin@mandal.com / admin123 |
| **Staging** | https://mandal-app-staging.web.app | Same as dev |
| **Production** | https://mandal-app-87305.web.app | Live users |

## 🔧 **Environment Commands**

```bash
# Switch environments
firebase use dev      # Development
firebase use staging  # Staging
firebase use prod     # Production

# Set up data
npm run setup:dev        # Development
npm run setup:staging    # Staging

# Deploy
npm run deploy:staging   # Staging
npm run deploy:production # Production
```

## 🧪 **Testing**

```bash
# Development testing
npm run dev
# Visit: http://localhost:5173/

# Staging testing
npm run deploy:staging
# Visit: https://mandal-app-staging.web.app
```

## 🚨 **Emergency**

```bash
# Rollback production
git checkout main
git reset --hard <stable-commit>
git push origin main --force

# Hotfix
git checkout main
git checkout -b hotfix/critical-fix
# Make fix, test, commit, merge to main
```

## 📝 **Commit Types**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

---

**For detailed instructions, see [SAFE_WORKFLOW_GUIDE.md](./SAFE_WORKFLOW_GUIDE.md)**
