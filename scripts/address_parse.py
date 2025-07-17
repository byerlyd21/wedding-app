import csv
import json
import sys
import os
import re

def parse_zazzle_address_block(address_block):
    lines = [line.strip() for line in address_block.split('\n') if line.strip()]
    if len(lines) < 2:
        return None  # not enough lines

    address_1 = lines[0]
    city_state_zip = lines[1]

    # Match city, full state name, ZIP
    match = re.match(r'^(.*?),\s*([A-Za-z\s]+)\s+(\d{5}(?:-\d{4})?)$', city_state_zip)
    if not match:
        return None

    city, state, zip_code = match.groups()
    state = state.strip().title()
    return {
        "Address 1": address_1,
        "City": city.title(),
        "State": state,
        "Zip Code": zip_code
    }


def process_zazzle_csv(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8-sig', newline='') as infile, \
         open(output_file, 'w', encoding='utf-8', newline='') as outfile:

        lines = infile.read().splitlines()
        writer = csv.DictWriter(outfile, fieldnames=[
            'Full Name', 'Country', 'Company',
            'Address 1', 'Address 2 (e.g. Unit #)', 'Address 3',
            'City', 'State', 'Zip Code',
            'Phone Number', 'Email'
        ])
        writer.writeheader()

        header = lines[0].split('\t')
        current_name = None
        current_address_lines = []

        for line in lines[1:]:
            if '\t' in line:
                # New record
                if current_name and current_address_lines:
                    address_block = '\n'.join(current_address_lines)
                    parsed = parse_zazzle_address_block(address_block)
                    if parsed:
                        writer.writerow({
                            'Full Name': current_name,
                            'Country': 'United States',
                            'Company': '',
                            'Address 1': parsed['Address 1'],
                            'Address 2 (e.g. Unit #)': '',
                            'Address 3': '',
                            'City': parsed['City'],
                            'State': parsed['State'],
                            'Zip Code': parsed['Zip Code'],
                            'Phone Number': '',
                            'Email': ''
                        })
                    else:
                        print(f"⚠️ Skipping unparseable address for: {current_name}")
                # Start new record
                parts = line.split('\t')
                current_name = parts[0].strip()
                current_address_lines = [parts[1].strip()]
            else:
                # Continuation of address
                current_address_lines.append(line.strip())

        # Handle last entry
        if current_name and current_address_lines:
            address_block = '\n'.join(current_address_lines)
            parsed = parse_zazzle_address_block(address_block)
            if parsed:
                writer.writerow({
                    'Full Name': current_name,
                    'Country': 'United States',
                    'Company': '',
                    'Address 1': parsed['Address 1'],
                    'Address 2 (e.g. Unit #)': '',
                    'Address 3': '',
                    'City': parsed['City'],
                    'State': parsed['State'],
                    'Zip Code': parsed['Zip Code'],
                    'Phone Number': '',
                    'Email': ''
                })
            else:
                print(f"⚠️ Skipping unparseable address for: {current_name}")


def process_messy_csv(input_file, output_file):
    """Process messy CSV files with inconsistent formatting"""
    with open(input_file, 'r', encoding='utf-8-sig', newline='') as infile, \
         open(output_file, 'w', encoding='utf-8', newline='') as outfile:
        
        writer = csv.DictWriter(outfile, fieldnames=[
            'Full Name', 'Country', 'Company',
            'Address 1', 'Address 2 (e.g. Unit #)', 'Address 3',
            'City', 'State', 'Zip Code',
            'Phone Number', 'Email'
        ])
        writer.writeheader()
        
        reader = csv.DictReader(infile)
        for row in reader:
            # Basic cleaning and standardization
            writer.writerow({
                'Full Name': row.get('Full Name', '').strip(),
                'Country': 'United States',
                'Company': row.get('Company', '').strip(),
                'Address 1': row.get('Address 1', '').strip(),
                'Address 2 (e.g. Unit #)': row.get('Address 2 (e.g. Unit #)', '').strip(),
                'Address 3': row.get('Address 3', '').strip(),
                'City': row.get('City', '').strip().title(),
                'State': row.get('State', '').strip().title(),
                'Zip Code': row.get('Zip Code', '').strip(),
                'Phone Number': row.get('Phone Number', '').strip(),
                'Email': row.get('Email', '').strip()
            })


def process_clean_csv(input_file, output_file):
    """Process clean JSON-formatted CSV files"""
    with open(input_file, 'r', encoding='utf-8-sig', newline='') as infile, \
         open(output_file, 'w', encoding='utf-8', newline='') as outfile:
        
        writer = csv.DictWriter(outfile, fieldnames=[
            'Full Name', 'Country', 'Company',
            'Address 1', 'Address 2 (e.g. Unit #)', 'Address 3',
            'City', 'State', 'Zip Code',
            'Phone Number', 'Email'
        ])
        writer.writeheader()
        
        reader = csv.DictReader(infile)
        for row in reader:
            writer.writerow({
                'Full Name': row.get('Full Name', ''),
                'Country': row.get('Country', 'United States'),
                'Company': row.get('Company', ''),
                'Address 1': row.get('Address 1', ''),
                'Address 2 (e.g. Unit #)': row.get('Address 2 (e.g. Unit #)', ''),
                'Address 3': row.get('Address 3', ''),
                'City': row.get('City', ''),
                'State': row.get('State', ''),
                'Zip Code': row.get('Zip Code', ''),
                'Phone Number': row.get('Phone Number', ''),
                'Email': row.get('Email', '')
            })


def process_name_address_csv(input_file, output_file):
    """Process CSVs with columns 'name' and 'mailing_address' (address may contain newlines)"""
    with open(input_file, 'r', encoding='utf-8-sig', newline='') as infile, \
         open(output_file, 'w', encoding='utf-8', newline='') as outfile:
        reader = csv.DictReader(infile)
        writer = csv.DictWriter(outfile, fieldnames=[
            'Full Name', 'Country', 'Company',
            'Address 1', 'Address 2 (e.g. Unit #)', 'Address 3',
            'City', 'State', 'Zip Code',
            'Phone Number', 'Email'
        ])
        writer.writeheader()
        for row in reader:
            name = row.get('name', '').strip()
            address_block = row.get('mailing_address', '').strip()
            parsed = parse_zazzle_address_block(address_block)
            if parsed:
                writer.writerow({
                    'Full Name': name,
                    'Country': 'United States',
                    'Company': '',
                    'Address 1': parsed['Address 1'],
                    'Address 2 (e.g. Unit #)': '',
                    'Address 3': '',
                    'City': parsed['City'],
                    'State': parsed['State'],
                    'Zip Code': parsed['Zip Code'],
                    'Phone Number': '',
                    'Email': ''
                })
            else:
                print(f"⚠️ Skipping unparseable address for: {name}")


def main():
    if len(sys.argv) not in [2, 3]:
        print("Usage:\n  python address_parse.py input_file.csv [messy|zazzle|nameaddress]")
        sys.exit(1)

    input_file = sys.argv[1]
    mode = sys.argv[2].lower() if len(sys.argv) == 3 else "clean"

    if not os.path.isfile(input_file):
        print(f"❌ File not found: {input_file}")
        sys.exit(1)

    output_file = "formatted_addresses.csv"

    if mode == "messy":
        print("🔍 Using messy parser...")
        process_messy_csv(input_file, output_file)
    elif mode == "zazzle":
        print("🎁 Using Zazzle formatter...")
        process_zazzle_csv(input_file, output_file)
    elif mode == "nameaddress":
        print("📬 Using name/address CSV parser...")
        process_name_address_csv(input_file, output_file)
    else:
        print("🧼 Using clean JSON parser...")
        process_clean_csv(input_file, output_file)

    print(f"✅ Done! Output saved to: {output_file}")

if __name__ == '__main__':
    main() 