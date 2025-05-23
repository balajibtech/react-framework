import { useEffect } from "react";
import { useInitialAuthService, useLogoutService } from "@/services/User/User";
import { useAppSelector } from "./App.hook";
import { useDispatch } from "react-redux";
import { delUser } from "@/stores/User.store";
import { localStorageAccessor } from "@/utils/browserStorage";

// Custom hook for maintaining user authentication state and handling logout
const useAuth = () => {
  // Fetch authentication status from Redux store
  const { isAuthenticated } = useAppSelector((state: { UserReducer: any; }) => state.UserReducer);

  // Initialize authentication and logout services
  const [service] = useInitialAuthService();
  const [logoutService] = useLogoutService();

  // Dispatch function from Redux for updating global state
  const dispatch = useDispatch();

  /* Localstorage handlers for removing layout and active menu data */
  const [, , LremoveLayout] = localStorageAccessor("layout");
  const [, , LremoveActiveMenu] = localStorageAccessor("ActiveMenu");

  // Effect hook to check the authentication status on initial load
  useEffect(() => {
    // If the authentication state is undefined, run the authentication service
    if (isAuthenticated === null) service();
  }, [isAuthenticated, service]); // Dependencies: re-run the effect if `isAuthenticated` or `service` changes

  // Function to handle user logout
  const logout = async () => {
    // Call the logout service to perform the actual logout
    await logoutService();

    // Clear local storage data related to layout and active menu
    LremoveLayout();
    LremoveActiveMenu();

    // Dispatch an action to clear the user from Redux store
    dispatch(delUser());
  };

  // Return authentication state and logout function for use in components
  return { isAuthenticated, logout };
};

export { useAuth };
