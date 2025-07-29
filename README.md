# 🏛️ Tirora Cha Raja - Donation Management System

A modern, full-stack donation management application for the **श्रीराम गंज बाजार सार्वजनिक गणेश उत्सव मंडळ** (Shriram Ganj Bazar Public Ganesh Utsav Mandal). Built with React, Firebase, and modern web technologies.

## 🌟 Live Application

**🌐 Production URL:** www.tiroracharaja.in
**🔗 Firebase Console:** https://console.firebase.google.com/project/mandal-app-87305/overview

## ✨ Features

### 🎯 Core Features

- **📊 Donation Management**: Record and track donations with detailed information
- **👥 Role-Based Access**: Admin, Volunteer, and Public user roles
- **📱 Responsive Design**: Works perfectly on all devices
- **🎨 Modern UI/UX**: Beautiful, intuitive interface with animations
- **🔐 Secure Authentication**: Firebase Authentication with role management

### 💳 Payment Features

- **💵 Multiple Payment Modes**: Cash, UPI, Bank Transfer, Credit
- **📄 Auto Receipt Generation**: PDF receipts with unique links
- **📱 SMS Integration**: Automatic SMS with receipt links
- **⏳ Credit Payment System**: Admin can clear pending payments
- **🔄 Receipt Regeneration**: Updated receipts after payment clearance

### 🖼️ Gallery Management

- **📸 Admin-Controlled Gallery**: Upload images with titles and categories
- **🏛️ Category System**: "Gods/Murti" and "Charity" sections
- **🗓️ Year Organization**: Images organized by year
- **🖼️ Lightbox View**: Full-screen image viewing
- **🗑️ Image Management**: Upload, view, and delete images

### 📊 Admin Features

- **📈 Dashboard Analytics**: Real-time donation statistics
- **📊 Data Export**: Excel export functionality
- **🎯 Target Management**: Set and track donation goals
- **👥 Volunteer Management**: Create and manage volunteer accounts
- **📸 Gallery Administration**: Complete image management system

### 🎨 UI/UX Features

- **🎭 Framer Motion Animations**: Smooth, professional animations
- **🌙 Dark/Light Mode**: Theme switching capability
- **📱 Mobile-First Design**: Optimized for all screen sizes
- **♿ Accessibility**: Screen reader friendly and keyboard navigable
- **🎨 Modern Design**: Glass morphism and gradient effects

## 🛠️ Technology Stack

### Frontend

- **⚛️ React 19**: Modern React with latest features
- **⚡ Vite**: Fast build tool and development server
- **🎨 Tailwind CSS 4.0**: Utility-first CSS framework
- **🎭 Framer Motion**: Animation library
- **🔄 React Router DOM**: Client-side routing
- **🎯 Lucide React**: Beautiful icon library

### Backend & Services

- **🔥 Firebase Authentication**: User management and security
- **📊 Firestore Database**: NoSQL database for data storage
- **☁️ Firebase Storage**: File storage for images and PDFs
- **⚡ Firebase Functions**: Serverless functions
- **🌐 Firebase Hosting**: Static web hosting
- **🔒 Firestore Security Rules**: Database access control

### Utilities

- **📄 jsPDF & html2canvas**: PDF generation
- **📊 xlsx**: Excel export functionality
- **🆔 uuid**: Unique identifier generation

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase CLI** (for deployment)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mandal-donation-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id_here
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   VITE_FIREBASE_APP_ID=your_app_id_here
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Deployment
npm run deploy       # Build and deploy to Firebase
```

## 🚀 Deployment

### Firebase Setup

1. **Install Firebase CLI**

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**

   ```bash
   firebase login
   ```

3. **Initialize Firebase** (if not already done)
   ```bash
   firebase init
   ```

### Deployment Commands

#### Full Deployment

```bash
# Build and deploy everything
npm run build
firebase deploy
```

#### Hosting Only (Recommended for most updates)

```bash
# Build and deploy only hosting
npm run build
firebase deploy --only hosting
```

#### Specific Services

```bash
# Deploy only functions
firebase deploy --only functions

# Deploy only Firestore rules
firebase deploy --only firestore

# Deploy only Storage rules
firebase deploy --only storage
```

### Production Build

```bash
# Build for production
npm run build

