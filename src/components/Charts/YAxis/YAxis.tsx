import { YAxis } from "recharts";
import { BaseAxisConfig } from "../Charts";
import React from "react";

/**
 * Vertical component renders a Recharts YAxis with customized properties.
 *
 * This component renders a Recharts YAxis component, allowing for customization of its
 * appearance and behavior through props. It accepts configuration options such as
 * dataKey, hide, angle, textAnchor, interval, height, and tick (including tick.fontSize).
 * Default values are provided for some properties to ensure sensible rendering.
 *
 * @param {BaseAxisConfig} props - The configuration object for the 
 * @returns {JSX.Element} - The customized Recharts YAxis JSX element.
 */
const VerticalAxis: React.FC<BaseAxisConfig> = ({ 
  dataKey, hide, textAnchor = "end", interval = 0, height, tick 
}) => {

  const tickFontSize = tick?.fontSize ?? 12;

  return (

    <YAxis
      dataKey={dataKey}
      tick={({ x, y, payload }) => (
        <g transform={`translate(${x},${y})`}>
          <text 
            x={0} 
            y={0} 
            dy={16} 
            textAnchor={textAnchor}
            fill="#666" 
            fontSize={tickFontSize}
            cursor="pointer"
          >
            <tspan>
              { 
                payload.value.length > 10
                  ? `${payload.value.slice(0, 10)}...`
                  : payload.value
              }
            </tspan>
            <title>{payload.value}</title>
          </text>
        </g>
      )}
      hide={!!hide}
      interval={interval ?? 0}
      height={height ?? 40}
    />
  );
};

export default VerticalAxis;