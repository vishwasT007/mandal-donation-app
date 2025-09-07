# 🔧 Environment Setup Guide

## 📋 Overview

This guide will help you set up authentication, database, and dummy data for your development and staging environments.

## 🚀 Quick Setup

### **1. Set up Development Environment**

```bash
# Switch to development environment
firebase use dev

# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Set up Firebase Storage (via console)
# Go to: https://console.firebase.google.com/project/mandal-app-dev/storage
# Click "Get Started" to enable Storage

# Populate with dummy data
node scripts/setup-dummy-data.js dev
```

### **2. Set up Staging Environment**

```bash
# Switch to staging environment
firebase use staging

# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Set up Firebase Storage (via console)
# Go to: https://console.firebase.google.com/project/mandal-app-staging/storage
# Click "Get Started" to enable Storage

# Populate with dummy data
node scripts/setup-dummy-data.js staging
```

## 🔐 Authentication Setup

### **Test Accounts Created**

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@mandal.com | admin123 | Full access to all features |
| **Volunteer** | volunteer@mandal.com | volunteer123 | Can create donations, view dashboard |
| **Public** | user@mandal.com | user123 | Can view home page only |

### **Testing Authentication**

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Test login:**
   - Go to http://localhost:5173/login
   - Use any of the test accounts above
   - Verify role-based access works correctly

3. **Test different roles:**
   - Admin: Should access admin panel
   - Volunteer: Should access dashboard and donation form
   - Public: Should only see home page

## 💾 Database Setup

### **Collections Created**

#### **Users Collection**
```javascript
{
  email: "admin@mandal.com",
  role: "admin",
  fullName: "Admin User",
  mobile: "9876543210",
  createdAt: timestamp
}
```

#### **Donations Collection**
```javascript
{
  fullName: "Rajesh Kumar",
  mobile: "9876543213",
  address: "123 Main Street, Mumbai",
  amount: 1000,
  paymentMode: "Cash",
  utrNumber: "",
  due: false,
  timestamp: timestamp
}
```

#### **Gallery Collection**
```javascript
{
  title: "Ganesh Murti 2024",
  year: 2024,
  category: "Gods/Murti",
  imageUrl: "https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Ganesh+Murti+2024",
  uploadedAt: timestamp,
  uploadedBy: "admin"
}
```

#### **Settings Collection**
```javascript
{
  targetAmount: 100000,
  updatedAt: timestamp
}
```

## 🖼️ Storage Setup

### **⚠️ Firebase Storage Billing Issue**

Firebase Storage requires a paid billing plan. Since you're on the free tier, we'll use alternative storage solutions.

### **Current Setup: Placeholder Images**

Your gallery is already configured to work with external image URLs. The dummy data uses placeholder images that work perfectly for testing.

### **Alternative Storage Solutions**

See `STORAGE_ALTERNATIVES.md` for detailed options:

1. **Cloudinary** (Recommended) - 25GB free
2. **GitHub Pages** - Unlimited free
3. **ImgBB** - 32MB per image free
4. **ImageKit** - 20GB free

### **Quick Start with Placeholders**

Your current setup works immediately with placeholder images. No additional setup required for testing!

## 🧪 Testing Your Setup

### **✅ Current Status**

| Environment | Status | URL | Test Accounts |
|-------------|--------|-----|---------------|
| **Development** | ✅ **Ready** | http://localhost:5173/ | admin@mandal.com / admin123 |
| **Staging** | ✅ **Ready** | https://mandal-app-staging.web.app | Same as dev |
| **Production** | ✅ **Live** | https://mandal-app-87305.web.app | Live users |

### **🔐 Test Accounts (Both Dev & Staging)**

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@mandal.com | admin123 | Full access to all features |
| **Volunteer** | volunteer@mandal.com | volunteer123 | Can create donations, view dashboard |
| **Public** | user@mandal.com | user123 | Can view home page only |

### **1. Test Development Environment**

```bash
# Start development server (already running)
npm run dev

# Test URLs:
# Home: http://localhost:5173/
# Login: http://localhost:5173/login
# Dashboard: http://localhost:5173/dashboard (after login)
# Admin: http://localhost:5173/admin (admin only)
# Gallery: http://localhost:5173/gallery
```

### **2. Test Staging Environment**

