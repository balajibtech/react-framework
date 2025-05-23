import dayjs, { Dayjs, ConfigType } from "dayjs";
import { RangePickerProps } from "antd/es/date-picker";
import CFG from "@/config/config.json"
// import { store } from "@/stores/Store";
// const { CFG } = store.getState().SystemSettingsReducer;

/**
 * A generic method for generating formatted string using dayjs library.
 * @param {ConfigType} date - date you want to convert
 * @param {string} toFormat - format string to which the date to be converted to
 * @returns {string} Formatted Date as string
 * @example
 * getFormattedDate('2024-01-25', 'MMM D, YYYY') // 'Jan 25, 2024'
 */
const getFormattedDate = (
  date: ConfigType,
  toFormat: string = CFG?.site?.date_time_format?.date_format
): string => {
  return dayjs(date).format(toFormat);
};

/**
 * A generic method for disabling the previous dates in calender using dayjs library.
 * @param {Dayjs | null} currentDate - current date comes from datepicker
 * @example
 * <DatePicker disabledDate={disablePreviousDates} />
 */
const disablePreviousDates: RangePickerProps["disabledDate"] = (
  currentDate: Dayjs | null
) => {
  return currentDate ? currentDate.isBefore(dayjs().endOf("day")) : false;
};

const dateFormat = (data: Date | string, format = "dateTime") => {
  if (!data) return "";
  let formats: any = {},
    formatter = "";
  switch (format) {
    case "dateTime":
      formats = Object.assign(CFG?.site?.date_time_format?.date_format, CFG?.site?.date_time_format?.time_format);
      formatter = CFG?.site?.date_time_format?.date_time_formatter;
      break;
    case "date":
      formats = CFG?.site?.date_time_format?.date_format;
      formatter = CFG?.site?.date_time_format?.time_formatter;
      break;
    default: //time
      formats = CFG?.site?.date_time_format?.time_format;
      formatter = CFG?.site?.date_time_format?.time_formatter;
      break;
  }

  let date = new Date(data);
  let dateArray = date
    .toLocaleDateString(CFG?.site?.language?.default, formats)
    .replace(/,/g, "")
    .split(" ");
  let timeArray = dateArray[3] ? dateArray[3].split(":") : [];
  const dates: any = {
    "%M": dateArray[0],
    "%d": dateArray[1],
    "%Y": dateArray[2],
    "%H": timeArray[0],
    "%i": timeArray[1],
    "%A": dateArray[4],
  };

  for (var i in dates) formatter = formatter.replace(i, dates[i]);
  return formatter;
};

const daysInMonth = (month: number, year: number) =>
  new Date(year, month, 0).getDate();
// Methods to calculate the difference between the departure and arrival time
const getDifferenceInTime = (startTime?: string, endTime?: string) => {
  let start_Time: string[] = (startTime as string).split(" ");
  let end_Time: string[] = (endTime as string).split(" ");

  let formattedStartTime: any = new Date(
    Number(start_Time[0].split("/")[2]),
    Number(start_Time[0].split("/")[1]) - 1,
    Number(start_Time[0].split("/")[0]),
    Number(start_Time[1].split(":")[0]),
    Number(start_Time[1].split(":")[1]),
    Number(start_Time[1].split(":")[2])
  );

  let formattedEndTime: any = new Date(
    Number(end_Time[0].split("/")[2]),
    Number(end_Time[0].split("/")[1]) - 1,
    Number(end_Time[0].split("/")[0]),
    Number(end_Time[1].split(":")[0]),
    Number(end_Time[1].split(":")[1]),
    Number(end_Time[1].split(":")[2])
  );

  // Get total seconds
  let TotalSeconds = Math.abs(formattedStartTime - formattedEndTime) / 1000;

  // Get days
  let days = Math.floor(TotalSeconds / 86400);

  // Get hours
  let hours = Math.floor(TotalSeconds / 3600) % 24;

  // Get minutes
  let minutes = Math.floor(TotalSeconds / 60) % 60;

  // Get seconds
  // let seconds = TotalSeconds % 60;

  let timeDifferce: string = "";

  timeDifferce =
    days !== 0
      ? days + "d " + hours + "h"
      : hours !== 0
        ? hours + "h " + minutes + "m"
        : minutes !== 0
          ? minutes + "m"
          : timeDifferce;

  return timeDifferce;
};

const DateFormatForReschedule = (date: string, day = true) => {
  const formattedValue = new Date(
    date.substring(3, 6) + date.substring(0, 3) + date.substring(6, 19)
  );
  return formattedValue
    .toString()
    .substring(day ? 0 : 4, 15)
    .replace(/ /g, ", ");

};

