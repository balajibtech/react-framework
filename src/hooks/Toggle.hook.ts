import { useState } from "react";

/**
 * Custom hook to toggle a boolean state.
 * This hook provides a way to manage a boolean state that can be toggled between `true` and `false`.
 * It also allows you to directly set the boolean value if needed.
 * @param initialValue - The initial boolean value of the toggle state. Defaults to `false` if not provided.
 * @returns An array containing:
 *   - `value`: The current boolean value of the state.
 *   - `toggle`: A function that toggles the value between `true` and `false`, or sets it to a specified boolean value.
 * @example
 * const [isModalOpen, toggleModal] = useToggle(false);
 * // Toggle the modal open/close:
 * toggleModal(); // Toggles between `true` and `false`
 * // Directly set the modal state to `true` or `false`:
 * toggleModal(true); // Sets the value to `true`
 */
const useToggle = (
  initialValue: boolean = false
): [boolean, (bool?: boolean) => void] => {
  // Initialize the toggle state with the provided `initialValue` or default to `false`
  const [value, setValue] = useState<boolean>(initialValue);

  /**
   * Function to toggle the boolean state.
   * If a boolean value is provided as an argument, it sets the state to that value.
   * If no value is provided, it toggles the current state (`true` becomes `false` and vice versa).
   * @param bool - Optional boolean value to directly set the state.
   */
  const toggle = (bool?: boolean) =>
    // If a boolean value is passed, set the state to that value. Otherwise, toggle the current state.
    setValue((prevValue) => (typeof bool === "boolean" ? bool : !prevValue));

  // Return the current value and the toggle function
  return [value, toggle];
};

export { useToggle };
