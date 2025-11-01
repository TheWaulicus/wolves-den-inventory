/**
 * GearTypeService
 * Handles all Firestore operations for gear types
 * Falls back to in-memory storage if Firebase not configured
 */

class GearTypeService {
  constructor() {
    this.useFirebase = typeof db !== 'undefined';
    this.collection = this.useFirebase ? db.collection('gearTypes') : null;
    
    // In-memory storage fallback
    this.memoryStore = new Map();
    
    if (!this.useFirebase) {
      console.log('⚠️ GearTypeService running in memory mode (Firebase not configured)');
      this.initializeMemoryStore();
    } else {
      console.log('✅ GearTypeService connected to Firebase');
    }
  }

  /**
   * Initialize in-memory store with default gear types
   */
  initializeMemoryStore() {
    if (typeof DEFAULT_GEAR_TYPES !== 'undefined') {
      DEFAULT_GEAR_TYPES.forEach(typeData => {
        const gearType = new GearType(typeData);
        this.memoryStore.set(typeData.id, gearType);
      });
      console.log(`📦 Loaded ${this.memoryStore.size} gear types into memory`);
    }
  }

  /**
   * Create a new gear type
   * @param {GearType} gearType - GearType instance
   * @returns {Promise<string>} Document ID
   */
  async create(gearType) {
    const validation = gearType.validate();
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    if (this.useFirebase) {
      const docRef = await this.collection.add(gearType.toFirestore());
      console.log('✅ Gear type created:', docRef.id);
      return docRef.id;
    } else {
      // Memory mode
      const id = gearType.id || this.generateId();
      gearType.id = id;
      this.memoryStore.set(id, gearType);
      console.log('✅ Gear type created (memory):', id);
      return id;
    }
  }

  /**
   * Create gear type with specific ID
   * @param {string} id - Document ID
   * @param {GearType} gearType - GearType instance
   * @returns {Promise<void>}
   */
  async createWithId(id, gearType) {
    const validation = gearType.validate();
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    gearType.id = id;

    if (this.useFirebase) {
      await this.collection.doc(id).set(gearType.toFirestore());
      console.log('✅ Gear type created with ID:', id);
    } else {
      // Memory mode
      this.memoryStore.set(id, gearType);
      console.log('✅ Gear type created (memory):', id);
    }
  }

  /**
   * Get a gear type by ID
   * @param {string} id - Document ID
   * @returns {Promise<GearType>}
   */
  async getById(id) {
    if (this.useFirebase) {
      const doc = await this.collection.doc(id).get();
      return GearType.fromFirestore(doc);
    } else {
      // Memory mode
      return this.memoryStore.get(id) || null;
    }
  }

  /**
   * Update a gear type
   * @param {string} id - Document ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<void>}
   */
  async update(id, updates) {
    if (this.useFirebase) {
      await this.collection.doc(id).update({
        ...updates,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('✅ Gear type updated:', id);
    } else {
      // Memory mode
      const existing = this.memoryStore.get(id);
      if (existing) {
        Object.assign(existing, updates);
        existing.updatedAt = new Date();
        console.log('✅ Gear type updated (memory):', id);
      }
    }
  }

  /**
   * Delete a gear type (soft delete)
   * @param {string} id - Document ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    await this.update(id, { isActive: false });
    console.log('✅ Gear type deleted (soft):', id);
  }

  /**
   * Hard delete a gear type (permanent)
   * @param {string} id - Document ID
   * @returns {Promise<void>}
   */
  async hardDelete(id) {
    if (this.useFirebase) {
      await this.collection.doc(id).delete();
      console.log('✅ Gear type permanently deleted:', id);
    } else {
      // Memory mode
      this.memoryStore.delete(id);
      console.log('✅ Gear type permanently deleted (memory):', id);
    }
  }

  /**
   * Get all gear types with optional filters
   * @param {Object} filters - Query filters
   * @returns {Promise<GearType[]>}
   */
  async getAll(filters = {}) {
    if (this.useFirebase) {
      let query = this.collection;

      if (filters.category) {
        query = query.where('category', '==', filters.category);
      }

      if (filters.isActive !== undefined) {
        query = query.where('isActive', '==', filters.isActive);
      }

      query = query.orderBy('sortOrder', 'asc');

      const snapshot = await query.get();
      return snapshot.docs.map(doc => GearType.fromFirestore(doc));
    } else {
      // Memory mode
      let types = Array.from(this.memoryStore.values());

      if (filters.category) {
        types = types.filter(t => t.category === filters.category);
      }

      if (filters.isActive !== undefined) {
        types = types.filter(t => t.isActive === filters.isActive);
      }

      types.sort((a, b) => a.sortOrder - b.sortOrder);
      
      return types;
    }
  }

  /**
   * Get active gear types
   * @returns {Promise<GearType[]>}
   */
  async getActive() {
    return this.getAll({ isActive: true });
  }

  /**
   * Get gear types by category
   * @param {string} category - Category name
   * @returns {Promise<GearType[]>}
   */
  async getByCategory(category) {
    return this.getAll({ category, isActive: true });
  }

  /**
   * Get gear types grouped by category
   * @returns {Promise<Object>}
   */
  async getGroupedByCategory() {
    const allTypes = await this.getActive();
    const grouped = {};

    allTypes.forEach(type => {
      if (!grouped[type.category]) {
        grouped[type.category] = [];
      }
      grouped[type.category].push(type);
    });

    return grouped;
  }

  /**
   * Listen to real-time updates for all gear types
   * @param {Object} filters - Query filters
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  onSnapshotAll(filters = {}, callback) {
    if (this.useFirebase) {
      let query = this.collection;

      if (filters.category) {
        query = query.where('category', '==', filters.category);
      }

      if (filters.isActive !== undefined) {
        query = query.where('isActive', '==', filters.isActive);
      }

      query = query.orderBy('sortOrder', 'asc');

      return query.onSnapshot(snapshot => {
        const types = snapshot.docs.map(doc => GearType.fromFirestore(doc));
        callback(types);
      });
    } else {
      // Memory mode - simulate with initial callback
      this.getAll(filters).then(types => callback(types));
      return () => {}; // No-op unsubscribe
    }
  }

  /**
   * Generate unique ID for memory mode
   */
  generateId() {
    return `type-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get statistics
   * @returns {Promise<Object>}
   */
  async getStatistics() {
    const allTypes = await this.getAll();
    
    return {
      total: allTypes.length,
      active: allTypes.filter(t => t.isActive).length,
      byCategory: {
        footwear: allTypes.filter(t => t.category === 'footwear').length,
        protective: allTypes.filter(t => t.category === 'protective').length,
        sticks: allTypes.filter(t => t.category === 'sticks').length,
        clothing: allTypes.filter(t => t.category === 'clothing').length,
        accessories: allTypes.filter(t => t.category === 'accessories').length
      }
    };
  }

  /**
   * Reorder gear types
   * @param {Array} orderedIds - Array of IDs in new order
   * @returns {Promise<void>}
   */
  async reorder(orderedIds) {
    const updates = orderedIds.map((id, index) => 
      this.update(id, { sortOrder: index + 1 })
    );
    
    await Promise.all(updates);
    console.log('✅ Gear types reordered');
  }
}

// Export singleton instance
if (typeof window !== 'undefined') {
  window.GearTypeService = GearTypeService;
  window.gearTypeService = new GearTypeService();
}
