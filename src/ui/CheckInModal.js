/**
 * CheckInModal - Return gear modal
 */

class CheckInModal {
  constructor(transactionId) {
    this.transactionId = transactionId;
    this.transaction = null;
  }

  async show() {
    this.transaction = await transactionService.getById(this.transactionId);
    if (!this.transaction) {
      showError('Transaction not found');
      return;
    }

    this.render();
  }

  render() {
    const modalHtml = `
      <div class="modal-overlay" onclick="if(event.target===this) checkInModal.close()">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">📥 Check In Gear</h3>
            <button class="modal-close" onclick="checkInModal.close()">&times;</button>
          </div>
          <div class="modal-body">
            <!-- Transaction Info -->
            <div class="card mb-3" style="background: var(--color-background);">
              <h4 style="margin: 0 0 1rem 0;">Transaction Details</h4>
              <div class="grid grid-cols-2">
                <div>
                  <strong>Gear:</strong><br>
                  ${this.transaction.gearBrand} ${this.transaction.gearType}
                  ${this.transaction.gearSize ? ` (${this.transaction.gearSize})` : ''}
                </div>
                <div>
                  <strong>Borrower:</strong><br>
                  ${this.transaction.borrowerName}
                </div>
                <div>
                  <strong>Checked Out:</strong><br>
                  ${DateHelpers.formatDate(this.transaction.checkoutDate)}
                </div>
                <div>
                  <strong>Due Date:</strong><br>
                  ${DateHelpers.formatDate(this.transaction.dueDate)}
                  ${this.transaction.isOverdue ? `<br><span class="badge badge-error">Overdue</span>` : ''}
                </div>
              </div>
            </div>

            <form id="checkin-form" onsubmit="event.preventDefault(); checkInModal.handleCheckIn();">
              <!-- Return Date (auto-filled) -->
              <div class="form-group">
                <label class="form-label">Return Date</label>
                <input type="date" 
                       class="form-input" 
                       id="checkin-return-date" 
                       value="${DateHelpers.formatDate(new Date())}"
                       readonly>
              </div>

              <!-- Damage Report -->
              <div class="form-group">
                <div class="form-check">
                  <input type="checkbox" id="checkin-damage" onchange="checkInModal.toggleDamage()">
                  <label for="checkin-damage">Report damage or issue</label>
                </div>
              </div>

              <div id="damage-section" style="display: none;">
                <div class="form-group">
                  <label class="form-label">Damage Description</label>
                  <textarea class="form-textarea" 
                            id="checkin-damage-description" 
                            rows="2"
                            placeholder="Describe the damage or issue..."></textarea>
                  <span class="form-help">Item will be marked for maintenance</span>
                </div>
              </div>

              <!-- Notes -->
              <div class="form-group">
                <label class="form-label">Return Notes (Optional)</label>
                <textarea class="form-textarea" 
                          id="checkin-notes" 
                          rows="2"
                          placeholder="Any notes about the return..."></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" onclick="checkInModal.close()">Cancel</button>
            <button class="btn btn-success" onclick="checkInModal.handleCheckIn()">
              📥 Complete Check-In
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('modals-container').innerHTML = modalHtml;
  }

  toggleDamage() {
    const damageSection = document.getElementById('damage-section');
    const damageCheckbox = document.getElementById('checkin-damage');
    
    if (damageCheckbox.checked) {
      damageSection.style.display = 'block';
    } else {
      damageSection.style.display = 'none';
    }
  }

  async handleCheckIn() {
    try {
      const damageReported = document.getElementById('checkin-damage').checked;
      const damageDescription = document.getElementById('checkin-damage-description')?.value.trim() || '';
      const notes = document.getElementById('checkin-notes').value.trim();

      if (damageReported && !damageDescription) {
        showError('Please describe the damage');
        return;
      }

      await transactionService.checkIn(this.transactionId, {
        returnNotes: notes,
        damageReported: damageReported,
        damageDescription: damageDescription,
        returnedBy: 'admin'
      });

      showSuccess(`${this.transaction.gearBrand} ${this.transaction.gearType} returned successfully`);
      
      this.close();

      // Reload transactions and inventory
      if (typeof transactionManagement !== 'undefined') {
        await transactionManagement.loadTransactions();
      }
      if (typeof gearManagement !== 'undefined') {
        await gearManagement.loadGearItems();
      }

    } catch (error) {
      console.error('Check-in error:', error);
      showError(error.message || 'Failed to check in item');
    }
  }

  close() {
    document.getElementById('modals-container').innerHTML = '';
  }
}

// Export
if (typeof window !== 'undefined') {
  window.CheckInModal = CheckInModal;
}
