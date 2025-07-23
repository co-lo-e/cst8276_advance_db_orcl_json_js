drop view if exists HOUSING_JSON_DATA_V;

DECLARE
  dg CLOB;
BEGIN
  SELECT json_dataguide(json_data, DBMS_JSON.FORMAT_HIERARCHICAL) INTO dg
  FROM housing_json_data
  WHERE ROWNUM = 1;

  DBMS_JSON.CREATE_VIEW(
    viewname             => 'HOUSING_JSON_DATA_V',
    tablename            => 'HOUSING_JSON_DATA',
    jcolname             => 'JSON_DATA',
    dataguide            => dg,
    resolvenameconflicts => TRUE,
    colnameprefix        => 'DATA$',
    mixedcasecolumns     => TRUE
  );
END;
/