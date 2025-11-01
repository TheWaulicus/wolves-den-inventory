# Wolves Den Inventory - Agent Instructions

## Project-Specific Guidelines

### Technology Stack
- **Firebase Firestore**: NoSQL database with real-time sync
- **Firebase Storage**: Photo and image storage
- **Firebase Authentication**: Email/password authentication
- **Vanilla JavaScript**: ES6+, no frameworks
- **Firebase Hosting**: Static web app deployment
- **Python 3.11+**: For utility scripts and automation

### Code Standards

#### JavaScript
- Use **ES6+ features** (arrow functions, destructuring, async/await)
- **camelCase** for variables, functions, method names
- **PascalCase** for class names
- **UPPER_CASE** for constants
- Always use `const` or `let`, never `var`
- Use template literals for string interpolation
- Add JSDoc comments for all functions and classes

#### File Organization
```
src/
├── models/          # Data models (GearItem, Borrower, Transaction)
├── services/        # Firebase service layer (CRUD operations)
├── ui/              # UI components (render functions, event handlers)
├── utils/           # Utility functions (validators, formatters, helpers)
├── data/            # Configuration and default data
└── firebase-config.js
```

#### Firebase Patterns (from meerkats_board)
```javascript
// Real-time listeners
db.collection('gearItems')
  .where('status', '==', 'available')
  .onSnapshot(snapshot => {
    // Handle updates
  });

// Atomic transactions
db.runTransaction(async (transaction) => {
  // Multiple operations that succeed or fail together
});

// Batch writes
const batch = db.batch();
batch.update(ref1, data1);
batch.update(ref2, data2);
await batch.commit();
```

### Documentation

- **NO Confluence documentation** for this project
- Use Markdown files in `docs/` directory
- Keep README.md updated with latest features
- Document all major changes in commit messages

### Naming Conventions

#### Collections
- `gearItems` - Individual gear pieces
- `gearTypes` - Equipment categories
- `borrowers` - Players/staff
- `transactions` - Active lending
- `transactionHistory` - Completed lending

#### Status Values
- Use lowercase with hyphens: `checked-out`, `needs-repair`, `returned`

#### File Names
- Components: `GearManagement.js`, `PhotoUpload.js`
- Services: `GearService.js`, `PhotoService.js`
- Utils: `validators.js`, `formatters.js`, `dateHelpers.js`

### Security

- **Firestore Rules**: RBAC with admin and borrower roles
- **Storage Rules**: Admin-only write, public read
- **Input Validation**: Client and server-side
- **Sanitization**: All user inputs must be sanitized

### Performance

- Use **pagination** for large datasets (Firestore cursors)
- Implement **debouncing** for search inputs
- Use **real-time listeners** only where needed
- **Denormalize** data for frequently accessed information
- Enable **offline persistence** for better UX

### UI/UX Patterns

- **Toast notifications** for feedback (success/error/warning)
- **Modal dialogs** for forms and confirmations
- **Loading states** for all async operations
- **Responsive design** - mobile-first approach
- **Keyboard navigation** support
- **Accessibility** - proper ARIA labels and semantic HTML

### Testing

- Manual testing with `test-phase1.html` pattern
- Use Firebase Emulator for local development
- Test all CRUD operations before deployment
- Verify real-time sync functionality

### Deployment

```bash
# Test locally
firebase emulators:start

# Deploy rules only
firebase deploy --only firestore:rules,storage

# Deploy hosting
firebase deploy --only hosting

# Deploy everything
firebase deploy
```

### Git Workflow

- **Commit messages**: Descriptive, include what and why
- **Branch naming**: Not applicable (direct to main for now)
- Always test before committing
- Keep commits atomic and focused

### Phase-Specific Notes

#### Phase 1 (Complete)
- ✅ Models, services, utilities implemented
- ✅ 1,685 lines of code
- ✅ Validation and Firestore integration

#### Phase 2 (Current)
- Focus: Inventory Management UI
- Key components: GearManagement, PhotoUpload, Search/Filter
- Priority: Real-time updates, photo management, barcode generation

### Common Patterns

#### Service Layer
```javascript
class MyService {
  constructor() {
    this.collection = db.collection('myCollection');
  }
  
  async create(item) {
    const validation = item.validate();
    if (!validation.valid) throw new Error(validation.errors.join(', '));
    const docRef = await this.collection.add(item.toFirestore());
    return docRef.id;
  }
  
  onSnapshot(filters, callback) {
    let query = this.collection;
    if (filters.status) query = query.where('status', '==', filters.status);
    return query.onSnapshot(snapshot => {
      callback(snapshot.docs.map(doc => Item.fromFirestore(doc)));
    });
  }
}
```

#### UI Components
```javascript
function renderComponent(containerId, data) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class="component">
      ${data.map(item => `<div class="item">${item.name}</div>`).join('')}
    </div>
  `;
  
  // Attach event listeners
  container.querySelectorAll('.item').forEach(el => {
    el.addEventListener('click', handleClick);
  });
}
```

### Error Handling

```javascript
try {
  await service.create(item);
  showNotification('Success!', 'success');
} catch (error) {
  console.error('Error:', error);
  showNotification(error.message, 'error');
}
```

### Constants

```javascript
const COLLECTION_NAMES = {
  GEAR_ITEMS: 'gearItems',
  BORROWERS: 'borrowers',
  TRANSACTIONS: 'transactions'
};

const STATUS = {
  AVAILABLE: 'available',
  CHECKED_OUT: 'checked-out',
  MAINTENANCE: 'maintenance',
  RETIRED: 'retired'
};
```

### Emojis for Logging

- ✅ Success
- ❌ Error
- ⚠️ Warning
- 🔧 Maintenance/Debug
- 📦 Data operation
- 🔐 Security/Auth
- 🚀 Deployment

## Notes

- Keep code modular and reusable
- Follow DRY (Don't Repeat Yourself)
- Write self-documenting code with clear variable names
- Comment complex logic, not obvious code
- Performance matters - optimize queries and reduce re-renders
- User experience is paramount - fast, responsive, intuitive
