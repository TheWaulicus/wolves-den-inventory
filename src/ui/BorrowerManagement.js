/**
 * BorrowerManagement Component
 * UI for viewing, adding, editing, and searching borrowers (players/staff)
 */

class BorrowerManagement {
  constructor() {
    this.borrowers = [];
    this.filteredBorrowers = [];
    this.currentFilter = 'all';
    this.searchTerm = '';
    this.unsubscribe = null;
  }

  async render() {
    const container = document.getElementById('page-container');
    
    container.innerHTML = `
      <div class="borrower-management">
        <div class="page-header">
          <div>
            <h1>👥 Borrowers</h1>
            <p class="text-muted">Manage players and staff</p>
          </div>
          <button class="btn btn-primary" onclick="borrowerManagement.showAddModal()">
            ➕ Add Borrower
          </button>
        </div>

        <!-- Search and Filters -->
        <div class="card mb-3">
          <div class="card-body">
            <div class="search-filters">
              <div class="search-bar">
                <input 
                  type="text" 
                  id="borrower-search" 
                  placeholder="Search by name, email, or jersey number..."
                  class="form-control"
                >
              </div>
              <div class="filter-buttons">
                <button class="btn btn-ghost filter-btn active" data-filter="all">
                  All
                </button>
                <button class="btn btn-ghost filter-btn" data-filter="active">
                  Active
                </button>
                <button class="btn btn-ghost filter-btn" data-filter="suspended">
                  Suspended
                </button>
                <button class="btn btn-ghost filter-btn" data-filter="inactive">
                  Inactive
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div class="stats-grid mb-3" id="borrower-stats"></div>

        <!-- Borrowers Table -->
        <div class="card">
          <div class="card-body">
            <div id="borrowers-table-container">
              <div class="loading">Loading borrowers...</div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Set up event listeners
    this.setupEventListeners();

    // Load data
    await this.loadBorrowers();
  }

  setupEventListeners() {
    // Search
    const searchInput = document.getElementById('borrower-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase();
        this.filterBorrowers();
      });
    }

    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.filterBorrowers();
      });
    });
  }

  async loadBorrowers() {
    try {
      // Set up real-time listener
      if (typeof borrowerService !== 'undefined') {
        this.unsubscribe = borrowerService.onSnapshotAll({}, (borrowers) => {
          this.borrowers = borrowers;
          this.filterBorrowers();
          this.updateStats();
        });
      }
    } catch (error) {
      console.error('Error loading borrowers:', error);
      showError('Failed to load borrowers');
    }
  }

  filterBorrowers() {
    let filtered = [...this.borrowers];

    // Apply status filter
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(b => b.status === this.currentFilter);
    }

    // Apply search
    if (this.searchTerm) {
      filtered = filtered.filter(b =>
        b.firstName.toLowerCase().includes(this.searchTerm) ||
        b.lastName.toLowerCase().includes(this.searchTerm) ||
        b.email.toLowerCase().includes(this.searchTerm)
      );
    }

    this.filteredBorrowers = filtered;
    this.renderTable();
  }

  renderTable() {
    const container = document.getElementById('borrowers-table-container');
    
    if (this.filteredBorrowers.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">👥</div>
          <h3>No borrowers found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Items Out</th>
              <th>Overdue</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.filteredBorrowers.map(borrower => `
              <tr>
                <td>
                  <strong>${borrower.getFullName()}</strong>
                </td>
                <td>${borrower.email}</td>
                <td>${borrower.phone || '-'}</td>
                <td>
                  <span class="badge badge-${this.getStatusBadgeColor(borrower.status)}">
                    ${borrower.status}
                  </span>
                </td>
                <td>${borrower.currentItemCount || 0}</td>
                <td>
                  ${borrower.overdueCount > 0 
                    ? `<span class="badge badge-error">${borrower.overdueCount}</span>` 
                    : '-'
                  }
                </td>
                <td>
                  <div class="btn-group">
                    <button 
                      class="btn btn-icon" 
                      onclick="borrowerManagement.viewBorrower('${borrower.id}')"
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button 
                      class="btn btn-icon" 
                      onclick="borrowerManagement.editBorrower('${borrower.id}')"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    ${borrower.status === 'active' 
                      ? `<button 
                          class="btn btn-icon" 
                          onclick="borrowerManagement.suspendBorrower('${borrower.id}')"
                          title="Suspend"
                        >
                          🚫
                        </button>`
                      : `<button 
                          class="btn btn-icon" 
                          onclick="borrowerManagement.activateBorrower('${borrower.id}')"
                          title="Activate"
                        >
                          ✅
                        </button>`
                    }
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  updateStats() {
    const container = document.getElementById('borrower-stats');
    
    const stats = {
      total: this.borrowers.length,
      active: this.borrowers.filter(b => b.status === 'active').length,
      withItems: this.borrowers.filter(b => b.currentItemCount > 0).length,
      withOverdue: this.borrowers.filter(b => b.overdueCount > 0).length
    };

    container.innerHTML = `
      <div class="stat-card">
        <div class="stat-value">${stats.total}</div>
        <div class="stat-label">Total Borrowers</div>
      </div>
      <div class="stat-card">
        <div class="stat-value stat-success">${stats.active}</div>
        <div class="stat-label">Active</div>
      </div>
      <div class="stat-card">
        <div class="stat-value stat-warning">${stats.withItems}</div>
        <div class="stat-label">With Items</div>
      </div>
      <div class="stat-card">
        <div class="stat-value stat-error">${stats.withOverdue}</div>
        <div class="stat-label">With Overdue</div>
      </div>
    `;
  }

  getStatusBadgeColor(status) {
    const colors = {
      active: 'success',
      suspended: 'error',
      inactive: 'default'
    };
    return colors[status] || 'default';
  }

  showAddModal() {
    if (typeof BorrowerForm !== 'undefined') {
      window.borrowerForm = new BorrowerForm();
      borrowerForm.show();
    } else {
      showError('BorrowerForm component not loaded');
    }
  }

  async viewBorrower(id) {
    const borrower = this.borrowers.find(b => b.id === id);
    if (!borrower) return;

    // Get borrower's transactions
    const transactions = await transactionService.getByBorrower(id);

    showInfo(`
      <h3>${borrower.getFullName()}</h3>
      <p><strong>Email:</strong> ${borrower.email}</p>
      <p><strong>Phone:</strong> ${borrower.phone || 'N/A'}</p>
      <p><strong>Status:</strong> ${borrower.status}</p>
      <p><strong>Items Out:</strong> ${borrower.currentItemCount || 0}</p>
      <p><strong>Total Borrows:</strong> ${borrower.totalBorrows || 0}</p>
      <p><strong>Overdue:</strong> ${borrower.overdueCount || 0}</p>
      ${transactions.length > 0 
        ? `<p><strong>Active Transactions:</strong> ${transactions.filter(t => t.status === 'active').length}</p>` 
        : ''
      }
    `, 'Borrower Details', 0);
  }

  async editBorrower(id) {
    if (typeof BorrowerForm !== 'undefined') {
      window.borrowerForm = new BorrowerForm(id);
      borrowerForm.show();
    } else {
      showError('BorrowerForm component not loaded');
    }
  }

  async suspendBorrower(id) {
    if (!confirm('Suspend this borrower? They will not be able to check out items.')) return;

    try {
      await borrowerService.update(id, { status: 'suspended' });
      showSuccess('Borrower suspended');
    } catch (error) {
      console.error('Error suspending borrower:', error);
      showError('Failed to suspend borrower');
    }
  }

  async activateBorrower(id) {
    try {
      await borrowerService.update(id, { status: 'active' });
      showSuccess('Borrower activated');
    } catch (error) {
      console.error('Error activating borrower:', error);
      showError('Failed to activate borrower');
    }
  }

  cleanup() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

// Export for use in Navigation
if (typeof window !== 'undefined') {
  window.BorrowerManagement = BorrowerManagement;
}
