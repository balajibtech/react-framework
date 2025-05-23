import { Card, Typography, Switch, Col, Popover, Flex, Tooltip } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import EChartComponent from "@/components/Echart/Echart";
import TableDisplay from "@/components/Table/Table";
import * as echarts from 'echarts';
import { lightenColor } from "@/utils/general";
import { MenuOutlined } from '@ant-design/icons';
import { ChartComponentProp } from "../Charts";
import "./PieChart.scss";
import dayjs from 'dayjs';
import ChartDownload from "@/components/ChartDownload/ChartDownload";

const CircleChart: React.FC<ChartComponentProp> = ({ config, data }) => {

  const { Title, Text } = Typography;
  const { t } = useTranslation();
  const [changeChartTableData] = useState(data)
  const [enableDecal, setEnableDecal] = useState(false);
  const [open, setOpen] = useState(false);

  if (!config || !config.chartData) return null;

  const { title } = config;

  let pieChartData: [] = [];

  // Group and count by group_name
  const grouped = data.reduce<Record<string, number>>((acc: any, item: any) => {
    acc[item.group_name] = (acc[item.group_name] || 0) + 1;
    return acc;
  }, {});

  // Convert to desired output format
  const result = Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
  }));

  if (config?.changeData) {
    data = result
  }


  const resolveCSSVariable = (value: any) => {
    if (value?.startsWith('var(')) {
      const varName = value?.slice(4, -1).trim();
      return getComputedStyle(document?.documentElement).getPropertyValue(varName).trim();
    }
    return value;
  };

  let pieindex: any = config?.chartData?.map((ind: any) => { return ind?.dataKey });

  let colorArray = [
    {
      color: "--t-common-primary"
    },
    {
      color: "--t-common-primary-lt"
    },
    {
      color: "--t-common-secondary"
    },
    {
      color: "--t-color-black"
    },
    {
      color: "--t-api-request-icon"
    },
    {
      color: "--t-sso-request-icon"
    },
    {
      color: "--t-common-layout-grey-color"
    },
    {
      color: "--t-success-color"
    },
    {
      color: "--t-header-accessiblity-link"
    },
    {
      color: "--t-color-error"
    }
  ];

  pieChartData = data?.map((item: any, index: number) => {
    const baseColor = resolveCSSVariable(
      `var(${item[config?.xAxis?.dataKey] === "Success"
        ? "--t-success-color"
        : item[config?.xAxis?.dataKey] === "Failure"
          ? "--t-color-error"
          : colorArray[index]?.color
      })`
    );

    const lighterColor = lightenColor(baseColor, 70);

    return {
      value: item[pieindex[0]],
      name: item[config?.xAxis?.dataKey],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: baseColor // Top color
          },
          {
            offset: 1,
            color: lighterColor // bottom (adjust to match your theme)
          }
        ])
      },
    }
  });

  const [showTableView, setShowTableView] = useState(false);

  const prepareTableData = (data: any) => {
    return data.map((item: any, index: number) => {
      return {
        sno: index + 1,
        full_name: item.first_name + item.last_name,
        email_id: item.email_id,
        login_time: dayjs(item.login_time).format("HH:mm, DD MMM"),
        group_name: item.group_name,
        country_code: item.country_code,
        canExpand: false,
        key: index 
      }
    })
  }

  const initialColumns = [
    {
      title: "#",
      dataIndex: "sno",
      key: "sno",
    },
    {
      title: t("name"),
      dataIndex: "full_name",
      key: "first_name",
    },
    {
      title: "Email",
      dataIndex: "email_id",
      key: "email_id",
      render: (email_id:any) => {
        const truncated = email_id?.length > 12 ? email_id?.slice(0, 12) + "…" : email_id;
        return (
          <Tooltip title={email_id}>
            <Typography.Text className="fs-12 f-reg">{truncated}</Typography.Text>
          </Tooltip>
        )
      }
    },
    {
      title: "Login on",
      dataIndex: "login_time",
      key: "login_time",
    },
    {
      title: "Group name",
      dataIndex: "group_name",
      key: "group_name",
    }
  ];

  const [visibleColumns] = useState<any>(initialColumns);

  // Determine legend position based on data length
  const legendPosition = data.length > 4 ? {
    orient: 'vertical',
    right: 25,
    top: 'center',
    align: 'left',
    itemGap: 8,
    itemWidth: 12,
    itemHeight: 12
  } : {
    top: 15,
    itemGap: 10
  };

  const chartCenter = data.length > 4 ? ['30%', '55%'] : ['50%', '60%'];
  // Popover open close function
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  let chartOption: any = {
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
    tooltip: {
      trigger: 'item',
    },
    // Removed the toolbox feature
    dataZoom: [config.zoom],
    // Determine legend position based on data length
    legend:
    {
      ...legendPosition,
      type: data?.length > 4 ? "scroll" : "plain",
      data: data.map((d: any) => d?.name),
      formatter: function (name: string) {
        const item = data.find((d: any) => d?.name === name);
        return item ? `${item?.name} - ${item.value}` : name;
      },
      textStyle: {
        overflow: 'truncate',
        width: 135, // Optional: limit legend text width
      },
      tooltip: {
        show: true,
        formatter: function (toolTipData: any) {
          const item = data.find((d: any) => d?.name === toolTipData?.name);
          return item ? `${item?.name} - ${item.value}` : toolTipData?.name;
        },
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: chartCenter,
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 5
        },
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: pieChartData?.length ? pieChartData : [
          { value: 1, name: 'No data', itemStyle: { color: '#e0e0e0' } }
        ]
      }
    ]
  };

  return (
    <Card>
      { title && (
        <Title level={5} className="d-flex space-between">
          {t(title)}
          <Text className="d-flex align-center justify-center">
            {(changeChartTableData?.length != 0 && config?.showTable) && (
              <Flex align="middle" justify="center" gap={8} className="mt-5 mr-15">
                <Text className="fs-13 f-reg cls-grey d-iblock mt-2">{showTableView ? t('Table') : t('Chart')}</Text>
                <Switch
                  className="mt-2"
                  checked={showTableView}
                  onChange={() => setShowTableView(!showTableView)}
                />
              </Flex>
            )}
            { !showTableView ? 
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
                <Text>
                  <MenuOutlined />
                </Text>
              </Popover> : 
              <></>
            }
          </Text>
        </Title>
      )}
      {showTableView ? (
        <TableDisplay
          data={prepareTableData(changeChartTableData)}
          columns={visibleColumns}
          loading={false}
          width="100%"
        />
      ) : (
        <>
          <div id={title}>
            <EChartComponent
              option={chartOption}
              style={{
                minHeight: 300,
                height: chartOption?.dataZoom[0]?.show ? "100%" : 300
              }}
            />
          </div>
        </>
      )}
    </Card>
  );
};

export default CircleChart;
