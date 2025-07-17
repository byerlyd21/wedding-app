# Scripts

This directory contains utility scripts for the wedding app.

## Address Parser (`address_parse.py`)

A Python script for parsing and formatting address data from various CSV formats.

### Usage

```bash
python scripts/address_parse.py input_file.csv [mode]
```

### Modes

- **clean** (default): Process clean, well-formatted CSV files
- **messy**: Process CSV files with inconsistent formatting
- **zazzle**: Process tab-separated files from Zazzle with specific address formatting

### Examples

```bash
# Process a clean CSV file
python scripts/address_parse.py addresses.csv

# Process a messy CSV file
python scripts/address_parse.py messy_addresses.csv messy

# Process a Zazzle export file
python scripts/address_parse.py zazzle_export.csv zazzle
```

### Output

The script generates a `formatted_addresses.csv` file with standardized address fields:

- Full Name
- Country
- Company
- Address 1
- Address 2 (e.g. Unit #)
- Address 3
- City
- State
- Zip Code
- Phone Number
- Email

### Requirements

- Python 3.6+
- Standard library modules: `csv`, `json`, `sys`, `os`, `re` 