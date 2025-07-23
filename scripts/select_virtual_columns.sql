SET LINESIZE 200;
SET PAGESIZE 100;
COLUMN csd FORMAT A25;
COLUMN name FORMAT A15;
COLUMN unit FORMAT A5;
COLUMN value FORMAT A15;
COLUMN description FORMAT A15;
COLUMN display FORMAT A7;


SELECT
  h.ID,
  h."DATA$CSD" AS csd,
  h."DATA$CSDUID" AS csduid,
  h."DATA$Period" AS year,
  h."DATA$OriginalValue" AS original_value,
  h."DATA$UnitOfMeasure" AS unit,
  h."DATA$IndicatorSummaryDescription" AS description,
  c.name,
  c.value,
  c.is_display AS display,
  c.display_order
FROM housing_json_data h,
     JSON_TABLE(
       h.json_data,
       '$'
       COLUMNS (
         NESTED PATH '$.Dimensions[*]'
         COLUMNS (
           name          VARCHAR2(100) PATH '$.Name',
           value         VARCHAR2(100) PATH '$.Value',
           is_display    VARCHAR2(10)  PATH '$.IsDisplay',
           display_order NUMBER        PATH '$.DisplayOrder'
         )
       )
     ) c
WHERE id = 1;
