AMIRA V31 — Engine 05 Material Balance Fix

Main rule:
1. Engine 05 / T_MATERIAL is the ONLY source of Actual material usage for Material Balance.
2. Engine 06 / Base Racun is lookup/reference only.
3. Balance rows are created ONLY when actual material exists in Engine 05.
4. For CPT reporting, base is combined by block + prescription subtype: CWC1+PTC1, CWC2+PTC2, CWC3+PTC3, CWC4+PTC4.
5. WDC remains WDC and uses its own WDC1-4 base.
6. A work-only block without material does NOT appear in Material Balance.
7. If actual material exists but cannot be matched to a unique base subtype, actual still appears with NO BASE instead of inventing a prescription.
8. Existing HA/P4/HK, Multi Afdeling, and historical logic are preserved.
