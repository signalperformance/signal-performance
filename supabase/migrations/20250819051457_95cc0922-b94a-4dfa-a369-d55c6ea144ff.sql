-- Remove (PRO) and (AMATEUR) suffixes from class names in live_schedule_instances
UPDATE live_schedule_instances 
SET class_name = CASE 
  WHEN class_name LIKE '% (PRO)' THEN REPLACE(class_name, ' (PRO)', '')
  WHEN class_name LIKE '% (AMATEUR)' THEN REPLACE(class_name, ' (AMATEUR)', '')
  ELSE class_name
END
WHERE class_name LIKE '% (PRO)' OR class_name LIKE '% (AMATEUR)';

-- Remove (PRO) and (AMATEUR) suffixes from class names in schedule_entries
UPDATE schedule_entries 
SET class_name = CASE 
  WHEN class_name LIKE '% (PRO)' THEN REPLACE(class_name, ' (PRO)', '')
  WHEN class_name LIKE '% (AMATEUR)' THEN REPLACE(class_name, ' (AMATEUR)', '')
  ELSE class_name
END
WHERE class_name LIKE '% (PRO)' OR class_name LIKE '% (AMATEUR)';

-- Remove (PRO) and (AMATEUR) suffixes from class names in schedule_template_entries
UPDATE schedule_template_entries 
SET class_name = CASE 
  WHEN class_name LIKE '% (PRO)' THEN REPLACE(class_name, ' (PRO)', '')
  WHEN class_name LIKE '% (AMATEUR)' THEN REPLACE(class_name, ' (AMATEUR)', '')
  ELSE class_name
END
WHERE class_name LIKE '% (PRO)' OR class_name LIKE '% (AMATEUR)';