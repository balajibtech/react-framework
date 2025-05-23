// Import necessary dependencies from Redux Toolkit and user authentication services
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  authenticateService, 
  initialAuthService, 
  // otpAuthencateService 
} from '@/services/User/User';
import { hydrateUserFromLocalStorage } from '../utils/user';

// Define the User interface for better type safety
export interface User {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  groups: string[];
}

// Type alias for authentication status
type authenticated = boolean | null;

// Define the initial state for user authentication
const initialState: { user: User | null; isAuthenticated: authenticated } = { 
  user: null as unknown as User, 
  isAuthenticated: null 
};

/**
 * Handles successful authentication responses.
 * @param {Object} state - The current state of the user slice.
 * @param {Object} payload - The response payload containing user details.
 * @param {Object} meta - Metadata from the API response.
 * @returns {Object} Updated state with authenticated user data.
 */
const handleAuthFulfilled = (state: typeof initialState, { payload, meta } : any) => {
  if (payload.responseCode === 0) {

    const { email_id, user_id, groups, first_name, last_name, token } = payload.response.data;

    // Retrieve CSRF token from response headers or fallback to provided token
    let csrf = (meta as unknown as any)?.baseQueryMeta?.response.headers.get('x-csrftoken');
    if (csrf == null) {
      csrf = token;
    }

    // Construct the user object with required details
    const user = {
      email: email_id,
      id: user_id,
      name: email_id,
      firstName: first_name,
      lastName: last_name,
      groups: groups,
      token: csrf
    };

    // Store the user data in local storage (Base64 encoded)
    localStorage.setItem(`${import.meta.env.VITE_BROWSER_STORAGE_PREFIX}user`, btoa(JSON.stringify(user)));

    // Return the updated state with authenticated user
    return { ...state, user: user, isAuthenticated: true };
  }
};

// Create a Redux slice for user authentication
const reducer = createSlice({
  name: 'user', // Slice name
  initialState, // Initial state defined above
  reducers: {
    /**
     * Sets the user data in the state.
     * @param {Object} state - The current state of the user slice.
     * @param {PayloadAction<User>} payload - The user data to be set.
     * @returns {Object} Updated state with the new user data.
     */
    setUser: (state, { payload }: PayloadAction<User>) => {
      return { ...state, user: payload };
    },

    /**
     * Deletes the user data from state and local storage.
     * @param {Object} state - The current state of the user slice.
     * @returns {Object} Updated state with user set to null and authentication set to false.
     */
    delUser: (state) => {
      // Remove user-related data from local storage
      localStorage.removeItem(`${import.meta.env.VITE_BROWSER_STORAGE_PREFIX}user`);
      localStorage.removeItem(`${import.meta.env.VITE_BROWSER_STORAGE_PREFIX}sStart`);

      return { ...state, user: null, project: null, isAuthenticated: false };
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle initial authentication response
      .addMatcher(initialAuthService.matchFulfilled, (state) => {
        const user = hydrateUserFromLocalStorage();

        // Check if user data exists and is valid
        if (user && user.id && user.email && user.name && user.groups) {
          return { ...state, user: user, isAuthenticated: true };
        } else {
          return { ...state, user: null, isAuthenticated: false };
        }
      })
      // Handle rejected authentication response
      .addMatcher(initialAuthService.matchRejected, (state) => {
        return { ...state, user: null, isAuthenticated: false };
      })
      // Handle successful authentication for login & OTP-based authentication
      .addMatcher(authenticateService.matchFulfilled, handleAuthFulfilled)
      // .addMatcher(otpAuthencateService.matchFulfilled, handleAuthFulfilled);
  }
});

// Export the actions and reducer for use in the Redux store
export const {
  actions: { setUser, delUser },
  reducer: UserReducer
} = reducer;
