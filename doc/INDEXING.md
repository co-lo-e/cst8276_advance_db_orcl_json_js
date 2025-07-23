# Indexing in JSON

## Function-based indexing

```sql
create index idx_housing_type_apartment on housing_json_data j (upper(j.json_data.Dimensions[0].Value));
ALTER SESSION SET QUERY_REWRITE_INTEGRITY = TRUSTED; 
ALTER SESSION SET QUERY_REWRITE_ENABLED = TRUE;
```
### Perfomance Proofing

```sql
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
```

## Search Index

``` sql
CREATE SEARCH INDEX idx_housing_json_search ON housing_json_data ( json_data ) FOR JSON;
```


### Perfomance Proofing
```sql
EXPLAIN PLAN FOR SELECT h.json_data FROM housing_json_data h WHERE JSON_VALUE(h.json_data, '$.CSDUID' RETURNING VARCHAR(50) NULL ON ERROR TYPE(LAX)) = '4806016';
SELECT PLAN_TABLE_OUTPUT FROM TABLE(DBMS_XPLAN.DISPLAY());
```
