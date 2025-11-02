# Fix Gear Types - Categories & Sizes

## Purpose

This script validates and fixes gear types that have missing or invalid:
- **Categories** (must be: footwear, protective, sticks, clothing, accessories)
- **Size Types** (must be: numeric, alpha, custom, none)
- **Size Options** (must have options if `requiresSize` is true)

## How to Use

1. **Open the script** in your browser:
   ```
   scripts/fix-gear-types-validation.html
   ```

2. **Analyze**: Click "🔍 Analyze Gear Types" to scan all gear types in the database

3. **Review Issues**: Check the "Issues Found" section to see what needs fixing

4. **Fix**: Click "🔧 Fix All Issues" to automatically fix all problems

## What It Fixes

### Categories
The script intelligently infers categories based on gear type names:
- **footwear**: Skates
- **protective**: Pads, helmets, armour, guards, visors, cages, gloves, pants
- **sticks**: Hockey sticks
- **clothing**: Jerseys, socks
- **accessories**: Everything else (bags, tape, etc.)

### Size Types
The script infers appropriate size types:
- **numeric**: Skates (6.0, 6.5, 7.0, etc.)
- **alpha**: Most protective gear and clothing (XS, S, M, L, XL, XXL)
- **custom**: Gloves (inches), sticks (flex/length), goalie gear
- **none**: Items that don't require sizing

### Size Options
The script adds default size options based on the gear type:
- **Skates**: 6.0, 6.5, 7.0... up to 13.0
- **Alpha sizes**: XS, S, M, L, XL, XXL (or youth variants)
- **Gloves**: 12", 13", 14", 15"
- **Sticks**: Youth 46", Junior 52", Intermediate 54", Senior 56"/57"/58"
- **Goalie Pads**: 26", 28", 30", 32", 34", 36"
- **Goalie Gloves/Blockers**: Junior, Intermediate, Senior

## Example Fixes

### Before:
```
Goalie Pads - Jr
  Category: equipment (invalid)
  Size Type: undefined (invalid)
  Size Options: 0 options (missing)
```

### After:
```
Goalie Pads - Jr
  Category: protective ✅
  Size Type: custom ✅
  Size Options: 26", 28", 30", 32", 34", 36" ✅
```

## Safety

- ✅ **Non-destructive**: Only updates invalid fields
- ✅ **Preserves data**: Doesn't change valid categories or size options
- ✅ **Logged**: All changes are logged with before/after values
- ✅ **Reversible**: Changes can be manually reverted if needed

## When to Use

Run this script when:
- Setting up a new installation
- Importing gear types from external sources
- After manual edits that might have introduced inconsistencies
- Noticing gear types with "0 sizes" in the UI

## Technical Details

**Validation Rules:**
1. Category must be in: `['footwear', 'protective', 'sticks', 'accessories', 'clothing']`
2. Size Type must be in: `['numeric', 'alpha', 'custom', 'none']`
3. If `requiresSize === true`, must have at least 1 size option

**Inference Logic:**
- Categories inferred from keywords in the gear type name
- Size types inferred from the type of equipment
- Size options based on standard hockey equipment sizing conventions
