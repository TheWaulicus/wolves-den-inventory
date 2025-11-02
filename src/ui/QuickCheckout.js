/**
 * QuickCheckout - Quick checkout modal for single items
 */

class QuickCheckout {
  constructor(gearItemId) {
    this.gearItemId = gearItemId;
    this.gearItem = null;
    this.borrowers = [];
  }

  async show() {
    // Load gear item
    this.gearItem = await gearService.getById(this.gearItemId);
    if (!this.gearItem) {
      showError('Gear item not found');
      return;
    }

    // Check if available
    if (this.gearItem.status !== 'available') {
      showError('This item is not available for checkout');
      return;
    }

    // Load borrowers
    this.borrowers = await borrowerService.getActive();
    
    this.render();
  }

  render() {
    const gearType = window.gearTypeService ? 
      window.gearTypes?.find(t => t.id === this.gearItem.gearType) : null;
    const icon = gearType ? gearType.icon : '📦';

    // Calculate default due date (14 days from now)
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);

    const modalHtml = `
      <div class="modal-overlay" onclick="if(event.target===this) quickCheckout.close()">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">📤 Check Out Gear</h3>
            <button class="modal-close" onclick="quickCheckout.close()">&times;</button>
          </div>
          <div class="modal-body">
            <!-- Gear Item Info -->
            <div class="card mb-3" style="background: var(--color-background);">
              <div style="display: flex; gap: 1rem; align-items: center;">
                <div style="font-size: 2rem;">${icon}</div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 0.5rem 0;">${this.gearItem.brand} ${this.gearItem.model}</h4>
                  <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${this.gearItem.size ? `<span class="badge badge-neutral">📏 ${this.gearItem.size}</span>` : ''}
                    ${this.gearItem.barcode ? `<span class="badge badge-neutral">🔖 ${this.gearItem.barcode}</span>` : ''}
                  </div>
                </div>
              </div>
            </div>

            <form id="quick-checkout-form" onsubmit="event.preventDefault(); quickCheckout.handleCheckout();">
              <!-- Borrower Selection -->
              <div class="form-group">
                <label class="form-label required">Borrower</label>
                <select class="form-select" id="checkout-borrower" required>
                  <option value="">Select borrower...</option>
                  ${this.borrowers.map(b => `
                    <option value="${b.id}">
                      ${b.getFullName()} ${b.jerseyNumber ? `(#${b.jerseyNumber})` : ''} - ${b.teamRole}
                    </option>
                  `).join('')}
                </select>
              </div>

              <!-- Due Date -->
              <div class="form-group">
                <label class="form-label required">Due Date</label>
                <input type="date" 
                       class="form-input" 
                       id="checkout-due-date" 
                       value="${DateHelpers.formatDate(defaultDueDate)}"
                       min="${DateHelpers.formatDate(new Date())}"
                       required>
                <span class="form-help">Default: 14 days from today</span>
              </div>

              <!-- Notes -->
              <div class="form-group">
                <label class="form-label">Notes (Optional)</label>
                <textarea class="form-textarea" 
                          id="checkout-notes" 
                          rows="2"
                          placeholder="Any special notes about this checkout..."></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" onclick="quickCheckout.close()">Cancel</button>
            <button class="btn btn-primary" onclick="quickCheckout.handleCheckout()">
              📤 Check Out
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('modals-container').innerHTML = modalHtml;
  }

  async handleCheckout() {
    try {
      const borrowerId = document.getElementById('checkout-borrower').value;
      const dueDateStr = document.getElementById('checkout-due-date').value;
      const notes = document.getElementById('checkout-notes').value.trim();

      // Validation
      if (!borrowerId) {
        showError('Please select a borrower');
        return;
      }

      if (!dueDateStr) {
        showError('Please select a due date');
        return;
      }

      const dueDate = new Date(dueDateStr);
      if (dueDate < new Date()) {
        showError('Due date cannot be in the past');
        return;
      }

      // Get borrower
      const borrower = await borrowerService.getById(borrowerId);
      if (!borrower) {
        showError('Borrower not found');
        return;
      }

      // Check if borrower can borrow
      if (!borrower.canBorrow()) {
        showError(`${borrower.getFullName()} cannot borrow items at this time (limit: ${borrower.maxItems}, current: ${borrower.currentItemCount})`);
        return;
      }

      // Perform checkout
      await transactionService.checkOut({
        gearItemId: this.gearItemId,
        borrowerId: borrowerId,
        gearItem: this.gearItem,
        borrower: borrower,
        dueDate: dueDate,
        checkoutNotes: notes,
        checkedOutBy: 'admin'
      });

      showSuccess(`${this.gearItem.brand} ${this.gearItem.model} checked out to ${borrower.getFullName()}`);
      
      this.close();

      // Reload inventory if available
      if (typeof gearManagement !== 'undefined') {
        await gearManagement.loadGearItems();
      }

    } catch (error) {
      console.error('Checkout error:', error);
      showError(error.message || 'Failed to check out item');
    }
  }

  close() {
    document.getElementById('modals-container').innerHTML = '';
  }
}

// Export
if (typeof window !== 'undefined') {
  window.QuickCheckout = QuickCheckout;
}
