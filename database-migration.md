# Database Migration Strategy

## 1. Firestore Data Backup

### Before Any Changes
```bash
# Export production data
gcloud firestore export gs://mandal-app-87305-backup/backup-$(date +%Y%m%d-%H%M%S)

# Create backup collection
firebase firestore:export ./backup-$(date +%Y%m%d-%H%M%S)
```

## 2. Schema Changes Strategy

### Non-Breaking Changes (Safe)
- Adding new fields with default values
- Adding new collections
- Adding new indexes

### Breaking Changes (Requires Migration)
- Removing fields
- Changing field types
- Renaming collections/fields

## 3. Migration Scripts

### Example: Adding TypeScript Support
```javascript
// scripts/migrate-to-typescript.js
const admin = require('firebase-admin');

async function migrateDonations() {
  const db = admin.firestore();
  const donations = await db.collection('donations').get();
  
  const batch = db.batch();
  
  donations.forEach(doc => {
    const data = doc.data();
    
    // Add new fields with default values
    if (!data.version) {
      batch.update(doc.ref, {
        version: '1.0.0',
        migratedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  });
  
  await batch.commit();
  console.log('Migration completed');
}

migrateDonations();
```

## 4. Rollback Strategy

### Data Rollback
```bash
# Restore from backup
gcloud firestore import gs://mandal-app-87305-backup/backup-20240101-120000

# Or restore specific collections
firebase firestore:import ./backup-20240101-120000 --collection-ids donations,users
```

### Code Rollback
```bash
# Revert to previous version
git checkout main
git reset --hard HEAD~1
git push origin main --force

# Deploy previous version
npm run deploy:production
```

## 5. Testing Strategy

### Staging Environment Testing
1. Copy production data to staging
2. Test all functionality
3. Verify data integrity
4. Performance testing
5. User acceptance testing

### Production Deployment
1. Deploy during low-traffic hours
2. Monitor error rates
3. Have rollback plan ready
4. Monitor user feedback