const formatDate = (date: Date | string): string => {
  if (!(date instanceof Date)) date = new Date(date);
  // const options: Intl.DateTimeFormatOptions = {
  //   day: "2-digit",
  //   month: "short",
  //   year: "numeric",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   hour12: false,
  // };
  // return date.toLocaleDateString("en-GB", options);

  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const time = date.toLocaleTimeString("en-GB", optionsTime); // "13:20"
  const day = date.toLocaleDateString("en-GB", { day: "2-digit" }); // "15"
  const month = date.toLocaleDateString("en-GB", { month: "short" }); // "Oct"
  const year = date.toLocaleDateString("en-GB", { year: "numeric" }); // "2024"

  // Combine the formatted time and date parts with a comma where required
  return `${time}, ${month} ${day}, ${year}`;
};

const formatDateString = (dateString: string) => {
  // Parse the date string
  const date = new Date(dateString);

  // Get the month name
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];

  // Get the day, year, hours, and minutes
  const day = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // Format the minutes with leading zero if necessary
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Determine AM or PM
  // const ampm = hours >= 12 ? "PM" : "AM";
  // hours = hours % 12;
  // hours = hours ? hours : 12; // The hour '0' should be '12'

  // Construct the formatted date string
  // return `${month} ${day}, ${year} ${hours}:${formattedMinutes} ${ampm}`;
  return `${hours}:${formattedMinutes}, ${month} ${day}, ${year}`;
  // const dateString = '2024-06-18T09:47:35.185684Z';
  // console.log(formatDate(dateString)); // Output: "Jun 18, 2024 9:47 AM"
}

/**
 * Formats a time string into a human-readable format.
 * @param rawTime - The input time string (either "HH:MM:SS.MS" or "SS.MS" format)
 * @param format - Optional format string
 *                 - 'long': 1h 2m 3s 456ms
 *                 - 'short': 01:02:03.456
 *                 - 'auto': only non-zero parts (e.g., "1s 503ms") - DEFAULT
 *                 - 'micro': seconds with milliseconds (e.g., "1.503s")
 * @returns Formatted time string.
 */
const readableTimeFormat = (
  rawTime: string | undefined | null,
  format: "long" | "short" | "auto" | "micro" = "auto"
): string => {
  // Handle null/undefined/empty input
  if (!rawTime) {
    return format === "short" ? "00:00:00.000" : 
           format === "micro" ? "0.000s" : "0ms";
  }

  try {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let milliseconds = 0;

    // Check if input is in SS.MS format (e.g., "1.503")
    if (/^\d+\.\d+$/.test(rawTime)) {
      const parts = rawTime.split(".");
      seconds = parseInt(parts[0]) || 0;
      // Take first 3 digits of decimal part for milliseconds
      milliseconds = parseInt(parts[1].substring(0, 3).padEnd(3, '0')) || 0;
    } 
    // Handle HH:MM:SS.MS format
    else {
      const timeParts = rawTime.split(":");
      if (timeParts.length < 3) throw new Error("Invalid time format");

      const [h, m, sMs] = timeParts;
      const [s, ms = "0"] = sMs.split(".");
      hours = parseInt(h) || 0;
      minutes = parseInt(m) || 0;
      seconds = parseInt(s) || 0;
      milliseconds = parseInt(ms.substring(0, 3).padEnd(3, '0')) || 0;
    }

    // Validate ranges
    if (
      hours < 0 || minutes < 0 || seconds < 0 || milliseconds < 0 ||
      minutes >= 60 || seconds >= 60 || milliseconds >= 1000
    ) {
      throw new Error("Invalid time component");
    }

    // Micro format (e.g., "1.503s")
    if (format === "micro") {
      const totalSeconds = hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
      return `${totalSeconds.toFixed(3)}s`;
    }

    // Short format (e.g., "00:01:00.503")
    if (format === "short") {
      return [
        String(hours).padStart(2, '0'),
        String(minutes).padStart(2, '0'),
        String(seconds).padStart(2, '0')
      ].join(':') + `.${String(milliseconds).padStart(3, '0')}`;
    }

    // Auto format (e.g., "1s 503ms")
    if (format === "auto") {
      const parts = [
        hours > 0 ? `${hours}h` : "",
        minutes > 0 ? `${minutes}m` : "",
        seconds > 0 ? `${seconds}s` : "",
        milliseconds > 0 ? `${milliseconds}ms` : "",
      ].filter(Boolean);
      return parts.join(" ") || "0ms";
    }

    // Long format (e.g., "0h 1m 0s 503ms")
    return [
      `${hours}h`,
      `${minutes}m`,
      `${seconds}s`,
      `${milliseconds}ms`
    ].join(' ');

  } catch (error) {
    console.error("Error formatting time:", error);
    return format === "short" ? "00:00:00.000" : 
           format === "micro" ? "0.000s" : "0ms";
  }
}

export {
  formatDate,
  formatDateString,
  dateFormat,
  daysInMonth,
  getDifferenceInTime,
  DateFormatForReschedule,
  getFormattedDate,
  disablePreviousDates,
  readableTimeFormat
};
