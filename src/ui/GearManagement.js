/**
 * GearManagement - Main inventory management UI
 * Display, search, filter, and manage all gear items
 */

class GearManagement {
  constructor() {
    this.gearItems = [];
    this.gearTypes = [];
    this.filters = {
      search: '',
      gearType: '',
      status: ''
    };
    this.viewMode = 'grid'; // 'grid' or 'table'
  }

  /**
   * Render the gear management page
   */
  async render(containerId = 'page-container') {
    const container = document.getElementById(containerId);
    
    container.innerHTML = `
      <div class="gear-management-page">
        <!-- Header with Actions -->
        <div class="card mb-3">
          <div class="card-header">
            <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
              <div style="flex: 1;">
                <h2 class="card-title" style="margin: 0;">📦 Inventory Management</h2>
                <p style="margin: 0.5rem 0 0 0; color: var(--color-text-secondary);">
                  <span id="inventory-stats">Loading...</span>
                </p>
              </div>
              <button class="btn btn-primary" onclick="gearManagement.showAddModal()">
                <span>➕</span>
                <span>Add Gear Item</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Search and Filters -->
        <div class="card mb-3">
          <div class="card-body">
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1rem;">
              <!-- Search -->
              <div class="search-bar">
                <span class="search-icon">🔍</span>
                <input type="text" 
                       class="search-input" 
                       id="gear-search" 
                       placeholder="Search by brand, model, or barcode..."
                       onkeyup="gearManagement.handleSearch(this.value)">
                <button class="search-clear" 
                        id="search-clear-btn" 
                        onclick="gearManagement.clearSearch()" 
                        style="display: none;">×</button>
              </div>

              <!-- Gear Type Filter -->
              <select class="form-select" id="filter-gear-type" onchange="gearManagement.handleFilterChange()">
                <option value="">All Types</option>
              </select>

              <!-- Status Filter -->
              <select class="form-select" id="filter-status" onchange="gearManagement.handleFilterChange()">
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="checked-out">Checked Out</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </select>

            </div>

            <!-- View Mode Toggle -->
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem; align-items: center;">
              <span style="color: var(--color-text-secondary); font-size: 0.875rem;">View:</span>
              <button class="btn btn-sm ${this.viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}" 
                      onclick="gearManagement.setViewMode('grid')">
                🔲 Grid
              </button>
              <button class="btn btn-sm ${this.viewMode === 'table' ? 'btn-primary' : 'btn-outline'}" 
                      onclick="gearManagement.setViewMode('table')">
                📋 Table
              </button>
            </div>
          </div>
        </div>

        <!-- Gear Items List -->
        <div id="gear-items-list"></div>
      </div>
    `;

    // Load data
    await this.loadGearTypes();
    await this.loadGearItems();
  }

  /**
   * Load gear types for filters
   */
  async loadGearTypes() {
    try {
      this.gearTypes = await gearTypeService.getActive();
      
      // Populate gear type filter
      const filterSelect = document.getElementById('filter-gear-type');
      if (filterSelect) {
        this.gearTypes.forEach(type => {
          const option = document.createElement('option');
          option.value = type.id;
          option.textContent = `${type.icon} ${type.name}`;
          filterSelect.appendChild(option);
        });
      }
    } catch (error) {
      console.error('Error loading gear types:', error);
    }
  }

