import {
  useLazyGetFileDataQuery,
  useLazyGetFileListQuery,
} from "@/services/GrmServiceV1/GrmServiceV1";
import { useCallback, useState } from "react";
import { CsvProcessor, ProcessorParams, TxtFileProcessor } from "@/utils/utils";

/**
 * Combined options for file fetching
 */
interface FileFetchOptions<T extends FileProcessor> {
  queryFile: string;
  date: string;
  processor: T;
  processorParams: ProcessorParams;
  app: string;
}

/**
 * Union type for all supported processors
 */
type FileProcessor = CsvProcessor | TxtFileProcessor;

/**
 * Custom hook for fetching and accumulating data from multiple files.
 * Provides both sequential and parallel fetching strategies with automatic state management.
 * @template T - The processor function type
 * @returns {
 *   fetchAllFilesData: (options: FileFetchOptions<T>) => Promise<ProcessedData[]>,
 *   data: ProcessedData[],
 *   isLoading: boolean,
 *   error: string | null,
 *   reset: () => void
 * }
 *
 * @example
 * const { fetchAllFilesData, data, isLoading } = useFileDataFetcher();
 *
 * // Sequential fetch
 * await fetchAllFilesData({ queryFile: 'logs', date: '28-08-2024' }, true);
 *
 * // Parallel fetch (default)
 * await fetchAllFilesData({ queryFile: 'logs', date: '28-08-2024' });
 */
export const useFileDataFetcher = <T extends FileProcessor>() => {
  const [getFileListService,] = useLazyGetFileListQuery();
  const [getFileDataService,] = useLazyGetFileDataQuery();

  const [accumulatedData, setAccumulatedData] = useState<any[]>([]);
  const [currentFiles, setCurrentFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Resets all hook state to initial values
   */
  const reset = useCallback(() => {
    setAccumulatedData([]);
    setCurrentFiles([]);
    setError(null);
  }, []);

  /**
   * Fetches data from a single file with error handling
   */
  const fetchSingleFile = useCallback(
    async (
      filename: string,
      processor: T,
      processorParams: ProcessorParams,
      app: string
    ) => {
      try {
        const fileResponse = await getFileDataService({
          qf_dwn: filename,
          app: app && app
        }).unwrap();

        if (!fileResponse) return null;

        return processor(fileResponse, filename, processorParams);
      } catch (err) {
        console.error(`Failed to fetch file ${filename}:`, err);
        return null;
      }
    },
    [getFileDataService]
  );

  /**
   * Fetches files sequentially with controlled concurrency
   */
  const fetchSequentially = useCallback(
    async (files: string[], processor: T, processorParams: ProcessorParams, app: string) => {
      const results = [];
      for (const filename of files) {
        const fileData = await fetchSingleFile(
          filename,
          processor,
          processorParams,
          app
        );
        if (fileData !== null) {
          results.push(fileData);
        }
      }
      return results;
    },
    [fetchSingleFile]
  );

  /**
   * Fetches files in parallel with controlled concurrency
   */
  const fetchInParallel = useCallback(
    async (
      files: string[],
      processor: T,
      processorParams: ProcessorParams,
      app: string,
      concurrency = 5,
    ) => {
      const results: any[] = [];
      const batches = Math.ceil(files.length / concurrency);


      for (let i = 0; i < batches; i++) {
        const batch = files.slice(i * concurrency, (i + 1) * concurrency);
        const batchResults = await Promise.all(
          batch.map((filename) =>
            fetchSingleFile(filename, processor, processorParams, app)
          )
        );
        results.push(...batchResults.filter(Boolean));
      }

      return results.flat();
    },
    [fetchSingleFile]
  );

  /**
   * Main function to fetch all files data
   * @param {FileFetchOptions} options - Contains queryFile and date
   * @param {boolean} [isSequential=false] - Whether to fetch sequentially
   * @returns Promise with accumulated data
   */
  const fetchAllFilesData = useCallback(
    async (
      options: FileFetchOptions<T>,
      isSequential: boolean = false
    ): Promise<any[]> => {
      setIsLoading(true);
      setError(null);
      setCurrentFiles([]);
      setAccumulatedData([]);

      try {
        // Get file list
        const fileListResponse = await getFileListService({
          qf: options.queryFile,
          dt: options.date,
          app: options.app && options.app
        });

        if (!fileListResponse.data) {
          throw new Error(
            fileListResponse.error?.toString() || "No files found"
          );
        }

        const files = JSON.parse(fileListResponse.data).response;

        if (!Array.isArray(files) || files.length === 0) {
          throw new Error("Empty file list returned");
        }

        setCurrentFiles(files);

        // Fetch file contents
        const fileData = isSequential
          ? await fetchSequentially(
            files,
            options.processor,
            options.processorParams,
            options.app && options.app
          )
          : await fetchInParallel(
            files,
            options.processor,
            options.processorParams,
            options.app && options.app,
          );

        setAccumulatedData(fileData);
        return fileData;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(message);
        console.error("File fetch error:", err);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [getFileListService]
  );

  return {
    fetchAllFilesData,
    data: accumulatedData,
    currentFiles,
    isLoading,
    error,
    reset,
  };
};

/* USAGE EXAMPLE */
/* 
  await fetchAllFilesData({
        queryFile: 'WN_groupAction',
        date: '28-08-2024',
        processor: csvProcessor,
        processorParams: {
          logDate: '28-08-2024',
          startTime: '09:00',
          endTime: '17:00',
          skipModules: 'admin,test',
          skipEmails: 'test@example.com'
        }
      }, true); // true for sequential, false/default for parallel
  };
 */
