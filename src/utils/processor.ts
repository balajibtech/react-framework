import { 
  CsvProcessor, 
  CsvRow, 
  LogEntry, 
  // ProcessorParams, 
  TxtFileProcessor 
} from "./utils";

/**
 * Standard CSV Processor
 * @param csvText Raw CSV content
 * @param fileName Source filename (for logging)
 * @param params Processing parameters including time filtering
 * @returns Filtered CSV data as objects
 */
export const csvProcessor: CsvProcessor = (
  csvText : string, 
  // fileName : string, 
  // params : ProcessorParams
  ) => {
  const rows = csvText.split("\n").filter((row) => row.trim());
  const headers = rows[0].split(",").map((h) => h.trim());

  return rows
    .slice(1)
    .map((row) => {
      const values = row.split(",");
      const rowObj = headers.reduce((obj, header, i) => {
        obj[header] = values[i]?.trim() || "";
        return obj;
      }, {} as CsvRow);

      return rowObj;
    })
    .filter(Boolean);
};

/**
 * Standard TXT Log Processor
 * @param txtText Raw log content
 * @param fileName Source filename (for logging)
 * @param params Processing parameters including time range
 * @returns Parsed log entries with timestamps
 */
export const txtProcessor: TxtFileProcessor = (txtText, fileName, params) => {
  const lines = txtText.split("\n");
  const filteredLogs: LogEntry[] = [];
  let currentTimestamp = "";
  let jsonBuffer: string[] = [];

  const startTimestamp = new Date(
    `${params.logDate} ${params.startTime}`
  ).getTime();
  const endTimestamp = new Date(
    `${params.logDate} ${params.endTime}`
  ).getTime();

  for (const line of lines) {
    const timeMatch = line.match(
      /Time : (\d{2}-\w{3}-\d{4} \d{2}: \d{2}: \d{2})/
    );

    if (timeMatch) {
      currentTimestamp = timeMatch[1].trim();
      const logTime = new Date(currentTimestamp).getTime();
      if (logTime < startTimestamp || logTime > endTimestamp) {
        currentTimestamp = "";
      }
      continue;
    }

    if (!currentTimestamp) continue;

    if (line.trim().startsWith("{")) {
      jsonBuffer = [];
    }

    jsonBuffer.push(line.trim());

    if (line.trim().endsWith("}")) {
      try {
        const parsed = JSON.parse(jsonBuffer.join(""));
        filteredLogs.push({ ...parsed, timestamp: currentTimestamp });
      } catch {
        console.warn(`Malformed JSON in ${fileName}`);
      }
      jsonBuffer = [];
    }
  }

  return filteredLogs;
};
