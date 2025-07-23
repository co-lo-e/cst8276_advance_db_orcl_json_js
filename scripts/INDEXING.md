# Indexing in JSON


# Setup.

### 1. Open your terminal and go to the project root

```bash
cd path/to/your/project-root

example: cd C:\Users\YourName\Repository\cst8276_advance_db_orcl_json_js
```

### 2. Log into your Oracle SQL account

```bash
sqlplus your_user/your_password@your_db
```

### 3. Performance explain plan before indexing

#### 3.1 function-based index 
```bash
@"scripts/output-function-based-index-xplan.sql"
```

#### 3.2 search index 
```bash
@"scripts/output-search-index-xplan.sql"
```
---
### 4. Create indexes

#### 4.1 function-based index 
At the SQL prompt, run:

```bash
@"scripts/create-function-based-index.sql"
```

#### 4.2 function-based index 
At the SQL prompt, run:

```bash
@"scripts/create-search-index.sql"
```
----
### 5. Performance explain plan after indexing

#### 3.1 function-based index 
```bash
@"scripts/output-function-based-index-xplan.sql"
```

#### 3.2 search index 
```bash
@"scripts/output-search-index-xplan.sql"
```

---

### Sample Code 
#### create indexes
```sql

-- Create function-based index
DROP INDEX IF EXISTS idx_housing_type_apartment;

create index idx_housing_type_apartment on housing_json_data j (upper(j.json_data.Dimensions[0].Value));
ALTER SESSION SET QUERY_REWRITE_INTEGRITY = TRUSTED; 
ALTER SESSION SET QUERY_REWRITE_ENABLED = TRUE;


DROP INDEX IF EXISTS idx_housing_json_search;
-- Create search index
CREATE SEARCH INDEX idx_housing_json_search ON housing_json_data ( json_data ) FOR JSON;

```
#### Explain plan
```sql

-- Performance proofing with explain plan for function-based index
 explain plan for SELECT H.id, JT.*
	 FROM housing_json_data H,
				JSON_TABLE(H.json_data, '$'
									 COLUMNS (
											 CSDUID VARCHAR2(100) PATH '$.CSDUID',
											 CSD VARCHAR2(100) PATH '$.CSD',
											 Period VARCHAR2(100) PATH '$.Period',
											 IndicatorSummaryDescription VARCHAR2(100) PATH '$.IndicatorSummaryDescription',
											 UnitOfMeasure VARCHAR2(100) PATH '$.UnitOfMeasure',
											 OriginalValue NUMBER PATH '$.OriginalValue'
									 )) AS JT
	 WHERE UPPER(JSON_VALUE(H.json_data, '$.Dimensions[*]?(@.Name == "Housing Type").Value')) = 'APARTMENT';

SELECT PLAN_TABLE_OUTPUT FROM TABLE(DBMS_XPLAN.DISPLAY());


-- Performance proofing with explain plan for search index
EXPLAIN PLAN FOR SELECT h.json_data FROM housing_json_data h WHERE JSON_VALUE(h.json_data, '$.CSDUID' RETURNING VARCHAR(50) NULL ON ERROR TYPE(LAX)) = '4806016';
SELECT PLAN_TABLE_OUTPUT FROM TABLE(DBMS_XPLAN.DISPLAY());

```