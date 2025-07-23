
DROP INDEX IF EXISTS idx_housing_json_search;
-- Create search index
CREATE SEARCH INDEX idx_housing_json_search ON housing_json_data ( json_data ) FOR JSON;