  /**
   * Load gear items from service
   */
  async loadGearItems() {
    try {
      this.gearItems = await gearService.getAll();
      this.updateStats();
      this.renderGearItemsList();
    } catch (error) {
      console.error('Error loading gear items:', error);
      showError('Failed to load gear items');
      
      // Show empty state
      document.getElementById('gear-items-list').innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <div class="empty-state-title">Unable to load inventory</div>
          <div class="empty-state-description">
            ${error.message || 'An error occurred while loading gear items'}
          </div>
        </div>
      `;
    }
  }

  /**
   * Update inventory statistics
   */
  updateStats() {
    const stats = {
      total: this.gearItems.length,
      available: this.gearItems.filter(i => i.status === 'available').length,
      checkedOut: this.gearItems.filter(i => i.status === 'checked-out').length,
      maintenance: this.gearItems.filter(i => i.status === 'maintenance').length
    };

    const statsEl = document.getElementById('inventory-stats');
    if (statsEl) {
      statsEl.innerHTML = `
        ${stats.total} total items • 
        ${stats.available} available • 
        ${stats.checkedOut} checked out • 
        ${stats.maintenance} in maintenance
      `;
    }
  }

  /**
   * Render gear items list based on view mode
   */
  renderGearItemsList() {
    const container = document.getElementById('gear-items-list');
    if (!container) return;

    const filteredItems = this.getFilteredItems();

    if (filteredItems.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <div class="empty-state-title">No gear items found</div>
          <div class="empty-state-description">
            ${this.gearItems.length === 0 
              ? 'Add your first gear item to get started' 
              : 'Try adjusting your search or filters'}
          </div>
          ${this.gearItems.length === 0 ? `
            <button class="btn btn-primary mt-3" onclick="gearManagement.showAddModal()">
              Add Gear Item
            </button>
          ` : ''}
        </div>
      `;
      return;
    }

    if (this.viewMode === 'grid') {
      container.innerHTML = '<div class="grid grid-cols-3">' +
        filteredItems.map(item => this.renderGearCard(item)).join('') +
        '</div>';
    } else {
      container.innerHTML = this.renderGearTable(filteredItems);
    }
  }

