/**
 * GearType Model
 * Represents a category/type of hockey equipment
 */

class GearType {
  static VALID_CATEGORIES = ['footwear', 'protective', 'sticks', 'accessories', 'clothing'];
  static SIZE_TYPES = ['numeric', 'alpha', 'custom', 'none'];

  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.category = data.category || 'accessories';
    this.description = data.description || '';
    this.requiresSize = data.requiresSize !== false;
    this.sizeType = data.sizeType || 'numeric';
    this.sizeOptions = data.sizeOptions || [];
    this.icon = data.icon || '📦';
    this.sortOrder = data.sortOrder || 0;
    this.isActive = data.isActive !== false;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  toFirestore() {
    const doc = {
      name: this.name,
      category: this.category,
      description: this.description,
      requiresSize: this.requiresSize,
      sizeType: this.sizeType,
      sizeOptions: this.sizeOptions,
      icon: this.icon,
      sortOrder: this.sortOrder,
      isActive: this.isActive,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (!this.id) {
      doc.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    }

    return doc;
  }

  static fromFirestore(doc) {
    if (!doc.exists) return null;
    
    const data = doc.data();
    return new GearType({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || null,
      updatedAt: data.updatedAt?.toDate() || null
    });
  }

  validate() {
    const errors = [];

    if (!this.name || this.name.trim() === '') {
      errors.push('Name is required');
    }

    if (!GearType.VALID_CATEGORIES.includes(this.category)) {
      errors.push(`Category must be one of: ${GearType.VALID_CATEGORIES.join(', ')}`);
    }

    if (!GearType.SIZE_TYPES.includes(this.sizeType)) {
      errors.push(`Size type must be one of: ${GearType.SIZE_TYPES.join(', ')}`);
    }

    return { valid: errors.length === 0, errors };
  }

  static getDefaultSizeOptions(sizeType) {
    switch (sizeType) {
      case 'numeric':
        return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      case 'alpha':
        return ['6', '7', '8', '9', '10', '11', '12'];
      case 'none':
        return [];
      default:
        return [];
    }
  }
}

if (typeof window !== 'undefined') {
  window.GearType = GearType;
}
