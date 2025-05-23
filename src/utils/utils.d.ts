/**
 * CSV Processor Type
 * @param csvText - Raw CSV content as string
 * @param fileName - Name of the file being processed
 * @param params - Additional processing parameters
 * @returns Array of processed CSV rows
 */
export type CsvProcessor = (
  csvText: string,
  fileName: string,
  params: ProcessorParams
) => CsvRow[];

export type ProcessorParams = {
  logDate?: string;
  startTime?: string;
  endTime?: string;
  skipModules?: string;
  skipEmails?: string;
};

export type CsvRow = {
  [key: string]: string;
};

export type LogEntry = Record<string, any>;

/**
 * TXT Processor Type
 * @param txtText - Raw text content as string
 * @param fileName - Name of the file being processed
 * @param params - Additional processing parameters
 * @returns Array of processed log entries
 */
type TxtFileProcessor = (
  txtText: string,
  fileName: string,
  params: ProcessorParams
) => LogEntry[];
