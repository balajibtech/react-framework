import { useState } from "react";

type LogEntry = Record<string, any>;


interface TxtProcessorParams {
  fileName: string;
  logDate: string;
  startTime: string;
  endTime: string;
}

export const useTxtFileProcessor = () => {
  const [jsonData, setJsonData] = useState<LogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const processTxtFile = async ({
    fileName,
    logDate,
    startTime,
    endTime,
  }: TxtProcessorParams) => {
    setIsLoading(true);
    setError(null);

    try {
      // Construct the file path
      const filePath = `/api/${fileName}${logDate
        .split("-")
        .reverse()
        .join("-")}.txt`;

      // Fetch the TXT file
      const response = await fetch(filePath);
      if (!response.ok) throw new Error("File not found");

      const txtContent = await response.text();
      const lines = txtContent.split("\n");

      const filteredLogs: LogEntry[] = [];
      let currentTimestamp = "";
      let jsonBuffer: string[] = [];

      // Convert input time range to timestamps for comparison
      const startTimestamp = new Date(`${logDate} ${startTime}`).getTime();
      const endTimestamp = new Date(`${logDate} ${endTime}`).getTime();

      for (const line of lines) {
        // Match timestamp from "Time : <date>"
        const timeMatch = line.match(/Time : (\d{2}-\w{3}-\d{4} \d{2}: \d{2}: \d{2})/);
        
        if (timeMatch) {
          currentTimestamp = timeMatch[1].trim();
          const logTime = new Date(currentTimestamp).getTime();

          // **Time-based filtering: Skip entries outside range**
          if (logTime < startTimestamp || logTime > endTimestamp) {
            currentTimestamp = ""; // Reset timestamp since it's out of range
          }
          continue;
        }

        // If no valid timestamp found, ignore log
        if (!currentTimestamp) continue;

        // Collect JSON lines
        if (line.trim().startsWith("{")) {
          jsonBuffer = []; // Reset buffer
        }

        jsonBuffer.push(line.trim());

        // Check if JSON is complete
        if (line.trim().endsWith("}")) {
          try {
            const jsonString = jsonBuffer.join("");
            const parsedJson = JSON.parse(jsonString);
            filteredLogs.push({...parsedJson, timestamp : currentTimestamp});
          } catch {
            console.warn("Skipping malformed JSON:", jsonBuffer.join(""));
          }
          jsonBuffer = []; // Reset buffer after parsing
        }
      }

      setJsonData(filteredLogs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setJsonData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { jsonData, error, isLoading, processTxtFile };
};