  /**
   * Get filtered items based on current filters
   */
  getFilteredItems() {
    return this.gearItems.filter(item => {
      // Search filter
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase();
        const matchesSearch = 
          item.brand.toLowerCase().includes(search) ||
          item.model.toLowerCase().includes(search) ||
          (item.barcode && item.barcode.toLowerCase().includes(search)) ||
          item.gearType.toLowerCase().includes(search);
        
        if (!matchesSearch) return false;
      }

      // Gear type filter
      if (this.filters.gearType && item.gearType !== this.filters.gearType) {
        return false;
      }

      // Status filter
      if (this.filters.status && item.status !== this.filters.status) {
        return false;
      }

      return true;
    });
  }

  /**
   * Render individual gear card
   */
  renderGearCard(item) {
    const gearType = this.gearTypes.find(t => t.id === item.gearType);
    const icon = gearType ? gearType.icon : '📦';

    return `
      <div class="card card-clickable" onclick="gearManagement.showViewModal('${item.id}')">
        <div style="display: flex; gap: 1rem; align-items: start;">
          <div style="font-size: 2.5rem;">${icon}</div>
          <div style="flex: 1;">
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.125rem;">${item.brand} ${item.model}</h3>
            
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span class="badge badge-${this.getStatusClass(item.status)}">
                ${Formatters.formatStatus(item.status)}
              </span>
              <span class="badge badge-neutral">
                ${icon} ${gearType ? gearType.name : item.gearType}
              </span>
              ${item.size ? `<span class="badge badge-neutral">📏 ${item.size}</span>` : ''}
            </div>

            ${item.barcode ? `<div style="font-size: 0.875rem; color: var(--color-text-secondary);">🔖 ${item.barcode}</div>` : ''}
          </div>
        </div>
        
        <div class="card-footer">
          <button class="btn btn-sm btn-ghost" onclick="event.stopPropagation(); gearManagement.showEditModal('${item.id}')">
            ✏️ Edit
          </button>
          <button class="btn btn-sm btn-ghost" onclick="event.stopPropagation(); gearManagement.showViewModal('${item.id}')">
            👁️ View
          </button>
          ${item.status === 'available' ? `
            <button class="btn btn-sm btn-success" onclick="event.stopPropagation(); gearManagement.quickCheckout('${item.id}')">
              📤 Check Out
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Render gear table view
   */
  renderGearTable(items) {
    return `
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Brand / Model</th>
              <th>Size</th>
              <th>Status</th>
              <th>Barcode</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => this.renderGearRow(item)).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * Render table row
   */
  renderGearRow(item) {
    const gearType = this.gearTypes.find(t => t.id === item.gearType);
    const icon = gearType ? gearType.icon : '📦';

    return `
      <tr onclick="gearManagement.showViewModal('${item.id}')" style="cursor: pointer;">
        <td>${icon} ${gearType ? gearType.name : item.gearType}</td>
        <td><strong>${item.brand}</strong> ${item.model}</td>
        <td>${item.size || '-'}</td>
        <td><span class="badge badge-${this.getStatusClass(item.status)}">${item.status}</span></td>
        <td>${item.barcode || '-'}</td>
        <td onclick="event.stopPropagation()">
          <button class="btn btn-sm btn-ghost" onclick="gearManagement.showViewModal('${item.id}')">
            View
          </button>
        </td>
      </tr>
    `;
  }

  /**
   * Get status badge class
   */
  getStatusClass(status) {
    const classes = {
      'available': 'success',
      'checked-out': 'info',
      'maintenance': 'warning',
      'retired': 'neutral'
    };
    return classes[status] || 'neutral';
  }

  /**
   * Handle search input
   */
  handleSearch(value) {
    this.filters.search = value;
    
    // Show/hide clear button
    const clearBtn = document.getElementById('search-clear-btn');
    if (clearBtn) {
      clearBtn.style.display = value ? 'block' : 'none';
    }

    this.renderGearItemsList();
  }

  /**
   * Clear search
   */
  clearSearch() {
    const searchInput = document.getElementById('gear-search');
    if (searchInput) {
      searchInput.value = '';
      this.handleSearch('');
    }
  }

  /**
   * Handle filter changes
   */
  handleFilterChange() {
    this.filters.gearType = document.getElementById('filter-gear-type').value;
    this.filters.status = document.getElementById('filter-status').value;
    
    this.renderGearItemsList();
  }

  /**
   * Set view mode
   */
  async setViewMode(mode) {
    this.viewMode = mode;
    await this.render();
  }

  /**
   * Show add gear modal
   */
  showAddModal() {
    window.gearForm = new GearForm();
    gearForm.show();
  }

  /**
   * Show edit gear modal
   */
  showEditModal(id) {
    window.gearForm = new GearForm(id);
    gearForm.show();
  }

  /**
   * Show view/edit modal (placeholder)
   */
  async showViewModal(id) {
    const item = this.gearItems.find(i => i.id === id);
    if (!item) {
      showError('Gear item not found');
      return;
    }

    const gearType = this.gearTypes.find(t => t.id === item.gearType);

    const modalHtml = `
      <div class="modal-overlay" onclick="if(event.target===this) gearManagement.closeModal()">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">${gearType ? gearType.icon : '📦'} ${item.brand} ${item.model}</h3>
            <button class="modal-close" onclick="gearManagement.closeModal()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="grid grid-cols-2">
              <div class="form-group">
                <label class="form-label">Type</label>
                <div>${gearType ? gearType.name : item.gearType}</div>
              </div>
              <div class="form-group">
                <label class="form-label">Size</label>
                <div>${item.size || 'N/A'}</div>
              </div>
              <div class="form-group">
                <label class="form-label">Status</label>
                <div><span class="badge badge-${this.getStatusClass(item.status)}">${item.status}</span></div>
              </div>
            </div>
            ${item.barcode ? `
              <div class="form-group">
                <label class="form-label">Barcode</label>
                <div>${item.barcode}</div>
              </div>
            ` : ''}
            ${item.description ? `
              <div class="form-group">
                <label class="form-label">Description</label>
                <div>${item.description}</div>
              </div>
            ` : ''}
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" onclick="gearManagement.closeModal()">Close</button>
            <button class="btn btn-primary" onclick="gearManagement.closeModal(); gearManagement.showEditModal('${id}')">
              ✏️ Edit
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('modals-container').innerHTML = modalHtml;
  }

  /**
   * Quick checkout
   */
  quickCheckout(id) {
    window.quickCheckout = new QuickCheckout(id);
    quickCheckout.show();
  }

  /**
   * Close modal
   */
  closeModal() {
    document.getElementById('modals-container').innerHTML = '';
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.GearManagement = GearManagement;
  window.gearManagement = new GearManagement();
}
