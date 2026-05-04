---
tags: [graveyard, tombstone, claude-code, oasys-web]
project: oasys-web
date: 2026-05-03
duration: short
type: tombstone
---

# NIF Validation Added

**Status at death**: Document generation system with NIF validation preventing incomplete documents

## What we did
- Checked database for plazas without NIF (found 48 plazas without NIF, which is expected)
- Added NIF validation logic to getPlazaData() function in generateDoc.js
- Implemented abort mechanism for plazas missing NIF to prevent null documents
- Tested validation with Plaza 1 (no NIF) - correctly aborts
- Tested validation with Plaza 13 (has NIF) - successfully generates document

## Where it went wrong
- Initial query syntax was incorrect (or() vs is() for null checks)
- No significant issues - validation implementation was straightforward

## Unfinished business
- **Additional validations**: Consider adding validation for other required fields (nombre_fundador, email, etc.)
- **Error messages**: Improve user-facing error messages for different validation failures
- **Batch operations**: Consider adding batch document generation for multiple plazas
- **Template expansion**: Add more document types beyond agreements and invoices

## Key files touched
- C:\Users\amyus\Documents\oasys-web\generateDoc.js
- C:\Users\amyus\Documents\oasys-web\assets\legal\generated\test\Factura_Con_NIF.md