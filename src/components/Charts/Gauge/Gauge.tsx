// import { Card, Typography } from "antd";
// import React, { useEffect, useState } from "react";
// import { ChartComponentProp } from "../Charts";
// import { useTranslation } from "react-i18next";
// import EChartComponent from "@/components/Echart/Echart";
// import { lightenColor, resolveCSSVariable } from "@/utils/general";
// import * as echarts from 'echarts';

// const DualGaugeChart: React.FC<ChartComponentProp> = ({
//   config,
//   data
// }: ChartComponentProp) => {
//   const { Title } = Typography;
//   const { t } = useTranslation();
//   const { title } = config;

//   const [activeIndex, setActiveIndex] = useState(0);
//   const total = data?.reduce((sum: number, item: any) => sum + item.value, 0);

//   // Color array with CSS variables
//   const colorArray = [
//     "--t-common-primary",
//     "--t-common-secondary",
//     "--t-common-primary-lt",
//     "--t-color-black",
//     "--t-api-request-icon",
//     "--t-sso-request-icon",
//     "--t-common-layout-grey-color",
//     "--t-success-color",
//     "--t-header-accessiblity-link",
//     "--t-color-error"
//   ];

//   /**
//    * Finds the first divisor of a number (other than 1)
//    * @param n The number to find divisors for
//    * @returns The first divisor found or the number itself if it's prime
//    */
//   const findFirstDivisor = (n: number): number => {
//     for (let i = 2; i <= Math.sqrt(n); i++) {
//       if (n % i === 0) return i;
//     }
//     return n > 1 ? n : 2; // Default to 2 for invalid numbers
//   };

//   /**
//    * Generates chart options for a specific data item
//    * @param item The data item to display
//    * @param index The index of the data item (for color selection)
//    * @returns ECharts option configuration
//    */
//   const generateChartOption = (item: any, index: number) => {
//     // Get color from CSS variable or fallback to default
//     const baseColor = resolveCSSVariable(`var(${colorArray[index % colorArray.length]})`) || '#3891a9';

//     return {
//       tooltip: {
//         trigger: 'item'
//       },
//       series: [
//         {
//           splitNumber: findFirstDivisor(total),
//           type: "gauge",
//           center: ["50%", "60%"],
//           startAngle: 210,
//           endAngle: -30,
//           min: 0,
//           max: total,
//           itemStyle: {
//             color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//               { offset: 0, color: baseColor },
//               { offset: 1, color: lightenColor(baseColor, 60) }
//             ])
//           },
//           progress: {
//             show: true,
//             width: 30,
//             roundCap: true,
//           },
//           pointer: { show: true },
//           axisLine: {
//             lineStyle: { 
//               width: 30,
//               color: [[1, '#F5F5F5']]
//             },
//           },
//           axisTick: {
//             distance: -45,
//             splitNumber: 10,
//             lineStyle: {
//               width: 1,
//               color: '#999'
//             }
//           },
//           splitLine: {
//             distance: -52,
//             length: 14,
//             lineStyle: {
//               width: 2,
//               color: '#999'
//             }
//           },
//           axisLabel: {
//             distance: -15,
//             color: '#999',
//             fontSize: 14,
//           },
//           detail: {
//             valueAnimation: true,
//             offsetCenter: [0, "45%"],
//             fontSize: 16,
//             fontWeight: "bold",
//             rich: {
//               value: {
//                 color: baseColor,
//                 fontSize: 18,
//                 fontWeight: "bold",
//                 padding: [0, 0, 5, 0]
//               },
//               total: {
//                 color: "#666",
//                 fontSize: 14
//               }
//             }
//           },
//           data: [item],
//         }
//       ],
//     };
//   };

//   // Generate all chart options
//   const chartOptions = data?.map((item: any, index: number) => 
//     generateChartOption(item, index)
//   ) || [];

// //   useEffect(() => {
// //     if (!data?.length) return;

// //     // Cycle through charts every 3 seconds
// //     const chartInterval = setInterval(() => {
// //       setActiveIndex(prev => (prev + 1) % data.length);
// //     }, 3000);

// //     return () => {
// //       clearInterval(chartInterval);
// //     };
// //   }, [data]);

//   if (!data?.length) return null;

//   return (
//     // <Card>
//     //   {title && <Title level={5}>{t(title)}</Title>}
//     //   <div className="chart-fade-wrapper">
//     //     {chartOptions.map((option:any, index:number) => (
//     //       <div 
//     //         key={index}
//     //         className={`fade ${activeIndex === index ? "fade-in" : "fade-out"}`}
//     //       >
//     //         {activeIndex === index && (
//     //           <EChartComponent 
//     //             option={option} 
//     //             style={{ height: 300 }} 
//     //           />
//     //         )}
//     //       </div>
//     //     ))}
//     //   </div>
//     // </Card>

//     <Card>
//         {title && <Title level={5}>{t(title)}</Title>}
//         <div
//             className="chart-stack-wrapper"
//             style={{
//             display: "flex",
//             flexDirection: "column",
//             gap: "16px", // spacing between charts
//             }}
//         >
//             {chartOptions.map((option: any, index: number) => (
//             <div key={index} className="chart-fade-container">
//                 <EChartComponent
//                 option={option}
//                 style={{ height: 150}}
//                 />
//             </div>
//             ))}
//         </div>
//     </Card>

//   );
// };

