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
                  <label class="form-label">Brand</label>
                  <input type="text" 
                         class="form-input" 
                         id="gear-brand" 
                         value="${item.brand || ''}"
                         placeholder="e.g., Bauer, CCM, Warrior">
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

              <!-- Donation Info (Optional) -->
              <div class="form-group">
                <button type="button" 
                        class="btn btn-ghost btn-sm" 
                        onclick="gearForm.toggleDonationInfo()">
                  <span id="donation-toggle-icon">▶️</span> Donation Information (Optional)
                </button>
              </div>

              <div id="donation-info" style="display: none;">
                <div class="grid grid-cols-2">
                  <!-- Donation Date -->
                  <div class="form-group">
                    <label class="form-label">Donation Date</label>
                    <input type="date" 
                           class="form-input" 
                           id="gear-donation-date"
                           value="${item.donationDate ? DateHelpers.formatDate(item.donationDate) : ''}">
                  </div>

                  <!-- Donor Name -->
                  <div class="form-group">
                    <label class="form-label">Donor Name</label>
                    <select class="form-select" 
                            id="gear-donor-id"
                            onchange="gearForm.handleDonorChange()">
                      <option value="">Select donor...</option>
                      <option value="__new__">+ Add New Donor</option>
                      <!-- Dynamic borrower list will be inserted here -->
                    </select>
                  </div>
                </div>

                <!-- New Donor Form (hidden by default) -->
                <div id="new-donor-form" style="display: none; margin-top: 1rem; padding: 1rem; background: var(--color-background); border-radius: 4px;">
                  <h4>Add New Donor</h4>
                  <div class="grid grid-cols-2">
                    <div class="form-group">
                      <label class="form-label">First Name</label>
                      <input type="text" class="form-input" id="donor-first-name" placeholder="First name">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Last Name</label>
                      <input type="text" class="form-input" id="donor-last-name" placeholder="Last name">
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-input" id="donor-email" placeholder="email@example.com">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Phone</label>
                    <input type="tel" class="form-input" id="donor-phone" placeholder="(555) 123-4567">
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
  toggleDonationInfo() {
    const donationInfo = document.getElementById('donation-info');
    const icon = document.getElementById('donation-toggle-icon');
    
    if (donationInfo.style.display === 'none') {
      donationInfo.style.display = 'block';
      icon.textContent = '▼';
      this.loadDonors();
    } else {
      donationInfo.style.display = 'none';
      icon.textContent = '▶️';
    }
  }

  async loadDonors() {
    try {
      const borrowers = await borrowerService.getAll();
      const select = document.getElementById('gear-donor-id');
      
      // Keep the first two options (empty and new)
      const options = '<option value="">Select donor...</option><option value="__new__">+ Add New Donor</option>';
      
      // Add borrowers
      const borrowerOptions = borrowers.map(b => 
        `<option value="${b.id}">${b.getFullName()}</option>`
      ).join('');
      
      select.innerHTML = options + borrowerOptions;
      
      // Set selected if editing
      if (this.item && this.item.donorId) {
        select.value = this.item.donorId;
      }
    } catch (error) {
      console.error('Error loading donors:', error);
    }
  }

  handleDonorChange() {
    const select = document.getElementById('gear-donor-id');
    const newDonorForm = document.getElementById('new-donor-form');
    
    if (select.value === '__new__') {
      newDonorForm.style.display = 'block';
    } else {
      newDonorForm.style.display = 'none';
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
        donationDate: document.getElementById('gear-donation-date')?.value,
        donorId: document.getElementById('gear-donor-id')?.value
      };

      // Validation
      if (!formData.gearType) {
        showError('Please select a gear type');
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

      // Handle new donor creation
      if (formData.donorId === '__new__') {
        const firstName = document.getElementById('donor-first-name').value.trim();
        const lastName = document.getElementById('donor-last-name').value.trim();
        const email = document.getElementById('donor-email').value.trim();
        const phone = document.getElementById('donor-phone').value.trim();
        
        if (!firstName || !lastName || !email) {
          showError('Please fill in donor first name, last name, and email');
          return;
        }
        
        // Create new borrower/donor
        const donor = new Borrower({
          firstName,
          lastName,
          email,
          phone,
          status: 'active',
          maxItems: 0, // Donors don't borrow
          notes: 'Created as donor'
        });
        
        try {
          formData.donorId = await borrowerService.create(donor);
          showSuccess('Donor added successfully');
        } catch (error) {
          showError('Failed to create donor: ' + error.message);
          return;
        }
      }

      // Convert donation date
      if (formData.donationDate) {
        formData.donationDate = new Date(formData.donationDate);
      } else {
        formData.donationDate = null;
      }

      let gearItemId;
      
      if (this.gearId) {
        // Update existing item
        await gearService.update(this.gearId, formData);
        gearItemId = this.gearId;
        showSuccess(`${formData.brand} ${formData.model} updated successfully!`);
      } else {
        // Create new item
        const gearItem = new GearItem(formData);
        gearItemId = await gearService.create(gearItem);
        showSuccess(`${formData.brand} ${formData.model} added successfully!`);
      }

      // Create donation transaction if donation info provided
      if (formData.donorId && formData.donationDate && !this.gearId) {
        try {
          // Get the donor (borrower)
          const donor = await borrowerService.getById(formData.donorId);
          // Get the gear item
          const gearItem = await gearService.getById(gearItemId);
          
          if (donor && gearItem) {
            // Create a special transaction record for the donation
            await db.collection('donations').add({
              gearItemId: gearItemId,
              donorId: formData.donorId,
              donorName: donor.getFullName(),
              donationDate: formData.donationDate,
              gearType: gearItem.gearType,
              gearDescription: `${gearItem.brand} ${gearItem.model} - ${gearItem.size}`,
              createdAt: new Date(),
              notes: `Donation from ${donor.getFullName()}`
            });
            
            console.log(`✅ Donation recorded for ${donor.getFullName()}`);
          }
        } catch (error) {
          console.error('Error recording donation:', error);
          // Don't fail the whole operation if donation record fails
        }
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
