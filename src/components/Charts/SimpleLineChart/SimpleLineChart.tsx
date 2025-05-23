import { Card, Flex, Popover, Switch, Typography } from "antd";
import React, { useMemo, useState } from "react";
import { ChartComponentProp } from "../Charts";
import { useTranslation } from "react-i18next";
import EChartComponent from "@/components/Echart/Echart";
import dayjs from 'dayjs';
import { lightenColor, resolveCSSVariable } from "@/utils/general";
import { MenuOutlined } from "@ant-design/icons";
import ChartDownload from "@/components/ChartDownload/ChartDownload";
import * as echarts from 'echarts';

/**
 * SimpleLineChart component renders a simple line chart based on the provided configuration.
 * This component displays a line chart using the Recharts library. It takes a configuration object 
 * (`config`) as a prop, which should contain the chart data and other configuration options 
 * (e.g., xAxis, yAxis, tooltip). The chart data is expected to be an array of objects, where each 
 * object represents a point on the line chart. 
 * @param {ChartComponentProp} props - The configuration object for the chart.
 * @returns {JSX.Element|null} - The line chart JSX element, or null if config or chartData is missing.
 */
const SimpleLineChart: React.FC<ChartComponentProp> = ({
  config,
  data,
}: ChartComponentProp) => {
  const { Title, Text } = Typography;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [enableDecal, setEnableDecal] = useState(false);
  const { title } = config;
  if (!config || !config.chartData) return null;

  // Memoize expensive calculations
  const { xAxisArray, seriesArray, zoomEnableCondition } = useMemo(() => {
    const { xAxis } = config;

    // Single loop to process x-axis data
    const xAxisArray = data?.map((item: any) => {
      const value = item[xAxis.dataKey];
      if (!value) return "Others";
      const date = dayjs(value);
      return date.isValid() ? date.format("HH:MM, DD MMM, YYYY") : value;
    }) || ["No data"];

    // Get Y-axis keys in single operation
    const yKeys = data?.length
      ? Object.keys(data[0]).filter(key =>
        !['serviceName', 'method', 'total', xAxis.dataKey].includes(key)
      )
      : [];

    // Create series data with minimal loops
    const seriesArray = yKeys.map((dataKey, index) => {
      const colorConfig: any = config?.chartData?.[index] || {};
      const baseColor = resolveCSSVariable(colorConfig?.stroke || "#5470c6");
      const lighterColor = lightenColor(baseColor, 60);
      return {
        name: t(dataKey),
        type: 'line',
        // data: data?.map((item: any) => item[dataKey]),
        data: data.map((item: any) => ({
          value: item[dataKey],
          filterService: item,
          filterData: xAxisArray,
        })),
        // symbol: data?.length <= 30 ? 'circle' : 'none',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: baseColor
            },
            {
              offset: 1,
              color: lighterColor
            }
          ])
        },
        symbolSize: 6,
        lineStyle: {
          width: 2,
          // color: baseColor
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: baseColor
            },
            {
              offset: 1,
              color: lighterColor
            }
          ])
        },
        showSymbol: data?.length <= 30,
        animation: data?.length <= 200,
        progressive: data?.length > 100 ? 200 : 0,
        progressiveThreshold: 100,
        large: true
      };
    });

    const zoomEnableCondition = config?.zoom?.[0]?.show && (data?.length || 0) > (config?.zoomEnableCount || 30);
    return { xAxisArray, seriesArray, zoomEnableCondition };

  }, [config, data, t]);

  // Popover open close function
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const chartOption = useMemo(() => ({
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
    },
    xAxis: {
      type: config.xAxis.type,
      data: xAxisArray.length ? xAxisArray : ["No data"],
      boundaryGap: config.xAxis.boundaryGap,
      axisLabel: {
        rotate: 45,
        interval: xAxisArray?.length > 20 ? "auto" : 0,
        // formatter: (value: string) => (value.length > 8 ? value.slice(0, 10) + "…" : value),
        formatter: (value: string) => {
          const formatted = dayjs(value, "HH:mm, DD MMM, YYYY").format("HH:mm, DD MMM");
          return formatted === "Invalid Date" ? (value.length > 10 ? value.slice(0, 10) + "…" : value) : formatted;
        },
      },
      tooltip: {
        show: true,
        formatter: ({ value }: { value: string }) => value,
      },
    },
    yAxis: {
      type: 'value',
      name: config.yAxis?.name || config.yAxis.dataKey || '',
      nameLocation: 'end',
      nameGap: 20,
      nameTextStyle: {
        align: 'right',
        // fontWeight: 'bold'
      },
      ...(!data?.length && { min: 0, max: 1 })
    },
    legend: {
      show: config.legendData?.show,
      type: 'scroll', // Add scroll for many legend items
      top: config.legendData?.top,
      left: config.legendData?.left,
      textStyle: config.legendData?.textStyle,
      formatter: (name: string) =>
        name.split(/(?=[A-Z])|_/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
    },
    series: seriesArray,
    tooltip: {
      ...config.tooltipData,
      trigger: 'axis',
      axisPointer: { type: 'line' }
    },
    grid: {
      ...config.gridData,
      ...(xAxisArray?.length < 20
        ? {
          bottom: config.gridData.bottom,
          top: config.gridData.top
        }
        : {
          bottom: "20%",
          top: "25%"
        }
      ),
      containLabel: true
    },
    dataZoom: zoomEnableCondition ? config.zoom : undefined,
    animation: seriesArray.length < 50,
    // progressive: 200,
    // progressiveThreshold: 500
  }), [config, data, xAxisArray, seriesArray, zoomEnableCondition]);

  return (
    <Card>
      {config.title && <Title level={5}>{t(config.title)}</Title>}
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
      <Flex vertical>
        <div id={title}>
          <EChartComponent
            option={chartOption}
            style={{
              minHeight: 300,
              height: zoomEnableCondition ? "100%" : config?.height || 350
            }}
          />
        </div>
      </Flex>
    </Card>
  );
};

export default SimpleLineChart;
