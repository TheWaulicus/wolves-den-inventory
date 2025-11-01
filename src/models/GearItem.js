/**
 * GearItem Model
 * Represents a single piece of hockey equipment in inventory
 */

class GearItem {
  static VALID_CONDITIONS = ['new', 'good', 'fair', 'needs-repair', 'retired'];
  static VALID_STATUSES = ['available', 'checked-out', 'maintenance', 'retired'];

  constructor(data = {}) {
    this.id = data.id || null;
    this.gearType = data.gearType || '';
    this.brand = data.brand || '';
    this.model = data.model || '';
    this.size = data.size || '';
    this.condition = data.condition || 'good';
    this.status = data.status || 'available';
    this.purchaseDate = data.purchaseDate || null;
    this.purchaseCost = data.purchaseCost || null;
    this.description = data.description || '';
    this.notes = data.notes || '';
    this.barcode = data.barcode || null;
    this.location = data.location || '';
    this.photoCount = data.photoCount || 0;
    this.currentBorrower = data.currentBorrower || null;
    this.lastCheckoutDate = data.lastCheckoutDate || null;
    this.tags = data.tags || [];
    this.customFields = data.customFields || {};
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
    this.createdBy = data.createdBy || null;
  }

  toFirestore() {
    const doc = {
      gearType: this.gearType,
      brand: this.brand,
      model: this.model,
      size: this.size,
      condition: this.condition,
      status: this.status,
      description: this.description,
      notes: this.notes,
      location: this.location,
      photoCount: this.photoCount,
      tags: this.tags,
      customFields: this.customFields,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (this.purchaseDate) doc.purchaseDate = this.purchaseDate;
    if (this.purchaseCost !== null) doc.purchaseCost = this.purchaseCost;
    if (this.barcode) doc.barcode = this.barcode;
    if (this.currentBorrower) doc.currentBorrower = this.currentBorrower;
    if (this.lastCheckoutDate) doc.lastCheckoutDate = this.lastCheckoutDate;

    if (!this.id) {
      doc.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      if (this.createdBy) doc.createdBy = this.createdBy;
    }

    return doc;
  }

  static fromFirestore(doc) {
    if (!doc.exists) return null;
    
    const data = doc.data();
    return new GearItem({
      id: doc.id,
      ...data,
      purchaseDate: data.purchaseDate?.toDate() || null,
      lastCheckoutDate: data.lastCheckoutDate?.toDate() || null,
      createdAt: data.createdAt?.toDate() || null,
      updatedAt: data.updatedAt?.toDate() || null
    });
  }

  validate() {
    const errors = [];

    if (!this.gearType || this.gearType.trim() === '') {
      errors.push('Gear type is required');
    }

    if (!this.brand || this.brand.trim() === '') {
      errors.push('Brand is required');
    }

    if (!GearItem.VALID_CONDITIONS.includes(this.condition)) {
      errors.push(`Condition must be one of: ${GearItem.VALID_CONDITIONS.join(', ')}`);
    }

    if (!GearItem.VALID_STATUSES.includes(this.status)) {
      errors.push(`Status must be one of: ${GearItem.VALID_STATUSES.join(', ')}`);
    }

    if (this.purchaseCost !== null && (isNaN(this.purchaseCost) || this.purchaseCost < 0)) {
      errors.push('Purchase cost must be a positive number');
    }

    return { valid: errors.length === 0, errors };
  }

  isAvailable() {
    return this.status === 'available';
  }

  isCheckedOut() {
    return this.status === 'checked-out';
  }
}

if (typeof window !== 'undefined') {
  window.GearItem = GearItem;
}
