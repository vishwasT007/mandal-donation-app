# 🧪 **Testing Guide**

## 📋 **Overview**

This guide provides comprehensive testing instructions for all environments of the Mandal Donation App.

## 🌐 **Environment URLs**

| Environment | URL | Status | Purpose |
|-------------|-----|--------|---------|
| **Development** | http://localhost:5173/ | ✅ Ready | Local development and testing |
| **Staging** | https://mandal-app-staging.web.app | ✅ Ready | Pre-production testing |
| **Production** | https://mandal-app-87305.web.app | ✅ Live | Live application |

## 🔐 **Test Accounts**

### **Development & Staging Environments**

| Role | Email | Password | Access Level | Features |
|------|-------|----------|--------------|----------|
| **Admin** | admin@mandal.com | admin123 | Full Access | All features, user management, admin panel |
| **Volunteer** | volunteer@mandal.com | volunteer123 | Dashboard Access | Create donations, view dashboard, gallery |
| **Public** | user@mandal.com | user123 | Home Only | View home page, basic features |

### **Production Environment**
- Use real user accounts
- No test accounts available

## 🚀 **Quick Start Testing**

### **1. Development Environment**
```bash
# Start development server
npm run dev

# Visit: http://localhost:5173/
# Login with test accounts above
```

### **2. Staging Environment**
```bash
# Deploy to staging (if needed)
npm run deploy:staging

# Visit: https://mandal-app-staging.web.app
# Login with test accounts above
```

## 🔍 **Comprehensive Testing Checklist**

### **🏠 Home Page Testing**
- [ ] **Page loads correctly** - No console errors
- [ ] **Donation form displays** - All fields visible
- [ ] **Form validation works** - Required fields enforced
- [ ] **Submit donation** - Test with different payment modes
- [ ] **Responsive design** - Test on mobile/tablet
- [ ] **Navigation works** - All links functional

### **🔐 Authentication Testing**

#### **Login Page**
- [ ] **Page loads** - http://localhost:5173/login
- [ ] **Admin login** - admin@mandal.com / admin123
- [ ] **Volunteer login** - volunteer@mandal.com / volunteer123
- [ ] **Public login** - user@mandal.com / user123
- [ ] **Invalid credentials** - Error handling
- [ ] **Form validation** - Required fields
- [ ] **Redirect after login** - Correct page based on role

#### **Logout Testing**
- [ ] **Logout button works** - All environments
- [ ] **Session cleared** - Can't access protected routes
- [ ] **Redirect to home** - After logout

### **📊 Dashboard Testing**

#### **Access Control**
- [ ] **Admin access** - Full dashboard features
- [ ] **Volunteer access** - Limited dashboard features
- [ ] **Public user** - Redirected or blocked
- [ ] **Unauthenticated** - Redirected to login

#### **Dashboard Features**
- [ ] **Donations display** - Should show 5 dummy donations
- [ ] **Statistics** - Total amount, count, etc.
- [ ] **Payment modes** - Different modes displayed
- [ ] **Due payments** - Highlighted correctly
- [ ] **Responsive layout** - Mobile/tablet view

### **👑 Admin Panel Testing**

#### **Access Control**
- [ ] **Admin only** - Other roles blocked
- [ ] **Unauthenticated** - Redirected to login

#### **Admin Features**
- [ ] **User management** - View/create users
- [ ] **Gallery management** - Upload/view images
- [ ] **Settings** - Update target amount
- [ ] **Donation management** - View all donations
- [ ] **Export functionality** - Excel export works

### **🖼️ Gallery Testing**

#### **Image Display**
- [ ] **Images load** - 3 placeholder images visible
- [ ] **Categories work** - Gods/Murti and Charity tabs
- [ ] **Lightbox view** - Click to enlarge
- [ ] **Navigation** - Previous/next buttons
- [ ] **Image info** - Title, year, category displayed
- [ ] **Responsive grid** - Different screen sizes

#### **Admin Gallery Features**
- [ ] **Upload images** - Admin can upload (if implemented)
- [ ] **Delete images** - Admin can delete (if implemented)
- [ ] **Edit image details** - Title, category, year

### **💳 Donation Form Testing**

#### **Form Functionality**
- [ ] **All fields work** - Name, mobile, address, amount
- [ ] **Payment modes** - Cash, UPI, Bank Transfer, Credit
- [ ] **UTR number** - Required for UPI/Bank Transfer
- [ ] **Form validation** - Required fields, format validation
- [ ] **Submit success** - Confirmation message
- [ ] **Data persistence** - Shows in dashboard

