AMIRA V31 — Engine 05 Material Allocation + Engine 07 Balance Fix

Engine 05:
- T_MATERIAL remains the sole actual material source.
- When T_MATERIAL has no block field, material quantity is allocated across the related SIC blocks using proportional P4 contribution.
- Total allocated quantity remains exactly equal to the original T_MATERIAL quantity.
- All actual material-containing blocks can appear in Material Usage.

Engine 06 / Engine 07:
- Base is prescription only.
- CPT reporting combines CWC + Path Chemist + TPH Chemist.
- CPT base combines matching CWC + PTC subtype (CWC1 + PTC1, etc.).
- WDC remains independent.
- Material Balance starts from actual Engine 05 rows; no actual material means no Balance row.

History:
- Existing date + afdeling historical logic retained.
