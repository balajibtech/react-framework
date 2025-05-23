import { Grid } from "antd";
import type { Breakpoint } from "antd";

/**
 * Custom hook to get the current active screen size breakpoint from Ant Design's Grid system
 * This hook uses Ant Design's Grid system to determine the active screen size breakpoint (like 'xs', 'sm', 'md', etc.)
 * The hook listens for the active breakpoint and returns it
 * @returns {Breakpoint | undefined} - The active screen size breakpoint or `undefined` if none is active.
 */
export const useMediaSize = (): Breakpoint | undefined => {
  // Destructure the `useBreakpoint` hook from Ant Design's Grid system
  const { useBreakpoint } = Grid;

  // Get the current screen size information, which is an object where the keys are the breakpoint names and the values are booleans indicating whether that breakpoint is active.
  const screens:any = useBreakpoint();

  // Find the active breakpoint by checking which screen is currently active (true)
  // `Object.keys(screens)` returns an array of the breakpoint names (like 'xs', 'sm', etc.)
  // `findLast` finds the last active breakpoint in the list
  const currentScreenSize = (Object.keys(screens) as any).findLast(
    (screen: string | number) => screens[screen] // If the value is true, it's the active breakpoint
  );

  // Return the active screen size breakpoint.
  return currentScreenSize;
};