#### **Payment Mode Testing**
- [ ] **Cash** - No UTR required
- [ ] **UPI** - UTR required
- [ ] **Bank Transfer** - UTR required
- [ ] **Credit** - Due payment marked

### **📱 Responsive Testing**

#### **Mobile Devices**
- [ ] **iPhone** - Safari, Chrome
- [ ] **Android** - Chrome, Firefox
- [ ] **Tablet** - iPad, Android tablet
- [ ] **Touch interactions** - Buttons, forms work
- [ ] **Navigation** - Mobile menu works

#### **Desktop Browsers**
- [ ] **Chrome** - Latest version
- [ ] **Firefox** - Latest version
- [ ] **Safari** - Latest version
- [ ] **Edge** - Latest version

## 🐛 **Error Testing**

### **Network Issues**
- [ ] **Slow connection** - App still functional
- [ ] **Offline mode** - Graceful degradation
- [ ] **API errors** - Error messages displayed

### **Input Validation**
- [ ] **Invalid email** - Error message
- [ ] **Invalid phone** - Error message
- [ ] **Empty fields** - Required field errors
- [ ] **Special characters** - Proper handling

### **Authentication Errors**
- [ ] **Wrong password** - Error message
- [ ] **Non-existent user** - Error message
- [ ] **Session timeout** - Redirect to login

## 📊 **Data Testing**

### **Dummy Data Verification**
- [ ] **5 donations** - All visible in dashboard
- [ ] **3 gallery images** - All categories represented
- [ ] **User accounts** - All 3 roles working
- [ ] **Settings** - Target amount set

### **Data Persistence**
- [ ] **Page refresh** - Data persists
- [ ] **New donations** - Appear in dashboard
- [ ] **User sessions** - Maintained across pages

## 🔧 **Performance Testing**

### **Load Times**
- [ ] **Initial load** - Under 3 seconds
- [ ] **Page navigation** - Under 1 second
- [ ] **Image loading** - Reasonable time
- [ ] **Form submission** - Under 2 seconds

### **Resource Usage**
- [ ] **Memory usage** - No memory leaks
- [ ] **Network requests** - Minimal unnecessary calls
- [ ] **Bundle size** - Reasonable size

## 🚀 **Deployment Testing**

### **Staging Deployment**
- [ ] **Build succeeds** - No build errors
- [ ] **Deploy succeeds** - No deployment errors
- [ ] **URL accessible** - https://mandal-app-staging.web.app
- [ ] **All features work** - Same as development

### **Production Deployment**
- [ ] **Build succeeds** - No build errors
- [ ] **Deploy succeeds** - No deployment errors
- [ ] **URL accessible** - https://mandal-app-87305.web.app
- [ ] **Live data** - Real donations visible

## 📝 **Testing Commands**

### **Setup Commands**
```bash
# Set up dummy data
npm run setup:dev        # Development
npm run setup:staging    # Staging

# Clear data
npm run clear:dev        # Development
npm run clear:staging    # Staging

# Reset environments
npm run reset:dev        # Clear and re-setup dev
npm run reset:staging    # Clear and re-setup staging
```

### **Deployment Commands**
```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

### **Development Commands**
```bash
# Start development
npm run dev

# Build for staging
npm run build:staging

# Build for production
npm run build:production
```

## 🐛 **Common Issues & Solutions**

### **Authentication Issues**
- **Problem**: "User not found" error
- **Solution**: Re-run `npm run setup:dev` or `npm run setup:staging`

### **Data Not Loading**
- **Problem**: Dashboard shows no data
- **Solution**: Check Firestore rules, verify dummy data setup

### **Deployment Issues**
- **Problem**: Build fails
- **Solution**: Check for linting errors, fix and retry

### **Login Issues**
- **Problem**: Can't login with test accounts
- **Solution**: Verify Firebase Auth is enabled in console

## 📞 **Support**

If you encounter issues not covered in this guide:

1. **Check browser console** for errors
2. **Verify environment setup** in Firebase Console
3. **Check network tab** for failed requests
4. **Review troubleshooting guide**: `TROUBLESHOOTING.md`
5. **Contact**: business.vishwas24@gmail.com

---

**Happy Testing! 🚀**
