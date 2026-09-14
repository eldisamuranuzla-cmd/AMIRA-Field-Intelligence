# AMIRA — Afdeling Material & Rawat Intelligence

POC frontend for plantation rawat field intelligence, maintained as a separate repository from Adriana V24.

## Correct GitHub Pages structure

```text
AMIRA-Field-Intelligence/
├── index.html
├── .nojekyll
├── assets/
│   ├── style.css
│   ├── amira-logo.svg
│   ├── plantation-banner.svg
│   └── field-map.svg
└── js/
    ├── amira-core.js
    ├── csv-parser.js
    └── dashboard.js
```

The site uses relative paths so it works under a GitHub Pages project URL.

## Data foundation

- Master Rawat = foundation for JOBCODE, job description, UOM and material mapping.
- Amanda Rawat CSV = actual field transaction engine.
- Workstreams: CPT, WDC, WDM, CWC.
- Dashboard indicators: transactions, unique workers/HK, evidence, GPS, workstream, block and material mapping.
- CSV files are processed locally in the browser and are not stored in this repository.

## Usage

1. Open the deployed AMIRA page.
2. Click **Upload Amanda CSV**.
3. Select the **Master Rawat CSV** first.
4. Select the Amanda Rawat CSV files.
5. The POC parses the files locally and updates the dashboard.

## Important

The repository is intentionally separate from Adriana V24. Adriana is an architecture/reference pattern, not a data source.