```bash
# Deploy to staging
npm run deploy:staging

# Test URLs:
# Home: https://mandal-app-staging.web.app/
# Login: https://mandal-app-staging.web.app/login
# Dashboard: https://mandal-app-staging.web.app/dashboard (after login)
# Admin: https://mandal-app-staging.web.app/admin (admin only)
# Gallery: https://mandal-app-staging.web.app/gallery
```

### **🔍 Testing Checklist**

#### **Development Testing (http://localhost:5173/)**
- [ ] **Home Page**: Visit `/` - should show donation form
- [ ] **Login**: Visit `/login` - test all 3 accounts
- [ ] **Dashboard**: Visit `/dashboard` (after login) - should show 5 donations
- [ ] **Admin Panel**: Visit `/admin` (admin only) - should show admin controls
- [ ] **Gallery**: Visit `/gallery` - should show 3 placeholder images
- [ ] **Donation Form**: Try submitting a test donation

#### **Staging Testing (https://mandal-app-staging.web.app)**
- [ ] **Home Page**: Visit `/` - should show donation form
- [ ] **Login**: Visit `/login` - test all 3 accounts
- [ ] **Dashboard**: Visit `/dashboard` (after login) - should show 5 donations
- [ ] **Admin Panel**: Visit `/admin` (admin only) - should show admin controls
- [ ] **Gallery**: Visit `/gallery` - should show 3 placeholder images
- [ ] **Donation Form**: Try submitting a test donation

### **📊 What You Can Test**

#### **Authentication & Roles**
- ✅ Login with different user roles
- ✅ Role-based access control
- ✅ Protected routes

#### **Donation Management**
- ✅ Create new donations
- ✅ View donation dashboard
- ✅ Different payment modes (Cash, UPI, Bank Transfer, Credit)
- ✅ Due payment tracking

#### **Admin Features**
- ✅ Admin panel access
- ✅ User management
- ✅ Gallery management
- ✅ Settings management

#### **Gallery System**
- ✅ Image display with categories
- ✅ Lightbox view
- ✅ Year-based organization

## 🔄 Data Management Scripts

### **Setup Dummy Data**
```bash
# For development
node scripts/setup-dummy-data.js dev

# For staging
node scripts/setup-dummy-data.js staging
```

### **Clear Dummy Data**
```bash
# For development
node scripts/clear-dummy-data.js dev

# For staging
node scripts/clear-dummy-data.js staging
```

### **Reset Environment**
```bash
# Clear and re-setup
node scripts/clear-dummy-data.js dev
node scripts/setup-dummy-data.js dev
```

## 🐛 Troubleshooting

### **Authentication Issues**

#### **"User not found" error**
```bash
# Re-run the setup script
node scripts/setup-dummy-data.js dev
```

#### **"Invalid credentials" error**
- Check if you're using the correct environment
- Verify the email/password combinations
- Check Firebase Console for user creation

### **Database Issues**

#### **"Permission denied" error**
```bash
# Redeploy Firestore rules
firebase deploy --only firestore
```

#### **"Collection not found" error**
```bash
# Re-run the setup script
node scripts/setup-dummy-data.js dev
```

### **Storage Issues**

#### **"Storage not initialized" error**
1. Go to Firebase Console
2. Navigate to Storage
3. Click "Get Started"
4. Choose test mode
5. Select location

## 📊 Monitoring Your Environments

### **Firebase Console URLs**

| Environment | Console URL |
|-------------|-------------|
| **Development** | https://console.firebase.google.com/project/mandal-app-dev |
| **Staging** | https://console.firebase.google.com/project/mandal-app-staging |
| **Production** | https://console.firebase.google.com/project/mandal-app-87305 |

### **Check Data**

1. **Firestore Database:**
   - Go to Firebase Console → Firestore Database
   - Check collections: users, donations, gallery, settings

2. **Authentication:**
   - Go to Firebase Console → Authentication → Users
   - Verify test users are created

3. **Storage:**
   - Go to Firebase Console → Storage
   - Check if storage is enabled

## 🚀 Next Steps

1. **Set up Storage** for both environments
2. **Run dummy data scripts** to populate data
3. **Test authentication** with different roles
4. **Test all features** in both environments
5. **Verify data isolation** between environments

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify Firebase Console settings
3. Check the browser console for errors
4. Contact: business.vishwas24@gmail.com

---

**Remember**: Always test in development first, then staging, before deploying to production! 🚀
