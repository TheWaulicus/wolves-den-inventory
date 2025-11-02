/**
 * Borrower Model
 * Represents a person who can borrow gear (player, coach, staff)
 */

class Borrower {
  static VALID_STATUSES = ['active', 'suspended', 'inactive'];
  static CONTACT_METHODS = ['email', 'sms', 'both'];

  constructor(data = {}) {
    this.id = data.id || null;
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.status = data.status || 'active';
    this.maxItems = data.maxItems || 5;
    this.canBorrowUntil = data.canBorrowUntil || null;
    this.currentItemCount = data.currentItemCount || 0;
    this.totalBorrows = data.totalBorrows || 0;
    this.overdueCount = data.overdueCount || 0;
    this.preferredContact = data.preferredContact || 'email';
    this.notifications = data.notifications !== false;
    this.notes = data.notes || '';
    this.photoUrl = data.photoUrl || null;
    this.emergencyContact = data.emergencyContact || '';
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
    this.createdBy = data.createdBy || null;
  }

  toFirestore() {
    const doc = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      status: this.status,
      maxItems: this.maxItems,
      currentItemCount: this.currentItemCount,
      totalBorrows: this.totalBorrows,
      overdueCount: this.overdueCount,
      preferredContact: this.preferredContact,
      notifications: this.notifications,
      notes: this.notes,
      emergencyContact: this.emergencyContact,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (this.canBorrowUntil) doc.canBorrowUntil = this.canBorrowUntil;
    if (this.photoUrl) doc.photoUrl = this.photoUrl;

    if (!this.id) {
      doc.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      if (this.createdBy) doc.createdBy = this.createdBy;
    }

    return doc;
  }

  static fromFirestore(doc) {
    if (!doc.exists) return null;
    
    const data = doc.data();
    return new Borrower({
      id: doc.id,
      ...data,
      canBorrowUntil: data.canBorrowUntil?.toDate() || null,
      createdAt: data.createdAt?.toDate() || null,
      updatedAt: data.updatedAt?.toDate() || null
    });
  }

  validate() {
    const errors = [];

    if (!this.firstName || this.firstName.trim() === '') {
      errors.push('First name is required');
    }

    if (!this.lastName || this.lastName.trim() === '') {
      errors.push('Last name is required');
    }

    if (this.email && !this.isValidEmail(this.email)) {
      errors.push('Email must be valid if provided');
    }

    if (!Borrower.VALID_STATUSES.includes(this.status)) {
      errors.push(`Status must be one of: ${Borrower.VALID_STATUSES.join(', ')}`);
    }

    if (this.maxItems < 1) {
      errors.push('Max items must be at least 1');
    }

    return { valid: errors.length === 0, errors };
  }

  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  canBorrow() {
    if (this.status !== 'active') return false;
    if (this.currentItemCount >= this.maxItems) return false;
    if (this.canBorrowUntil && new Date() > this.canBorrowUntil) return false;
    return true;
  }

  hasOverdueItems() {
    return this.overdueCount > 0;
  }
}

if (typeof window !== 'undefined') {
  window.Borrower = Borrower;
}
