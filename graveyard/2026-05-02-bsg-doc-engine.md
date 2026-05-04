---
tags: [graveyard, tombstone, claude-code, oasys-web]
project: oasys-web
date: 2026-05-02
duration: short
type: tombstone
---

# BSG Document Generation Engine

**Status at death**: Functional document generation system with CLI support, but still using hardcoded test data

## What we did
- Modified `generateDoc.js` to support command-line arguments (--id, --template, --output)
- Successfully generated test documents for Plaza 13 (Francisco García Yuste, NIF 03833458W)
- Created standalone invoice files in `assets/legal/generated/paco/`
- Added automatic directory creation for output paths
- Tested dynamic document generation with custom parameters

## Where it went wrong
- Initial script didn't parse CLI arguments - had to be modified mid-session
- Git not available in environment (git command not found)
- Script still uses hardcoded Paco data as base instead of database integration
- No input validation or error handling for missing templates

## Unfinished business
- **Database integration**: Script needs to fetch real plaza data from Supabase instead of using hardcoded `pacoData`
- **Input validation**: Add checks for valid template names, required parameters, and data completeness
- **Error handling**: Improve error messages for missing templates, invalid paths, and malformed data
- **Template expansion**: Consider adding more document types beyond agreements and invoices
- **Testing**: Extensive testing with different plaza IDs and edge cases

## Key files touched
- C:\Users\amyus\Documents\oasys-web\generateDoc.js
- C:\Users\amyus\Documents\oasys-web\assets\legal\generated\paco\Factura_Paco_Standalone.md
- C:\Users\amyus\Documents\oasys-web\assets\legal\generated\paco\Factura_Final.md
- C:\Users\amyus\Documents\oasys-web\assets\legal\generated\paco\Factura_BSG_2026_013.md