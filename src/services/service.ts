import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers by adding an authentication token to the request headers
const prepareHeader = (headers: Headers) => {
  // Retrieving the user object from localStorage
  const user = localStorage.getItem(
    import.meta.env.VITE_BROWSER_STORAGE_PREFIX + "user"
  ) as any;

  // If user exists, extract the token and set it in the headers
  if (user) {
    const token = JSON.parse(atob(user))?.token;
    token && headers.set("X-XSRF-TOKEN", token); // Adding the token to headers if it exists
  }
  return headers;
};

// AuthService API slice for handling authentication requests
const AuthService = createApi({
  reducerPath: "authApi", // Defining the slice name
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_AUTH_API_URL, // Base URL for authentication API
    credentials: "include", // To include cookies with the request
    prepareHeaders: prepareHeader, // Use the `prepareHeader` function to handle headers
  }),
  endpoints: () => ({}), // Placeholder for actual API endpoints (currently empty)
});

// CommonService API slice for handling common API requests
const CommonService = createApi({
  reducerPath: "CommonApi", // Defining the slice name
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include", // To include cookies with the request
    prepareHeaders: prepareHeader
  }),
  endpoints: () => ({}), // Placeholder for actual API endpoints (currently empty)
});

const DashboardService = createApi({
  reducerPath: "Dashboard",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
    prepareHeaders: (headers) => {
      const token = { userTypeId: "1", userType: "AU" };
      // Set Authorization header
      if (token) {
        token && headers.set("Authorization", JSON.stringify(token));
      }

      // Set Content-Type header
      headers.set(
        "Content-Type",
        "multipart/form-data; boundary=----WebKitFormBoundaryUaZCFxybwhpbiYfd"
      );
      headers.set("observe", "response");
      headers.set("responseType", "text");
      headers.set("Accept", "application/json, text/plain, */*");

      return headers;
    },
  }),
  endpoints: () => ({}),
});

const MenuService = createApi({
  reducerPath: "MenuServiceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
    // prepareHeaders: (headers) => {
    //   // const token = { userTypeId: "1", userType: "AU" };
    //   // Set Authorization header
    //   // if (token) {
    //   //   token && headers.set("Authorization", JSON.stringify(token));
    //   // }

    //   // Set Content-Type header
    //   // headers.set(
    //   //   "Content-Type",
    //   //   "multipart/form-data; boundary=----WebKitFormBoundaryUaZCFxybwhpbiYfd"
    //   // );
    //   // headers.set("observe", "response");
    //   // headers.set("responseType", "text");
    //   // headers.set("Accept", "application/json, text/plain, */*");

    //   return headers;
    // },
  }),
  endpoints: () => ({}),
});

const GrmService = createApi({
  reducerPath: "grmServiceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
  }),
  endpoints: () => ({}),
});

/**
 * GRM Metrics API Service Configuration
 *
 * @module GrmServiceV1
 * @description
 * Core API service definition for GRM metrics data.
 * Configures base settings for all API endpoints including:
 * - Authentication: Basic Auth with PHP backend - **incomplete**
 * - Base URL: Points to PHP status endpoint
 * - Default headers: Authorization setup
 *
 * @returns {Api<BaseQueryFn, Endpoints, string, string, typeof apiReducerPath>}
 * Configured RTK Query API instance
 */
const GrmServiceV1 = createApi({
  reducerPath: "grmMetricsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost/support-book-backend/grmAdmin/status.php",
    // prepareHeaders: (headers) => {
    //      /* PHP HTTP authentication */
    //      const username = 'grouprm';
    //      const password = 'Infi2grm!';
    //      const encodedCredentials = btoa(`${username}:${password}`);
    //      const authorizationHeader = `Basic ${encodedCredentials}`;
    //      headers.set("Authorization", authorizationHeader)
    //     /* It's not working because PHP's $_SERVER['PHP_AUTH_USER'] and $_SERVER['PHP_AUTH_PW']
    //     variables are only automatically populated when using PHP-CGI or Apache with mod_php, but not with some modern setups (like Nginx + PHP-FPM)*/
    // @see {@link https://www.nginx.com/resources/wiki/start/topics/examples/phpfcgi/} for Nginx+PHP-FPM auth
    //      return headers;
    // }
  }),

  endpoints: () => ({}),
});

// NotificationService API slice for handling push notification requests
const NotificationService = createApi({
  reducerPath: "notificationApi", // Defining the slice name
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PUSH_API_URL, // Base URL for the notification API
    credentials: "include", // To include cookies with the request
    // prepareHeaders: prepareHeader, // Use the `prepareHeader` function to handle headers
  }),
  endpoints: () => ({}), // Placeholder for actual API endpoints (currently empty)
});

export { CommonService, AuthService, DashboardService, MenuService, GrmService, GrmServiceV1, NotificationService };
