---
tags: [graveyard, tombstone, claude-code, oasys-web]
project: oasys-web
date: 2026-05-03
duration: short
type: tombstone
---

# Supabase Integration Complete

**Status at death**: Fully operational document generation system with live Supabase database integration

## What we did
- Installed @supabase/supabase-js and dotenv packages for database connectivity
- Created .env file with correct Supabase credentials (URL: brphqjjxnsdalvhgntck, service_role key)
- Modified generateDoc.js to support async/await and Supabase queries
- Added getPlazaData() function to fetch real plaza data from database
- Fixed credential issues (wrong URL format, using ADMIN_SECRET instead of service_role key)
- Successfully connected to Supabase and retrieved Plaza 13 data (Francisco García Yuste)
- Updated Plaza 13 NIF field in database (03833458W)
- Generated definitive invoice BSG-2026-013 with complete data including NIF

## Where it went wrong
- Initial Supabase URL was incorrect (umNfockrByb6vwOIEtpW vs brphqjjxnsdalvhgntck)
- First API key was wrong (ADMIN_SECRET instead of service_role key)
- NIF field was null in database initially, required manual update
- Node.js 18 shows deprecation warnings for Supabase packages (not blocking)

## Unfinished business
- **Input validation**: Add validation for plaza IDs and required fields
- **Error handling**: Improve error messages for missing templates and database errors
- **Template expansion**: Consider adding more document types beyond agreements and invoices
- **Testing**: Test with other plaza IDs to ensure system robustness
- **Node upgrade**: Consider upgrading to Node.js 20+ to eliminate deprecation warnings

## Key files touched
- C:\Users\amyus\Documents\oasys-web\generateDoc.js
- C:\Users\amyus\Documents\oasys-web\.env
- C:\Users\amyus\Documents\oasys-web\package.json
- C:\Users\amyus\Documents\oasys-web\assets\legal\generated\paco\Factura_Definitiva.md