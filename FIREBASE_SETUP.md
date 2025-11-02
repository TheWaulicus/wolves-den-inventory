# 🔥 Firebase Setup Guide - Wolves Den Inventory

Your Firebase project **wolves-den-8bb09** is now configured!

## 📋 Quick Start Checklist

- [x] Firebase project created: `wolves-den-8bb09`
- [x] Firebase config added to `src/firebase-config.js`
- [x] Project ID added to `.firebaserc`
- [ ] Firebase CLI installed
- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Sample data initialized
- [ ] Admin user created

---

## Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

## Step 2: Deploy Rules

Use the automated script:

```bash
./scripts/firebase-deploy.sh
```

Or manually:

```bash
firebase deploy --only firestore
firebase deploy --only storage
```

## Step 3: Initialize Sample Data

Open in browser:

```bash
python3 -m http.server 8080
# Visit: http://localhost:8080/scripts/init-sample-data.html
```

Click "Initialize All" to add:
- 8 gear types
- 16 sample gear items  
- 10 sample borrowers

## Step 4: Create Admin User

1. Go to [Firebase Console - Authentication](https://console.firebase.google.com/project/wolves-den-8bb09/authentication)
2. Add a new user (email + password)
3. Copy the User UID
4. Go to [Firestore Database](https://console.firebase.google.com/project/wolves-den-8bb09/firestore)
5. Create collection: `admins`
6. Add document with User UID as ID:
   ```json
   {
     "email": "admin@example.com",
     "role": "admin",
     "createdAt": "2024-11-20T12:00:00Z"
   }
   ```

## Step 5: Test

Local: `http://localhost:8080`  
GitHub Pages: `https://thewaulicus.github.io/wolves-den-inventory/`  
Firebase: `https://wolves-den-8bb09.web.app`

## 🔗 Quick Links

- **Console**: https://console.firebase.google.com/project/wolves-den-8bb09
- **Firestore**: https://console.firebase.google.com/project/wolves-den-8bb09/firestore
- **Authentication**: https://console.firebase.google.com/project/wolves-den-8bb09/authentication
- **Storage**: https://console.firebase.google.com/project/wolves-den-8bb09/storage

## 🚨 Troubleshooting

**Permission denied?**
- Deploy rules: `firebase deploy --only firestore`
- Check admin user exists in `admins` collection

**Index required?**
- Deploy indexes: `firebase deploy --only firestore:indexes`

**Photo upload fails?**
- Deploy storage rules: `firebase deploy --only storage`
- Max 5MB, images only

---

**Next:** Sign in as admin and start using the app! 🎉
