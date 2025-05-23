import { Card, Flex, Popover, Switch, Typography } from "antd";
import { useTranslation } from "react-i18next";
import EChartComponent from "@/components/Echart/Echart";
import { ChartComponentProp } from "../Charts";
import dayjs from 'dayjs';
import { resolveCSSVariable, lightenColor } from "@/utils/general";
import ChartDownload from "@/components/ChartDownload/ChartDownload";
import { MenuOutlined } from "@ant-design/icons";
import { useState, useMemo, useCallback, startTransition } from "react";
const { Text, Title } = Typography;

const MixedLineBar: React.FC<ChartComponentProp> = ({
  config,
  data = [],
}: ChartComponentProp) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [enableDecal, setEnableDecal] = useState(false);
  const { title } = config;

  // Memoized values
  const baseColor = useMemo(() => resolveCSSVariable("var(--t-common-primary)"), []);
  const lighterColor = useMemo(() => lightenColor(baseColor, 60), [baseColor]);
  const firstIndexColor = useMemo(() => resolveCSSVariable("var(--t-common-secondary)"), []);

  const xAxisArray = useMemo(() => {
    return data.map((item: any) => {
      const value = item.time;
      if (!value) return "Others";
      const date = dayjs(value);
      return date.isValid() ? date.format("HH:MM, DD MMM, YYYY") : value;
    });
  }, [data]);

  const metricKeys = useMemo(() => {
    const keys = new Set<string>();
    data.forEach((d: any) => {
      Object.keys(d).forEach(key => {
        if (key !== "time" && key !== "response_time") {
          keys.add(key);
        }
      });
    });
    return Array.from(keys);
  }, [data]);

  const generateGradientColor = useCallback((index: number) => ({
    type: "linear",
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: index === 0 ? firstIndexColor : `hsl(${(index * 45) % 360}, 70%, 60%)`
      },
      {
        offset: 1,
        color: index === 0 ? lightenColor(firstIndexColor, 35) : `hsl(${(index * 45 + 30) % 360}, 70%, 40%)`
      }
    ]
  }), [firstIndexColor]);

  // Base series without decal
  const baseSeries = useMemo(() => [
    ...metricKeys.map((key: string, idx: number) => ({
      name: t(key),
      type: "bar",
      yAxisIndex: 1,
      data: data.map((item: any) =>
        item[key] !== undefined
          ? {
            value: +item[key],
            filterService: item,
            filterData: xAxisArray,
          }
          : 0
      ),
      itemStyle: {
        color: generateGradientColor(idx)
      },
    })),
    {
      name: t("response_time"),
      type: "line",
      yAxisIndex: 0,
      data: data.map((d: any) => +d.response_time),
      smooth: true,
      lineStyle: {
        color: baseColor,
        width: 2
      },
      itemStyle: {
        color: lighterColor
      }
    }
  ], [metricKeys, data, xAxisArray, generateGradientColor, baseColor, lighterColor, t]);

  // Series with decal applied when enabled
  const series = useMemo(() => {
    return baseSeries.map(seriesItem => ({
      ...seriesItem,
      itemStyle: {
        ...seriesItem.itemStyle,
        decal: enableDecal ? {
          symbol: 'rect',
          symbolKeepAspect: true,
          dashArrayX: [1, 0],
          dashArrayY: [2, 5],
          rotation: Math.PI / 4,
          color: 'rgba(0, 0, 0, 0.2)'
        } : undefined
      }
    }));
  }, [baseSeries, enableDecal]);

  const option = useMemo(() => ({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      },
      formatter: function (params: any[]) {
        const header = params?.[0]?.axisValueLabel ?? "";
        const items = params
          ?.filter(p => p?.value !== 0 && p?.value !== null && p?.value !== undefined)
          ?.map(p => `${p?.marker} ${p?.seriesName}: ${(+p?.value).toFixed(2)}`)
          ?.join("<br/>");

        return items ? `${header}<br/>${items}` : header;
      }
    },
    legend: {
      type: "scroll",
      top: 20,
    },
    xAxis: {
      type: "category",
      data: xAxisArray.length ? xAxisArray : ["No data"],
      axisLabel: {
        rotate: 60,
        interval: "auto",
        formatter: (value: string) => {
          const formatted = dayjs(value, "HH:mm, DD MMM, YYYY").format("HH:mm, DD MMM");
          return formatted === "Invalid Date"
            ? (value.length > 12 ? value.slice(0, 13) + "…" : value)
            : formatted;
        },
      },
      tooltip: {
        show: true,
        formatter: ({ value }: { value: string }) => value,
      },
    },
    yAxis: [
      {
        type: "value",
        name: t("Seconds"),
        position: "left",
        nameLocation: "end",
        nameGap: 20,
        nameTextStyle: {
          align: "right",
        },
        alignTicks: true,
        splitLine: {
          show: true,
        },
        axisLabel: {
          formatter: "{value}"
        }
      },
      {
        type: "value",
        name: t("Counts"),
        nameGap: 20,
        nameTextStyle: {
          align: "left",
        },
        alignTicks: true,
        splitLine: {
          show: true,
        },
        axisLabel: {
          formatter: "{value}"
        }
      }
    ],
    grid: xAxisArray.length < 20
      ? {
        top: 90,
        bottom: 10,
        right: 50,
        left: 40,
        containLabel: true,
      }
      : {
        ...config?.gridData,
        containLabel: true,
      },
    dataZoom: xAxisArray.length > 20 ? [
      { type: "slider", show: true, xAxisIndex: 0, start: 0, end: 100 },
      { type: "inside", xAxisIndex: 0, start: 0, end: 100 },
    ] : [],
    series
  }), [xAxisArray, series, t, config?.gridData]);

  const toggleDecal = useCallback(() => {
    startTransition(() => {
      setEnableDecal(prev => !prev);
    });
  }, []);

  const popoverContent = useMemo(() => (
    <Flex vertical gap={10}>
      <Flex justify="space-between" align="center">
        <Text className="fs-13 f-reg">{t("decal_pattern")}</Text>
        <Switch
          checked={enableDecal}
          onChange={toggleDecal}
        />
      </Flex>
      <ChartDownload chartId={title} />
    </Flex>
  ), [enableDecal, title, toggleDecal]);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
  }, []);

  return (
    <Card>
      {config?.title && <Title level={5}>{t(config.title)}</Title>}
      <Popover
        placement="leftTop"
        content={popoverContent}
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
            option={option}
            style={{
              minHeight: 300,
              height: config?.height ? config.height : 300
            }}
          />
        </div>
      </Flex>
    </Card>
  );
};

export default MixedLineBar;