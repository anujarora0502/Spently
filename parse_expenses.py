import re
import uuid
import sys

# Read the log file
log_path = '/Users/anuj/.gemini/antigravity/brain/afa2fba7-d653-4007-86b0-a27ec2938046/.system_generated/logs/overview.txt'
try:
    with open(log_path, 'r') as f:
        content = f.read()
except FileNotFoundError:
    print(f"Could not find log file at {log_path}")
    sys.exit(1)

# Find the latest user request with the data
# The user request starts with "Giving you all data generate the query -"
match = re.search(r'Giving you all data generate the query -\s*(.*?)</USER_REQUEST>', content, re.DOTALL)
if not match:
    print("Could not find the data block in the log.")
    sys.exit(1)

data_block = match.group(1)

# Format the SQL insert statements
sql_statements = []
sql_statements.append("DO $$")
sql_statements.append("DECLARE")
sql_statements.append("  -- REPLACE THE STRING BELOW WITH YOUR ACTUAL USER ID FROM SUPABASE AUTHENTICATION")
sql_statements.append("  my_user_id UUID := '141e8f7c-0f1a-49ad-bca0-7d59b982a11e';")
sql_statements.append("BEGIN")
sql_statements.append("  INSERT INTO expenses (user_id, amount, date, category, item) VALUES")

values = []
for line in data_block.split('\n'):
    parts = line.split('\t')
    if len(parts) >= 3 and parts[0].strip().isdigit():
        amount = parts[0].strip()
        date_str = parts[1].strip()
        category = parts[2].strip()
        item = parts[3].strip() if len(parts) >= 4 and parts[3].strip() else category
        
        # Convert date from M/D/YYYY to YYYY-MM-DD
        try:
            m, d, y = date_str.split('/')
            formatted_date = f"{y}-{int(m):02d}-{int(d):02d}"
            
            # Escape single quotes in category and item
            category = category.replace("'", "''")
            item = item.replace("'", "''")
            
            values.append(f"  (my_user_id, {amount}, '{formatted_date}', '{category}', '{item}')")
        except Exception as e:
            pass

sql_statements.append(",\n".join(values) + ";")
sql_statements.append("END $$;")

with open('bulk_import.sql', 'w') as f:
    f.write("\n".join(sql_statements))

print(f"Successfully wrote {len(values)} records to bulk_import.sql")
