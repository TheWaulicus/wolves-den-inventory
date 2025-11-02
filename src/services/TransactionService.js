/**
 * TransactionService
 * Handles all Firestore operations for transactions
 */

class TransactionService {
  constructor() {
    // Check if Firebase is properly configured
    this.useFirebase = false;
    
    if (typeof db !== 'undefined' && typeof firebase !== 'undefined') {
      try {
        const config = firebase.app().options;
        if (config.projectId && config.projectId !== 'YOUR_PROJECT_ID') {
          this.useFirebase = true;
          this.collection = db.collection('transactions');
          this.historyCollection = db.collection('transactionHistory');
          console.log('✅ TransactionService connected to Firebase');
        }
      } catch (error) {
        console.log('⚠️ Firebase not properly configured, using memory mode');
      }
    }
    
    // In-memory storage fallback
    this.memoryStore = new Map();
    this.historyStore = new Map();
    
    if (!this.useFirebase) {
      console.log('⚠️ TransactionService running in memory mode (Firebase not configured)');
    }
  }

  async create(transaction) {
    const validation = transaction.validate();
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    if (this.useFirebase) {
      const docRef = await this.collection.add(transaction.toFirestore());
      console.log('✅ Transaction created:', docRef.id);
      return docRef.id;
    } else {
      // Memory mode
      const id = `trans-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      transaction.id = id;
      transaction.createdAt = new Date();
      transaction.updatedAt = new Date();
      this.memoryStore.set(id, transaction);
      console.log('✅ Transaction created (memory):', id);
      return id;
    }
  }

  async getById(id) {
    if (this.useFirebase) {
      const doc = await this.collection.doc(id).get();
      return Transaction.fromFirestore(doc);
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
      console.log('✅ Transaction updated:', id);
    } else {
      // Memory mode
      const existing = this.memoryStore.get(id);
      if (existing) {
        Object.assign(existing, updates);
        existing.updatedAt = new Date();
        console.log('✅ Transaction updated (memory):', id);
      } else {
        throw new Error('Transaction not found');
      }
    }
  }

  async delete(id) {
    await this.update(id, { status: 'cancelled' });
    console.log('✅ Transaction cancelled:', id);
  }

  async getAll(filters = {}) {
    if (this.useFirebase) {
      let query = this.collection;

      if (filters.status) {
        query = query.where('status', '==', filters.status);
      }

      if (filters.borrowerId) {
        query = query.where('borrowerId', '==', filters.borrowerId);
      }

      if (filters.gearItemId) {
        query = query.where('gearItemId', '==', filters.gearItemId);
      }

      if (filters.isOverdue !== undefined) {
        query = query.where('isOverdue', '==', filters.isOverdue);
      }

      query = query.orderBy('checkoutDate', 'desc');

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => Transaction.fromFirestore(doc));
    } else {
      // Memory mode
      let transactions = Array.from(this.memoryStore.values());

      if (filters.status) {
        transactions = transactions.filter(t => t.status === filters.status);
      }

      if (filters.borrowerId) {
        transactions = transactions.filter(t => t.borrowerId === filters.borrowerId);
      }

      if (filters.gearItemId) {
        transactions = transactions.filter(t => t.gearItemId === filters.gearItemId);
      }

      if (filters.isOverdue !== undefined) {
        transactions = transactions.filter(t => t.isOverdue === filters.isOverdue);
      }

      transactions.sort((a, b) => (b.checkoutDate || 0) - (a.checkoutDate || 0));

      if (filters.limit) {
        transactions = transactions.slice(0, filters.limit);
      }

      return transactions;
    }
  }

  async getActive() {
    return this.getAll({ status: 'active' });
  }

  async getOverdue() {
    return this.getAll({ isOverdue: true });
  }

  async getByBorrower(borrowerId) {
    return this.getAll({ borrowerId });
  }

  async getByGearItem(gearItemId) {
    return this.getAll({ gearItemId });
  }

  /**
   * Check out gear to borrower
   * @param {Object} checkoutData - Checkout details
   * @returns {Promise<string>} Transaction ID
   */
  async checkOut(checkoutData) {
    const {
      gearItemId,
      borrowerId,
      gearItem,
      borrower,
      dueDate,
      checkoutNotes,
      checkedOutBy
    } = checkoutData;

    // Verify gear is available
    if (gearItem.status !== 'available') {
      throw new Error('Gear item is not available for checkout');
    }

    // Verify borrower can borrow
    if (!borrower.canBorrow()) {
      throw new Error('Borrower cannot borrow items at this time');
    }

    if (this.useFirebase) {
      // Use Firestore transaction for atomic update
      return db.runTransaction(async (transaction) => {
      // Create transaction record
      const newTransaction = new Transaction({
        gearItemId,
        borrowerId,
        gearType: gearItem.gearType,
        gearBrand: gearItem.brand,
        gearSize: gearItem.size,
        borrowerName: borrower.getFullName(),
        borrowerEmail: borrower.email,
        checkoutDate: firebase.firestore.Timestamp.now(),
        dueDate: firebase.firestore.Timestamp.fromDate(dueDate),
        expectedReturnDate: firebase.firestore.Timestamp.fromDate(dueDate),
        checkoutCondition: gearItem.condition,
        checkoutNotes: checkoutNotes || '',
        checkedOutBy: checkedOutBy || getCurrentUser()?.uid,
        status: 'active',
        isOverdue: false
      });

      const transactionRef = this.collection.doc();
      transaction.set(transactionRef, newTransaction.toFirestore());

      // Update gear item
      const gearRef = db.collection('gearItems').doc(gearItemId);
      transaction.update(gearRef, {
        status: 'checked-out',
        currentBorrower: borrowerId,
        lastCheckoutDate: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Update borrower
      const borrowerRef = db.collection('borrowers').doc(borrowerId);
      transaction.update(borrowerRef, {
        currentItemCount: firebase.firestore.FieldValue.increment(1),
        totalBorrows: firebase.firestore.FieldValue.increment(1),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

        console.log('✅ Checkout completed:', transactionRef.id);
        return transactionRef.id;
      });
    } else {
      // Memory mode - simple sequential updates
      const newTransaction = new Transaction({
        gearItemId,
        borrowerId,
        gearType: gearItem.gearType,
        gearBrand: gearItem.brand,
        gearSize: gearItem.size,
        borrowerName: borrower.getFullName(),
        borrowerEmail: borrower.email,
        checkoutDate: new Date(),
        dueDate: new Date(dueDate),
        expectedReturnDate: new Date(dueDate),
        checkoutNotes: checkoutNotes || '',
        checkedOutBy: checkedOutBy || 'system',
        status: 'active',
        isOverdue: false
      });

      const transactionId = await this.create(newTransaction);

      // Update gear item
      await gearService.update(gearItemId, {
        status: 'checked-out',
        currentBorrower: borrowerId,
        lastCheckoutDate: new Date()
      });

      // Update borrower
      await borrowerService.incrementItemCount(borrowerId);

      console.log('✅ Checkout completed (memory):', transactionId);
      return transactionId;
    }
  }

  /**
   * Check in gear from borrower
   * @param {string} transactionId - Transaction ID
   * @param {Object} returnData - Return details
   * @returns {Promise<void>}
   */
  async checkIn(transactionId, returnData) {
    const {
      returnNotes,
      damageReported,
      damageDescription,
      returnedBy
    } = returnData;

    const transactionDoc = await this.getById(transactionId);
    if (!transactionDoc) {
      throw new Error('Transaction not found');
    }

    if (this.useFirebase) {
      return db.runTransaction(async (transaction) => {
      // Update transaction
      const transactionRef = this.collection.doc(transactionId);
      transaction.update(transactionRef, {
        returnDate: firebase.firestore.FieldValue.serverTimestamp(),
        returnCondition: returnCondition || transactionDoc.checkoutCondition,
        returnNotes: returnNotes || '',
        damageReported: damageReported || false,
        damageDescription: damageDescription || '',
        status: 'returned',
        isOverdue: false,
        returnedBy: returnedBy || getCurrentUser()?.uid,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Update gear item
      const gearRef = db.collection('gearItems').doc(transactionDoc.gearItemId);
      transaction.update(gearRef, {
        status: damageReported ? 'maintenance' : 'available',
        currentBorrower: null,
        condition: returnCondition || transactionDoc.checkoutCondition,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Update borrower
      const borrowerRef = db.collection('borrowers').doc(transactionDoc.borrowerId);
      const updates = {
        currentItemCount: firebase.firestore.FieldValue.increment(-1),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      if (transactionDoc.isOverdue) {
        updates.overdueCount = firebase.firestore.FieldValue.increment(-1);
      }

      transaction.update(borrowerRef, updates);

        console.log('✅ Check-in completed:', transactionId);
      });
    } else {
      // Memory mode - simple sequential updates
      await this.update(transactionId, {
        returnDate: new Date(),
        returnNotes: returnNotes || '',
        damageReported: damageReported || false,
        damageDescription: damageDescription || '',
        status: 'returned',
        isOverdue: false,
        returnedBy: returnedBy || 'system'
      });

      // Update gear item
      await gearService.update(transactionDoc.gearItemId, {
        status: damageReported ? 'maintenance' : 'available',
        currentBorrower: null
      });

      // Update borrower
      await borrowerService.decrementItemCount(transactionDoc.borrowerId);
      
      if (transactionDoc.isOverdue) {
        await borrowerService.decrementOverdueCount(transactionDoc.borrowerId);
      }

      console.log('✅ Check-in completed (memory):', transactionId);
    }
  }

  /**
   * Move transaction to history
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<void>}
   */
  async moveToHistory(transactionId) {
    const transactionDoc = await this.getById(transactionId);
    if (!transactionDoc || !transactionDoc.isReturned()) {
      throw new Error('Only returned transactions can be archived');
    }

    const historyData = {
      ...transactionDoc.toFirestore(),
      archivedAt: firebase.firestore.FieldValue.serverTimestamp(),
      completedAt: transactionDoc.returnDate
    };

    await this.historyCollection.doc(transactionId).set(historyData);
    await this.collection.doc(transactionId).delete();
    console.log('✅ Transaction moved to history:', transactionId);
  }

  /**
   * Check for overdue transactions and update status
   * @returns {Promise<number>} Number of overdue transactions
   */
  async checkOverdue() {
    const activeTransactions = await this.getActive();
    const now = new Date();
    let overdueCount = 0;

    const batch = db.batch();

    activeTransactions.forEach(trans => {
      if (trans.dueDate && now > trans.dueDate) {
        const ref = this.collection.doc(trans.id);
        batch.update(ref, {
          status: 'overdue',
          isOverdue: true,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        overdueCount++;
      }
    });

    if (overdueCount > 0) {
      await batch.commit();
      console.log(`✅ Marked ${overdueCount} transactions as overdue`);
    }

    return overdueCount;
  }

  onSnapshot(id, callback) {
    return this.collection.doc(id).onSnapshot(doc => {
      const transaction = Transaction.fromFirestore(doc);
      callback(transaction);
    });
  }

  onSnapshotAll(filters = {}, callback) {
    let query = this.collection;

    if (filters.status) {
      query = query.where('status', '==', filters.status);
    }

    if (filters.borrowerId) {
      query = query.where('borrowerId', '==', filters.borrowerId);
    }

    query = query.orderBy('checkoutDate', 'desc');

    return query.onSnapshot(snapshot => {
      const transactions = snapshot.docs.map(doc => Transaction.fromFirestore(doc));
      callback(transactions);
    });
  }

  async getStatistics() {
    const allTransactions = await this.getAll();
    
    return {
      total: allTransactions.length,
      active: allTransactions.filter(t => t.status === 'active').length,
      overdue: allTransactions.filter(t => t.isOverdue).length,
      returned: allTransactions.filter(t => t.status === 'returned').length,
      withDamage: allTransactions.filter(t => t.damageReported).length
    };
  }
}

if (typeof window !== 'undefined') {
  window.transactionService = new TransactionService();
}
