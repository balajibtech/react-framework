import dayjs from "dayjs";
import CFG from "@/config/config.json"
// import { store } from "@/stores/Store";
// const { CFG } = store.getState().SystemSettingsReducer;

/* Async Friendly SetTimeout */
export const asyncTimeout = (s: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, s * 1000);
  });
};

/**
 * Creates an array of objects, where each object represents a
 * triplet of elements: the previous, current, and next element
 * from the given input array.
 *
 * For the first element, 'prev' will be null.
 * For the last element, 'next' will be null.
 *
 * @param {Array} arr - The input array.
 * @returns {Array} - An array of objects, each containing 'prev', 'current', and 'next' properties.
 */
export const getLinkedList = (arr: any[]) => {
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    const prev = i === 0 ? null : arr[i - 1];
    const next = i === arr.length - 1 ? null : arr[i + 1];

    result.push({
      prev,
      current: arr[i],
      next,
    });
  }

  return result;
};

/**
 * Finds a menu object within the given array of menu objects
 * based on the provided 'currentCode'.
 *
 * @param {Array} menus - An array of objects, where each object
 *                       represents a menu with 'prev', 'current', and 'next' properties.
 * @param {string} currentCode - The 'menu_code' of the 'current' menu to find.
 * @returns {Object|undefined} - The found menu object, or undefined if not found.
 */
export const getLinkedListValue = (arr: any[], currentCode: string) => {
  return arr.find((val) => val.current.menu_code === currentCode);
};

/* Find the key for the given value */
export const getKeyByValue = (
  mapping: { [key: string]: string },
  value: string
): string | undefined => {
  return Object.keys(mapping).find((key) => mapping[key] === value);
};

/* Returns boolean value after comparing two arrays */
export const compareArrays = (array1: any[], array2: any[], key?: string) => {
  if (key) {
    if (array1.length !== array2.length) return false;
    return array1.every((item, index) => item[key] === array2[index][key]);
  }
  return JSON.stringify(array1) === JSON.stringify(array2);
};

/* Validation method to parse a JSON */
export const safelyParseJson = (value: string) => {
  try {
    // Attempt to parse the string as JSON
    return JSON.parse(value);
  } catch (error) {
    // If it throws an error, return the value as a string (or handle appropriately)
    return value;
  }
};

export const isPossiblyBtoaEncoded = (str: any) => {
  try {
    // Attempt to decode the string
    const decoded = atob(str);

    // Check if the decoded string contains only printable characters
    return decoded
      .split("")
      .every((char) => char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126);
  } catch (error) {
    // If decoding fails, it's likely not btoa encoded
    return false;
  }
};

/**
 * Utility function to calculate a dynamic date based on an offset.
 * It takes a string with year, month, and day offsets, and generates a new date
 * relative to the current date. The returned date is formatted as 'MMM DD, YYYY'.
 *
 * @param {string} dateParam - The input string in the format "('yearOffset,monthOffset,day')".
 * Example: '0,1,1' would return a date that is 1 month and 1st of the month.
 * @param {boolean} reverse - True : convert 'Jul 13, 2024' to '0,-2,13'
 *
 * @returns {string} - A formatted string representing the calculated date in 'MMM DD, YYYY' format.
 *
 * Example usage:
 *
 * getDynamicDate('0,1,1'); // If today is Jan 10, 2024, the output would be 'Feb 1, 2024'.
 * Extra forth value(time) can be given. That will be appended after the dynamic date.
 */
// export const getDynamicDate = (
//   dateParam: string | dayjs.Dayjs,
//   reverse: boolean = false,
//   dateFormat: string = ""
// ): string | dayjs.Dayjs | undefined => {
//   console.log(dateParam);

//   // Remove parentheses and single quotes, then split into an array of numbers
//   try {
//     if (reverse) {
//       // Parse the input date (e.g., "Jul 13, 2024") to dayjs
//       const targetDate = dayjs(
//         dateParam,
//         dateFormat ? dateFormat : "MMM DD, YYYY"
//       );
//       const currentDate = dayjs();

//       // Calculate year and month offsets
//       const yearOffset = targetDate.year() - currentDate.year();
//       const monthOffset = targetDate.month() - currentDate.month();
//       const day = targetDate.date();

