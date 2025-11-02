# 🐺 Wolves Den Inventory

Ice hockey gear inventory management system for the **Ice Zoo Wolves**.

🌐 **Live Application**: [https://thewaulicus.github.io/wolves-den-inventory/](https://thewaulicus.github.io/wolves-den-inventory/)

🔥 **Firebase Project**: `wolves-den-8bb09` (Fully configured and deployed)

> **Status**: ✅ **Production Ready** - Complete inventory management system with real-time data, authentication, and full CRUD operations for gear, borrowers, and transactions.

[![Firebase](https://img.shields.io/badge/Firebase-v9.22.0-orange)](https://firebase.google.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🎯 Overview

A comprehensive web-based system for managing hockey gear inventory and lending operations. Built with Firebase for real-time synchronization, offline support, and secure data management.

## ✨ Features

### Core Functionality (Production Ready)

#### 📦 Inventory Management
- ✅ Complete gear tracking with 100+ items
- ✅ Distinct gear types: Junior, Senior, Intermediate, Goalie equipment
- ✅ Comprehensive size management with validated options
- ✅ Condition tracking (available, checked-out, maintenance, retired)
- ✅ Brand, model, and description tracking
- ✅ Real-time availability status
- ✅ Advanced search and filtering
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Gear type management with categories

#### 👥 Borrower Management
- ✅ Player and staff profiles with full CRUD
- ✅ Contact information (email, phone)
- ✅ Team role tracking (player, coach, staff, volunteer)
- ✅ Status management (active, suspended, inactive)
- ✅ Borrowing limits enforcement
- ✅ Active items counter
- ✅ Search and filter functionality
- ✅ Real-time updates

#### ↔️ Transaction System
- ✅ Quick checkout workflow
- ✅ Check-in with condition assessment
- ✅ Due date tracking (optional)
- ✅ Overdue detection and alerts
- ✅ Transaction history archiving
- ✅ Real-time status synchronization
- ✅ Notes and tracking information

#### 📊 Dashboard & Monitoring
- ✅ Real-time statistics dashboard
- ✅ Recent activity feed
- ✅ Overdue items alerts
- ✅ Inventory counts by status and type
- ✅ Quick actions panel
- ✅ Live data synchronization

#### 🔐 Security & Authentication
- ✅ Firebase Authentication (email/password)
- ✅ Role-based access control (admin/borrower)
- ✅ Firestore Security Rules enforced
- ✅ Storage Security Rules enforced
- ✅ Input validation and sanitization
- ✅ Secure API key management

#### 🎨 User Experience
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Intuitive navigation system
- ✅ Toast notifications for feedback
- ✅ Loading states and error handling
- ✅ Real-time sync across devices
- ✅ Offline persistence enabled
- ✅ Modal-based forms and dialogs

### 🚧 Future Enhancements
- Photo upload and management UI
- Barcode/QR code generation and scanning
- Advanced reporting with charts
- Email notifications for due dates
- PWA (Progressive Web App) support
- Mobile native app version
- Bulk operations (import/export)

## 🚀 Quick Start

### Access the Live Application

**Production Site**: [https://thewaulicus.github.io/wolves-den-inventory/](https://thewaulicus.github.io/wolves-den-inventory/)

1. Visit the URL above
2. Sign in with your admin credentials (or continue in demo mode)
3. Start managing your inventory!

### For Administrators

**Firebase Console**: [https://console.firebase.google.com/project/wolves-den-8bb09](https://console.firebase.google.com/project/wolves-den-8bb09)

- Manage users in Authentication
- View data in Firestore
- Monitor usage and analytics

### Local Development

#### Prerequisites

- Node.js and npm installed
- Firebase CLI: `npm install -g firebase-tools`
- Google account for Firebase

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/TheWaulicus/wolves-den-inventory.git
   cd wolves-den-inventory
   ```

2. **Create Firebase Project**
   - Follow the guide in [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md)
   - Get your Firebase configuration

3. **Configure the project**
   - Update `.firebaserc` with your Firebase project ID
   - Update `src/firebase-config.js` with your Firebase config

4. **Deploy Firebase rules**
   ```bash
   firebase login
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```

5. **Create admin user**
   - Add user in Firebase Authentication
   - Create admin document in Firestore (see setup guide)

6. **Test locally**
   ```bash
   # Start Firebase emulators
   firebase emulators:start
   
   # Open index.html in browser
   # Or use: firebase serve
   ```

7. **Deploy to production**
   ```bash
   firebase deploy
   ```

## 📁 Project Structure

```
wolves-den-inventory/
├── .firebaserc                      # Firebase project configuration
├── firebase.json                    # Firebase services configuration
├── firestore.rules                  # Database security rules
├── firestore.indexes.json           # Query optimization indexes
├── storage.rules                    # Storage security rules
├── index.html                       # Main application interface
├── README.md                        # This file
├── AGENTS.md                        # Development guidelines
├── src/                             # JavaScript source code
│   ├── firebase-config.js           # Firebase initialization
│   ├── app.js                       # Main application
│   ├── models/                      # Data models
│   │   ├── GearItem.js              # Gear item model
│   │   ├── GearType.js              # Gear type model
│   │   ├── Borrower.js              # Borrower model
│   │   └── Transaction.js           # Transaction model
│   ├── services/                    # Business logic
│   │   ├── GearService.js           # Gear CRUD operations
│   │   ├── GearTypeService.js       # Gear type management
│   │   ├── BorrowerService.js       # Borrower management
│   │   └── TransactionService.js    # Transaction operations
│   ├── ui/                          # UI components
│   │   ├── Dashboard.js             # Dashboard view
│   │   ├── GearManagement.js        # Gear inventory UI
│   │   ├── BorrowerManagement.js    # Borrower management UI
│   │   ├── TransactionManagement.js # Transaction tracking UI
│   │   ├── QuickCheckout.js         # Quick checkout modal
│   │   ├── CheckInModal.js          # Check-in modal
│   │   ├── GearForm.js              # Gear add/edit form
│   │   ├── BorrowerForm.js          # Borrower add/edit form
│   │   ├── GearTypeManager.js       # Gear type management
│   │   ├── Navigation.js            # Navigation system
│   │   └── NotificationSystem.js    # Toast notifications
│   ├── utils/                       # Utility functions
│   │   ├── validators.js            # Input validation
│   │   ├── formatters.js            # Data formatting
│   │   └── dateHelpers.js           # Date utilities
│   └── data/                        # Configuration data
│       ├── defaultGearTypes.js      # Default gear types
│       ├── sampleGearData.js        # Sample gear items
│       └── sampleBorrowers.js       # Sample borrowers
├── css/                             # Stylesheets
│   ├── main.css                     # Main styles
│   └── components.css               # Component styles
├── assets/                          # Static assets
│   └── images/                      # Images and icons
├── scripts/                         # Administrative scripts
│   ├── reset-and-recreate-inventory.html  # Database reset tool
│   └── firebase-deploy.sh           # Deployment script
└── docs/                            # Documentation
    ├── SCRIPTS_DOCUMENTATION.md     # Admin scripts guide
    ├── FIREBASE_SETUP.md            # Firebase setup guide
    ├── DATA_STRUCTURE.md            # Database schema
    ├── DEPLOYMENT_GUIDE.md          # Deployment instructions
    ├── PROJECT_SUMMARY.md           # Project overview
    └── ROADMAP.md                   # Development roadmap
```

## 🔧 Technology Stack

- **Database**: Firebase Firestore (NoSQL)
- **Storage**: Firebase Storage (photos)
- **Authentication**: Firebase Authentication
- **Frontend**: Vanilla JavaScript + HTML/CSS
- **Backend**: Firebase Cloud Functions (Python)
- **Hosting**: Firebase Hosting / GitHub Pages
- **Testing**: Jest, pytest, Firebase Emulator

## 🚀 Deployment

### GitHub Pages (Demo Mode)

The app automatically deploys to GitHub Pages on every push to `main`:

1. **Automatic Deployment**: GitHub Actions workflow builds and deploys
2. **Access**: Visit [https://thewaulicus.github.io/wolves-den-inventory/](https://thewaulicus.github.io/wolves-den-inventory/)
3. **Memory Mode**: Runs without Firebase (data stored in browser memory)

### Firebase Hosting (Production)

For production deployment with full Firebase features:

```bash
# Configure Firebase
firebase init hosting

# Deploy to Firebase
firebase deploy --only hosting

# Deploy everything (hosting, Firestore rules, storage)
firebase deploy
```

### Manual Setup

To run locally without Firebase:

```bash
# Serve with any HTTP server
python3 -m http.server 8080

# Or use Live Server in VS Code
# Open index.html and click "Go Live"
```

The app will work in memory mode - perfect for testing and development!

## 📖 Documentation

- **[Scripts Documentation](docs/SCRIPTS_DOCUMENTATION.md)** - Admin scripts and tools guide
- **[Firebase Setup Guide](docs/FIREBASE_SETUP.md)** - Step-by-step Firebase configuration
- **[Data Structure](docs/DATA_STRUCTURE.md)** - Complete Firestore schema reference
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **[Project Summary](docs/PROJECT_SUMMARY.md)** - Overview and current status
- **[Development Roadmap](docs/ROADMAP.md)** - Feature development plan

## 🛠️ Administrative Tools

### Reset & Recreate Inventory
A comprehensive script for resetting the database and recreating inventory from scratch:

```
scripts/reset-and-recreate-inventory.html
```

**Features:**
- Complete database cleanup (gear items, types, transactions, borrowers)
- Recreate gear types with proper categories and sizes
- Generate individual items based on inventory counts
- Three-step process with safety confirmations

See [docs/SCRIPTS_DOCUMENTATION.md](docs/SCRIPTS_DOCUMENTATION.md) for details.

## 📊 Current Inventory

The system currently manages:
- **16 Gear Types**: Junior, Senior, Intermediate, and Goalie equipment
- **100+ Individual Items**: Tracked with sizes, brands, and conditions
- **Categories**: Protective gear, footwear, sticks, clothing, accessories
- **Size Options**: Comprehensive sizing for all equipment types

## 🔐 Security

- **Authentication**: Firebase Auth with email/password
- **Authorization**: Firestore Security Rules with RBAC
- **Data Protection**: Encrypted at rest and in transit
- **Bot Protection**: Firebase App Check with reCAPTCHA v3
- **Input Validation**: Client and server-side validation
- **Audit Logging**: Transaction history and change tracking

## 🧪 Testing

```bash
# Start Firebase emulators for testing
firebase emulators:start

# Run JavaScript tests
npm test

# Run Python tests (for utilities)
pytest
```

## 🚀 Deployment

```bash
# Deploy all services
firebase deploy

# Deploy specific services
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only functions
```

## 🤝 Contributing

This is a custom project for the Ice Zoo Wolves. For modifications or enhancements, please follow the coding standards outlined in the repository.

## 📝 License

MIT License - See [LICENSE](LICENSE) for details

## 🐺 About Ice Zoo Wolves

The Ice Zoo Wolves are a hockey team that needs efficient gear management. This system streamlines equipment tracking, lending, and maintenance operations.

## 🔗 Links

- **Repository**: https://github.com/TheWaulicus/wolves-den-inventory
- **Firebase Console**: https://console.firebase.google.com/
- **Firebase Documentation**: https://firebase.google.com/docs

## 📞 Support

For issues, questions, or contributions, please refer to the documentation in the `docs/` folder or create an issue in the GitHub repository.

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: November 2024  
**Total Lines of Code**: ~1,900 (models, services, UI components, utilities)
