/**
 * GearForm - Add/Edit gear item form
 * Modal form with validation and dynamic size options
 */

class GearForm {
  constructor(gearId = null) {
    this.gearId = gearId;
    this.gearItem = null;
    this.gearTypes = [];
  }

  /**
   * Show the form modal
   */
  async show() {
    // Load gear types
    this.gearTypes = await gearTypeService.getActive();

    // If editing, load the gear item
    if (this.gearId) {
      this.gearItem = await gearService.getById(this.gearId);
      if (!this.gearItem) {
        showError('Gear item not found');
        return;
      }
    }

    this.render();
  }

  /**
   * Render the form modal
   */
  render() {
    const isEdit = !!this.gearId;
    const item = this.gearItem || {};

    const modalHtml = `
      <div class="modal-overlay" onclick="if(event.target===this) gearForm.close()">
        <div class="modal modal-lg">
          <div class="modal-header">
            <h3 class="modal-title">${isEdit ? '✏️ Edit' : '➕ Add'} Gear Item</h3>
            <button class="modal-close" onclick="gearForm.close()">&times;</button>
          </div>
          <div class="modal-body">
            <form id="gear-form" onsubmit="event.preventDefault(); gearForm.handleSubmit();">
              
              <!-- Gear Type -->
              <div class="form-group">
                <label class="form-label required">Gear Type</label>
                <select class="form-select" id="gear-type" required onchange="gearForm.handleTypeChange()">
                  <option value="">Select gear type...</option>
                  ${this.gearTypes.map(type => `
                    <option value="${type.id}" ${item.gearType === type.id ? 'selected' : ''}>
                      ${type.icon} ${type.name}
                    </option>
                  `).join('')}
                </select>
              </div>

              <div class="grid grid-cols-2">
                <!-- Brand -->
                <div class="form-group">
                  <label class="form-label required">Brand</label>
                  <input type="text" 
                         class="form-input" 
                         id="gear-brand" 
                         value="${item.brand || ''}"
                         placeholder="e.g., Bauer, CCM, Warrior" 
                         required>
                </div>

                <!-- Model -->
                <div class="form-group">
                  <label class="form-label">Model</label>
                  <input type="text" 
                         class="form-input" 
                         id="gear-model" 
                         value="${item.model || ''}"
                         placeholder="e.g., Vapor X3.5">
                </div>
              </div>

              <div class="grid grid-cols-2">
                <!-- Size -->
                <div class="form-group" id="size-container">
                  <label class="form-label" id="size-label">Size</label>
                  <input type="text" 
                         class="form-input" 
                         id="gear-size" 
                         value="${item.size || ''}"
                         placeholder="Select gear type first">
                  <div id="size-options" style="margin-top: 0.5rem; display: none;">
                    <!-- Dynamic size buttons will go here -->
                  </div>
                </div>

                <!-- Status -->
                <div class="form-group">
                  <label class="form-label required">Status</label>
                  <select class="form-select" id="gear-status" required>
                    <option value="available" ${item.status === 'available' ? 'selected' : ''}>✅ Available</option>
                    <option value="checked-out" ${item.status === 'checked-out' ? 'selected' : ''}>📤 Checked Out</option>
                    <option value="maintenance" ${item.status === 'maintenance' ? 'selected' : ''}>🔧 Maintenance</option>
                    <option value="retired" ${item.status === 'retired' ? 'selected' : ''}>❌ Retired</option>
                  </select>
                </div>
              </div>

              <!-- Barcode -->
              <div class="form-group">
                <label class="form-label">Barcode</label>
                <div style="display: flex; gap: 0.5rem;">
                  <input type="text" 
                         class="form-input" 
                         id="gear-barcode" 
                         value="${item.barcode || ''}"
                         placeholder="Auto-generated if left empty"
                         style="flex: 1;">
                  <button type="button" 
                          class="btn btn-outline" 
                          onclick="gearForm.generateBarcode()">
                    🔄 Generate
                  </button>
                </div>
                <span class="form-help">Leave empty to auto-generate</span>
              </div>

              <!-- Description -->
              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea" 
                          id="gear-description" 
                          rows="3"
                          placeholder="Additional notes about this item">${item.description || ''}</textarea>
              </div>

              <!-- Purchase Info (Optional) -->
              <div class="form-group">
                <button type="button" 
                        class="btn btn-ghost btn-sm" 
                        onclick="gearForm.togglePurchaseInfo()">
                  <span id="purchase-toggle-icon">▶️</span> Purchase Information (Optional)
                </button>
              </div>

              <div id="purchase-info" style="display: none;">
                <div class="grid grid-cols-2">
                  <!-- Purchase Date -->
                  <div class="form-group">
                    <label class="form-label">Purchase Date</label>
                    <input type="date" 
                           class="form-input" 
                           id="gear-purchase-date"
                           value="${item.purchaseDate ? DateHelpers.formatDate(item.purchaseDate) : ''}">
                  </div>

                  <!-- Purchase Cost -->
                  <div class="form-group">
                    <label class="form-label">Purchase Cost</label>
                    <div style="position: relative;">
                      <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--color-text-muted);">$</span>
                      <input type="number" 
                             class="form-input" 
                             id="gear-purchase-cost"
                             value="${item.purchaseCost || ''}"
                             placeholder="0.00"
                             step="0.01"
                             min="0"
                             style="padding-left: 1.75rem;">
                    </div>
                  </div>
                </div>
              </div>

              <!-- Notes -->
              <div class="form-group">
                <label class="form-label">Internal Notes</label>
                <textarea class="form-textarea" 
                          id="gear-notes" 
                          rows="2"
                          placeholder="Private notes (not visible to borrowers)">${item.notes || ''}</textarea>
              </div>

            </form>
          </div>
          <div class="modal-footer">
            ${isEdit ? `
              <button class="btn btn-error" onclick="gearForm.handleDelete()">
                🗑️ Delete
              </button>
              <div style="flex: 1;"></div>
            ` : ''}
            <button class="btn btn-ghost" onclick="gearForm.close()">Cancel</button>
            <button class="btn btn-primary" onclick="gearForm.handleSubmit()">
              ${isEdit ? '💾 Update' : '➕ Add'} Gear Item
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('modals-container').innerHTML = modalHtml;

    // Initialize form if editing
    if (this.gearId && item.gearType) {
      this.handleTypeChange();
    }
  }

  /**
   * Handle gear type change - update size options
   */
  handleTypeChange() {
    const typeId = document.getElementById('gear-type').value;
    if (!typeId) return;

    const gearType = this.gearTypes.find(t => t.id === typeId);
    if (!gearType) return;

    const sizeInput = document.getElementById('gear-size');
    const sizeLabel = document.getElementById('size-label');
    const sizeOptions = document.getElementById('size-options');

    if (gearType.requiresSize) {
      sizeLabel.innerHTML = 'Size <span style="color: var(--color-error);">*</span>';
      sizeInput.required = true;
      sizeInput.placeholder = 'Select a size';

      // Show size option buttons if available
      if (gearType.sizeOptions && gearType.sizeOptions.length > 0) {
        sizeOptions.style.display = 'block';
        sizeOptions.innerHTML = `
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${gearType.sizeOptions.map(size => `
              <button type="button" 
                      class="btn btn-sm btn-outline" 
                      onclick="gearForm.selectSize('${size}')"
                      style="min-width: 60px;">
                ${size}
              </button>
            `).join('')}
          </div>
        `;
      } else {
        sizeOptions.style.display = 'none';
      }
    } else {
      sizeLabel.textContent = 'Size';
      sizeInput.required = false;
      sizeInput.placeholder = 'No size required';
      sizeOptions.style.display = 'none';
    }
  }

  /**
   * Select a size from buttons
   */
  selectSize(size) {
    document.getElementById('gear-size').value = size;
  }

  /**
   * Generate a unique barcode
   */
  generateBarcode() {
    const barcode = gearService.generateBarcode();
    document.getElementById('gear-barcode').value = barcode;
    showSuccess('Barcode generated!');
  }

  /**
   * Toggle purchase information section
   */
  togglePurchaseInfo() {
    const purchaseInfo = document.getElementById('purchase-info');
    const icon = document.getElementById('purchase-toggle-icon');
    
    if (purchaseInfo.style.display === 'none') {
      purchaseInfo.style.display = 'block';
      icon.textContent = '🔽';
    } else {
      purchaseInfo.style.display = 'none';
      icon.textContent = '▶️';
    }
  }

  /**
   * Handle form submission
   */
  async handleSubmit() {
    try {
      // Get form values
      const formData = {
        gearType: document.getElementById('gear-type').value,
        brand: document.getElementById('gear-brand').value.trim(),
        model: document.getElementById('gear-model').value.trim(),
        size: document.getElementById('gear-size').value.trim(),
        status: document.getElementById('gear-status').value,
        barcode: document.getElementById('gear-barcode').value.trim(),
        description: document.getElementById('gear-description').value.trim(),
        notes: document.getElementById('gear-notes').value.trim(),
        purchaseDate: document.getElementById('gear-purchase-date').value,
        purchaseCost: document.getElementById('gear-purchase-cost').value
      };

      // Validation
      if (!formData.gearType) {
        showError('Please select a gear type');
        return;
      }

      if (!formData.brand) {
        showError('Brand is required');
        return;
      }

      // Check if size is required
      const gearType = this.gearTypes.find(t => t.id === formData.gearType);
      if (gearType && gearType.requiresSize && !formData.size) {
        showError('Size is required for this gear type');
        return;
      }

      // Auto-generate barcode if empty
      if (!formData.barcode) {
        formData.barcode = gearService.generateBarcode();
      }

      // Convert purchase date
      if (formData.purchaseDate) {
        formData.purchaseDate = new Date(formData.purchaseDate);
      } else {
        formData.purchaseDate = null;
      }

      // Convert purchase cost
      if (formData.purchaseCost) {
        formData.purchaseCost = parseFloat(formData.purchaseCost);
      } else {
        formData.purchaseCost = null;
      }

      if (this.gearId) {
        // Update existing item
        await gearService.update(this.gearId, formData);
        showSuccess(`${formData.brand} ${formData.model} updated successfully!`);
      } else {
        // Create new item
        const gearItem = new GearItem(formData);
        await gearService.create(gearItem);
        showSuccess(`${formData.brand} ${formData.model} added successfully!`);
      }

      this.close();

      // Reload the inventory list if available
      if (typeof gearManagement !== 'undefined') {
        await gearManagement.loadGearItems();
      }

    } catch (error) {
      console.error('Error saving gear item:', error);
      showError(error.message || 'Failed to save gear item');
    }
  }

  /**
   * Handle delete
   */
  async handleDelete() {
    if (!this.gearId) return;

    const item = this.gearItem;
    const confirm = window.confirm(
      `Are you sure you want to delete ${item.brand} ${item.model}?\n\n` +
      `This action cannot be undone.`
    );

    if (!confirm) return;

    try {
      await gearService.hardDelete(this.gearId);
      showSuccess(`${item.brand} ${item.model} deleted successfully`);
      
      this.close();

      // Reload the inventory list
      if (typeof gearManagement !== 'undefined') {
        await gearManagement.loadGearItems();
      }

    } catch (error) {
      console.error('Error deleting gear item:', error);
      showError('Failed to delete gear item');
    }
  }

  /**
   * Close the modal
   */
  close() {
    document.getElementById('modals-container').innerHTML = '';
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.GearForm = GearForm;
}
