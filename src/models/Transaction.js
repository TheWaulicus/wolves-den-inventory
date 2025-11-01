/**
 * Transaction Model
 * Represents a lending transaction (checkout/return)
 */

class Transaction {
  static VALID_STATUSES = ['active', 'overdue', 'returned', 'cancelled'];
  static VALID_CONDITIONS = ['new', 'good', 'fair', 'needs-repair', 'retired'];

  constructor(data = {}) {
    this.id = data.id || null;
    this.gearItemId = data.gearItemId || '';
    this.borrowerId = data.borrowerId || '';
    
    // Denormalized data
    this.gearType = data.gearType || '';
    this.gearBrand = data.gearBrand || '';
    this.gearSize = data.gearSize || '';
    this.borrowerName = data.borrowerName || '';
    this.borrowerEmail = data.borrowerEmail || '';
    
    // Transaction details
    this.checkoutDate = data.checkoutDate || null;
    this.dueDate = data.dueDate || null;
    this.expectedReturnDate = data.expectedReturnDate || null;
    this.returnDate = data.returnDate || null;
    
    // Status
    this.status = data.status || 'active';
    this.isOverdue = data.isOverdue || false;
    
    // Condition tracking
    this.checkoutCondition = data.checkoutCondition || 'good';
    this.returnCondition = data.returnCondition || null;
    this.damageReported = data.damageReported || false;
    this.damageDescription = data.damageDescription || '';
    
    // Notes
    this.checkoutNotes = data.checkoutNotes || '';
    this.returnNotes = data.returnNotes || '';
    
    // Metadata
    this.checkedOutBy = data.checkedOutBy || null;
    this.returnedBy = data.returnedBy || null;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  toFirestore() {
    const doc = {
      gearItemId: this.gearItemId,
      borrowerId: this.borrowerId,
      gearType: this.gearType,
      gearBrand: this.gearBrand,
      gearSize: this.gearSize,
      borrowerName: this.borrowerName,
      borrowerEmail: this.borrowerEmail,
      checkoutDate: this.checkoutDate,
      dueDate: this.dueDate,
      expectedReturnDate: this.expectedReturnDate,
      status: this.status,
      isOverdue: this.isOverdue,
      checkoutCondition: this.checkoutCondition,
      damageReported: this.damageReported,
      damageDescription: this.damageDescription,
      checkoutNotes: this.checkoutNotes,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (this.returnDate) doc.returnDate = this.returnDate;
    if (this.returnCondition) doc.returnCondition = this.returnCondition;
    if (this.returnNotes) doc.returnNotes = this.returnNotes;
    if (this.checkedOutBy) doc.checkedOutBy = this.checkedOutBy;
    if (this.returnedBy) doc.returnedBy = this.returnedBy;

    if (!this.id) {
      doc.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    }

    return doc;
  }

  static fromFirestore(doc) {
    if (!doc.exists) return null;
    
    const data = doc.data();
    return new Transaction({
      id: doc.id,
      ...data,
      checkoutDate: data.checkoutDate?.toDate() || null,
      dueDate: data.dueDate?.toDate() || null,
      expectedReturnDate: data.expectedReturnDate?.toDate() || null,
      returnDate: data.returnDate?.toDate() || null,
      createdAt: data.createdAt?.toDate() || null,
      updatedAt: data.updatedAt?.toDate() || null
    });
  }

  validate() {
    const errors = [];

    if (!this.gearItemId) {
      errors.push('Gear item ID is required');
    }

    if (!this.borrowerId) {
      errors.push('Borrower ID is required');
    }

    if (!this.checkoutDate) {
      errors.push('Checkout date is required');
    }

    if (!this.dueDate) {
      errors.push('Due date is required');
    }

    if (this.checkoutDate && this.dueDate && this.checkoutDate > this.dueDate) {
      errors.push('Due date must be after checkout date');
    }

    if (!Transaction.VALID_STATUSES.includes(this.status)) {
      errors.push(`Status must be one of: ${Transaction.VALID_STATUSES.join(', ')}`);
    }

    if (!Transaction.VALID_CONDITIONS.includes(this.checkoutCondition)) {
      errors.push(`Checkout condition must be one of: ${Transaction.VALID_CONDITIONS.join(', ')}`);
    }

    return { valid: errors.length === 0, errors };
  }

  isActive() {
    return this.status === 'active' || this.status === 'overdue';
  }

  isReturned() {
    return this.status === 'returned';
  }

  checkOverdue() {
    if (this.isActive() && this.dueDate) {
      const now = new Date();
      this.isOverdue = now > this.dueDate;
      if (this.isOverdue && this.status === 'active') {
        this.status = 'overdue';
      }
    }
    return this.isOverdue;
  }

  getDaysOverdue() {
    if (!this.isOverdue || !this.dueDate) return 0;
    const now = new Date();
    const diff = now - this.dueDate;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}

if (typeof window !== 'undefined') {
  window.Transaction = Transaction;
}
