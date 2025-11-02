# 🐺 Wolves Den Inventory

Ice hockey gear inventory management system for the **Ice Zoo Wolves**.

🌐 **Live Demo**: [https://thewaulicus.github.io/wolves-den-inventory/](https://thewaulicus.github.io/wolves-den-inventory/)

> **Note**: The live demo runs in memory mode (no Firebase configuration). All data is stored locally in your browser and will be reset on page reload.

[![Firebase](https://img.shields.io/badge/Firebase-v8-orange)](https://firebase.google.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🎯 Overview

A comprehensive web-based system for managing hockey gear inventory and lending operations. Built with Firebase for real-time synchronization, offline support, and secure data management.

## ✨ Features

### 📦 Inventory Management
- Track all hockey gear (skates, helmets, pads, sticks, etc.)
- Multiple photos per item
- Condition tracking (new, good, fair, needs repair, retired)
- Barcode/QR code generation
- Size and brand tracking
- Real-time availability status

### 👥 Borrower Management
- Player and staff profiles
- Contact information management
- Borrowing history tracking
- Borrowing limits and restrictions
- Status management (active, suspended)

### ↔️ Lending System
- Check-out/check-in workflow
- Due date tracking
- Overdue detection
- Condition assessment on return
- Transaction history
- Email notifications

### 📊 Reporting & Analytics
- Dashboard with key metrics
- Inventory status reports
- Borrowing patterns
- Overdue items tracking
- Usage analytics

### 🔐 Security
- Firebase Authentication (email/password)
- Role-based access control (admin/borrower)
- Firestore Security Rules
- Firebase App Check protection
- Audit logging

## 🚀 Quick Start

### Prerequisites

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
├── .firebaserc              # Firebase project configuration
├── firebase.json            # Firebase services configuration
├── firestore.rules          # Database security rules
├── firestore.indexes.json   # Query optimization indexes
├── storage.rules            # Storage security rules
├── index.html               # Admin interface (to be created)
├── borrower.html            # Self-service portal (to be created)
├── src/                     # JavaScript modules
│   └── firebase-config.js   # Firebase initialization
├── css/                     # Stylesheets
├── assets/                  # Images and static files
│   └── images/
└── docs/                    # Documentation
    ├── FIREBASE_SETUP.md    # Setup guide
    ├── DATA_STRUCTURE.md    # Firestore schema
    ├── PROJECT_SUMMARY.md   # Project overview
    └── ROADMAP.md           # Development plan
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

- **[Firebase Setup Guide](docs/FIREBASE_SETUP.md)** - Step-by-step Firebase configuration
- **[Data Structure](docs/DATA_STRUCTURE.md)** - Complete Firestore schema reference
- **[Project Summary](docs/PROJECT_SUMMARY.md)** - Overview and status
- **[Development Roadmap](ROADMAP.md)** - 7-phase implementation plan

## 🗺️ Development Roadmap

The project follows a 7-phase development plan (18-24 weeks):

1. **Foundation** (2-3 weeks) - Database schema, data models, Firebase setup
2. **Inventory Management** (3-4 weeks) - Gear tracking, photos, stock control
3. **Lending System** (3-4 weeks) - Check-out/in workflow, transactions
4. **User Interface** (3-4 weeks) - Admin UI, borrower portal
5. **Reporting** (2-3 weeks) - Analytics, dashboards, exports
6. **Advanced Features** (3-4 weeks) - QR codes, notifications, maintenance
7. **Deployment** (2 weeks) - Production deployment, optimization

See [ROADMAP.md](ROADMAP.md) for detailed breakdown.

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

**Status**: Initial Setup Complete ✅  
**Version**: 0.1.0  
**Last Updated**: November 2024
