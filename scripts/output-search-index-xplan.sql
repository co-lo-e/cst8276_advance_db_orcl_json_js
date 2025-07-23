-- Performance proofing with explain plan for search index
EXPLAIN PLAN FOR SELECT h.json_data FROM housing_json_data h WHERE JSON_VALUE(h.json_data, '$.CSDUID' RETURNING VARCHAR(50) NULL ON ERROR TYPE(LAX)) = '4806016';
SELECT PLAN_TABLE_OUTPUT FROM TABLE(DBMS_XPLAN.DISPLAY());
