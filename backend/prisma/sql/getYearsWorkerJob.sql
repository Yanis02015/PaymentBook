SELECT 
  EXTRACT(YEAR FROM date) as year,
  COUNT(*) as vochers
FROM 
  Vocher
WHERE 
  workerId = ? 
GROUP BY 
  EXTRACT(YEAR FROM date)
ORDER BY 
  year DESC;
