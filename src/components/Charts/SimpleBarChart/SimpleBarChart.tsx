import React, { useMemo, useState } from "react";
import { Card, Flex, Popover, Switch, Typography } from "antd";
import { ChartComponentProp } from "../Charts";
import { useTranslation } from "react-i18next";
import EChartComponent from "@/components/Echart/Echart";
import dayjs from "dayjs";
import ChartDownload from "@/components/ChartDownload/ChartDownload";
import { MenuOutlined } from "@ant-design/icons";

const SimpleBarChart: React.FC<ChartComponentProp> = ({ config, data }) => {
  const { Title, Text } = Typography;
  const { t } = useTranslation();
  const [enableDecal, setEnableDecal] = useState(false);
  const [open, setOpen] = useState(false);
  if (!config || !config.chartData) return null;

  const { title, xAxis, legendData, tooltipData } = config;

  // Memoize processed data to avoid recomputation
  const { xAxisArray, seriesArray, verticalLegendCheck, legendLength = 0 } = useMemo(() => {
    if (!data || data.length === 0) return { YchartData: [], xAxisArray: [], seriesArray: [], verticalLegendCheck: false };

    // Precompute formatted xAxis values once and cache
    const formattedXAxisArray = data.map((item: any) => {
      const val = item[xAxis.dataKey];
      if (!val) return "Others";
      const formatted = dayjs(val).format("HH:MM, DD MMM, YYYY");
      return formatted === "Invalid Date" ? val : formatted;
    });

    // Extract unique Y-axis keys excluding xAxis key and known keys
    const keysSet = new Set<string>();
    data.forEach((obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (key !== xAxis.dataKey && key !== "serviceName" && key !== "method" && key !== "total") {
          keysSet.add(key);
        }
      });
    });
    const yKeys = Array.from(keysSet);

    const legendLength = yKeys.length;
    const verticalLegend = legendLength > 5;


    // Construct series array
    const series = yKeys.map((key) => {
      return {
        data: data.map((item: any) => ({
          value: item[key],
          filterService: item,
          filterData: formattedXAxisArray,
        })),
        name: t(key),
        type: "bar",
        large: true,
        // itemStyle: {}  // Add if needed with memoized colors
      };
    });

    return {
      YchartData: yKeys,
      xAxisArray: formattedXAxisArray,
      seriesArray: series,
      verticalLegendCheck: verticalLegend,
      legendLength: legendLength
    };
  }, [data, xAxis.dataKey, t]);

  // Zoom condition
  const zoomEnableCondition = config?.zoom?.[0]?.show && data?.length > config?.zoomEnableCount;

  // Popover open close function
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const chartOption = useMemo(() => {
    return {
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
        tooltip: {
          show: true,
          formatter: ({ value }: { value: string }) => value,
        },
        type: xAxis.type,
        data: xAxisArray.length ? xAxisArray : ["No data"],
        axisLabel: {
          rotate: 60,
          formatter: (value: string) => {
            const formatted = dayjs(value, "HH:mm, DD MMM, YYYY").format("HH:mm, DD MMM");
            return formatted === "Invalid Date" ? (value.length > 10 ? value.slice(0, 10) + "…" : value) : formatted;
          },
        },
      },
      yAxis: {
        name: config.yAxis.dataKey,
        position: "left",
        nameLocation: "end",
        nameGap: 20,
        nameTextStyle: {
          align: "right",
        },
        type: "value",
        ...(!data?.length && {
          min: 0,
          max: 1,
        }),
      },
      grid: !verticalLegendCheck
        ? { ...config.gridData }
        : {
          top: legendLength > 12 ? 90 : 50,
          right: legendLength > 12 ? 30 : 220,
          bottom: 55,
          left: 25,
          containLabel: true,
        },
      dataZoom: zoomEnableCondition
        ? [
          { type: "slider", show: true, xAxisIndex: 0, start: 0, end: 100 },
          { type: "inside", xAxisIndex: 0, start: 0, end: 100 },
        ]
        : [],
      series: seriesArray,
      tooltip: tooltipData,
      legend: {
        show: legendData?.show,
        orient: legendLength > 12 || !verticalLegendCheck ? "horizontal" : "vertical",
        type: legendLength > 12 ? "scroll" : "plain",
        top: legendLength > 12 || !verticalLegendCheck ? legendData?.top : "center",
        right: legendLength > 12 || !verticalLegendCheck ? undefined : 10,
        left: legendLength > 12 || !verticalLegendCheck ? legendData?.left : undefined,
        itemWidth: 14,
        itemHeight: 14,
        itemGap: 10,
        textStyle: {
          ...legendData?.textStyle,
          width: 150,
          overflow: "truncate",
          ellipsis: "..."
        },
        formatter: (name: string) => t(name),
        tooltip: {
          show: true,
          formatter: (data: any) => t(data?.name)
        }
      }
    };
  }, [
    xAxis.type,
    xAxisArray,
    verticalLegendCheck,
    config.gridData,
    zoomEnableCondition,
    seriesArray,
    tooltipData,
    legendData,
    config.yAxis.dataKey,
    t,
    data?.length,
    enableDecal
  ]);

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
        <div id={title}> 
          <EChartComponent 
            option={chartOption} 
            style={{ 
              minHeight: 350,
              height: zoomEnableCondition ? "100%" : config?.height 
            }} 
          /> 
        </div>
      </Flex>
    </Card>
  );
};

export default SimpleBarChart;
