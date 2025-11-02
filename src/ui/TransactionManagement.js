/**
 * TransactionManagement - View and manage active checkouts
 */

class TransactionManagement {
  constructor() {
    this.transactions = [];
    this.borrowers = new Map();
    this.filters = {
      search: '',
      status: 'active'
    };
  }

  async render(containerId = 'page-container') {
    const container = document.getElementById(containerId);
    
    container.innerHTML = `
      <div class="transactions-page">
        <!-- Header -->
        <div class="card mb-3">
          <div class="card-header">
            <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
              <div style="flex: 1;">
                <h2 class="card-title" style="margin: 0;">↔️ Active Checkouts</h2>
                <p style="margin: 0.5rem 0 0 0; color: var(--color-text-secondary);" id="transaction-stats">
                  Loading...
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="card mb-3">
          <div class="card-body">
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem;">
              <!-- Search -->
              <div class="search-bar">
                <span class="search-icon">🔍</span>
                <input type="text" 
                       class="search-input" 
                       id="transaction-search" 
                       placeholder="Search by borrower or gear..."
                       onkeyup="transactionManagement.handleSearch(this.value)">
              </div>

              <!-- Status Filter -->
              <select class="form-select" id="filter-transaction-status" onchange="transactionManagement.handleFilterChange()">
                <option value="active">Active</option>
                <option value="overdue">Overdue</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Transactions List -->
        <div id="transactions-list"></div>
      </div>
    `;

    await this.loadData();
  }

  async loadData() {
    try {
      // Load borrowers first for quick lookup
      const borrowersList = await borrowerService.getAll();
      borrowersList.forEach(b => this.borrowers.set(b.id, b));

      // Load transactions
      await this.loadTransactions();
    } catch (error) {
      console.error('Error loading transactions:', error);
      showError('Failed to load transactions');
    }
  }

  async loadTransactions() {
    try {
      // Get transactions based on filter
      if (this.filters.status === 'all') {
        this.transactions = await transactionService.getAll();
      } else if (this.filters.status === 'overdue') {
        this.transactions = await transactionService.getOverdue();
      } else {
        this.transactions = await transactionService.getActive();
      }

      // Check for overdue items
      this.transactions.forEach(t => t.checkOverdue());

      this.updateStats();
      this.renderTransactionsList();
    } catch (error) {
      console.error('Error loading transactions:', error);
      showError('Failed to load transactions');
    }
  }

  updateStats() {
    const active = this.transactions.filter(t => t.status === 'active').length;
    const overdue = this.transactions.filter(t => t.isOverdue).length;
    
    const statsEl = document.getElementById('transaction-stats');
    if (statsEl) {
      statsEl.innerHTML = `${this.transactions.length} total • ${active} active • ${overdue} overdue`;
    }
  }

  renderTransactionsList() {
    const container = document.getElementById('transactions-list');
    if (!container) return;

    const filtered = this.getFilteredTransactions();

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-title">No transactions found</div>
          <div class="empty-state-description">
            ${this.transactions.length === 0 ? 'No gear is currently checked out' : 'Try adjusting your search or filters'}
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Gear</th>
              <th>Borrower</th>
              <th>Checked Out</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(t => this.renderTransactionRow(t)).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderTransactionRow(trans) {
    const borrower = this.borrowers.get(trans.borrowerId);
    const daysOut = DateHelpers.daysBetween(new Date(), trans.checkoutDate);
    
    return `
      <tr>
        <td>
          <strong>${trans.gearBrand} ${trans.gearType}</strong>
          ${trans.gearSize ? `<br><small>Size: ${trans.gearSize}</small>` : ''}
        </td>
        <td>
          ${trans.borrowerName}
          ${borrower?.jerseyNumber ? `<br><small>#${borrower.jerseyNumber}</small>` : ''}
        </td>
        <td>${DateHelpers.formatDate(trans.checkoutDate)}<br><small>${daysOut} days ago</small></td>
        <td>
          ${DateHelpers.formatDate(trans.dueDate)}
          ${trans.isOverdue ? `<br><small class="badge badge-error">Overdue by ${trans.getDaysOverdue()} days</small>` : ''}
        </td>
        <td>
          <span class="badge badge-${trans.isOverdue ? 'error' : trans.status === 'active' ? 'info' : 'neutral'}">
            ${trans.isOverdue ? '🔴 Overdue' : trans.status === 'active' ? '🟢 Active' : trans.status}
          </span>
        </td>
        <td>
          ${trans.status === 'active' || trans.status === 'overdue' ? `
            <button class="btn btn-sm btn-success" onclick="transactionManagement.showCheckIn('${trans.id}')">
              📥 Check In
            </button>
          ` : ''}
        </td>
      </tr>
    `;
  }

  getFilteredTransactions() {
    if (!this.filters.search) return this.transactions;

    const search = this.filters.search.toLowerCase();
    return this.transactions.filter(t => 
      t.borrowerName.toLowerCase().includes(search) ||
      t.gearBrand.toLowerCase().includes(search) ||
      t.gearType.toLowerCase().includes(search)
    );
  }

  handleSearch(value) {
    this.filters.search = value;
    this.renderTransactionsList();
  }

  async handleFilterChange() {
    this.filters.status = document.getElementById('filter-transaction-status').value;
    await this.loadTransactions();
  }

  showCheckIn(transactionId) {
    window.checkInModal = new CheckInModal(transactionId);
    checkInModal.show();
  }
}

// Export
if (typeof window !== 'undefined') {
  window.TransactionManagement = TransactionManagement;
  window.transactionManagement = new TransactionManagement();
}
