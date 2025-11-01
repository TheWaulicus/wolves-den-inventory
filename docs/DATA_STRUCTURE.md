# Firestore Data Structure

Complete reference for all Firestore collections and document schemas.

## Collections Overview

- `gearItems` - Inventory of all hockey gear
- `gearTypes` - Categories and types of equipment
- `borrowers` - Players and staff who can borrow gear
- `transactions` - Active lending transactions
- `transactionHistory` - Completed transaction archive
- `settings` - System configuration
- `admins` - Admin user records

---

## Collection: `gearItems`

Individual pieces of hockey equipment in inventory.

### Document Structure

```javascript
{
  id: "auto-generated-id",
  gearType: "skates",              // Reference to gearTypes
  brand: "Bauer",
  model: "Vapor X3.5",
  size: "10.0",                    // String to support various formats
  condition: "good",               // new, good, fair, needs-repair, retired
  status: "available",             // available, checked-out, maintenance, retired
  purchaseDate: Timestamp,
  purchaseCost: 299.99,            // Number (optional)
  description: "Senior skates",
  notes: "Left blade slightly worn",
  barcode: "WDI-SKT-001",         // Generated barcode/ID
  location: "Storage Room A",      // Physical location
  createdAt: Timestamp,
  updatedAt: Timestamp,
  createdBy: "admin-uid",
  
  // Denormalized data for performance
  photoCount: 2,
  currentBorrower: null,           // borrowerId if checked out
  lastCheckoutDate: null,
  
  // Metadata
  tags: ["adult", "forward"],      // Array of tags
  customFields: {}                 // Flexible additional data
}
```

### Subcollection: `gearItems/{itemId}/photos`

Photos for each gear item.

```javascript
{
  id: "auto-generated-id",
  url: "gs://bucket/gear-photos/item-id/photo-id.jpg",
  thumbnailUrl: "gs://bucket/gear-photos/item-id/thumb-photo-id.jpg",
  storagePath: "gear-photos/item-id/photo-id.jpg",
  fileName: "photo-001.jpg",
  fileSize: 1024567,              // Bytes
  contentType: "image/jpeg",
  isPrimary: true,                // First photo is primary
  uploadedAt: Timestamp,
  uploadedBy: "admin-uid"
}
```

### Indexes

- `status` + `gearType` + `createdAt`
- `status` + `condition`
- `gearType` + `size`

---

## Collection: `gearTypes`

Categories and types of hockey equipment.

### Document Structure

