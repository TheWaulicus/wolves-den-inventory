/**
 * Main Application Entry Point
 * Initializes the Wolves Den Inventory system
 */

class WolvesDenApp {
  constructor() {
    this.initialized = false;
    this.user = null;
  }

  async init() {
    console.log('🐺 Initializing Wolves Den Inventory...');

    try {
      // Check Firebase initialization
      if (typeof firebase === 'undefined' || !firebase.apps.length) {
        console.error('❌ Firebase not initialized');
        this.showFirebaseError();
        return;
      }

      console.log('✅ Firebase initialized');

      // Load saved theme
      this.loadTheme();

      // Set up authentication listener
      this.setupAuthListener();

      // Initialize navigation
      window.navigation = new Navigation();

      // Update inventory counts
      await this.updateCounts();

      // Set up real-time listeners for counts
      this.setupCountListeners();

      this.initialized = true;
      console.log('✅ Application initialized successfully');

    } catch (error) {
      console.error('❌ Initialization error:', error);
      showError('Failed to initialize application');
    }
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
  }

  setupAuthListener() {
    if (typeof auth === 'undefined') return;

    auth.onAuthStateChanged(async (user) => {
      this.user = user;
      
      if (user) {
        console.log('✅ User authenticated:', user.uid);
        await this.updateUserDisplay(user);
      } else {
        console.log('⚠️ No user authenticated');
        // In a real app, redirect to login
        // For now, we'll show a demo mode message
        this.showDemoMode();
      }
    });
  }

  async updateUserDisplay(user) {
    const userNameEl = document.querySelector('.user-name');
    const userRoleEl = document.querySelector('.user-role');

    if (userNameEl) {
      userNameEl.textContent = user.email || 'Admin User';
    }

    if (userRoleEl) {
      // Check if user is admin
      const isAdmin = await isCurrentUserAdmin();
      userRoleEl.textContent = isAdmin ? 'Administrator' : 'User';
    }
  }

  showDemoMode() {
    const userNameEl = document.querySelector('.user-name');
    const userRoleEl = document.querySelector('.user-role');

    if (userNameEl) {
      userNameEl.textContent = 'Demo Mode';
    }

    if (userRoleEl) {
      userRoleEl.textContent = 'Not Authenticated';
    }

    // Show info notification
    setTimeout(() => {
      showInfo('Running in demo mode. Configure Firebase to enable full functionality.', 'Demo Mode', 0);
    }, 1000);
  }

  showFirebaseError() {
    document.getElementById('page-container').innerHTML = `
      <div class="card" style="max-width: 600px; margin: 2rem auto;">
        <div class="alert alert-error">
          <div class="alert-icon">❌</div>
          <div class="alert-content">
            <div class="alert-title">Firebase Not Configured</div>
            <p>Please configure Firebase to use this application:</p>
            <ol style="margin-left: 1.5rem; margin-top: 1rem;">
              <li>Create a Firebase project</li>
              <li>Update <code>src/firebase-config.js</code> with your credentials</li>
              <li>Deploy Firestore rules and indexes</li>
              <li>Reload this page</li>
            </ol>
            <p style="margin-top: 1rem;">
              See <a href="docs/FIREBASE_SETUP.md" target="_blank">Firebase Setup Guide</a> for details.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  async updateCounts() {
    try {
      // Update inventory count
      if (typeof gearService !== 'undefined') {
        const stats = await gearService.getStatistics();
        const inventoryCount = document.getElementById('inventory-count');
        if (inventoryCount) {
          inventoryCount.textContent = stats.total || 0;
        }
      }

      // Update overdue count
      if (typeof transactionService !== 'undefined') {
        const overdueTransactions = await transactionService.getOverdue();
        const overdueCount = document.getElementById('overdue-count');
        if (overdueCount) {
          const count = overdueTransactions.length;
          overdueCount.textContent = count;
          overdueCount.style.display = count > 0 ? 'inline-flex' : 'none';
        }
      }
    } catch (error) {
      console.error('Error updating counts:', error);
    }
  }

  setupCountListeners() {
    // Real-time listener for inventory count
    if (typeof gearService !== 'undefined') {
      gearService.onSnapshotAll({}, (items) => {
        const inventoryCount = document.getElementById('inventory-count');
        if (inventoryCount) {
          inventoryCount.textContent = items.length;
        }
      });
    }

    // Real-time listener for overdue transactions
    if (typeof transactionService !== 'undefined') {
      transactionService.onSnapshotAll({ isOverdue: true }, (transactions) => {
        const overdueCount = document.getElementById('overdue-count');
        if (overdueCount) {
          const count = transactions.length;
          overdueCount.textContent = count;
          overdueCount.style.display = count > 0 ? 'inline-flex' : 'none';
        }
      });
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new WolvesDenApp();
  window.app.init();
});

// Expose app globally
if (typeof window !== 'undefined') {
  window.WolvesDenApp = WolvesDenApp;
}
