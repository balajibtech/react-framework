// Importing necessary types and services
import { ApiResponse } from '../services';
import { AuthService } from '../service';
import { 
  AuthResponseData, 
  // ForgotPassword, 
  UnAuththenticatedUser 
} from './UserTypes';

// Extracting the base authentication URL from the environment variable
// const AUTH_URL = import.meta.env.VITE_API_URL
// ?.substr(0, import.meta.env.VITE_API_URL.lastIndexOf('/'));


// Injecting authentication-related endpoints into AuthService
const service = AuthService.injectEndpoints({
  endpoints: (build) => ({
    
    // Mutation to check user session status
    initialAuthService: build.mutation<'', void>({
      query: () => ({
        method: 'POST',
        url: `/checksession/` // API endpoint for checking active session
      })
    }),

    // Mutation to handle user logout
    logoutService: build.mutation<'', void>({
      query: () => ({
        method: 'POST',
        url: `/web_app_logout/` // API endpoint for logging out
      })
    }),

    // Mutation to authenticate user login
    authenticateService: build.mutation<ApiResponse<AuthResponseData>, UnAuththenticatedUser>({
      query: (data) => {
        return {
          method: 'POST',
          url: `/web_app_login/`, // API endpoint for authentication
          body: data // Sending user credentials as the request body
        };
      }
    }),

    // // Mutation to send OTP for authentication
    // sendOTPservice: build.mutation<ApiResponse<any>, any>({
    //   query: (data) => {
    //     return {
    //       method: 'POST',
    //       url: `/generateOtp/`, // API endpoint for generating OTP
    //       body: data // Request payload containing user details for OTP
    //     };
    //   }
    // }),

    // // Mutation to verify OTP for authentication
    // otpAuthencateService: build.mutation<ApiResponse<any>, any>({
    //   query: (data) => {
    //     return {
    //       method: 'POST',
    //       url: `/otp_login/`, // API endpoint for OTP-based login
    //       body: data // Request payload containing OTP for verification
    //     };
    //   }
    // }),

    // // Mutation to reset user password
    // resetPasswordService: build.mutation<ApiResponse<undefined>, ForgotPassword>({
    //   query: (data) => {
    //     return {
    //       method: 'POST',
    //       url: `${AUTH_URL}/forgotpassword/`, // API endpoint for password reset
    //       body: data // Sending new password details in the request body
    //     };
    //   }
    // })
  }),
  overrideExisting: false // Ensuring endpoints are not overridden if they already exist
});

// Exporting custom hooks for use in components
export const {
  useAuthenticateServiceMutation: useAuthenticateService, // Hook for user authentication
  useInitialAuthServiceMutation: useInitialAuthService, // Hook for session validation
  useLogoutServiceMutation: useLogoutService, // Hook for user logout
  // useSendOTPserviceMutation: useSendOtpService, // Hook to send OTP
  // useOtpAuthencateServiceMutation: useOTPAuthService, // Hook for OTP-based authentication
  // useResetPasswordServiceMutation: resetPasswordService, // Hook to reset password
  endpoints: { 
    authenticateService, 
    initialAuthService
    // , otpAuthencateService 
  } // Exposing endpoints if needed
} = service;