// export default DualGaugeChart;


import { Card, Flex, Popover, Switch, Typography } from "antd";
import React, { useState } from "react";
import { ChartComponentProp } from "../Charts";
import { useTranslation } from "react-i18next";
import EChartComponent from "@/components/Echart/Echart";
import { lightenColor, resolveCSSVariable } from "@/utils/general";
import * as echarts from "echarts";
import ChartDownload from "@/components/ChartDownload/ChartDownload";
import { MenuOutlined } from "@ant-design/icons";

const DualGaugeChart: React.FC<ChartComponentProp> = ({
  config,
  data
}: ChartComponentProp) => {
  const { Title, Text } = Typography;
  const { t } = useTranslation();
  const { title } = config;
  const [open, setOpen] = useState(false);
  const [enableDecal, setEnableDecal] = useState(false);
  if (!data || data.length < 2) return null;

  // Get base colors
  const baseColor1 = resolveCSSVariable("var(--t-common-primary)") || "#3f87ff";
  const baseColor2 = resolveCSSVariable("var(--t-common-secondary)") || "#ffc107";

  const baseRadius = 80; // starting outer radius
  const radiusStep = 20; // step between layers
  const baseWidth = 20;  // stroke width
  const totalRange: any = data.reduce((sum: any, item: any) => sum + item.value, 0);
  const total = data?.reduce((sum: number, item: any) => sum + item.value, 0);

  /**
   * Finds the first divisor of a number (other than 1)
   * @param n The number to find divisors for
   * @returns The first divisor found or the number itself if it's prime
   */
  const findFirstDivisor = (n: number): number => {
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return i;
    }
    return n > 1 ? n : 2; // Default to 2 for invalid numbers
  };

  const findHighestDivisor = (n: number): number => {
    if (n <= 1) return 1; // no proper divisor for 1 or below

    for (let i = Math.floor(n / 2); i >= 2; i--) {
      if (n % i === 0) return i;
    }

    return 1; // if no divisor found (i.e., n is prime)
  };

  let splitValue = findHighestDivisor(total);

  const series = data.map((item: any, index: number) => {
    const isOuter = index === 0;
    const radiusVal = baseRadius - index * radiusStep;

    if (radiusVal <= 10) return null; // skip if too small
    const radius = `${radiusVal}%`;

    const width = baseWidth - index * 5;
    const baseColor = index === 0 ? baseColor1 : baseColor2;
    const lightColor = lightenColor(baseColor, 60);
    return {
      name: item?.name,
      splitNumber: splitValue < 13 ? splitValue : findFirstDivisor(total),
      type: "gauge",
      radius,
      center: ["50%", "80%"],
      startAngle: 190,
      endAngle: -10,
      min: 0,
      max: totalRange,
      progress: {
        show: true,
        width,
        roundCap: true
      },
      pointer: {
        show: data.length < 3 ? true : false,
        length: "60%",
        width: 4
      },
      axisLine: {
        lineStyle: {
          width,
          color: [[1, "#F5F5F5"]]
        }
      },
      axisTick: {
        show: isOuter,
        distance: -45,
        splitNumber: 10,
        lineStyle: {
          width: 1,
          color: '#999'
        }
      },
      splitLine: {
        show: isOuter,
        distance: -52,
        length: 14,
        lineStyle: {
          width: 2,
          color: '#999'
        }
      },
      axisLabel: {
        show: isOuter,
        distance: -15,
        color: '#999',
        fontSize: 12,
        // interval: "auto",
        // formatter: function (value: number) {
        //     return Math.round(value).toString();
        // }
      },
      title: {
        show: false
      },
      detail: {
        show: false // Hide values inside gauge
      },
      itemStyle: {
        decal: enableDecal
          ? {
            symbol: "rect",
            color: "#000",
            dashArrayX: [1, 2],
            dashArrayY: [2, 3],
            rotation: Math.PI / 4,
          }
          : null,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: baseColor },
          { offset: 1, color: lightColor }
        ])
      },
      data: [item]
    };
  });

  // Popover open close function
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const option = {
    legend: {
      show: true,
      top: 15,
      left: 'center',
      itemWidth: 20,
      itemHeight: 10,
      textStyle: {
        fontSize: 12,
        color: '#666'
      },
      data: data.map((d: any) => d?.name),
      formatter: function (name: string) {
        const item = data.find((d: any) => d?.name === name);
        return item ? `${item?.name} - ${item?.value}` : name;
      }
    },
    tooltip: {
      formatter: "{b}: {c}",
    },
    series
  };

  return (
    <Card>
      {title && <Title level={5}>{t(title)}</Title>}
      <Popover
        placement="leftTop"
        content={
          <Flex vertical gap={10}>
            <Flex justify="space-between" style={{ cursor: "pointer" }} onClick={() => { setEnableDecal(!enableDecal) }}>
              <Text className="fs-13 f-reg">{t("decal_pattern")}</Text>
              <Switch className="ml-10" onClick={() => { setEnableDecal(!enableDecal) }} />
            </Flex>
            <ChartDownload chartId={title} />
          </Flex>
        }
        title="Chart Options"
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Text className="cls-chart-options">
          <MenuOutlined />
        </Text>
      </Popover>
      <div id={title}> 
        <EChartComponent 
          option={option} 
          style={{ height: 260 }} 
        /> 
      </div>
    </Card>
  );
};

export default DualGaugeChart;
