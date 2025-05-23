import { useState } from "react";

interface CsvRow {
  [key: string]: string;
}

interface CsvProcessorParams {
  fileName?: string;
  csvText?: string;
  logDate: string;
  startTime: string;
  endTime: string;
  skipModules: string;
  skipEmails: string;
}

const useCsvProcessor = () => {
  const [jsonData, setJsonData] = useState<CsvRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const processCsv = async ({
    fileName,
    csvText,
    logDate
  }: CsvProcessorParams) => {
    setIsLoading(true);
    setError(null);

    try {
      if (fileName){
        // Construct the file path
      const filePath = `/api/${fileName}${logDate
        .split("-")
        .reverse()
        .join("-")}.csv`;

      // Fetch the CSV file
      const response = await fetch(filePath);
      if (!response.ok) throw new Error("File not found");

      csvText = await response.text();
      }
      
      if (!csvText) return false;

      // Parse CSV text
      const rows = csvText.split("\n").filter((row) => row.trim() !== "");
      const headers = rows[0].split(",").map((header) => header.trim());
      const data = rows.slice(1).map((row) => {
        const values = row.split(",");
        return headers.reduce((obj: CsvRow, header, index) => {
          obj[header] = values[index]?.trim() || "";
          return obj;
        }, {});
      });

      // Filter data based on time range, skipModules, and skipEmails
      // const filteredData = data.filter((row) => {
      //   const rowTime = new Date(`${row.action_date}`.replace(/-/g, " ")).getTime();
      //   // const rowTime = new Date(`${logDate}T${row.action_date}`).getTime();
      //   const start = new Date(`${logDate}T${startTime}`).getTime();
      //   const end = new Date(`${logDate}T${endTime}`).getTime();

      //   const skipModuleList = skipModules
      //     .split(",")
      //     .map((module) => module.trim());
      //   const skipEmailList = skipEmails
      //     .split(",")
      //     .map((email) => email.trim());

      //   return (
      //     rowTime >= start &&
      //     rowTime <= end &&
      //     !skipModuleList.includes(row.action_module) &&
      //     !skipEmailList.includes(row.login_id)
      //   );
      // });
      // Update state with filtered JSON data
      setJsonData(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setJsonData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { jsonData, error, isLoading, processCsv };
};

export default useCsvProcessor;
