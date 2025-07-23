DECLARE
 dg CLOB;
BEGIN
 SELECT json_dataguide(json_data, DBMS_JSON.FORMAT_HIERARCHICAL) INTO dg
 FROM housing_json_data;
 DBMS_JSON.add_virtual_columns('housing_json_data', 'json_data', dg, resolveNameConflicts=>TRUE,
                                colNamePrefix=>'DATA$',
                                mixedCaseColumns=>TRUE);
END;
/