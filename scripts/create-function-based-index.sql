-- Create function-based index
DROP INDEX IF EXISTS idx_housing_type_apartment;

create index idx_housing_type_apartment on housing_json_data j (upper(j.json_data.Dimensions[0].Value));
ALTER SESSION SET QUERY_REWRITE_INTEGRITY = TRUSTED; 
ALTER SESSION SET QUERY_REWRITE_ENABLED = TRUE;
