/**
 * Navigation - Handle sidebar and page navigation
 */

class Navigation {
  constructor() {
    this.currentPage = 'dashboard';
    this.sidebar = document.getElementById('sidebar');
    this.pageContainer = document.getElementById('page-container');
    this.pageTitle = document.getElementById('page-title');
    
    this.init();
  }

  init() {
    // Navigation menu items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const page = item.getAttribute('data-page');
        if (page) {
          this.navigateTo(page);
        }
      });
    });

    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        this.sidebar.classList.toggle('active');
      });
    }

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        this.sidebar.classList.toggle('collapsed');
      });
    }

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.logout();
      });
    }

    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        if (!this.sidebar.contains(e.target) && !e.target.closest('#mobile-menu-toggle')) {
          this.sidebar.classList.remove('active');
        }
      }
    });

    // Load initial page
    this.navigateTo(this.currentPage);
  }

  navigateTo(page) {
    this.currentPage = page;

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-page') === page) {
        item.classList.add('active');
      }
    });

    // Update page title
    const titles = {
      dashboard: 'Dashboard',
      inventory: 'Inventory',
      borrowers: 'Borrowers',
      transactions: 'Transactions',
      'gear-types': 'Gear Types',
      settings: 'Settings'
    };
    
    this.pageTitle.textContent = titles[page] || page;

    // Load page content
    this.loadPage(page);

    // Close mobile sidebar
    if (window.innerWidth <= 768) {
      this.sidebar.classList.remove('active');
    }
  }

  async loadPage(page) {
    this.showLoading();

    try {
      switch (page) {
        case 'dashboard':
          await this.loadDashboard();
          break;
        case 'inventory':
          await this.loadInventory();
          break;
        case 'borrowers':
          await this.loadBorrowers();
          break;
        case 'transactions':
          await this.loadTransactions();
          break;
        case 'gear-types':
          await this.loadGearTypes();
          break;
        case 'settings':
          await this.loadSettings();
          break;
        default:
          this.pageContainer.innerHTML = '<div class="empty-state"><h2>Page not found</h2></div>';
      }
    } catch (error) {
      console.error('Error loading page:', error);
      showError('Failed to load page content');
      this.pageContainer.innerHTML = '<div class="empty-state"><h2>Error loading page</h2></div>';
    } finally {
      this.hideLoading();
    }
  }

  async loadDashboard() {
    this.pageContainer.innerHTML = `
      <div class="welcome-message">
        <h2>📊 Dashboard</h2>
        <p>Dashboard content will be loaded here</p>
        <p class="mt-2">This is where you'll see inventory statistics, recent activity, and alerts.</p>
      </div>
    `;
  }

  async loadInventory() {
    this.pageContainer.innerHTML = `
      <div class="welcome-message">
        <h2>📦 Inventory Management</h2>
        <p>Inventory management interface will be loaded here</p>
        <p class="mt-2">Add, edit, and manage all your hockey gear.</p>
      </div>
    `;
  }

  async loadBorrowers() {
    this.pageContainer.innerHTML = `
      <div class="welcome-message">
        <h2>👥 Borrowers</h2>
        <p>Borrower management will be loaded here</p>
        <p class="mt-2">Manage players and staff who can borrow equipment.</p>
      </div>
    `;
  }

  async loadTransactions() {
    this.pageContainer.innerHTML = `
      <div class="welcome-message">
        <h2>↔️ Transactions</h2>
        <p>Transaction history will be loaded here</p>
        <p class="mt-2">Track all check-outs and returns.</p>
      </div>
    `;
  }

  async loadGearTypes() {
    if (typeof gearTypeManager !== 'undefined') {
      await gearTypeManager.render();
    } else {
      this.pageContainer.innerHTML = `
        <div class="welcome-message">
          <h2>⚙️ Gear Types</h2>
          <p>Gear type manager not loaded</p>
        </div>
      `;
    }
  }

  async loadSettings() {
    this.pageContainer.innerHTML = `
      <div class="welcome-message">
        <h2>🔧 Settings</h2>
        <p>Settings will be loaded here</p>
        <p class="mt-2">Configure system preferences and options.</p>
      </div>
    `;
  }

  showLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.remove('hidden');
    }
  }

  hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
  }

  async logout() {
    try {
      if (typeof auth !== 'undefined' && auth.currentUser) {
        await auth.signOut();
        showSuccess('Logged out successfully');
      }
      
      // Redirect to login or show login form
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      showError('Failed to logout');
    }
  }
}

// Initialize navigation when DOM is ready
if (typeof window !== 'undefined') {
  window.navigation = null;
}
