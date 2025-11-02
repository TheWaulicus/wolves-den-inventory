/**
 * Dashboard Component
 * Main landing page with statistics, recent activity, and quick actions
 */

class Dashboard {
  constructor() {
    this.stats = {
      inventory: { total: 0, available: 0, checkedOut: 0, maintenance: 0 },
      borrowers: { total: 0, active: 0, withOverdue: 0 },
      transactions: { active: 0, overdue: 0, thisWeek: 0 }
    };
  }

  async render() {
    const container = document.getElementById('page-container');
    
    // Load statistics
    await this.loadStats();

    container.innerHTML = `
      <div class="dashboard">
        <div class="dashboard-header">
          <h1>🐺 Dashboard</h1>
          <p class="text-muted">Welcome to Wolves Den Inventory Management</p>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-grid">
          ${this.renderStatCard('Inventory', '📦', [
            { label: 'Total Items', value: this.stats.inventory.total, color: 'primary' },
            { label: 'Available', value: this.stats.inventory.available, color: 'success' },
            { label: 'Checked Out', value: this.stats.inventory.checkedOut, color: 'warning' },
            { label: 'Maintenance', value: this.stats.inventory.maintenance, color: 'error' }
          ])}
          
          ${this.renderStatCard('Borrowers', '👥', [
            { label: 'Total', value: this.stats.borrowers.total, color: 'primary' },
            { label: 'Active', value: this.stats.borrowers.active, color: 'success' },
            { label: 'With Overdue', value: this.stats.borrowers.withOverdue, color: 'error' }
          ])}
          
          ${this.renderStatCard('Transactions', '🔄', [
            { label: 'Active', value: this.stats.transactions.active, color: 'warning' },
            { label: 'Overdue', value: this.stats.transactions.overdue, color: 'error' },
            { label: 'This Week', value: this.stats.transactions.thisWeek, color: 'success' }
          ])}
        </div>

        <!-- Quick Actions -->
        <div class="card mt-3">
          <div class="card-header">
            <h3>⚡ Quick Actions</h3>
          </div>
          <div class="card-body">
            <div class="quick-actions">
              <button class="btn btn-primary" onclick="navigation.loadPage('inventory')">
                📦 Manage Inventory
              </button>
              <button class="btn btn-success" onclick="navigation.loadPage('transactions')">
                ✅ View Checkouts
              </button>
              <button class="btn btn-outline" onclick="navigation.loadPage('borrowers')">
                👥 Manage Borrowers
              </button>
              <button class="btn btn-outline" onclick="navigation.loadPage('gear-types')">
                🏷️ Gear Types
              </button>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="dashboard-grid mt-3">
          <div class="card">
            <div class="card-header">
              <h3>📋 Recent Checkouts</h3>
            </div>
            <div class="card-body" id="recent-checkouts">
              <div class="loading">Loading recent checkouts...</div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3>⚠️ Overdue Items</h3>
            </div>
            <div class="card-body" id="overdue-items">
              <div class="loading">Loading overdue items...</div>
            </div>
          </div>
        </div>

        <!-- Low Stock Alert -->
        <div class="card mt-3" id="low-stock-card" style="display: none;">
          <div class="card-header">
            <h3>⚠️ Low Stock Alert</h3>
          </div>
          <div class="card-body" id="low-stock-items"></div>
        </div>
      </div>
    `;

    // Load recent activity
    await this.loadRecentActivity();
  }

  renderStatCard(title, icon, stats) {
    return `
      <div class="stats-card">
        <div class="stats-card-header">
          <span class="stats-icon">${icon}</span>
          <h3>${title}</h3>
        </div>
        <div class="stats-card-body">
          ${stats.map(stat => `
            <div class="stat-item">
              <div class="stat-label">${stat.label}</div>
              <div class="stat-value stat-${stat.color}">${stat.value}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  async loadStats() {
    try {
      // Load inventory stats
      if (typeof gearService !== 'undefined') {
        const inventoryStats = await gearService.getStatistics();
        this.stats.inventory = inventoryStats;
      }

      // Load borrower stats
      if (typeof borrowerService !== 'undefined') {
        const borrowerStats = await borrowerService.getStatistics();
        this.stats.borrowers = borrowerStats;
      }

      // Load transaction stats
      if (typeof transactionService !== 'undefined') {
        const transactionStats = await transactionService.getStatistics();
        this.stats.transactions = transactionStats;
        
        // Calculate this week's transactions
        const allTransactions = await transactionService.getAll();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        this.stats.transactions.thisWeek = allTransactions.filter(t => 
          t.checkoutDate && t.checkoutDate >= oneWeekAgo
        ).length;
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  async loadRecentActivity() {
    try {
      // Load recent checkouts
      const recentTransactions = await transactionService.getAll({ limit: 5 });
      const checkoutsContainer = document.getElementById('recent-checkouts');
      
      if (recentTransactions.length === 0) {
        checkoutsContainer.innerHTML = '<div class="empty-state">No recent checkouts</div>';
      } else {
        checkoutsContainer.innerHTML = `
          <div class="activity-list">
            ${recentTransactions.map(trans => `
              <div class="activity-item">
                <div class="activity-icon">📦</div>
                <div class="activity-details">
                  <div class="activity-title">${trans.borrowerName}</div>
                  <div class="activity-subtitle">${trans.gearBrand} ${trans.gearType}</div>
                  <div class="activity-date">${DateHelpers.formatReadable(trans.checkoutDate)}</div>
                </div>
                <span class="badge badge-${trans.status === 'overdue' ? 'error' : 'warning'}">
                  ${trans.status}
                </span>
              </div>
            `).join('')}
          </div>
        `;
      }

      // Load overdue items
      const overdueTransactions = await transactionService.getOverdue();
      const overdueContainer = document.getElementById('overdue-items');
      
      if (overdueTransactions.length === 0) {
        overdueContainer.innerHTML = '<div class="empty-state">✅ No overdue items</div>';
      } else {
        overdueContainer.innerHTML = `
          <div class="alert alert-warning mb-2">
            <div class="alert-content">
              ${overdueTransactions.length} item(s) overdue
            </div>
          </div>
          <div class="activity-list">
            ${overdueTransactions.map(trans => `
              <div class="activity-item">
                <div class="activity-icon">⚠️</div>
                <div class="activity-details">
                  <div class="activity-title">${trans.borrowerName}</div>
                  <div class="activity-subtitle">${trans.gearBrand} ${trans.gearType}</div>
                  <div class="activity-date">Due: ${DateHelpers.formatReadable(trans.dueDate)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }

    } catch (error) {
      console.error('Error loading recent activity:', error);
      showError('Failed to load recent activity');
    }
  }
}

// Export for use in Navigation
if (typeof window !== 'undefined') {
  window.Dashboard = Dashboard;
}
