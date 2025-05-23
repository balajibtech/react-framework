import { useState, useEffect } from "react";

/**
 * Custom hook to ensure a smoother and more organized loading experience by introducing a delay.
 * This hook will delay the change in state for a given amount of time (in milliseconds) after it is triggered.
 * @param {number} delay - The time to wait in milliseconds before the delay is considered complete.
 * @returns {boolean} - A boolean indicating whether the delay has completed or not.
 */
const useMinimumDelay = (delay: number) => {
  // State to keep track of whether the delay has completed or not
  const [isDelayComplete, setIsDelayComplete] = useState(false);

  useEffect(() => {
    // Set a timer to complete the delay after the specified time period
    const timer = setTimeout(() => {
      setIsDelayComplete(true); // Set delay completion to true when the timer ends
    }, delay);

    // Clean up the timer when the component unmounts or when delay value changes
    return () => clearTimeout(timer);
  }, [delay]); // Re-run the effect only if the delay value changes

  return isDelayComplete; // Return whether the delay has completed or not
};

export default useMinimumDelay;
