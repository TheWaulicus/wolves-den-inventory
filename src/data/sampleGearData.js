/**
 * Sample Gear Data
 * Pre-populated gear items for testing and demo
 */

const SAMPLE_GEAR_DATA = [
  {
    gearType: 'skates',
    brand: 'Bauer',
    model: 'Vapor X3.5',
    size: '10.0',
    condition: 'good',
    status: 'available',
    description: 'Senior hockey skates',
    location: 'Storage Room A',
    barcode: 'WDI-SKA-001',
    purchaseCost: 299.99
  },
  {
    gearType: 'skates',
    brand: 'CCM',
    model: 'Jetspeed FT2',
    size: '9.5',
    condition: 'new',
    status: 'available',
    description: 'Brand new skates',
    location: 'Storage Room A',
    barcode: 'WDI-SKA-002',
    purchaseCost: 349.99
  },
  {
    gearType: 'helmet',
    brand: 'Bauer',
    model: 'Re-Akt 200',
    size: 'L',
    condition: 'good',
    status: 'checked-out',
    description: 'Helmet with cage',
    location: 'Storage Room B',
    barcode: 'WDI-HEL-001',
    purchaseCost: 199.99
  },
  {
    gearType: 'helmet',
    brand: 'CCM',
    model: 'Tacks 910',
    size: 'M',
    condition: 'good',
    status: 'available',
    description: 'Helmet with visor',
    location: 'Storage Room B',
    barcode: 'WDI-HEL-002',
    purchaseCost: 179.99
  },
  {
    gearType: 'stick',
    brand: 'Bauer',
    model: 'Vapor Hyperlite',
    size: 'Senior 87',
    condition: 'new',
    status: 'available',
    description: '87 flex, P92 curve',
    location: 'Stick Rack',
    barcode: 'WDI-STK-001',
    purchaseCost: 279.99
  },
  {
    gearType: 'stick',
    brand: 'CCM',
    model: 'Ribcor Trigger 6',
    size: 'Senior 85',
    condition: 'good',
    status: 'checked-out',
    description: '85 flex, P29 curve',
    location: 'Stick Rack',
    barcode: 'WDI-STK-002',
    purchaseCost: 249.99
  },
  {
    gearType: 'gloves',
    brand: 'Warrior',
    model: 'Alpha DX',
    size: '14"',
    condition: 'fair',
    status: 'available',
    description: 'Black gloves',
    location: 'Storage Room C',
    barcode: 'WDI-GLV-001',
    purchaseCost: 129.99
  },
  {
    gearType: 'gloves',
    brand: 'Bauer',
    model: 'Supreme 3S',
    size: '14"',
    condition: 'good',
    status: 'available',
    description: 'Navy blue gloves',
    location: 'Storage Room C',
    barcode: 'WDI-GLV-002',
    purchaseCost: 149.99
  },
  {
    gearType: 'pants',
    brand: 'CCM',
    model: 'Tacks AS-V',
    size: 'L',
    condition: 'good',
    status: 'available',
    description: 'Black hockey pants',
    location: 'Storage Room A',
    barcode: 'WDI-PNT-001',
    purchaseCost: 199.99
  },
  {
    gearType: 'shin-guards',
    brand: 'Bauer',
    model: 'Supreme M3',
    size: '15"',
    condition: 'good',
    status: 'maintenance',
    description: 'Needs strap replacement',
    location: 'Maintenance Area',
    barcode: 'WDI-SHN-001',
    purchaseCost: 89.99
  },
  {
    gearType: 'jersey',
    brand: 'Ice Zoo Wolves',
    model: 'Home Jersey',
    size: 'L',
    condition: 'new',
    status: 'available',
    description: 'Blue home jersey #10',
    location: 'Jersey Storage',
    barcode: 'WDI-JER-010',
    purchaseCost: 75.00
  },
  {
    gearType: 'jersey',
    brand: 'Ice Zoo Wolves',
    model: 'Away Jersey',
    size: 'L',
    condition: 'good',
    status: 'checked-out',
    description: 'White away jersey #10',
    location: 'Jersey Storage',
    barcode: 'WDI-JER-110',
    purchaseCost: 75.00
  }
];

/**
 * Initialize sample gear data in service
 */
async function initializeSampleGearData(gearService) {
  console.log('🔧 Loading sample gear data...');
  
  let loadedCount = 0;
  
  for (const itemData of SAMPLE_GEAR_DATA) {
    try {
      const gearItem = new GearItem({
        ...itemData,
        createdBy: 'demo-user'
      });
      
      await gearService.create(gearItem);
      loadedCount++;
    } catch (error) {
      console.error('Error creating sample gear:', error);
    }
  }
  
  console.log(`✅ Loaded ${loadedCount} sample gear items`);
  return loadedCount;
}

// Export
if (typeof window !== 'undefined') {
  window.SAMPLE_GEAR_DATA = SAMPLE_GEAR_DATA;
  window.initializeSampleGearData = initializeSampleGearData;
}
