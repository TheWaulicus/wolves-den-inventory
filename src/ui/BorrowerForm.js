/**
 * BorrowerForm Component
 * Modal form for adding/editing borrower details
 */

class BorrowerForm {
  constructor(borrowerId = null) {
    this.borrowerId = borrowerId;
    this.borrower = null;
    this.isEdit = !!borrowerId;
  }

  async show() {
    // Load borrower data if editing
    if (this.isEdit) {
      this.borrower = await borrowerService.getById(this.borrowerId);
      if (!this.borrower) {
        showError('Borrower not found');
        return;
      }
    }

    this.render();
  }

  render() {
    const modalsContainer = document.getElementById('modals-container');
    
    modalsContainer.innerHTML = `
      <div class="modal-overlay" id="borrower-form-modal">
        <div class="modal modal-lg">
          <div class="modal-header">
            <h2>${this.isEdit ? '✏️ Edit Borrower' : '➕ Add Borrower'}</h2>
            <button class="modal-close" onclick="borrowerForm.close()">×</button>
          </div>
          <div class="modal-body">
            <form id="borrower-form" onsubmit="borrowerForm.handleSubmit(event)">
              <div class="form-grid">
                <!-- Personal Information -->
                <div class="form-section">
                  <h3>Personal Information</h3>
                  
                  <div class="form-group">
                    <label for="firstName">First Name *</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName" 
                      class="form-control"
                      value="${this.borrower?.firstName || ''}"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label for="lastName">Last Name *</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName" 
                      class="form-control"
                      value="${this.borrower?.lastName || ''}"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label for="email">Email *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      class="form-control"
                      value="${this.borrower?.email || ''}"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label for="phone">Phone</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      class="form-control"
                      value="${this.borrower?.phone || ''}"
                      placeholder="(555) 123-4567"
                    >
                  </div>
                </div>

                <!-- Borrower Settings -->
                <div class="form-section">
                  <h3>Borrower Settings</h3>

                  <div class="form-group">
                    <label for="status">Status *</label>
                    <select 
                      id="status" 
                      name="status" 
                      class="form-control"
                      required
                    >
                      <option value="active" ${!this.borrower || this.borrower?.status === 'active' ? 'selected' : ''}>Active</option>
                      <option value="suspended" ${this.borrower?.status === 'suspended' ? 'selected' : ''}>Suspended</option>
                      <option value="inactive" ${this.borrower?.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="maxItemLimit">Max Items Allowed</label>
                    <input 
                      type="number" 
                      id="maxItemLimit" 
                      name="maxItemLimit" 
                      class="form-control"
                      value="${this.borrower?.maxItemLimit || 3}"
                      min="1"
                      max="20"
                    >
                    <small class="form-text">Maximum number of items this borrower can have at once</small>
                  </div>
                </div>
              </div>

              <!-- Notes -->
              <div class="form-group">
                <label for="notes">Notes</label>
                <textarea 
                  id="notes" 
                  name="notes" 
                  class="form-control"
                  rows="3"
                  placeholder="Any additional information about this borrower..."
                >${this.borrower?.notes || ''}</textarea>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-ghost" onclick="borrowerForm.close()">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary">
                  ${this.isEdit ? '💾 Update Borrower' : '➕ Add Borrower'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    // Show modal
    document.getElementById('borrower-form-modal').classList.add('active');
  }

  async handleSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
      firstName: formData.get('firstName').trim(),
      lastName: formData.get('lastName').trim(),
      email: formData.get('email').trim(),
      phone: formData.get('phone').trim(),
      status: formData.get('status'),
      maxItemLimit: parseInt(formData.get('maxItemLimit')) || 3,
      notes: formData.get('notes').trim()
    };

    try {
      if (this.isEdit) {
        // Update existing borrower
        await borrowerService.update(this.borrowerId, data);
        showSuccess('Borrower updated successfully');
      } else {
        // Create new borrower
        const borrower = new Borrower({
          ...data,
          currentItemCount: 0,
          totalBorrows: 0,
          overdueCount: 0
        });
        
        await borrowerService.create(borrower);
        showSuccess('Borrower added successfully');
      }

      this.close();
      
      // Refresh borrower management if it exists
      if (window.borrowerManagement) {
        borrowerManagement.filterBorrowers();
      }
    } catch (error) {
      console.error('Error saving borrower:', error);
      showError(error.message || 'Failed to save borrower');
    }
  }

  close() {
    const modal = document.getElementById('borrower-form-modal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.remove();
      }, 300);
    }
  }
}

// Export for use globally
if (typeof window !== 'undefined') {
  window.BorrowerForm = BorrowerForm;
}
