// import { useState } from "react";
// import dayjs from "dayjs";

// const useFilter = () => {
//     const [filteredData, setFilteredData] = useState<any[]>([]);

//     interface FilterHookType {
//         filterData: any[];
//         filterCol: { col: "", value: "" };
//         filterBy: "today" | "yesterday" | "last_week" | "last_month";
//         customDate: boolean
//     }

//     const filterByFunction = (filterBy: string, item: any) => {

//         const today = dayjs(); // Current date
//         const requestDate = dayjs(item?.start_date ? dayjs(item.start_date, "DD-MMM-YYYY").format("YYYY-MM-DD HH:mm:ss") : item?.RQ_date_time_stamp, "YYYY-MM-DD HH:mm:ss");

//         if (!requestDate.isValid()) return false; // Ensure requestDate is valid

//         if (["today", "yesterday", "last_week", "last_month"].includes(filterBy)) {
//             const yesterday = today.subtract(1, "day");
//             const lastWeekStart = today.subtract(1, "week").startOf("week");
//             const lastWeekEnd = today.startOf("week");
//             const lastMonthStart = today.subtract(1, "month").startOf("month");
//             const lastMonthEnd = today.startOf("month");

//             switch (filterBy) {
//                 case "today":
//                     return requestDate.isSame(today, "day");
//                 case "yesterday":
//                     return requestDate.isSame(yesterday, "day");
//                 case "last_week":
//                     return requestDate.isAfter(lastWeekStart) && requestDate.isBefore(lastWeekEnd);
//                 case "last_month":
//                     return requestDate.isAfter(lastMonthStart) && requestDate.isBefore(lastMonthEnd);
//                 default:
//                     return true;
//             }
//         }
//         else if (filterBy != "") {
//             // If filterBy is in the format "YYYY-MM-DD HH:mm:ss", compare directly
//             const filterDate = dayjs(filterBy, "YYYY-MM-DD HH:mm:ss", true);
//             if (filterDate.isValid()) {
//                 return requestDate.isSame(filterDate, "day");
//             }
//         }

//         return true; // If filterBy is invalid or empty, return all data
//     };


//     const processFilter = ({ filterData, filterCol, filterBy, customDate }: FilterHookType) => {

//         filterCol.value && filterCol.value === "All service" ? filterCol.value = "" : filterCol.value;
//         if (!filterData || filterData.length === 0) {
//             setFilteredData([]);
//             return;
//         }

//         const filteredResult = filterData.filter((item) => {

//             if (item[filterCol.col] == undefined && !customDate) {
//                 item[filterCol.col] = "no service";
//                 item?.start_date ? item?.start_date : item.RQ_date_time_stamp = "0000-00-00 00:00:00";
//             }
//             const requestDate = dayjs(item?.start_date ? dayjs(item.start_date, "DD-MMM-YYYY").format("YYYY-MM-DD HH:mm:ss") : item?.RQ_date_time_stamp, "YYYY-MM-DD HH:mm:ss");

//             if (!requestDate.isValid()) return false;
//             const matchesDateFilter = filterBy ? filterByFunction(filterBy, item) : true;
//             const matchesColumnFilter = filterCol.col && filterCol.value ? item[filterCol.col] === filterCol.value : true;

//             // Ensure both conditions are checked correctly
//             return matchesDateFilter && matchesColumnFilter;
//         });

//         setFilteredData(filteredResult);
//     };



//     return { filteredData, processFilter };
// };

// export default useFilter;


import { useState } from "react";
import dayjs from "dayjs";

interface FilterItem {
    [key: string]: any;
    start_date?: string;
    RQ_date_time_stamp?: string;
}

interface FilterHookType {
    filterData: FilterItem[];
    filterCol: { col: string; value: string };
    filterBy: "today" | "yesterday" | "last_week" | "last_month" | string;
    customDate: boolean;
}

const useFilter = () => {
    const [filteredData, setFilteredData] = useState<FilterItem[]>([]);

    const filterByFunction = (filterBy: string, item: FilterItem) => {
        const today = dayjs();
        const dateString = item?.start_date 
            ? dayjs(item.start_date, "DD-MMM-YYYY").format("YYYY-MM-DD HH:mm:ss")
            : item?.RQ_date_time_stamp;
        
        const requestDate = dayjs(dateString, "YYYY-MM-DD HH:mm:ss");

        if (!requestDate.isValid()) return false;

        if (["today", "yesterday", "last_week", "last_month"].includes(filterBy)) {
            const yesterday = today.subtract(1, "day");
            const lastWeekStart = today.subtract(1, "week").startOf("week");
            const lastWeekEnd = today.startOf("week");
            const lastMonthStart = today.subtract(1, "month").startOf("month");
            const lastMonthEnd = today.startOf("month");

            switch (filterBy) {
                case "today": return requestDate.isSame(today, "day");
                case "yesterday": return requestDate.isSame(yesterday, "day");
                case "last_week": return requestDate.isAfter(lastWeekStart) && requestDate.isBefore(lastWeekEnd);
                case "last_month": return requestDate.isAfter(lastMonthStart) && requestDate.isBefore(lastMonthEnd);
                default: return true;
            }
        }
        else if (filterBy) {
            // If filterBy is in the format "YYYY-MM-DD HH:mm:ss", compare directly
            const filterDate = dayjs(filterBy, "YYYY-MM-DD HH:mm:ss", true);
            if (filterDate.isValid()) {
                return requestDate.isSame(filterDate, "day");
            }
        }

        return true;
    };

    const processFilter = ({ filterData, filterCol, filterBy, customDate }: FilterHookType) => {
        if (!filterData?.length) {
            setFilteredData([]);
            return;
        }

        const filterValue = filterCol.value === "All service" ? "" : filterCol.value;

        const filteredResult = filterData.filter((item) => {
            // Create a copy of the item to avoid modifying the original
            const itemCopy = { ...item };
            
            // Handle missing properties without modifying the original
            if (itemCopy[filterCol.col] === undefined && !customDate) {
                itemCopy[filterCol.col] = "no service";
                if (!itemCopy.start_date && !itemCopy.RQ_date_time_stamp) {
                    itemCopy.RQ_date_time_stamp = "0000-00-00 00:00:00";
                }
            }

            const matchesDateFilter = filterBy ? filterByFunction(filterBy, itemCopy) : true;
            const matchesColumnFilter = filterCol.col && filterValue 
                ? itemCopy[filterCol.col] === filterValue 
                : true;

            return matchesDateFilter && matchesColumnFilter;
        });

        setFilteredData(filteredResult);
    };

    return { filteredData, processFilter };
};

export default useFilter;