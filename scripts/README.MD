# JSON Export from Oracle SQL

This project demonstrates how to normalize housing data into relational tables and export it as a JSON file using Oracle SQL features like `JSON_OBJECT` and `JSON_ARRAYAGG`.

## How to Export the JSON File

Follow these steps to create the tables and export the data to a file:

### 1. Open your terminal and go to the project root

```bash
cd path/to/your/project-root

example: cd C:\Users\YourName\Repository\cst8276_advance_db_orcl_json_js
```
### 2. Log into your Oracle SQL account
```bash
sqlplus your_user/your_password@your_db
```

### 3. Create the tables and insert dummy data
At the SQL prompt, run:
```bash
@"scripts/create-multiple-tables.sql"
```

### 4. Export the JSON file
Still at the SQL prompt, run:
```bash
@"scripts/export_json_output.sql"
```
This will create the file: data/json_output.json

