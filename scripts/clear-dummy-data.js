#!/usr/bin/env node

/**
 * Clear Dummy Data from Development and Staging Environments
 * 
 * This script clears all dummy data from the specified environment.
 * Use with caution!
 * 
 * Usage:
 * node scripts/clear-dummy-data.js dev
 * node scripts/clear-dummy-data.js staging
 */

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  deleteUser
} from 'firebase/auth';

// Environment configurations
const environments = {
  dev: {
    apiKey: "AIzaSyCHkvuXB_Gizwn-O3KkjZgUD1safEgTmcM",
    authDomain: "mandal-app-dev.firebaseapp.com",
    projectId: "mandal-app-dev",
    storageBucket: "mandal-app-dev.firebasestorage.app",
    messagingSenderId: "86333545526",
    appId: "1:86333545526:web:179d73b3c735d60f774c97"
  },
  staging: {
    apiKey: "AIzaSyD1t1inD1tsYRfYRjNy8mt6qi0uv68lZE8",
    authDomain: "mandal-app-staging.firebaseapp.com",
    projectId: "mandal-app-staging",
    storageBucket: "mandal-app-staging.firebasestorage.app",
    messagingSenderId: "1080847102294",
    appId: "1:1080847102294:web:971e3d68c0658d9c2ee6f7"
  }
};

const testEmails = [
  "admin@mandal.com",
  "volunteer@mandal.com", 
  "user@mandal.com"
];

async function clearDummyData(environment) {
  console.log(`🧹 Clearing dummy data from ${environment} environment...`);
  
  if (!environments[environment]) {
    console.error(`❌ Unknown environment: ${environment}`);
    console.log('Available environments: dev, staging');
    process.exit(1);
  }

  // Initialize Firebase
  const app = initializeApp(environments[environment]);
  const db = getFirestore(app);
  const auth = getAuth(app);

  try {
    // 1. Clear donations
    console.log('💰 Clearing donations...');
    const donationsSnapshot = await getDocs(collection(db, 'donations'));
    for (const docSnapshot of donationsSnapshot.docs) {
      await deleteDoc(doc(db, 'donations', docSnapshot.id));
      console.log(`✅ Deleted donation: ${docSnapshot.data().fullName}`);
    }

    // 2. Clear gallery images
    console.log('🖼️  Clearing gallery images...');
    const gallerySnapshot = await getDocs(collection(db, 'gallery'));
    for (const docSnapshot of gallerySnapshot.docs) {
      await deleteDoc(doc(db, 'gallery', docSnapshot.id));
      console.log(`✅ Deleted gallery image: ${docSnapshot.data().title}`);
    }

    // 3. Clear settings
    console.log('⚙️  Clearing settings...');
    try {
      await deleteDoc(doc(db, 'settings', 'donationGoal'));
      console.log('✅ Deleted settings');
    } catch (error) {
      console.log('⚠️  Settings not found or already deleted');
    }

    // 4. Clear users (Firestore documents)
    console.log('👥 Clearing user documents...');
    const usersSnapshot = await getDocs(collection(db, 'users'));
    for (const docSnapshot of usersSnapshot.docs) {
      const userData = docSnapshot.data();
      if (testEmails.includes(userData.email)) {
        await deleteDoc(doc(db, 'users', docSnapshot.id));
        console.log(`✅ Deleted user document: ${userData.email}`);
      }
    }

    console.log(`🎉 Dummy data cleared from ${environment} environment!`);
    console.log('Note: Firebase Auth users need to be deleted manually from the Firebase Console.');

  } catch (error) {
    console.error('❌ Error clearing dummy data:', error);
  }
}

// Main execution
const environment = process.argv[2];
if (!environment) {
  console.log('Usage: node scripts/clear-dummy-data.js <environment>');
  console.log('Environments: dev, staging');
  process.exit(1);
}

clearDummyData(environment);
