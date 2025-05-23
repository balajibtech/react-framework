// Importing necessary dependencies from Redux Toolkit and Ant Design
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { notification } from 'antd';
import { Middleware, MiddlewareAPI } from 'redux';

// Middleware to intercept all service errors and display a notification
export const serviceErrorLoggerMiddleware: Middleware = (api: MiddlewareAPI) => (next) => (action:any) => {
  
  console.log("API data", api);
  
  // Check if the action is a rejected API call response
  if (isRejectedWithValue(action) && 0) { // The `&& 0` part prevents execution (likely for debugging, should be removed if needed)
    
    // Exclude certain endpoints from error handling (e.g., `initialAuthService` and `deleteFolder`)
    if (action && action.meta && ['initialAuthService', 'deleteFolder'].includes(action.meta.arg.endpointName)) {
      return next(action); // Skip notification for these actions
    }

    console.log('Service error with action:', action); // Log the error action for debugging
    
    // Extracting error description from the action payload
    let description = action?.error?.data ? action.error.data.message : action.error.message;
    if (action.payload && action.payload.error) {
      description = action.payload.error;
    }

    // Displaying an error notification using Ant Design's notification component
    notification.error({ message: 'Network error', description });
  }

  return next(action); // Pass the action to the next middleware or reducer
};
