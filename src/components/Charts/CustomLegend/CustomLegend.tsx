import { Flex } from "antd";
import React from "react";
import { LegendProps } from "recharts";

interface CustomLegend extends LegendProps {
  formatValue?: boolean;
}

/**
 * CustomLegend component for overriding the default Legend in Recharts.
 * It renders a list-based legend with colored indicators for each data series.
 *
 * @param {LegendProps} props - Props passed by Recharts containing legend data.
 * @returns {JSX.Element} - A custom legend component.
 */
const CustomLegend: React.FC<CustomLegend> = (props) => {
  const { formatValue, payload, layout } = props;

  const formatLegend = (value: string) => {
    const formattedStr = value
      .replace(/([A-Z])/g, " $1") // Insert space before each uppercase letter
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2") // Insert space after lowercase followed by uppercase
      .replace(/[-_]/g, " ") // Replace hyphens and underscores with spaces
      .toLowerCase()
      .trim();

    return formattedStr.charAt(0).toUpperCase() + formattedStr.slice(1);
  };

  if (!payload) return null; // Handle cases where payload is undefined


  const uniquePayload = Array.from(
    new Map(payload.map((item: { value: any; }) => [item.value, item])).values()
  );

  return (
    <ul
      style={{
        listStyle: "none",
        display: "flex",
        flexWrap: "wrap",
        gap: layout == "vertical" ? 0 : "10px",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: layout == "vertical" ? "column" : "row",
        marginBlockEnd: "10px",
      }}
    >
      {uniquePayload.map((entry:any, index) => (
        <li
          key={`legend-item-${index}`}
          style={{ color: "var(--t-color-black)", fontWeight: "500" }}
          className="fs-11"
        >
          <Flex align="center">
            {/* Color Indicator */}
            <span
              style={{
                display: "inline-block",
                width: "24px",
                height: "12px",
                backgroundColor: entry.color,
                marginRight: "5px",
                borderRadius: "2px",
              }}
            ></span>
            {formatValue ? formatLegend(entry.value) : entry.value}
          </Flex>
        </li>
      ))}
    </ul>
  );
};

export default CustomLegend;
