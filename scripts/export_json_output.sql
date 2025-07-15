SET PAGESIZE 0 -- avoid getting JSON_OUTPUT in the terminal and output file
SET TRIMSPOOL ON -- removes the whitespaces in the output file

-- Start spooling output to a file
SPOOL data\json_output.json

-- Export JSON using JSON_OBJECT and JSON_ARRAYAGG
SELECT JSON_SERIALIZE(
            JSON_ARRAYAGG(
                JSON_OBJECT(
                'CSDUID' VALUE l.csduid,
                'CSD' VALUE l.csd,
                'Period' VALUE hi.period,
                'IndicatorSummaryDescription' VALUE hi.indicator_summary,
                'Dimensions' VALUE JSON_ARRAYAGG(
                    JSON_OBJECT(
                    'Name' VALUE ht.name,
                    'Value' VALUE ht.type,
                    'IsDisplay' VALUE CASE hi.is_display WHEN 'Y' THEN 'true' ELSE 'false' END,
                    'DisplayOrder' VALUE hi.display_order
                    )
                ),
                'UnitOfMeasure' VALUE hi.unit_of_measure,
                'OriginalValue' VALUE hi.original_value
                )
            )
            FORMAT JSON PRETTY
        ) AS json_output
FROM HousingInfo hi
JOIN Location l ON hi.location_id = l.id
JOIN HousingType ht ON hi.housing_type_id = ht.id
GROUP BY
  l.csduid, l.csd, hi.period, hi.indicator_summary, hi.unit_of_measure, hi.original_value;

-- Stop writing to file
SPOOL OFF
