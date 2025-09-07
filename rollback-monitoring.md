# Rollback and Monitoring Strategy

## 1. Monitoring Setup

### Firebase Analytics
```javascript
// Add to main.jsx
import { getAnalytics } from 'firebase/analytics';

const analytics = getAnalytics(app);

// Track critical events
analytics.logEvent('donation_submitted', {
  amount: donationAmount,
  payment_mode: paymentMode
});
```

### Error Monitoring
```javascript
// Add error boundary
import { getFunctions, httpsCallable } from 'firebase/functions';

const reportError = httpsCallable(functions, 'reportError');

window.addEventListener('error', (event) => {
  reportError({
    message: event.error?.message,
    stack: event.error?.stack,
    url: window.location.href,
    userAgent: navigator.userAgent
  });
});
```

## 2. Health Checks

### Application Health
```javascript
// utils/healthCheck.js
export const healthCheck = async () => {
  try {
    // Check Firebase connection
    const db = getFirestore();
    await getDoc(doc(db, 'health', 'check'));
    
    // Check storage
    const storage = getStorage();
    const testRef = ref(storage, 'health/test.txt');
    
    return { status: 'healthy', timestamp: new Date() };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};
```

### Database Health
```javascript
// Check critical collections
const checkDatabaseHealth = async () => {
  const checks = [
    { collection: 'donations', minCount: 0 },
    { collection: 'users', minCount: 1 },
    { collection: 'settings', minCount: 1 }
  ];
  
  for (const check of checks) {
    const snapshot = await getDocs(collection(db, check.collection));
    if (snapshot.size < check.minCount) {
      throw new Error(`Collection ${check.collection} has insufficient data`);
    }
  }
};
```

## 3. Rollback Procedures

### Quick Rollback (Code Only)
```bash
#!/bin/bash
# quick-rollback.sh

echo "Starting quick rollback..."

# Get current commit
CURRENT_COMMIT=$(git rev-parse HEAD)
echo "Current commit: $CURRENT_COMMIT"

# Get previous commit
PREVIOUS_COMMIT=$(git rev-parse HEAD~1)
echo "Rolling back to: $PREVIOUS_COMMIT"

# Reset to previous commit
git reset --hard $PREVIOUS_COMMIT

# Force push to main
git push origin main --force

# Deploy previous version
npm run deploy:production

echo "Rollback completed"
```

### Full Rollback (Code + Data)
```bash
#!/bin/bash
# full-rollback.sh

echo "Starting full rollback..."

# 1. Rollback code
./quick-rollback.sh

# 2. Restore database
BACKUP_DATE=$1
if [ -z "$BACKUP_DATE" ]; then
    echo "Usage: ./full-rollback.sh YYYYMMDD-HHMMSS"
    exit 1
fi

echo "Restoring database from backup: $BACKUP_DATE"
gcloud firestore import gs://mandal-app-87305-backup/backup-$BACKUP_DATE

echo "Full rollback completed"
```

## 4. Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Staging environment tested
- [ ] Database backup created
- [ ] Rollback plan ready
- [ ] Monitoring alerts configured
- [ ] Team notified of deployment

### During Deployment
- [ ] Deploy during low-traffic hours
- [ ] Monitor error rates
- [ ] Check critical functionality
- [ ] Monitor user feedback
- [ ] Have rollback ready

### Post-Deployment
- [ ] Verify all features working
- [ ] Check analytics data
- [ ] Monitor for 24 hours
- [ ] Document any issues
- [ ] Update deployment log

## 5. Emergency Procedures

### Critical Issues
1. **Immediate Rollback**: Use quick-rollback.sh
2. **Notify Users**: Update status page
3. **Investigate**: Check logs and analytics
4. **Fix**: Develop hotfix in separate branch
5. **Test**: Thoroughly test in staging
6. **Deploy**: Deploy hotfix to production

### Communication Plan
- **Slack/Teams**: Immediate notification
- **Status Page**: Public updates
- **Email**: Stakeholder notification
- **Social Media**: If needed

## 6. Monitoring Dashboard

### Key Metrics
- Error rate
- Response time
- User engagement
- Donation success rate
- Database performance
- Storage usage

### Alerts
- Error rate > 5%
- Response time > 3 seconds
- Database connection failures
- Storage quota > 80%
- Unusual traffic patterns
