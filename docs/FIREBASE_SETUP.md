# Firebase Setup Guide

Complete guide to set up Firebase for Wolves Den Inventory system.

## Prerequisites

- Google account
- Firebase CLI installed: `npm install -g firebase-tools`

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `wolves-den-inventory` (or your preference)
4. Enable/disable Google Analytics (recommended: enable)
5. Choose Analytics location and accept terms
6. Click "Create project"

## Step 2: Enable Firestore Database

1. In Firebase Console, navigate to **Firestore Database**
2. Click "Create database"
3. Select "Start in production mode" (we'll deploy custom rules)
4. Choose database location (select closest to your users)
   - `us-central1` (Iowa) - default
   - `us-east1` (South Carolina)
   - Other locations available
5. Click "Enable"

## Step 3: Enable Firebase Storage

1. Navigate to **Storage** in Firebase Console
2. Click "Get started"
3. Review security rules
4. Choose storage location (use same as Firestore)
5. Click "Done"

## Step 4: Enable Firebase Authentication

1. Navigate to **Authentication** in Firebase Console
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Save

## Step 5: Create Admin User

1. In Authentication section, go to "Users" tab
2. Click "Add user"
3. Enter email and password for admin account
4. Click "Add user"
5. Copy the **User UID** (you'll need this)

6. Go to **Firestore Database**
7. Click "Start collection"
8. Collection ID: `admins`
9. Document ID: Paste the User UID you copied
10. Add fields:
    - Field: `email`, Type: string, Value: admin email
    - Field: `role`, Type: string, Value: `admin`
    - Field: `createdAt`, Type: timestamp, Value: (current date)
11. Click "Save"

## Step 6: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click web icon (`</>`) to add a web app
4. Register app with nickname: "Wolves Den Inventory"
5. Check "Also set up Firebase Hosting"
6. Click "Register app"
7. Copy the Firebase configuration object

Example configuration:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-XXXXXXXXXX"
};
```

## Step 7: Update Project Configuration

1. Open `.firebaserc` in your project
2. Replace `YOUR_FIREBASE_PROJECT_ID` with your actual project ID

3. Open `src/firebase-config.js`
4. Replace the placeholder config with your Firebase config from Step 6

## Step 8: Deploy Firestore Rules and Indexes

```bash
# Login to Firebase CLI
firebase login

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes

# Deploy Storage rules
firebase deploy --only storage
```

## Step 9: Test with Firebase Emulator (Optional)

For local development and testing:

```bash
# Install Firebase emulator
firebase init emulators

# Start emulators
firebase emulators:start
```

Access emulator UI at: http://localhost:4000

## Step 10: Deploy to Firebase Hosting

```bash
# Build/prepare your app (if needed)
# ...

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

Your app will be available at: `https://your-project.web.app`

## Security Notes

- Keep your Firebase configuration secure
- Never commit real API keys to public repositories
- Use environment variables for sensitive data
- Review and test Firestore Security Rules thoroughly
- Enable Firebase App Check for production (see docs/SECURITY.md)

## Next Steps

- [ ] Set up reCAPTCHA v3 for App Check
- [ ] Configure custom domain (optional)
- [ ] Set up Firebase Analytics events
- [ ] Configure backup strategy
- [ ] Set up monitoring and alerts

## Troubleshooting

### Permission Denied Errors
- Check Firestore Security Rules
- Verify user is authenticated
- Confirm admin document exists for admin users

### Storage Upload Fails
- Check Storage Security Rules
- Verify file size limits (5MB for photos)
- Confirm file type is image/*

### Offline Persistence Issues
- Only works in one browser tab at a time
- Not supported in all browsers (e.g., older Safari)
- Check browser console for specific errors

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Storage Security](https://firebase.google.com/docs/storage/security)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
