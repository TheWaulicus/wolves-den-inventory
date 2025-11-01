/**
 * Default Hockey Gear Types
 * Pre-configured equipment categories for Ice Zoo Wolves
 */

const DEFAULT_GEAR_TYPES = [
  {
    id: 'skates',
    name: 'Skates',
    category: 'footwear',
    icon: '⛸️',
    description: 'Ice hockey skates',
    requiresSize: true,
    sizeType: 'numeric',
    sizeOptions: ['6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0', '9.5', '10.0', '10.5', '11.0', '11.5', '12.0', '12.5', '13.0'],
    sortOrder: 1,
    isActive: true
  },
  {
    id: 'helmet',
    name: 'Helmet',
    category: 'protective',
    icon: '🪖',
    description: 'Hockey helmet with cage or visor',
    requiresSize: true,
    sizeType: 'alpha',
    sizeOptions: ['XS', 'S', 'M', 'L', 'XL'],
    sortOrder: 2,
    isActive: true
  },
  {
    id: 'shoulder-pads',
    name: 'Shoulder Pads',
    category: 'protective',
    icon: '🦺',
    description: 'Upper body protective gear',
    requiresSize: true,
    sizeType: 'alpha',
    sizeOptions: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    sortOrder: 3,
    isActive: true
  },
  {
    id: 'elbow-pads',
    name: 'Elbow Pads',
    category: 'protective',
    icon: '🛡️',
    description: 'Elbow protection',
    requiresSize: true,
    sizeType: 'alpha',
    sizeOptions: ['S', 'M', 'L', 'XL'],
    sortOrder: 4,
    isActive: true
  },
  {
    id: 'gloves',
    name: 'Hockey Gloves',
    category: 'protective',
    icon: '🧤',
    description: 'Protective gloves',
    requiresSize: true,
    sizeType: 'numeric',
    sizeOptions: ['12"', '13"', '14"', '15"'],
    sortOrder: 5,
    isActive: true
  },
  {
    id: 'shin-guards',
    name: 'Shin Guards',
    category: 'protective',
    icon: '🦿',
    description: 'Lower leg protection',
    requiresSize: true,
    sizeType: 'numeric',
    sizeOptions: ['12"', '13"', '14"', '15"', '16"', '17"'],
    sortOrder: 6,
    isActive: true
  },
  {
    id: 'pants',
    name: 'Hockey Pants',
    category: 'protective',
    icon: '👖',
    description: 'Protective pants with padding',
    requiresSize: true,
    sizeType: 'alpha',
    sizeOptions: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    sortOrder: 7,
    isActive: true
  },
  {
    id: 'stick',
    name: 'Hockey Stick',
    category: 'sticks',
    icon: '🏒',
    description: 'Hockey stick - various flexes and curves',
    requiresSize: true,
    sizeType: 'custom',
    sizeOptions: ['Youth 46"', 'Junior 52"', 'Intermediate 54"', 'Senior 56"', 'Senior 57"', 'Senior 58"'],
    sortOrder: 8,
    isActive: true
  },
  {
    id: 'jersey',
    name: 'Game Jersey',
    category: 'clothing',
    icon: '👕',
    description: 'Official team game jersey',
    requiresSize: true,
    sizeType: 'alpha',
    sizeOptions: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    sortOrder: 9,
    isActive: true
  },
  {
    id: 'practice-jersey',
    name: 'Practice Jersey',
    category: 'clothing',
    icon: '👔',
    description: 'Practice jersey or pinnie',
    requiresSize: true,
    sizeType: 'alpha',
    sizeOptions: ['XS', 'S', 'M', 'L', 'XL'],
    sortOrder: 10,
    isActive: true
  },
  {
    id: 'bag',
    name: 'Equipment Bag',
    category: 'accessories',
    icon: '🎒',
    description: 'Bag for carrying equipment',
    requiresSize: false,
    sizeType: 'none',
    sizeOptions: [],
    sortOrder: 11,
    isActive: true
  },
  {
    id: 'tape',
    name: 'Hockey Tape',
    category: 'accessories',
    icon: '📦',
    description: 'Stick tape and accessory tape',
    requiresSize: false,
    sizeType: 'none',
    sizeOptions: [],
    sortOrder: 12,
    isActive: true
  },
  {
    id: 'goalie-pads',
    name: 'Goalie Leg Pads',
    category: 'protective',
    icon: '🥅',
    description: 'Goaltender leg pads',
    requiresSize: true,
    sizeType: 'custom',
    sizeOptions: ['26"', '28"', '30"', '32"', '34"', '36"'],
    sortOrder: 13,
    isActive: true
  },
  {
    id: 'goalie-glove',
    name: 'Goalie Catch Glove',
    category: 'protective',
    icon: '🧤',
    description: 'Goaltender catching glove',
    requiresSize: true,
    sizeType: 'custom',
    sizeOptions: ['Junior', 'Intermediate', 'Senior'],
    sortOrder: 14,
    isActive: true
  },
  {
    id: 'goalie-blocker',
    name: 'Goalie Blocker',
    category: 'protective',
    icon: '🛡️',
    description: 'Goaltender blocker',
    requiresSize: true,
    sizeType: 'custom',
    sizeOptions: ['Junior', 'Intermediate', 'Senior'],
    sortOrder: 15,
    isActive: true
  }
];

