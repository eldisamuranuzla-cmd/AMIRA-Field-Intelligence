AMIRA V30 — CPT + History Bug Fix

Fixes:
1. Material Balance: CPT is now the reporting family. Base for CPT pairs the same prescription subtype: CWC1 + PTC1, CWC2 + PTC2, etc. Actual CWC/PTC material is reconciled together.
2. Realisasi per Blok: racun is shown only when actual material exists; jobs without racun show — instead of 0.
3. Akumulasi Pekerjaan: active locked dataset is included once in Multi Afdeling accumulation, so the active block (including OC017) appears.
4. Historical save: deterministic date+afdeling dataset ID, clearer save error handling, and historical raw/master payloads are stored as Blob in IndexedDB to reduce storage pressure. Same date + different afdeling remains separate.

Important:
- History in this build is still browser-local IndexedDB. It is NOT yet cross-device cloud history.
- Supabase integration requires a separate cloud configuration/table and should not use a secret key in this static frontend.
