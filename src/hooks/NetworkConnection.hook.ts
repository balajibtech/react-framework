import { useState } from "react";
import { useEventListener } from "./EventListener.hook";

/**
 * Custom hook to monitor the network connection status.
 * This hook listens for the `online` and `offline` events to track when the network connection changes.
 * @returns {boolean} - A boolean indicating whether the network is online or not.
 */
const NetworkConnection = () => {
  // State to store the current network connection status, initialized based on the current state of the navigator's network connection (online or offline).
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Listen for the `online` event, which occurs when the device connects to the internet. When the event triggers, set the `isOnline` state to true.
  useEventListener("online", () => setIsOnline(true));

  // Listen for the `offline` event, which occurs when the device disconnects from the internet. When the event triggers, set the `isOnline` state to false.
  useEventListener("offline", () => setIsOnline(false));

  // Return the current network connection status (true if online, false if offline)
  return isOnline;
};

export default NetworkConnection;
