import React, { useState } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Popover,
  Switch,
  Flex,
  // Empty 
} from "antd";
import { ChartComponentProp } from "../Charts";
import { useTranslation } from "react-i18next";
import EChartComponent from "@/components/Echart/Echart";
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import ChartDownload from "@/components/ChartDownload/ChartDownload";
import { MenuOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

/**
 * StackedAreaChart component renders a stacked area chart based on the provided configuration.
 * This component displays a stacked area chart using Recharts library. It takes a configuration object
 * (`config`) as a prop, which should contain the chart data and other configuration options
 * (e.g., xAxis, yAxis, tooltip). The chart data is expected to be an array of objects, where each
 * object represents an area in the chart. The areas are stacked on top of each other to show the
 * cumulative value.
 *
 * @param {ChartComponentProp} props - The configuration object for the chart.
 * @returns {JSX.Element|null} - The stacked area chart JSX element, or null if config or chartData is missing.
 */
const StackedAreaChart: React.FC<ChartComponentProp> = ({
  config,
  data = [],
}: ChartComponentProp) => {
  const { t } = useTranslation();
  const [enableDecal, setEnableDecal] = useState(false);
  const [open, setOpen] = useState(false);
  if (!(config && config.chartData && data)) return null;

  const { title, legendData, gridData, tooltipData, xAxis } = config;
  const renderData = data?.chartData?.length ? data?.chartData : data;

  const xAxisData = renderData?.map((item: any) => {
    return dayjs(item[xAxis.dataKey]).format("HH:MM, DD MMM, YYYY") != "Invalid Date" ? dayjs(item[xAxis.dataKey]).format("HH:MM, DD MMM, YYYY") : item[config.xAxis.dataKey]
  });

  const zoomEnableCondition = (config?.zoom?.[0]?.show && renderData?.length > config?.zoomEnableCount);

  const resolveCSSVariable = (value: string) => {
    if (value.startsWith('var(')) {
      const varName = value.slice(4, -1).trim();
      return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    }
    return value;
  };

  /**
 * Converts a hex color to RGB.
 */
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const sanitizedHex = hex.replace('#', '');
    const bigint = parseInt(sanitizedHex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }

  /**
   * Returns a LinearGradient with a random variation from the base hex color.
   */
  const generateGradientFromHex = (hex: string) => {
    const base = hexToRgb(hex);

    const lighten = (val: number) => Math.min(255, val + Math.floor(Math.random() * 50 + 20));
    const darken = (val: number) => Math.max(0, val - Math.floor(Math.random() * 50 + 20));

    const topColor = `rgb(${lighten(base.r)}, ${lighten(base.g)}, ${lighten(base.b)})`;
    const bottomColor = `rgb(${darken(base.r)}, ${darken(base.g)}, ${darken(base.b)})`;

    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: topColor },
      { offset: 1, color: bottomColor },
    ]);
  }

  // Popover open close function
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const seriesData =
    config.chartData?.map((configData: any) => {
      const baseColor = resolveCSSVariable(configData.stroke);

      return {
        name: configData?.dataKey,
        type: 'line',
        stack: 'Total',
        showSymbol: false,
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
          color: generateGradientFromHex(baseColor),
        },
        smooth: true,
        lineStyle: {
          width: 0
        },
        areaStyle: {
          opacity: 0.8,
          color: generateGradientFromHex(baseColor)
        },
        emphasis: {
          focus: 'series'
        },
        data: renderData.map((item: any) => ({
          value: item[configData?.dataKey],
          filterService: item,
          filterData: xAxisData,
        })),
      }
    });

  let chartOption: any = {
    tooltip: {
      ...tooltipData,
      formatter: function (params: any[]) {
        const time = params[0]?.axisValueLabel || '';
        const items = params
          ?.map(p => `${p?.marker} ${t(p?.seriesName)}: ${(p?.data)}`)
          ?.join("<br/>");
        // Always return something to keep tooltip visible
        return items ? `${time}<br/>${items}` : time;
      }
    },
    grid: gridData,
    xAxis: [{
      type: xAxis.type,
      boundaryGap: xAxis.boundaryGap,
      data: xAxisData?.length ? xAxisData : ['No data'],
      axisLabel: {
        formatter: (value: string) => {
          const formatted = dayjs(value, "HH:mm, DD MMM, YYYY").format("HH:mm, DD MMM");
          return formatted === "Invalid Date" ? (value.length > 10 ? value.slice(0, 10) + "…" : value) : formatted;
        },
      }
    }],
    yAxis: [{
      name: config.yAxis.dataKey,
      position: "left",
      nameLocation: "end",
      nameGap: 20,
      nameTextStyle: {
        align: "right"
      },
      type: 'value',
      ...(!renderData?.length && {
        min: 0,
        max: 1
      })
    }],
    dataZoom: [zoomEnableCondition ? config?.zoom : false],
    series: seriesData,
    legend: {
      show: legendData?.show,
      top: legendData?.top,
      left: legendData?.left,
      textStyle: legendData?.textStyle,
      formatter: function (name: string) {
        const count = data?.userCount?.[name]
        return config?.legendData?.showCount && count ? `${t(name)} - ${count}` : t(name);
      }
    },
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
      {/* { data?.length ?  */}
      <div id={title}>
        <EChartComponent
          option={chartOption}
          style={{
            height: zoomEnableCondition ? "100%" : config?.height
          }}
        />
      </div>
      {/* :  */}
      {/* <Empty /> } */}
      {config?.showPerformanceData ? (
        <Row justify="space-between" className="mt-7">
          <Col style={{ textAlign: "center", flex: 1 }}>
            <Text className="cls-grey-lite">CPU utilization</Text> <br />
            <Text className="fs-16 f-bold p-clr">
              {data?.statistics?.cpuUtilization.toFixed(2)}%
            </Text>
          </Col>
          <Col style={{ textAlign: "center", flex: 1 }}>
            <Text className="cls-grey-lite">Memory utilization</Text> <br />
            <Text className="fs-16 f-bold p-clr">
              {data?.statistics?.memoryUtilization.toFixed(2)}%
            </Text>
          </Col>
          <Col style={{ textAlign: "center", flex: 1 }}>
            <Text className="cls-grey-lite">Server load</Text>  <br />
            <Text className="fs-16 f-bold p-clr">
              {data?.statistics?.serverLoad.toFixed(2)}%
            </Text>p
          </Col>
        </Row>
      ) : (
        <></>
      )
      }
    </Card>
  );
};

export default StackedAreaChart;