```javascript
{
  id: "skates",                   // Use slug as ID
  name: "Skates",
  category: "footwear",           // footwear, protective, sticks, accessories
  description: "Ice hockey skates",
  requiresSize: true,
  sizeType: "numeric",            // numeric, alpha, custom
  sizeOptions: ["8.0", "8.5", "9.0", ...], // Predefined sizes (optional)
  icon: "⛸️",                     // Emoji or icon reference
  sortOrder: 1,
  isActive: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## Collection: `borrowers`

Players and staff who can borrow equipment.

### Document Structure

```javascript
{
  id: "auto-generated-id",        // Can match auth UID for self-service
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1-555-0123",
  teamRole: "player",             // player, coach, staff, volunteer
  jerseyNumber: "10",             // Optional
  status: "active",               // active, suspended, inactive
  
  // Borrowing limits
  maxItems: 5,                    // Max concurrent items
  canBorrowUntil: Timestamp,      // Expiration date (optional)
  
  // Stats (denormalized)
  currentItemCount: 2,            // Currently borrowed items
  totalBorrows: 45,               // Lifetime borrows
  overdueCount: 0,                // Current overdue items
  
  // Contact preferences
  preferredContact: "email",      // email, sms, both
  notifications: true,
  
  // Metadata
  notes: "Prefers size 10 skates",
  photoUrl: "https://...",        // Optional profile photo
  emergencyContact: "+1-555-9999",
  
  createdAt: Timestamp,
  updatedAt: Timestamp,
  createdBy: "admin-uid"
}
```

---

## Collection: `transactions`

Active lending transactions (checked out gear).

### Document Structure

```javascript
{
  id: "auto-generated-id",
  gearItemId: "item-id",
  borrowerId: "borrower-id",
  
  // Denormalized data for queries
  gearType: "skates",
  gearBrand: "Bauer",
  gearSize: "10.0",
  borrowerName: "John Doe",
  borrowerEmail: "john.doe@example.com",
  
  // Transaction details
  checkoutDate: Timestamp,
  dueDate: Timestamp,
  expectedReturnDate: Timestamp,
  returnDate: null,               // Filled when returned
  
  // Status tracking
  status: "active",               // active, overdue, returned, cancelled
  isOverdue: false,               // Computed field
  
  // Condition tracking
  checkoutCondition: "good",      // Condition at checkout
  returnCondition: null,          // Condition at return
  damageReported: false,
  damageDescription: null,
  
  // Notes
  checkoutNotes: "Extra laces included",
  returnNotes: null,
  
  // Metadata
  checkedOutBy: "admin-uid",      // Who processed checkout
  returnedBy: null,               // Who processed return
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Indexes

- `status` + `dueDate`
- `borrowerId` + `checkoutDate`
- `gearItemId` + `checkoutDate`
- `isOverdue` + `dueDate`

---

## Collection: `transactionHistory`

Completed transactions (immutable archive).

### Document Structure

Same as `transactions` but moved here when completed. Includes:

```javascript
{
  // All fields from transactions
  ...transactionFields,
  
  // Additional archive metadata
  archivedAt: Timestamp,
  completedAt: Timestamp
}
```

---

## Collection: `settings`

System-wide configuration.

### Document: `settings/general`

```javascript
{
  systemName: "Wolves Den Inventory",
  organizationName: "Ice Zoo Wolves",
  logoUrl: "https://...",
  
  // Lending defaults
  defaultLoanPeriodDays: 14,
  maxItemsPerBorrower: 5,
  allowOverdueCheckout: false,
  
  // Notifications
  sendOverdueReminders: true,
  reminderDaysBefore: 2,
  overdueReminderFrequency: 3,    // Days between reminders
  
  // Display options
  theme: "dark",                   // dark, light
  showPhotos: true,
  
  updatedAt: Timestamp,
  updatedBy: "admin-uid"
}
```

---

## Collection: `admins`

Admin user records (minimal, used for authorization).

### Document Structure

```javascript
{
  id: "auth-uid",                 // Must match Firebase Auth UID
  email: "admin@example.com",
  role: "admin",                  // admin, super-admin
  createdAt: Timestamp
}
```

---

## Data Relationships

### One-to-Many

- `gearTypes` → `gearItems` (one type, many items)
- `borrowers` → `transactions` (one borrower, many transactions)
- `gearItems` → `transactions` (one item, many transactions over time)
- `gearItems` → `photos` (one item, many photos)

### Denormalization Strategy

To optimize read performance, we denormalize:

1. **Borrower info in transactions**: Name, email (avoid join queries)
2. **Gear info in transactions**: Type, brand, size (for history display)
3. **Stats in borrowers**: Current count, overdue count (avoid aggregations)
4. **Photo count in gear items**: Quick display without subcollection query

### Data Consistency

When updating denormalized data:

- Use Firestore transactions for critical updates
- Consider Cloud Functions triggers for automatic propagation
- Implement manual sync functions for batch corrections

---

## Naming Conventions

- **Collections**: camelCase, plural (`gearItems`, `borrowers`)
- **Document IDs**: Auto-generated or kebab-case slugs
- **Fields**: camelCase (`firstName`, `checkoutDate`)
- **Timestamps**: Use Firebase `Timestamp` type
- **Status values**: lowercase with hyphens (`checked-out`, `needs-repair`)

---

## Best Practices

1. **Use subcollections** for one-to-many with high cardinality (photos)
2. **Denormalize** data that's read together frequently
3. **Index** all fields used in `where()` and `orderBy()` queries
4. **Limit array fields** to reasonable sizes (max 100 items)
5. **Use batch writes** for multi-document updates
6. **Implement soft deletes** with status flags, not actual deletion
7. **Store file metadata** in Firestore, files in Storage
8. **Use server timestamps** for consistency across clients

---

## Migration Notes

For future schema changes:

- Add version field to documents: `schemaVersion: 1`
- Write migration scripts for batch updates
- Support multiple versions during transition
- Use Cloud Functions for automatic migrations on read/write