//       // Return the string in the format "yearOffset, monthOffset, day"
//       return `${yearOffset},${monthOffset},${day}`;
//     }

//     if (typeof dateParam !== "string") throw "Invalid date format";

//     const [yearOffset, monthOffset, day, added] = dateParam?.split(",");

//     // Calculate the dynamic date based on the extracted values
//     const dynamicDate = new Date(
//       new Date().getFullYear() + Number(yearOffset),
//       new Date().getMonth() + Number(monthOffset),
//       Number(day)
//     );

//     // Format the date to "MMM DD, YYYY"
//     const formattedDate = dynamicDate.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "2-digit",
//     });

//     // Append 'added' value if it exists, trimming any leading/trailing spaces
//     return added ? `${formattedDate} ${added.trim()}` : formattedDate;
//   } catch {
//     return dateParam;
//   }
// };
export const getDynamicDate = (
  dateParam: string | dayjs.Dayjs,
  reverse: boolean = false,
  dateFormat: string = CFG?.site?.date_time_format?.date_format || "MMM DD, YYYY" // Default format
): string | dayjs.Dayjs | undefined => {
  try {
    if (reverse) {
      // Parse the input date with the provided format
      const targetDate = dayjs(dateParam, dateFormat);
      if (!targetDate.isValid()) throw new Error("Invalid date format");

      const currentDate = dayjs();

      // Calculate year and month offsets
      const yearOffset = targetDate.year() - currentDate.year();
      const monthOffset = targetDate.month() - currentDate.month();
      const day = targetDate.date();

      // Return the string in the format "yearOffset, monthOffset, day"
      return `${yearOffset},${monthOffset},${day}`;
    }

    if (typeof dateParam !== "string") throw new Error("Invalid date format");

    const [yearOffset, monthOffset, day, added] = dateParam.split(",");

    // Calculate the dynamic date based on the extracted values
    const dynamicDate = new Date(
      new Date().getFullYear() + Number(yearOffset),
      new Date().getMonth() + Number(monthOffset),
      Number(day)
    );

    // Format the date using the provided format or fallback
    const formattedDate = dayjs(dynamicDate).format(dateFormat);

    // Append 'added' value if it exists, trimming any leading/trailing spaces
    return added ? `${formattedDate} ${added.trim()}` : formattedDate;
  } catch (error) {
    console.error(error);
    return dateParam;
  }
};

/* Converts first character of the string into uppercase and returns the string */
export const makeCharAt0UpperCase = (char: string) => {
  return char.charAt(0).toUpperCase() + char.slice(1);
};

/**
 * Formats a number as currency with thousands separators and decimal places,
 * supporting international currency formats based on the provided locale and currency code.
 * Example 1:
 *   Input: 100000, 'en-US', 'USD'
 *   Output: "$100,000.00"
 * Example 2:
 *   Input: 100000, 'en-IN', 'INR'
 *   Output: "₹1,00,000.00"
 * @param value - The numeric value to be formatted.
 * @param locale - The locale code to determine the numbering system (e.g., 'en-US', 'en-IN').
 * @param currency - The ISO 4217 currency code (e.g., 'USD', 'INR', 'EUR').
 * @returns A string representing the formatted currency.
 */
export const getFormattedCurrency = (
  value: number | undefined,
  locale: string = CFG?.site?.language.default || "en-US"
  // currency: string = CFG?.currency || 'USD'
): string => {
  return new Intl.NumberFormat(locale, {
    // Use the provided locale for numbering format
    // style: 'currency',                   // Format the number as currency
    // currency: currency,                  // Use the provided currency code
    minimumFractionDigits: 2, // Ensure the output always has at least 2 decimal places
    maximumFractionDigits: 2, // Limit the output to a maximum of 2 decimal places
  }).format(value || 0); // Format the number according to the specified options
};

