import React, { useState } from "react";

interface CsvRow {
  [key: string]: string; // Dynamic keys for CSV columns
}

const CsvReader: React.FC = () => {
  const [jsonData, setJsonData] = useState<CsvRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("WS_groupAction");
  const [logDate, setLogDate] = useState<string>(
    new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [startTime, setStartTime] = useState<string>("15:00:01");
  const [endTime, setEndTime] = useState<string>("16:50:59");
  const [skipModules, setSkipModules] = useState<string>("");
  const [skipEmails, setSkipEmails] = useState<string>("");

  const processCsv = async () => {
    try {
      // Construct the file path
      const filePath = `/api/${fileName}${logDate
        .split("-")
        .reverse()
        .join("-")}.csv`;


      // Fetch the CSV file
      const response = await fetch(`http://localhost:3000${filePath}`);
      if (!response.ok) throw new Error("File not found");

      const csvText = await response.text();

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
      const filteredData = data.filter((row) => {
        const rowTime = new Date(`${logDate}T${row.action_date}`).getTime();
        const start = new Date(`${logDate}T${startTime}`).getTime();
        const end = new Date(`${logDate}T${endTime}`).getTime();

        const skipModuleList = skipModules
          .split(",")
          .map((module) => module.trim());
        const skipEmailList = skipEmails
          .split(",")
          .map((email) => email.trim());

        return (
          rowTime >= start &&
          rowTime <= end &&
          !skipModuleList.includes(row.action_module) &&
          !skipEmailList.includes(row.login_id)
        );
      });

      // Update state with filtered JSON data
      setJsonData(filteredData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setJsonData([]);
    }
  };

  return (
    <div>
      <h1>CSV Reader</h1>
      <div>
        <label>
          File Name:
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Log Date:
          <input
            type="date"
            value={logDate}
            onChange={(e) => setLogDate(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Start Time:
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          End Time:
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Skip Modules:
          <textarea
            value={skipModules}
            onChange={(e) => setSkipModules(e.target.value)}
            placeholder="Enter module names separated by commas"
          />
        </label>
      </div>
      <div>
        <label>
          Skip Emails:
          <textarea
            value={skipEmails}
            onChange={(e) => setSkipEmails(e.target.value)}
            placeholder="Enter email addresses separated by commas"
          />
        </label>
      </div>
      <button onClick={processCsv}>Process CSV</button>

      {error && <p style={{ color: "var(--t-color-error)" }}>{error}</p>}

      {jsonData.length > 0 && (
        <div>
          <h2>Processed Data</h2>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CsvReader;
