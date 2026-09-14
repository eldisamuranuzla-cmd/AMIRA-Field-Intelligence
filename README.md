# AMIRA — Afdeling Material & Rawat Intelligence

POC frontend inspired by the architecture and interaction pattern of Adriana V24, but maintained as a separate repository.

## Data foundation
- Master Rawat = foundation for JOBCODE, job description, UOM, material and rules.
- Three Amanda Rawat CSV files = actual field transaction engine.
- Browser-side parsing and calculation; operational CSV files are not stored in the repository.

## Flow
Master Rawat → JOBCODE mapping → Amanda Rawat → CPT/WDC/WDM/CWC → HK / transaction / material / block / GPS / evidence → dashboard.

## Usage
1. Open `index.html` or deploy through GitHub Pages.
2. Click **Upload Amanda CSV**.
3. Select the Master Rawat CSV first.
4. Select the three Amanda Rawat CSV files.
5. The POC processes the data locally in the browser.

## Note
The repository is intentionally separate from Adriana V24. Adriana is an architecture/reference pattern, not a data source.
