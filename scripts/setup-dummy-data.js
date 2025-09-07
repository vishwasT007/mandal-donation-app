#!/usr/bin/env node

/**
 * Setup Dummy Data for Development and Staging Environments
 * 
 * This script populates the development and staging environments
 * with realistic dummy data for testing purposes.
 * 
 * Usage:
 * node scripts/setup-dummy-data.js dev
 * node scripts/setup-dummy-data.js staging
 */

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  setDoc, 
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
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

// Dummy data
const dummyUsers = [
  {
    email: "admin@mandal.com",
    password: "admin123",
    role: "admin",
    fullName: "Admin User",
    mobile: "9876543210"
  },
  {
    email: "volunteer@mandal.com", 
    password: "volunteer123",
    role: "volunteer",
    fullName: "Volunteer User",
    mobile: "9876543211"
  },
  {
    email: "user@mandal.com",
    password: "user123", 
    role: "public",
    fullName: "Public User",
    mobile: "9876543212"
  }
];

const dummyDonations = [
  {
    fullName: "Rajesh Kumar",
    mobile: "9876543213",
    address: "123 Main Street, Mumbai",
    amount: 1000,
    paymentMode: "Cash",
    utrNumber: "",
    due: false,
    timestamp: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    fullName: "Priya Sharma", 
    mobile: "9876543214",
    address: "456 Park Avenue, Delhi",
    amount: 2500,
    paymentMode: "UPI",
    utrNumber: "UPI123456789",
    due: false,
    timestamp: new Date(Date.now() - 172800000) // 2 days ago
  },
  {
    fullName: "Amit Patel",
    mobile: "9876543215", 
    address: "789 Garden Road, Bangalore",
    amount: 5000,
    paymentMode: "Bank Transfer",
    utrNumber: "BT987654321",
    due: false,
    timestamp: new Date(Date.now() - 259200000) // 3 days ago
  },
  {
    fullName: "Sunita Singh",
    mobile: "9876543216",
    address: "321 Lake View, Pune", 
    amount: 1500,
    paymentMode: "Credit",
    utrNumber: "",
    due: true,
    timestamp: new Date(Date.now() - 345600000) // 4 days ago
  },
  {
    fullName: "Vikram Reddy",
    mobile: "9876543217",
    address: "654 Hill Station, Hyderabad",
    amount: 3000,
    paymentMode: "Cash",
    utrNumber: "",
    due: false,
    timestamp: new Date(Date.now() - 432000000) // 5 days ago
  }
];

const dummyGalleryImages = [
  {
    title: "Ganesh Murti 2024",
    year: 2024,
    category: "Gods/Murti",
    imageUrl: "https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Ganesh+Murti+2024",
    uploadedAt: new Date(),
    uploadedBy: "admin"
  },
  {
    title: "Community Service",
    year: 2024,
    category: "Charity", 
    imageUrl: "https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Community+Service",
    uploadedAt: new Date(),
    uploadedBy: "admin"
  },
  {
    title: "Blood Donation Camp",
    year: 2023,
    category: "Charity",
    imageUrl: "https://via.placeholder.com/400x300/E74C3C/FFFFFF?text=Blood+Donation",
    uploadedAt: new Date(),
    uploadedBy: "admin"
  }
];

const dummySettings = {
  targetAmount: 100000
};

async function setupDummyData(environment) {
  console.log(`🚀 Setting up dummy data for ${environment} environment...`);
  
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
    // 1. Create users
    console.log('👥 Creating dummy users...');
    for (const userData of dummyUsers) {
      try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          userData.email, 
          userData.password
        );
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userData.email,
          role: userData.role,
          fullName: userData.fullName,
          mobile: userData.mobile,
          createdAt: serverTimestamp()
        });
        
        console.log(`✅ Created user: ${userData.email} (${userData.role})`);
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`⚠️  User already exists: ${userData.email}`);
        } else {
          console.error(`❌ Error creating user ${userData.email}:`, error.message);
        }
      }
    }

    // 2. Create donations
    console.log('💰 Creating dummy donations...');
    for (const donation of dummyDonations) {
      try {
        await addDoc(collection(db, 'donations'), {
          ...donation,
          timestamp: serverTimestamp()
        });
        console.log(`✅ Created donation: ${donation.fullName} - ₹${donation.amount}`);
      } catch (error) {
        console.error(`❌ Error creating donation:`, error.message);
      }
    }

    // 3. Create gallery images
    console.log('🖼️  Creating dummy gallery images...');
    for (const image of dummyGalleryImages) {
      try {
        await addDoc(collection(db, 'gallery'), {
          ...image,
          uploadedAt: serverTimestamp()
        });
        console.log(`✅ Created gallery image: ${image.title}`);
      } catch (error) {
        console.error(`❌ Error creating gallery image:`, error.message);
      }
    }

    // 4. Create settings
    console.log('⚙️  Creating dummy settings...');
    try {
      await setDoc(doc(db, 'settings', 'donationGoal'), {
        targetAmount: dummySettings.targetAmount,
        updatedAt: serverTimestamp()
      });
      console.log(`✅ Created settings: Target amount ₹${dummySettings.targetAmount}`);
    } catch (error) {
      console.error(`❌ Error creating settings:`, error.message);
    }

    console.log(`🎉 Dummy data setup completed for ${environment} environment!`);
    console.log('\n📋 Test Accounts:');
    console.log('Admin: admin@mandal.com / admin123');
    console.log('Volunteer: volunteer@mandal.com / volunteer123');
    console.log('User: user@mandal.com / user123');

  } catch (error) {
    console.error('❌ Error setting up dummy data:', error);
  }
}

// Main execution
const environment = process.argv[2];
if (!environment) {
  console.log('Usage: node scripts/setup-dummy-data.js <environment>');
  console.log('Environments: dev, staging');
  process.exit(1);
}

setupDummyData(environment);
