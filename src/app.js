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
      userNameEl.textContent = 'Not Signed In';
    }

    if (userRoleEl) {
      userRoleEl.textContent = 'Click to sign in';
    }

    // Add click handler to sign in
    const userDiv = document.getElementById('sidebar-user');
    if (userDiv) {
      userDiv.style.cursor = 'pointer';
      userDiv.onclick = () => this.showLoginModal();
    }

    // Show login modal after a moment
    setTimeout(() => {
      this.showLoginModal();
    }, 500);
  }

  showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'login-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>🔐 Sign In to Wolves Den</h2>
        </div>
        <div class="modal-body">
          <form id="login-form" onsubmit="app.handleLogin(event)">
            <div class="form-group">
              <label for="login-email">Email</label>
              <input 
                type="email" 
                id="login-email" 
                class="form-control" 
                placeholder="admin@wolves.com"
                required
                autofocus
              >
            </div>
            <div class="form-group">
              <label for="login-password">Password</label>
              <input 
                type="password" 
                id="login-password" 
                class="form-control" 
                placeholder="Password"
                required
              >
            </div>
            <div id="login-error" class="alert alert-error" style="display: none; margin-top: 1rem;">
              <div class="alert-content" id="login-error-message"></div>
            </div>
            <div class="modal-footer" style="margin-top: 1.5rem;">
              <button type="button" class="btn btn-ghost" onclick="app.closeLoginModal()">
                Continue in Demo Mode
              </button>
              <button type="submit" class="btn btn-primary">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  async handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    const errorMsg = document.getElementById('login-error-message');
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    try {
      errorDiv.style.display = 'none';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing in...';
      
      await signInWithEmail(email, password);
      
      showSuccess('Signed in successfully!');
      this.closeLoginModal();
      
    } catch (error) {
      console.error('Login error:', error);
      errorMsg.textContent = error.message || 'Failed to sign in. Please check your credentials.';
      errorDiv.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  }

  closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    }
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