# The build output will be in the `dist/` directory
```

## 📁 Project Structure

```
mandal-donation-app/
├── public/                 # Static assets
│   ├── gallery/           # Gallery images
│   └── images/            # Other static images
├── src/
│   ├── components/        # Reusable components
│   │   ├── CreateVolunteerForm.jsx
│   │   ├── Gallry.jsx
│   │   └── Navbar.jsx
│   ├── context/           # React context
│   │   └── AuthContext.jsx
│   ├── pages/             # Page components
│   │   ├── AdminPanel.jsx
│   │   ├── Dashboard.jsx
│   │   ├── DonationForm.jsx
│   │   ├── Home.jsx
│   │   ├── LoginPage.jsx
│   │   └── ReceiptPage.jsx
│   ├── utils/             # Utility functions
│   │   ├── exportDonationsToExcel.js
│   │   └── generateReceiptPDF.js
│   ├── App.jsx            # Main app component
│   ├── firebase.js        # Firebase configuration
│   ├── index.css          # Global styles
│   └── main.jsx           # App entry point
├── firebase.json          # Firebase configuration
├── firestore.rules        # Firestore security rules
├── storage.rules          # Storage security rules
├── .env                   # Environment variables
└── package.json           # Dependencies and scripts
```

## 🔐 Security Features

### Authentication

- **Firebase Authentication**: Secure user management
- **Role-Based Access**: Admin, Volunteer, Public roles
- **Protected Routes**: Automatic redirection for unauthorized access

### Database Security

- **Firestore Rules**: Granular access control
- **Storage Rules**: Secure file upload/download
- **Environment Variables**: Secure API key management

### Data Protection

- **Input Validation**: Client and server-side validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Secure form submissions

## 🎨 Design System

### Colors

- **Primary**: Orange (#c2410c)
- **Secondary**: Yellow (#fbbf24)
- **Background**: Cream (#fffbeb)
- **Text**: Dark Gray (#1e293b)

### Typography

- **Font Family**: Inter (Google Fonts)
- **Responsive**: Mobile-first design
- **Accessibility**: High contrast ratios

### Components

- **Cards**: Glass morphism effect
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Modern input styling with focus states
- **Animations**: Smooth Framer Motion transitions

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Features

- **Mobile-First**: Optimized for mobile devices
- **Touch-Friendly**: Large touch targets
- **Fast Loading**: Optimized assets and lazy loading
- **Offline Support**: Progressive Web App features

## 🔧 Configuration Files

### Firebase Configuration

- **firebase.json**: Hosting, functions, and rules configuration
- **firestore.rules**: Database access control
- **storage.rules**: File storage security
- **cors.json**: Cross-origin resource sharing

### Build Configuration

- **vite.config.js**: Vite build configuration
- **eslint.config.js**: Code linting rules
- **package.json**: Dependencies and scripts

## 🐛 Troubleshooting

### Common Issues

#### Firebase API Key Error

```bash
# Solution: Check environment variables
cat .env
# Ensure all VITE_FIREBASE_* variables are set
```

#### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Deployment Issues

```bash
# Check Firebase login
firebase login

# Check project configuration
firebase projects:list
firebase use <project-id>
```

### Development Tips

1. **Hot Reload**: Changes reflect immediately in development
2. **Console Logs**: Check browser console for errors
3. **Network Tab**: Monitor API calls and responses
4. **Firebase Console**: Monitor database and storage usage

## 🤝 Contributing

### Development Workflow

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes**

   - Follow existing code style
   - Add proper comments
   - Test thoroughly

3. **Test Locally**

   ```bash
   npm run dev
   npm run build
   ```

4. **Deploy to Staging** (if applicable)

   ```bash
   firebase deploy --only hosting
   ```

5. **Create Pull Request**
   - Describe changes clearly
   - Include screenshots if UI changes
   - Test in production environment

## 📄 License

This project is developed for the **श्रीराम गंज बाजार सार्वजनिक गणेश उत्सव मंडळ** and is not intended for commercial use.

## 👨‍💻 Developer

**Developed by:** Vishwas Tarende  
**Contact:** business.vishwas24@gmail.com
**Project:** Tirora Cha Raja - Donation Management System

---

## 🎉 Acknowledgments

- **Firebase Team**: For excellent backend services
- **Vite Team**: For fast build tooling
- **Tailwind CSS**: For utility-first styling
- **Framer Motion**: For smooth animations
- **Lucide Icons**: For beautiful iconography

---

_Built with ❤️ for the community_
