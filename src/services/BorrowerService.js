/**
 * BorrowerService
 * Handles all Firestore operations for borrowers
 */

class BorrowerService {
  constructor() {
    this.collection = db.collection('borrowers');
  }

  async create(borrower) {
    const validation = borrower.validate();
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const docRef = await this.collection.add(borrower.toFirestore());
    console.log('✅ Borrower created:', docRef.id);
    return docRef.id;
  }

  async getById(id) {
    const doc = await this.collection.doc(id).get();
    return Borrower.fromFirestore(doc);
  }

  async update(id, updates) {
    await this.collection.doc(id).update({
      ...updates,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Borrower updated:', id);
  }

  async delete(id) {
    await this.update(id, { status: 'inactive' });
    console.log('✅ Borrower deleted (soft):', id);
  }

  async hardDelete(id) {
    await this.collection.doc(id).delete();
    console.log('✅ Borrower permanently deleted:', id);
  }

  async getAll(filters = {}) {
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
    await this.collection.doc(id).update({
      currentItemCount: firebase.firestore.FieldValue.increment(1),
      totalBorrows: firebase.firestore.FieldValue.increment(1)
    });
  }

  async decrementItemCount(id) {
    await this.collection.doc(id).update({
      currentItemCount: firebase.firestore.FieldValue.increment(-1)
    });
  }

  async incrementOverdueCount(id) {
    await this.collection.doc(id).update({
      overdueCount: firebase.firestore.FieldValue.increment(1)
    });
  }

  async decrementOverdueCount(id) {
    await this.collection.doc(id).update({
      overdueCount: firebase.firestore.FieldValue.increment(-1)
    });
  }

  onSnapshot(id, callback) {
    return this.collection.doc(id).onSnapshot(doc => {
      const borrower = Borrower.fromFirestore(doc);
      callback(borrower);
    });
  }

  onSnapshotAll(filters = {}, callback) {
    let query = this.collection;

    if (filters.status) {
      query = query.where('status', '==', filters.status);
    }

    query = query.orderBy('lastName', 'asc');

    return query.onSnapshot(snapshot => {
      const borrowers = snapshot.docs.map(doc => Borrower.fromFirestore(doc));
      callback(borrowers);
    });
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
