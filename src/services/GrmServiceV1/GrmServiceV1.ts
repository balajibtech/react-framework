import { GrmServiceV1 } from "../service";

/**
 * GRM log File Operations API Endpoints
 *
 * @module GrmServiceV1
 * @description
 * Extended endpoints for GRM log file operations including:
 * - File listing by date/type
 * - Individual file content retrieval
 */
const service = GrmServiceV1.enhanceEndpoints({}).injectEndpoints({
  endpoints: (build) => ({
    /**
     * Get filtered file list from PHP backend
     * @method GET
     * @path /
     * @param {FileListParams} arg - Query parameters
     * @property {string} qf - Query file identifier (e.g. 'RM_groupAction')
     * @property {string} dt - Date string in DD-MM-YYYY format
     * @returns {Promise<string>} Raw text response of file list
     */
    getFileList: build.query<any, { qf: string; dt: string, app: string }>({
      query: (arg: { qf: string; dt: string; app:any }) => {
        const { qf, dt, app } = arg;
        return {
          url: `/`,
          params: app ? { qf, dt, app } : { qf, dt },
          responseHandler: (responese) => responese.text(),
        };
      },
    }),
    /**
     * Get individual file content
     * @method GET
     * @path /
     * @param {FileDataParams} arg - Query parameters
     * @property {string} qf_dwn - Filename to read
     * @returns {Promise<string>} Raw file content as text
     */
    getFileData: build.query<any, { qf_dwn: string, app: string }>({
      query: (arg: { qf_dwn: string; app:any  }) => {
        const { qf_dwn, app } = arg;
        return {
          url: `/`,
          params: app ? { qf_dwn, app } : { qf_dwn },
          responseHandler: (responese) => responese.text(),
        };
      },
    }),
  }),
});

export const { useLazyGetFileListQuery, useLazyGetFileDataQuery } = service;
