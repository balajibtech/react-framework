import { XAxis } from "recharts";
import { XAxisConfig } from "../Charts";
import React from "react";

/**
 * HorizontalAxis component renders a Recharts XAxis with customized properties.
 *
 * This component renders a Recharts XAxis component, allowing for customization of its
 * appearance and behavior through props. It accepts configuration options such as
 * dataKey, hide, angle, textAnchor, interval, height, and tick (including tick.fontSize).
 * Default values are provided for some properties to ensure sensible rendering.
 *
 * @param {XAxisConfig} props - The configuration object for the XAxis.
 * @returns {JSX.Element} - The customized Recharts XAxis JSX element.
 */
const HorizontalAxis: React.FC<XAxisConfig> = ({ 
  dataKey, hide, angle = 0, textAnchor = "middle", interval = 0, height = 40, tick 
}) => {

  const tickFontSize = tick?.fontSize ?? 14;

  return (
    <XAxis
      dataKey={dataKey}
      tick={({ x, y, payload }) => (
        <g transform={`translate(${x},${y})`}>
          <text 
            x={0} 
            y={0} 
            dy={16} 
            textAnchor={textAnchor}
            fill="#666" 
            transform={`rotate(${angle ?? 0})`}
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

export default HorizontalAxis;