/**
 * Get category display information
 */
const GEAR_CATEGORIES = {
  footwear: {
    name: 'Footwear',
    icon: '👟',
    color: '#3b82f6'
  },
  protective: {
    name: 'Protective Gear',
    icon: '🛡️',
    color: '#22c55e'
  },
  sticks: {
    name: 'Sticks',
    icon: '🏒',
    color: '#f59e0b'
  },
  clothing: {
    name: 'Clothing',
    icon: '👕',
    color: '#8b5cf6'
  },
  accessories: {
    name: 'Accessories',
    icon: '📦',
    color: '#6b7280'
  }
};

/**
 * Initialize default gear types in Firestore
 * @param {Object} gearTypeService - GearTypeService instance
 * @returns {Promise<number>} Number of types created
 */
async function initializeDefaultGearTypes(gearTypeService) {
  console.log('🔧 Initializing default gear types...');
  
  let createdCount = 0;
  
  for (const typeData of DEFAULT_GEAR_TYPES) {
    try {
      // Check if type already exists
      const existing = await gearTypeService.getById(typeData.id);
      
      if (!existing) {
        const gearType = new GearType(typeData);
        await gearTypeService.createWithId(typeData.id, gearType);
        createdCount++;
        console.log(`✅ Created gear type: ${typeData.name}`);
      } else {
        console.log(`⏭️ Gear type already exists: ${typeData.name}`);
      }
    } catch (error) {
      console.error(`❌ Error creating gear type ${typeData.name}:`, error);
    }
  }
  
  console.log(`✅ Initialized ${createdCount} gear types`);
  return createdCount;
}

/**
 * Get gear types grouped by category
 */
function getGearTypesByCategory() {
  const grouped = {};
  
  DEFAULT_GEAR_TYPES.forEach(type => {
    if (!grouped[type.category]) {
      grouped[type.category] = [];
    }
    grouped[type.category].push(type);
  });
  
  return grouped;
}

/**
 * Get size options for a specific gear type
 */
function getSizeOptionsForType(typeId) {
  const type = DEFAULT_GEAR_TYPES.find(t => t.id === typeId);
  return type ? type.sizeOptions : [];
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.DEFAULT_GEAR_TYPES = DEFAULT_GEAR_TYPES;
  window.GEAR_CATEGORIES = GEAR_CATEGORIES;
  window.initializeDefaultGearTypes = initializeDefaultGearTypes;
  window.getGearTypesByCategory = getGearTypesByCategory;
  window.getSizeOptionsForType = getSizeOptionsForType;
}
