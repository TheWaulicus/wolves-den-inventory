# Scripts Documentation

This document describes the available administrative scripts for the Wolves Den Inventory system.

## Available Scripts

### Reset & Recreate Inventory

**File:** `scripts/reset-and-recreate-inventory.html`

**Purpose:** Complete database reset and recreation from scratch with accurate inventory data.

**Use Cases:**
- Initial setup with clean data
- Fixing corrupted or inconsistent inventory
- Starting fresh after major data issues

**How to Use:**

1. **Open the script** in your browser:
   ```
   http://localhost:5000/scripts/reset-and-recreate-inventory.html
   ```

2. **Sign in** with admin credentials

3. **Follow the 3-step process:**
   - **Step 1: Delete All Data** - Removes all gear items, types, transactions, and borrowers (requires typing "YES")
   - **Step 2: Create Gear Types** - Creates fresh gear types with correct categories and sizes
   - **Step 3: Create Gear Items** - Creates individual items based on inventory counts

**Safety Features:**
- ⚠️ Requires double confirmation before deletion
- 🔐 Admin authentication required
- 📊 Progress tracking for each step
- 📝 Detailed logging of all operations

**What Gets Created:**
- Junior, Senior, and Goalie gear types (distinct categories)
- Proper size options for each type
- Individual items for each piece of equipment
- Accurate counts matching actual inventory

### Firebase Deployment Script

**File:** `scripts/firebase-deploy.sh`

**Purpose:** Automated deployment script for Firebase hosting and rules.

**How to Use:**

```bash
cd scripts
./firebase-deploy.sh
```

**What It Does:**
- Deploys Firestore security rules
- Deploys Storage security rules  
- Deploys Firebase Hosting
- Shows deployment status and URLs

## Data Structure Reference

### Gear Type Categories
- **footwear**: Skates
- **protective**: Pads, helmets, armour, guards, visors, cages, gloves, pants
- **sticks**: Hockey sticks
- **clothing**: Jerseys, socks
- **accessories**: Bags, tape, etc.

### Size Options by Type

**Player Gear (Junior & Senior):**
- Chest Armour: Small, Medium, Large, X-Large
- Hockey Pants: Small, Medium, Large, X-Large
- Elbows: Small, Medium, Large

**Goalie Gear:**
- Chest Armour (Senior/Int/Jr): Small, Medium, Large, X-Large, No Size
- Goalie Pants: Small, Medium, Large, X-Large
- Goalie Helmets: One Size
- Goalie Pads - Jr: 26" + 1"

**Shared Equipment:**
- Shin Pads: 10" through 17"
- Hockey Skates: 1, 2, 2.5, 3, 4, 6, 7, 7.5, 9.5, plus goalie sizes
- Gloves: 11" through 15"
- Helmets (Youth/Adult): Small, Medium, Large
- Metal Cages: One Size
- Clear Visor: One Size

## Best Practices

1. **Always backup** before running any administrative scripts
2. **Test in development** before running in production
3. **Review logs** after script execution
4. **Verify data** after major changes
5. **Keep authentication credentials secure**