/* Split pax functionality for PNRs */
export const splitPaxWithCategories = (
  adults: number,
  children: number,
  infants: number,
  n: number
) => {
  // Calculate base pax for each category
  const baseAdults = Math.floor(adults / n);
  const baseChildren = Math.floor(children / n);
  const baseInfants = Math.floor(infants / n);

  // Calculate remaining pax for each category
  const remainingAdults = adults % n;
  const remainingChildren = children % n;
  const remainingInfants = infants % n;

  // Create an array to store the pax distribution for each group
  const splitPax = [];

  // Initialize each group with base pax
  for (let i = 0; i < n; i++) {
    splitPax.push({
      adults: baseAdults,
      children: baseChildren,
      infants: baseInfants,
      total: baseAdults + baseChildren + baseInfants,
    });
  }

  // Distribute remaining adults
  for (let i = 0; i < remainingAdults; i++) {
    splitPax[i].adults++;
    splitPax[i].total++;
  }

  // Distribute remaining children
  for (let i = 0; i < remainingChildren; i++) {
    splitPax[i].children++;
    splitPax[i].total++;
  }

  // Distribute remaining infants
  for (let i = 0; i < remainingInfants; i++) {
    splitPax[i].infants++;
    splitPax[i].total++;
  }

  return splitPax;
};

/**
 * Utility function to check if a value is an object or array.
 * @param obj - The value to check.
 * @returns {boolean} - True if the value is an object or array, false otherwise.
 */
const isObject = (obj: any) => obj && typeof obj === "object";

/**
 * Utility funciton for detecting changes between two objects.
 * It compares the initial values with the current values recursively
 * to determine if any field has been updated.
 *
 * @param {object} original - The initial values.
 * @param {object} updated - The current values.
 * @returns {boolean} - Returns true if any changes are detected, false otherwise.
 */
export const deepCompare = (
  original: any,
  updated: any,
  checkKeyLength: boolean = false
): boolean => {
  // If both are not objects, compare directly
  if (!isObject(original) || !isObject(updated)) {
    return original != updated;
  }

  // If both are arrays, compare their elements
  if (Array.isArray(original) && Array.isArray(updated)) {
    if (original.length != updated.length) return true;

    return original.some((item, index) => deepCompare(item, updated[index]));
  }

  // For objects, compare their keys and values
  const originalKeys = Object.keys(original);
  const updatedKeys = Object.keys(updated);

  if (checkKeyLength && originalKeys.length !== updatedKeys.length) return true;

  return updatedKeys.some((key) => deepCompare(original[key], updated[key]));
};

// /**
//  * Utility function to calculate a dynamic date based on an offset.
//  * It takes a string with year, month, and day offsets, and generates a new date
//  * relative to the current date. The returned date is formatted as 'MMM DD, YYYY'.
//  *
//  * @param {string} dateParam - The input string in the format "('yearOffset,monthOffset,day')".
//  * Example: '0,1,1' would return a date that is 1 month and 1st of the month.
//  * @param {boolean} reverse - True : convert 'Jul 13, 2024' to '0,-2,13'
//  *
//  * @returns {string} - A formatted string representing the calculated date in 'MMM DD, YYYY' format.
//  *
//  * Example usage:
//  *
//  * getDynamicDate('0,1,1'); // If today is Jan 10, 2024, the output would be 'Feb 1, 2024'.
//  * Extra forth value(time) can be given. That will be appended after the dynamic date.
//  */
// export const getDynamicDate = (
//   dateParam: string | dayjs.Dayjs,
//   reverse: boolean = false,
//   dateFormat: string = ""
// ): string | dayjs.Dayjs | undefined => {
//   // Remove parentheses and single quotes, then split into an array of numbers
//   try {
//     if (reverse) {
//       // Parse the input date (e.g., "Jul 13, 2024") to dayjs
//       const targetDate = dayjs(
//         dateParam,
//         dateFormat ? dateFormat : "MMM DD, YYYY"
//       );
//       const currentDate = dayjs();

//       // Calculate year and month offsets
//       const yearOffset = targetDate.year() - currentDate.year();
//       const monthOffset = targetDate.month() - currentDate.month();
//       const day = targetDate.date();

//       // Return the string in the format "yearOffset, monthOffset, day"
//       return `${yearOffset},${monthOffset},${day}`;
//     }

//     if (typeof dateParam !== "string") throw "Invalid date format";

//     const [yearOffset, monthOffset, day, added] = dateParam?.split(",");

