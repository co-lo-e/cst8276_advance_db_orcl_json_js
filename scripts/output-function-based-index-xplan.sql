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
