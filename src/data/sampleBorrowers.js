/**
 * Sample Borrower Data
 * Pre-populated borrowers for testing and demo
 */

const SAMPLE_BORROWERS = [
  // Players
  {
    id: 'borrower-001',
    firstName: 'Alex',
    lastName: 'Thompson',
    email: 'alex.thompson@icezoo.com',
    phone: '555-0101',
    teamRole: 'player',
    jerseyNumber: '10',
    status: 'active'
  },
  {
    id: 'borrower-002',
    firstName: 'Jordan',
    lastName: 'Martinez',
    email: 'jordan.martinez@icezoo.com',
    phone: '555-0102',
    teamRole: 'player',
    jerseyNumber: '15',
    status: 'active'
  },
  {
    id: 'borrower-003',
    firstName: 'Casey',
    lastName: 'Williams',
    email: 'casey.williams@icezoo.com',
    phone: '555-0103',
    teamRole: 'player',
    jerseyNumber: '7',
    status: 'active'
  },
  {
    id: 'borrower-004',
    firstName: 'Morgan',
    lastName: 'Johnson',
    email: 'morgan.johnson@icezoo.com',
    phone: '555-0104',
    teamRole: 'player',
    jerseyNumber: '22',
    status: 'active'
  },
  {
    id: 'borrower-005',
    firstName: 'Taylor',
    lastName: 'Brown',
    email: 'taylor.brown@icezoo.com',
    phone: '555-0105',
    teamRole: 'player',
    jerseyNumber: '9',
    status: 'active'
  },
  {
    id: 'borrower-006',
    firstName: 'Sam',
    lastName: 'Davis',
    email: 'sam.davis@icezoo.com',
    phone: '555-0106',
    teamRole: 'player',
    jerseyNumber: '18',
    status: 'active'
  },
  {
    id: 'borrower-007',
    firstName: 'Riley',
    lastName: 'Miller',
    email: 'riley.miller@icezoo.com',
    phone: '555-0107',
    teamRole: 'player',
    jerseyNumber: '3',
    status: 'active'
  },
  {
    id: 'borrower-008',
    firstName: 'Jamie',
    lastName: 'Wilson',
    email: 'jamie.wilson@icezoo.com',
    phone: '555-0108',
    teamRole: 'player',
    jerseyNumber: '27',
    status: 'active'
  },
  // Coaches
  {
    id: 'borrower-009',
    firstName: 'Chris',
    lastName: 'Anderson',
    email: 'chris.anderson@icezoo.com',
    phone: '555-0201',
    teamRole: 'coach',
    jerseyNumber: '',
    status: 'active',
    notes: 'Head Coach'
  },
  {
    id: 'borrower-010',
    firstName: 'Pat',
    lastName: 'Taylor',
    email: 'pat.taylor@icezoo.com',
    phone: '555-0202',
    teamRole: 'coach',
    jerseyNumber: '',
    status: 'active',
    notes: 'Assistant Coach'
  },
  // Staff
  {
    id: 'borrower-011',
    firstName: 'Drew',
    lastName: 'Moore',
    email: 'drew.moore@icezoo.com',
    phone: '555-0301',
    teamRole: 'staff',
    jerseyNumber: '',
    status: 'active',
    notes: 'Equipment Manager'
  },
  {
    id: 'borrower-012',
    firstName: 'Avery',
    lastName: 'Jackson',
    email: 'avery.jackson@icezoo.com',
    phone: '555-0302',
    teamRole: 'staff',
    jerseyNumber: '',
    status: 'active',
    notes: 'Team Manager'
  }
];

// Export
if (typeof window !== 'undefined') {
  window.SAMPLE_BORROWERS = SAMPLE_BORROWERS;
}