//     // Calculate the dynamic date based on the extracted values
//     const dynamicDate = new Date(
//       new Date().getFullYear() + Number(yearOffset),
//       new Date().getMonth() + Number(monthOffset),
//       Number(day)
//     );

//     // Format the date to "MMM DD, YYYY"
//     const formattedDate = dynamicDate.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "2-digit",
//     });

//     // Append 'added' value if it exists, trimming any leading/trailing spaces
//     return added ? `${formattedDate} ${added.trim()}` : formattedDate;
//   } catch {
//     return dateParam;
//   }
// };

/**
 * Formats and returns a group label.
 * If the group string contains "fdms", it will:
 *  - Split the string by underscores (_)
 *  - Remove the "fdms" prefix
 *  - Capitalize the first letter of the remaining string
 * If "fdms" is not present, it returns the group string as is.
 *
 * @param group - The group string to be formatted
 * @returns The formatted group label
 *
 * Example:
 * Input: "fdms_head_of_operations"
 * Output: "Head of operations"
 */
export const getGroupLabel = (group: string) =>
  group?.includes("fdms")
    ? group
        .split("_")
        .splice(1)
        .join(" ")
        ?.replace(/^\w/, (char: any) => char.toUpperCase())
    : group;


/* Filter by date range */
type ItemType = {
  date: string; // e.g., 'Nov 01, 2024'
};

export const filterItemsByDateRange = (items: ItemType[], key: string, filterOption: string) => {
  const today = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (filterOption) {
    case "today":
      startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      endDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );
      break;

    case "this week":
      const dayOfWeek = today.getDay();
      startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - dayOfWeek
      );
      endDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + (6 - dayOfWeek) + 1
      );
      break;

    case "this month":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      break;

    case "this year":
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = new Date(today.getFullYear() + 1, 0, 1);
      break;

    default:
      return items;
  }

  return items.filter((item : any) => {
    const itemDate = new Date(getDynamicDate(item[key]) as string);
    return itemDate >= startDate && itemDate < endDate;
  });
};


/**
 * Lightens a hexadecimal color by a specified amount.
 * @param {string} hex - The hexadecimal color code to lighten (with or without '#' prefix)
 * @param {number} amount - The amount to lighten each RGB component (0-255)
 * @returns {string} - The lightened hexadecimal color code with '#' prefix
 * @example
 * lightenColor('#336699', 50); // returns a lighter shade of the input color
 * lightenColor('#369', 30);    // handles 3-digit shorthand hex codes
 */
export const lightenColor = (hex: string, amount: number): string => {
  // Remove '#' if present and normalize 3-digit hex to 6-digit
  let color = hex.replace('#', '');
  if (color.length === 4) {
    color = color.split('').map(c => c + c).join('');
  }

  // Parse hex to RGB components
  const num = parseInt(color, 16);
  // Lighten each component while clamping to 255 as maximum value
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0x00FF) + amount);
  const b = Math.min(255, (num & 0x0000FF) + amount);

  // Convert back to hex and ensure 6-digit format
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)}`;
};

/**
 * Resolves a CSS variable value to its computed value if the input is a CSS variable reference.
 * If the input is not a CSS variable, returns the value as-is.
 * @param {string} value - The value to check and potentially resolve. Can be either a direct value (e.g., "red") or a CSS variable reference (e.g., "var(--primary-color)")
 * @returns {string} - The computed value of the CSS variable if input is a variable reference, otherwise returns the original value unchanged
 * @example 
 *  resolveVariable('var(--main-color)'); - Returns the computed value of --main-color (e.g., "#0066cc")
 *  resolveVariable('blue'); - Returns "blue" unchanged
 */
export const resolveCSSVariable = (value: string): string => {
  // Check if the value is a CSS variable reference (starts with 'var(')
  if (value.startsWith('var(')) {
    // Extract the variable name by:
    // 1. Removing 'var(' from start (slice(4))
    // 2. Removing ')' from end (-1 in slice)
    // 3. Trimming any whitespace
    const varName = value.slice(4, -1).trim();
    
    // Get the computed value of the CSS variable from the root element
    return getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
  }
  
  // If not a CSS variable reference, return the value unchanged
  return value;
};