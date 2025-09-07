# Quick Start Commands

## Immediate Setup (Today)

### 1. Create Staging Environment
```bash
# Create new Firebase project
firebase projects:create mandal-app-staging

# Set up staging project
firebase use mandal-app-staging
firebase init hosting
firebase init firestore
firebase init functions
firebase init storage
```

### 2. Set up Git Branches
```bash
# Create development branches
git checkout -b develop
git checkout -b staging
git push origin develop
git push origin staging

# Set up branch protection in GitHub
```

### 3. Configure Environment Variables
```bash
# Create environment files
cp .env.example .env.local
cp .env.example .env.staging
cp .env.example .env.production

# Update with appropriate values
```

## Daily Development Workflow

### Start New Feature
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### Test Changes
```bash
npm run dev
npm run lint
npm run build
```

### Deploy to Staging
```bash
git checkout staging
git merge develop
git push origin staging
# CI/CD will deploy to staging automatically
```

### Deploy to Production
```bash
git checkout main
git merge staging
git push origin main
# CI/CD will deploy to production automatically
```

## Emergency Commands

### Quick Rollback
```bash
git checkout main
git reset --hard HEAD~1
git push origin main --force
npm run deploy:production
```

### Check System Health
```bash
# Check Firebase connection
firebase projects:list

# Check deployment status
firebase hosting:channel:list

# Check database
firebase firestore:indexes
```

## Monitoring Commands

### Check Logs
```bash
# Firebase Functions logs
firebase functions:log

# Hosting logs
firebase hosting:channel:list

# Database logs
gcloud logging read "resource.type=firestore_database"
```

### Backup Commands
```bash
# Create backup
gcloud firestore export gs://mandal-app-87305-backup/backup-$(date +%Y%m%d-%H%M%S)

# List backups
gsutil ls gs://mandal-app-87305-backup/

# Restore backup
gcloud firestore import gs://mandal-app-87305-backup/backup-20240101-120000
```

## Useful Aliases
```bash
# Add to ~/.bashrc or ~/.zshrc
alias deploy-staging="git checkout staging && git merge develop && git push origin staging"
alias deploy-prod="git checkout main && git merge staging && git push origin main"
alias rollback="git reset --hard HEAD~1 && git push origin main --force"
alias health-check="firebase projects:list && firebase hosting:channel:list"
```
