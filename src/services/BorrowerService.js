/**
 * BorrowerService
 * Handles all Firestore operations for borrowers
 */

class BorrowerService {
  constructor() {
    // Check if Firebase is properly configured
    this.useFirebase = false;
    
    if (typeof db !== 'undefined' && typeof firebase !== 'undefined') {
      try {
        const config = firebase.app().options;
        if (config.projectId && config.projectId !== 'YOUR_PROJECT_ID') {
          this.useFirebase = true;
          this.collection = db.collection('borrowers');
          console.log('✅ BorrowerService connected to Firebase');
        }
      } catch (error) {
        console.log('⚠️ Firebase not properly configured, using memory mode');
      }
    }
    
    // In-memory storage fallback
    this.memoryStore = new Map();
    
    if (!this.useFirebase) {
      console.log('⚠️ BorrowerService running in memory mode (Firebase not configured)');
      this.initializeMemoryStore();
    }
  }

  /**
   * Initialize in-memory store with sample data
   */
  async initializeMemoryStore() {
    if (typeof SAMPLE_BORROWERS !== 'undefined') {
      for (const borrowerData of SAMPLE_BORROWERS) {
        const borrower = new Borrower(borrowerData);
        const id = borrowerData.id || `borrower-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        borrower.id = id;
        borrower.createdAt = new Date();
        borrower.updatedAt = new Date();
        this.memoryStore.set(id, borrower);
      }
      console.log(`📦 Loaded ${this.memoryStore.size} sample borrowers into memory`);
    }
  }

  async create(borrower) {
    const validation = borrower.validate();
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    if (this.useFirebase) {
      const docRef = await this.collection.add(borrower.toFirestore());
      console.log('✅ Borrower created:', docRef.id);
      return docRef.id;
    } else {
      // Memory mode
      const id = borrower.id || `borrower-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      borrower.id = id;
      borrower.createdAt = new Date();
      borrower.updatedAt = new Date();
      this.memoryStore.set(id, borrower);
      console.log('✅ Borrower created (memory):', id);
      return id;
    }
  }

  async getById(id) {
    if (this.useFirebase) {
      const doc = await this.collection.doc(id).get();
      return Borrower.fromFirestore(doc);
    } else {
      return this.memoryStore.get(id) || null;
    }
  }

  async update(id, updates) {
    if (this.useFirebase) {
      await this.collection.doc(id).update({
        ...updates,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('✅ Borrower updated:', id);
    } else {
      // Memory mode
      const existing = this.memoryStore.get(id);
      if (existing) {
        Object.assign(existing, updates);
        existing.updatedAt = new Date();
        console.log('✅ Borrower updated (memory):', id);
      } else {
        throw new Error('Borrower not found');
      }
    }
  }

  async delete(id) {
    await this.update(id, { status: 'inactive' });
    console.log('✅ Borrower deleted (soft):', id);
  }

  async hardDelete(id) {
    if (this.useFirebase) {
      await this.collection.doc(id).delete();
      console.log('✅ Borrower permanently deleted:', id);
    } else {
      // Memory mode
      this.memoryStore.delete(id);
      console.log('✅ Borrower permanently deleted (memory):', id);
    }
  }

  async getAll(filters = {}) {
    if (this.useFirebase) {
      let query = this.collection;

      if (filters.status) {
        query = query.where('status', '==', filters.status);
      }

      if (filters.teamRole) {
        query = query.where('teamRole', '==', filters.teamRole);
      }

      query = query.orderBy('lastName', 'asc');

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => Borrower.fromFirestore(doc));
    } else {
      // Memory mode
      let borrowers = Array.from(this.memoryStore.values());

      if (filters.status) {
        borrowers = borrowers.filter(b => b.status === filters.status);
      }

      if (filters.teamRole) {
        borrowers = borrowers.filter(b => b.teamRole === filters.teamRole);
      }

      borrowers.sort((a, b) => a.lastName.localeCompare(b.lastName));

      if (filters.limit) {
        borrowers = borrowers.slice(0, filters.limit);
      }

      return borrowers;
    }
  }

  async search(searchTerm) {
    const allBorrowers = await this.getAll();
    const term = searchTerm.toLowerCase();
    
    return allBorrowers.filter(borrower => 
      borrower.firstName.toLowerCase().includes(term) ||
      borrower.lastName.toLowerCase().includes(term) ||
      borrower.email.toLowerCase().includes(term) ||
      borrower.jerseyNumber.includes(term)
    );
  }

  async getActive() {
    return this.getAll({ status: 'active' });
  }

  async incrementItemCount(id) {
    if (this.useFirebase) {
      await this.collection.doc(id).update({
        currentItemCount: firebase.firestore.FieldValue.increment(1),
        totalBorrows: firebase.firestore.FieldValue.increment(1)
      });
    } else {
      // Memory mode
      const borrower = this.memoryStore.get(id);
      if (borrower) {
        borrower.currentItemCount = (borrower.currentItemCount || 0) + 1;
        borrower.totalBorrows = (borrower.totalBorrows || 0) + 1;
        borrower.updatedAt = new Date();
      }
    }
  }

  async decrementItemCount(id) {
    if (this.useFirebase) {
      await this.collection.doc(id).update({
        currentItemCount: firebase.firestore.FieldValue.increment(-1)
      });
    } else {
      // Memory mode
      const borrower = this.memoryStore.get(id);
      if (borrower) {
        borrower.currentItemCount = Math.max(0, (borrower.currentItemCount || 0) - 1);
        borrower.updatedAt = new Date();
      }
    }
  }

  async incrementOverdueCount(id) {
    if (this.useFirebase) {
      await this.collection.doc(id).update({
        overdueCount: firebase.firestore.FieldValue.increment(1)
      });
    } else {
      // Memory mode
      const borrower = this.memoryStore.get(id);
      if (borrower) {
        borrower.overdueCount = (borrower.overdueCount || 0) + 1;
        borrower.updatedAt = new Date();
      }
    }
  }

  async decrementOverdueCount(id) {
    if (this.useFirebase) {
      await this.collection.doc(id).update({
        overdueCount: firebase.firestore.FieldValue.increment(-1)
      });
    } else {
      // Memory mode
      const borrower = this.memoryStore.get(id);
      if (borrower) {
        borrower.overdueCount = Math.max(0, (borrower.overdueCount || 0) - 1);
        borrower.updatedAt = new Date();
      }
    }
  }

  onSnapshot(id, callback) {
    if (this.useFirebase) {
      return this.collection.doc(id).onSnapshot(doc => {
        const borrower = Borrower.fromFirestore(doc);
        callback(borrower);
      });
    } else {
      // Memory mode - simulate with initial callback
      this.getById(id).then(borrower => {
        if (borrower) callback(borrower);
      });
      return () => {}; // No-op unsubscribe
    }
  }

  onSnapshotAll(filters = {}, callback) {
    if (this.useFirebase) {
      let query = this.collection;

      if (filters.status) {
        query = query.where('status', '==', filters.status);
      }

      query = query.orderBy('lastName', 'asc');

      return query.onSnapshot(snapshot => {
        const borrowers = snapshot.docs.map(doc => Borrower.fromFirestore(doc));
        callback(borrowers);
      });
    } else {
      // Memory mode - simulate with initial callback
      this.getAll(filters).then(borrowers => callback(borrowers));
      return () => {}; // No-op unsubscribe
    }
  }

  async getPaginated(pageSize = 20, lastDoc = null) {
    let query = this.collection
      .orderBy('lastName', 'asc')
      .limit(pageSize);

    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();
    const borrowers = snapshot.docs.map(doc => Borrower.fromFirestore(doc));
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];

    return { borrowers, lastDoc: lastVisible };
  }

  async getStatistics() {
    const allBorrowers = await this.getAll();
    
    return {
      total: allBorrowers.length,
      active: allBorrowers.filter(b => b.status === 'active').length,
      suspended: allBorrowers.filter(b => b.status === 'suspended').length,
      withOverdue: allBorrowers.filter(b => b.overdueCount > 0).length,
      byRole: {
        players: allBorrowers.filter(b => b.teamRole === 'player').length,
        coaches: allBorrowers.filter(b => b.teamRole === 'coach').length,
        staff: allBorrowers.filter(b => b.teamRole === 'staff').length,
        volunteers: allBorrowers.filter(b => b.teamRole === 'volunteer').length
      }
    };
  }
}

if (typeof window !== 'undefined') {
  window.borrowerService = new BorrowerService();
}
