#!/bin/bash
# Firebase Deployment Script for Wolves Den Inventory
# This script deploys Firestore rules, indexes, and Storage rules to Firebase

set -e  # Exit on error

echo "🐺 Wolves Den Inventory - Firebase Deployment"
echo "=============================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found!"
    echo "Install it with: npm install -g firebase-tools"
    exit 1
fi

echo "✅ Firebase CLI found"
echo ""

# Login check
echo "📋 Checking Firebase authentication..."
if ! firebase projects:list &> /dev/null; then
    echo "⚠️  Not logged in to Firebase"
    echo "Running: firebase login"
    firebase login
fi

echo "✅ Authenticated with Firebase"
echo ""

# Show current project
echo "📌 Current Firebase project:"
firebase use
echo ""

# Confirm deployment
read -p "Deploy to wolves-den-8bb09? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

echo ""
echo "🚀 Starting deployment..."
echo ""

# Deploy Firestore rules
echo "📝 Deploying Firestore rules..."
firebase deploy --only firestore:rules
echo "✅ Firestore rules deployed"
echo ""

# Deploy Firestore indexes
echo "🔍 Deploying Firestore indexes..."
firebase deploy --only firestore:indexes
echo "✅ Firestore indexes deployed"
echo ""

# Deploy Storage rules
echo "📦 Deploying Storage rules..."
firebase deploy --only storage
echo "✅ Storage rules deployed"
echo ""

# Optional: Deploy hosting
read -p "Deploy to Firebase Hosting as well? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌐 Deploying to Firebase Hosting..."
    firebase deploy --only hosting
    echo "✅ Firebase Hosting deployed"
    echo ""
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📊 Next steps:"
echo "1. Initialize sample data (run: ./scripts/init-sample-data.sh)"
echo "2. Create an admin user in Firebase Console"
echo "3. Test the application at: https://wolves-den-8bb09.web.app"
echo ""
echo "To view your Firebase project:"
echo "https://console.firebase.google.com/project/wolves-den-8bb09"
