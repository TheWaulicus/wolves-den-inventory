# 🚀 Deployment Guide - Wolves Den Inventory

## GitHub Pages Deployment

### Prerequisites
- Repository pushed to GitHub: `https://github.com/TheWaulicus/wolves-den-inventory`
- All code committed and ready to deploy

### Option 1: Manual Push (Required for Workflow File)

Due to OAuth scope restrictions, the workflow file needs to be pushed manually:

```bash
# You'll need to push using Git credentials or SSH
git push origin main

# Or if you have SSH configured:
git remote set-url origin git@github.com:TheWaulicus/wolves-den-inventory.git
git push origin main
```

### Option 2: Enable GitHub Pages in Repository Settings

If the automatic workflow doesn't work, you can enable GitHub Pages manually:

1. Go to your repository: `https://github.com/TheWaulicus/wolves-den-inventory`
2. Click **Settings** tab
3. Scroll to **Pages** section (left sidebar)
4. Under **Source**, select:
   - **Source**: Deploy from a branch
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. Click **Save**
6. GitHub will build and deploy your site
7. Your site will be available at: `https://thewaulicus.github.io/wolves-den-inventory/`

### Option 3: Verify GitHub Actions Workflow

Once pushed, the workflow should automatically deploy on every commit:

1. Go to **Actions** tab in your repository
2. You should see "Deploy to GitHub Pages" workflow
3. Click on the latest run to see deployment status
4. Once complete (green checkmark), your site is live!

## Testing the Deployment

1. **Visit the Live Site**:
   ```
   https://thewaulicus.github.io/wolves-den-inventory/
   ```

2. **Expected Behavior**:
   - App loads in memory mode (no Firebase)
   - Sample data is available
   - All features work without persistence
   - Data resets on page reload
   - Dark/light theme works
   - All navigation pages load

3. **Test Checklist**:
   - [ ] Dashboard loads with statistics
   - [ ] Inventory management shows sample gear
   - [ ] Borrower management shows sample borrowers
   - [ ] Can add/edit gear items (memory only)
   - [ ] Can add/edit borrowers (memory only)
   - [ ] Can checkout gear
   - [ ] Can check-in gear
   - [ ] Search and filters work
   - [ ] Theme toggle works
   - [ ] Mobile responsive menu works

## Firebase Hosting (Production Deployment)

For production with full Firebase features:

### 1. Configure Firebase Project

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project (already configured)
firebase init

# Select:
# - Hosting: Configure files for Firebase Hosting
# - Use existing project
# - Public directory: . (root)
# - Single-page app: Yes
# - Set up automatic builds: No
```

### 2. Update Firebase Configuration

Edit `src/firebase-config.js` with your project credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Deploy Firestore Rules

```bash
# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Deploy Storage rules
firebase deploy --only storage
```

### 4. Deploy to Firebase Hosting

```bash
# Deploy everything
firebase deploy

# Or deploy just hosting
firebase deploy --only hosting

# Your app will be available at:
# https://YOUR_PROJECT.firebaseapp.com
```

### 5. Custom Domain (Optional)

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow DNS configuration steps
4. SSL certificate is automatically provisioned

## Environment-Specific Features

### GitHub Pages (Memory Mode)
- ✅ All UI features work
- ✅ Sample data pre-loaded
- ✅ Full CRUD operations (in-memory)
- ❌ Data not persisted (resets on reload)
- ❌ No real-time sync
- ❌ No photo upload
- ❌ No multi-device sync

### Firebase Hosting (Full Mode)
- ✅ All UI features work
- ✅ Data persisted in Firestore
- ✅ Real-time sync across devices
- ✅ Photo upload to Storage
- ✅ User authentication
- ✅ Cloud Functions (if implemented)

## Troubleshooting

### GitHub Pages Not Deploying

**Issue**: Workflow file blocked by OAuth scope

**Solution**: Push manually with full Git credentials:
```bash
# Generate a Personal Access Token with 'workflow' scope
# Settings → Developer settings → Personal access tokens
# Then use it as password when pushing
git push https://github.com/TheWaulicus/wolves-den-inventory.git main
```

**Alternative**: Enable Pages manually in repository settings (see Option 2 above)

### 404 Error on GitHub Pages

**Issue**: Page not found

**Solutions**:
1. Check that Pages is enabled in Settings
2. Verify branch is set to `main`
3. Wait 1-2 minutes after first deployment
4. Clear browser cache

### App Shows "Firebase Not Configured"

**Expected**: This is normal for GitHub Pages deployment
- App runs in memory mode
- All features work without backend
- Data resets on page reload

### Styles Not Loading

**Issue**: CSS not applied

**Solutions**:
1. Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
2. Check browser console for errors
3. Verify CSS files are committed to repository

## Monitoring Deployment

### GitHub Actions
```
https://github.com/TheWaulicus/wolves-den-inventory/actions
```

### GitHub Pages Settings
```
https://github.com/TheWaulicus/wolves-den-inventory/settings/pages
```

### Firebase Console
```
https://console.firebase.google.com
```

## Rolling Back

### GitHub Pages
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard COMMIT_HASH
git push origin main --force
```

### Firebase Hosting
```bash
# View previous deployments
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:rollback
```

## Next Steps After Deployment

1. **Test thoroughly** on live site
2. **Share demo link** with team
3. **Gather feedback** on functionality
4. **Configure Firebase** for production
5. **Add remaining features** (photos, reports, etc.)
6. **Set up monitoring** and analytics
7. **Document** any issues or improvements needed

---

**Live Demo**: https://thewaulicus.github.io/wolves-den-inventory/  
**Repository**: https://github.com/TheWaulicus/wolves-den-inventory  
**Status**: Ready for deployment 🚀
