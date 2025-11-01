/**
 * GearTypeManager - UI for managing gear types
 * Display, add, edit, and delete gear types
 */

class GearTypeManager {
  constructor() {
    this.gearTypes = [];
    this.selectedCategory = 'all';
  }

  /**
   * Render the gear type management page
   */
  async render(containerId = 'page-container') {
    const container = document.getElementById(containerId);
    
    container.innerHTML = `
      <div class="gear-types-page">
        <!-- Header -->
        <div class="card mb-3">
          <div class="card-header">
            <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
              <div style="flex: 1;">
                <h2 class="card-title" style="margin: 0;">⚙️ Gear Types</h2>
                <p style="margin: 0.5rem 0 0 0; color: var(--color-text-secondary);">
                  Configure equipment categories and sizes
                </p>
              </div>
              <button class="btn btn-primary" onclick="gearTypeManager.showAddModal()">
                <span>➕</span>
                <span>Add Gear Type</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Category Filter -->
        <div class="card mb-3">
          <div class="card-body">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn ${this.selectedCategory === 'all' ? 'btn-primary' : 'btn-outline'}" 
                      onclick="gearTypeManager.filterByCategory('all')">
                📦 All
              </button>
              <button class="btn ${this.selectedCategory === 'footwear' ? 'btn-primary' : 'btn-outline'}" 
                      onclick="gearTypeManager.filterByCategory('footwear')">
                👟 Footwear
              </button>
              <button class="btn ${this.selectedCategory === 'protective' ? 'btn-primary' : 'btn-outline'}" 
                      onclick="gearTypeManager.filterByCategory('protective')">
                🛡️ Protective
              </button>
              <button class="btn ${this.selectedCategory === 'sticks' ? 'btn-primary' : 'btn-outline'}" 
                      onclick="gearTypeManager.filterByCategory('sticks')">
                🏒 Sticks
              </button>
              <button class="btn ${this.selectedCategory === 'clothing' ? 'btn-primary' : 'btn-outline'}" 
                      onclick="gearTypeManager.filterByCategory('clothing')">
                👕 Clothing
              </button>
              <button class="btn ${this.selectedCategory === 'accessories' ? 'btn-primary' : 'btn-outline'}" 
                      onclick="gearTypeManager.filterByCategory('accessories')">
                📦 Accessories
              </button>
            </div>
          </div>
        </div>

        <!-- Gear Types List -->
        <div id="gear-types-list"></div>
      </div>
    `;

    // Load gear types
    await this.loadGearTypes();
  }

  /**
   * Load gear types from service
   */
  async loadGearTypes() {
    try {
      this.gearTypes = await gearTypeService.getActive();
      this.renderGearTypesList();
    } catch (error) {
      console.error('Error loading gear types:', error);
      showError('Failed to load gear types');
    }
  }

  /**
   * Render gear types list
   */
  renderGearTypesList() {
    const container = document.getElementById('gear-types-list');
    if (!container) return;

    const filteredTypes = this.selectedCategory === 'all' 
      ? this.gearTypes 
      : this.gearTypes.filter(t => t.category === this.selectedCategory);

    if (filteredTypes.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <div class="empty-state-title">No gear types found</div>
          <div class="empty-state-description">
            ${this.selectedCategory === 'all' 
              ? 'Add your first gear type to get started' 
              : 'No gear types in the ' + this.selectedCategory + ' category'}
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = '<div class="grid grid-cols-3">' +
      filteredTypes.map(type => this.renderGearTypeCard(type)).join('') +
      '</div>';
  }

  /**
   * Render individual gear type card
   */
  renderGearTypeCard(gearType) {
    const categoryInfo = GEAR_CATEGORIES[gearType.category] || { name: gearType.category, icon: '📦' };
    
    return `
      <div class="card">
        <div style="display: flex; align-items: start; gap: 1rem;">
          <div style="font-size: 2.5rem;">${gearType.icon}</div>
          <div style="flex: 1;">
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.125rem;">${gearType.name}</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span class="badge badge-neutral">
                ${categoryInfo.icon} ${categoryInfo.name}
              </span>
              ${gearType.requiresSize ? 
                '<span class="badge badge-info">📏 ' + gearType.sizeOptions.length + ' sizes</span>' : 
                '<span class="badge badge-neutral">No size</span>'}
            </div>
            <p style="color: var(--color-text-secondary); font-size: 0.875rem; margin: 0;">
              ${gearType.description}
            </p>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-sm btn-ghost" onclick="gearTypeManager.showViewModal('${gearType.id}')">
            👁️ View
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Filter by category
   */
  async filterByCategory(category) {
    this.selectedCategory = category;
    await this.render();
  }

  /**
   * Show view details modal
   */
  async showViewModal(id) {
    const gearType = await gearTypeService.getById(id);
    if (!gearType) {
      showError('Gear type not found');
      return;
    }

    const categoryInfo = GEAR_CATEGORIES[gearType.category] || { name: gearType.category, icon: '📦' };

    const modalHtml = `
      <div class="modal-overlay" id="gear-type-modal" onclick="if(event.target===this) gearTypeManager.closeModal()">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">${gearType.icon} ${gearType.name}</h3>
            <button class="modal-close" onclick="gearTypeManager.closeModal()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Category</label>
              <div>${categoryInfo.icon} ${categoryInfo.name}</div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Description</label>
              <div>${gearType.description}</div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Requires Size</label>
              <div>${gearType.requiresSize ? '✅ Yes' : '❌ No'}</div>
            </div>
            
            ${gearType.requiresSize ? `
              <div class="form-group">
                <label class="form-label">Size Type</label>
                <div>${gearType.sizeType}</div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Available Sizes (${gearType.sizeOptions.length})</label>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                  ${gearType.sizeOptions.map(size => 
                    '<span class="badge badge-neutral">' + size + '</span>'
                  ).join('')}
                </div>
              </div>
            ` : ''}
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" onclick="gearTypeManager.closeModal()">Close</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('modals-container').innerHTML = modalHtml;
  }

  /**
   * Show add modal (simplified for demo)
   */
  showAddModal() {
    showInfo('Add gear type feature coming soon!', 'Not Yet Implemented');
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
  window.GearTypeManager = GearTypeManager;
  window.gearTypeManager = new GearTypeManager();
}
