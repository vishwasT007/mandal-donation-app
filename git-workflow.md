# Git Workflow Strategy

## Branch Structure

```
main (Production)
├── staging (Staging Environment)
├── develop (Development Branch)
├── feature/feature-name (Feature Branches)
├── hotfix/hotfix-name (Hotfix Branches)
└── release/version (Release Branches)
```

## Workflow Steps

### 1. Development Workflow
```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/typescript-migration

# Work on feature
git add .
git commit -m "feat: add TypeScript configuration"

# Push to remote
git push origin feature/typescript-migration

# Create Pull Request to develop
```

### 2. Staging Deployment
```bash
# Merge develop to staging
git checkout staging
git pull origin staging
git merge develop
git push origin staging

# Deploy to staging environment
npm run deploy:staging
```

### 3. Production Deployment
```bash
# Create release branch
git checkout -b release/v1.1.0
git push origin release/v1.1.0

# After testing, merge to main
git checkout main
git pull origin main
git merge release/v1.1.0
git tag v1.1.0
git push origin main --tags

# Deploy to production
npm run deploy:production
```

## Branch Protection Rules

### Main Branch
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Restrict pushes to main

### Staging Branch
- Require pull request reviews
- Require status checks to pass
- Allow force pushes (for hotfixes)

## Commit Message Convention
```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```
