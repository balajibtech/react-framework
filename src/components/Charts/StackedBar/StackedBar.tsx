import React, { useState } from "react";
import { Card, Typography, Flex, Popover, Switch } from "antd";
import { useTranslation } from "react-i18next";
import EChartComponent from "@/components/Echart/Echart";
import * as echarts from "echarts";
import { lightenColor, resolveCSSVariable } from "@/utils/general";
import { ChartComponentProp } from "../Charts";
import { MenuOutlined } from "@ant-design/icons";
import ChartDownload from "@/components/ChartDownload/ChartDownload";

const { Title, Text } = Typography;

const StackedBarChart: React.FC<ChartComponentProp> = ({
  config,
  data
}: ChartComponentProp) => {
  const { t } = useTranslation();
  const [enableDecal, setEnableDecal] = useState(false);
  const [open, setOpen] = useState(false);
  if (!config || !config.chartData) return null;
  const { title } = config;

  const xAxisLabels = data.map((d: any) => d.name);
  const seriesKeys = Object.keys(data[0]).filter((key) => key !== "name");

  const colorVars = [
    "var(--t-common-primary)",
    "var(--t-common-secondary)",
    "var(--t-color-black)",
    "var(--t-api-request-icon)"
  ];

  // Popover open close function
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const series: echarts.BarSeriesOption[] = seriesKeys.map((key: string, idx: number) => {
    const baseColor = resolveCSSVariable(colorVars[idx] || "#5470c6");
    const lighterColor = lightenColor(baseColor, 70);
    return {
      name: t(key),
      type: "bar" as const,
      stack: "total",
      barWidth: "60%",
      label: {
        show: true,
        // position: 'top', // Show labels on top of bars
        formatter: (params: any) => {
          const value = params.value as number;
          return value > 0 ? value.toString() : ''; // Only show positive values
        },
        color: "#141414",
        fontWeight: 'bold',
        fontSize: 12
      },
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: baseColor },
          { offset: 1, color: lighterColor }
        ])
      },
      data: data.map((item: any) => Math.max(0, item[key])) // Ensure values are ≥ 0
    };
  });

  const chartOption: echarts.EChartsOption = {
    legend: {
      data: seriesKeys.map((key) => t(key)),
      top: 10
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
    },
    grid: {
      left: 50,
      right: 50,
      top: 60,
      bottom: 50
    },
    xAxis: {
      type: "category",
      data: xAxisLabels,
      axisLabel: {
        rotate: 30
      }
    },
    yAxis: {
      type: "value",
      position: "left",
      nameLocation: "end",
      nameGap: 20,
      nameTextStyle: {
        align: "right"
      },
      name: config?.yAxis?.dataKey,
      min: 0, // Ensure y-axis starts at 0
      axisLabel: {
        formatter: (value: number) => Math.max(0, value).toString() // Ensure y-axis labels show ≥ 0
      }
    },
    series: series,
    tooltip: {
      trigger: "axis"
    }
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
      <Flex vertical>
        <EChartComponent 
          option={chartOption} 
          style={{ 
            minHeight: 300,
            height: config?.height || "400px" 
          }} />
      </Flex>
    </Card>
  );
};

export default StackedBarChart;