/**
 * GearService
 * Handles all Firestore operations for gear items
 */

class GearService {
  constructor() {
    // Check if Firebase is properly configured
    this.useFirebase = false;
    
    if (typeof db !== 'undefined' && typeof firebase !== 'undefined') {
      try {
        const config = firebase.app().options;
        if (config.projectId && config.projectId !== 'YOUR_PROJECT_ID') {
          this.useFirebase = true;
          this.collection = db.collection('gearItems');
          console.log('✅ GearService connected to Firebase');
        }
      } catch (error) {
        console.log('⚠️ Firebase not properly configured, using memory mode');
      }
    }
    
    // In-memory storage fallback
    this.memoryStore = new Map();
    
    if (!this.useFirebase) {
      console.log('⚠️ GearService running in memory mode (Firebase not configured)');
      this.initializeMemoryStore();
    }
  }

  /**
   * Initialize in-memory store with sample data
   */
  async initializeMemoryStore() {
    if (typeof SAMPLE_GEAR_DATA !== 'undefined') {
      for (const itemData of SAMPLE_GEAR_DATA) {
        const gearItem = new GearItem(itemData);
        const id = `gear-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        gearItem.id = id;
        gearItem.createdAt = new Date();
        gearItem.updatedAt = new Date();
        this.memoryStore.set(id, gearItem);
      }
      console.log(`📦 Loaded ${this.memoryStore.size} sample gear items into memory`);
    }
  }

  /**
   * Create a new gear item
   * @param {GearItem} gearItem - GearItem instance
   * @returns {Promise<string>} Document ID
   */
  async create(gearItem) {
    const validation = gearItem.validate();
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    if (this.useFirebase) {
      const docRef = await this.collection.add(gearItem.toFirestore());
      console.log('✅ Gear item created:', docRef.id);
      return docRef.id;
    } else {
      // Memory mode
      const id = gearItem.id || `gear-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      gearItem.id = id;
      gearItem.createdAt = new Date();
      gearItem.updatedAt = new Date();
      this.memoryStore.set(id, gearItem);
      console.log('✅ Gear item created (memory):', id);
      return id;
    }
  }

  /**
   * Get a gear item by ID
   * @param {string} id - Document ID
   * @returns {Promise<GearItem>}
   */
  async getById(id) {
    if (this.useFirebase) {
      const doc = await this.collection.doc(id).get();
      return GearItem.fromFirestore(doc);
    } else {
      return this.memoryStore.get(id) || null;
    }
  }

  /**
   * Update a gear item
   * @param {string} id - Document ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<void>}
   */
  async update(id, updates) {
    await this.collection.doc(id).update({
      ...updates,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Gear item updated:', id);
  }

  /**
   * Delete a gear item (soft delete)
   * @param {string} id - Document ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    await this.update(id, { status: 'retired' });
    console.log('✅ Gear item deleted (soft):', id);
  }

  /**
   * Hard delete a gear item (permanent)
   * @param {string} id - Document ID
   * @returns {Promise<void>}
   */
  async hardDelete(id) {
    await this.collection.doc(id).delete();
    console.log('✅ Gear item permanently deleted:', id);
  }

  /**
   * Get all gear items with optional filters
   * @param {Object} filters - Query filters
   * @returns {Promise<GearItem[]>}
   */
  async getAll(filters = {}) {
    if (this.useFirebase) {
      let query = this.collection;

      if (filters.status) {
        query = query.where('status', '==', filters.status);
      }

      if (filters.gearType) {
        query = query.where('gearType', '==', filters.gearType);
      }

      if (filters.condition) {
        query = query.where('condition', '==', filters.condition);
      }

      query = query.orderBy('createdAt', 'desc');

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => GearItem.fromFirestore(doc));
    } else {
      // Memory mode
      let items = Array.from(this.memoryStore.values());

      if (filters.status) {
        items = items.filter(i => i.status === filters.status);
      }

      if (filters.gearType) {
        items = items.filter(i => i.gearType === filters.gearType);
      }

      if (filters.condition) {
        items = items.filter(i => i.condition === filters.condition);
      }

      items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      if (filters.limit) {
        items = items.slice(0, filters.limit);
      }

      return items;
    }
  }

  /**
   * Search gear items by text
   * @param {string} searchTerm - Search term
   * @returns {Promise<GearItem[]>}
   */
  async search(searchTerm) {
    const allItems = await this.getAll();
    const term = searchTerm.toLowerCase();
    
    return allItems.filter(item => 
      item.brand.toLowerCase().includes(term) ||
      item.model.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.barcode?.toLowerCase().includes(term) ||
      item.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }

  /**
   * Get available gear items
   * @returns {Promise<GearItem[]>}
   */
  async getAvailable() {
    return this.getAll({ status: 'available' });
  }

  /**
   * Get checked out gear items
   * @returns {Promise<GearItem[]>}
   */
  async getCheckedOut() {
    return this.getAll({ status: 'checked-out' });
  }

  /**
   * Listen to real-time updates for a gear item
   * @param {string} id - Document ID
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  onSnapshot(id, callback) {
    return this.collection.doc(id).onSnapshot(doc => {
      const item = GearItem.fromFirestore(doc);
      callback(item);
    });
  }

  /**
   * Listen to real-time updates for all gear items
   * @param {Object} filters - Query filters
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  onSnapshotAll(filters = {}, callback) {
    let query = this.collection;

    if (filters.status) {
      query = query.where('status', '==', filters.status);
    }

    if (filters.gearType) {
      query = query.where('gearType', '==', filters.gearType);
    }

    query = query.orderBy('createdAt', 'desc');

    return query.onSnapshot(snapshot => {
      const items = snapshot.docs.map(doc => GearItem.fromFirestore(doc));
      callback(items);
    });
  }

  /**
   * Get gear items with pagination
   * @param {number} pageSize - Number of items per page
   * @param {Object} lastDoc - Last document from previous page
   * @returns {Promise<{items: GearItem[], lastDoc: Object}>}
   */
  async getPaginated(pageSize = 20, lastDoc = null) {
    let query = this.collection
      .orderBy('createdAt', 'desc')
      .limit(pageSize);

    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();
    const items = snapshot.docs.map(doc => GearItem.fromFirestore(doc));
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];

    return { items, lastDoc: lastVisible };
  }

  /**
   * Update gear item status when checked out
   * @param {string} id - Document ID
   * @param {string} borrowerId - Borrower ID
   * @returns {Promise<void>}
   */
  async checkOut(id, borrowerId) {
    await this.update(id, {
      status: 'checked-out',
      currentBorrower: borrowerId,
      lastCheckoutDate: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  /**
   * Update gear item status when returned
   * @param {string} id - Document ID
   * @returns {Promise<void>}
   */
  async checkIn(id) {
    await this.update(id, {
      status: 'available',
      currentBorrower: null
    });
  }

  /**
   * Generate unique barcode for gear item
   * @param {string} prefix - Barcode prefix
   * @returns {string} Unique barcode
   */
  generateBarcode(prefix = 'WDI') {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Get inventory statistics
   * @returns {Promise<Object>} Statistics object
   */
  async getStatistics() {
    const allItems = await this.getAll();
    
    return {
      total: allItems.length,
      available: allItems.filter(i => i.status === 'available').length,
      checkedOut: allItems.filter(i => i.status === 'checked-out').length,
      maintenance: allItems.filter(i => i.status === 'maintenance').length,
      retired: allItems.filter(i => i.status === 'retired').length,
      byCondition: {
        new: allItems.filter(i => i.condition === 'new').length,
        good: allItems.filter(i => i.condition === 'good').length,
        fair: allItems.filter(i => i.condition === 'fair').length,
        needsRepair: allItems.filter(i => i.condition === 'needs-repair').length
      }
    };
  }
}

// Export singleton instance
if (typeof window !== 'undefined') {
  window.gearService = new GearService();
}
