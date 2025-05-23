import "./DynamicChart.scss";
import CFG from "@/config/config.json";
import { Suspense, lazy, memo } from "react";
import { ChartComponentProp } from "../Charts";
import { Card, Col, Flex, Row, Skeleton, Space, Typography } from "antd";
import { useAppSelector } from "@/hooks/App.hook";
import { CheckCircleOutlined, CloseCircleOutlined, ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";
// import localData from "public/api/localeData.json";
const { Text, Title } = Typography;

interface DynamicChart {
  customConfigKey?: string;
  transactionData?: Record<string, any>;
  loading: boolean;
}

/**
 * DynamicChart component renders a collection of charts based on the provided configuration.
 * This component dynamically renders different types of charts (e.g., area, line, pie) 
 * based on the `chartConfig` array, which defines the configuration for each chart.
 * It handles lazy loading of chart components for better performance and provides
 * a basic error handling mechanism for cases where the specified chart type is not found.

 * @returns A React component that renders a collection of dynamic charts.
 */
const DynamicChart: React.FC<DynamicChart> = ({
  customConfigKey,
  transactionData,
  loading
}: DynamicChart) => {

  const { activeRoute } = useAppSelector((state) => state.MenuReducer);

  const configKey: any = customConfigKey
    ? customConfigKey
    : activeRoute?.component;
  const activeChart = useAppSelector((state) => state.MenuReducer.chartData);
  const { t } = useTranslation();

  const chartConfig = (CFG["chart"] as any)[configKey as string] || [];

  if (!chartConfig) {
    console.error(`No config found for type: ${configKey}`);
    return (
      <Text type="danger">
        Error: Config for "{configKey}" not found
      </Text>
    );
  }

  const renderSkeleton = (chart: any) => (
    <Flex vertical gap={10} style={{ height: chart.height, overflow: "hidden" }}>
      <Skeleton.Button block active />
      <Skeleton active />
      {Array.from({ length: 10 }).map((_, idx) => (
        <Skeleton.Button key={idx} block active />
      ))}
    </Flex>
  );

  /* Optimized Chart Components Import */
  const ChartComponents: Record<
    string,
    React.ComponentType<ChartComponentProp>
  > = {
    area: lazy(() => import(`@/components/Charts/StackedAreaChart/StackedAreaChart`)),
    line: lazy(() => import("@/components/Charts/SimpleLineChart/SimpleLineChart")),
    bar: lazy(() => import("@/components/Charts/SimpleBarChart/SimpleBarChart")),
    pie: lazy(() => import("@/components/Charts/PieChart/PieChart")),
    gauge: lazy(() => import("@/components/Charts/Gauge/Gauge")),
    progress: lazy(() => import("@/components/Charts/Progress/Progress")),
    stat: lazy(() => import("@/components/Charts/Stat/Stat")),
    mixedLineBar: lazy(() => import("@/components/Charts/MixedLineBar/MixedLineBar")),
    stackedBar: lazy(() => import("@/components/Charts/StackedBar/StackedBar")),
  };

  return (
    <>
      {Object.entries(chartConfig)?.map(([key, chart]: [string, any]) => {

        const ChartComponent = ChartComponents[chart.type];
        let sortedData: any = [];

        // if (key === "responseTime") {
        //   sortedData = (Array.isArray(transactionData?.[key]) ? [...transactionData?.[key]] : [])
        //     .sort((a: any, b: any) => b.time.localeCompare(a.time))
        //     .slice(0, 5);
        // }

        if (key === "cards") {
          return (
            <Col
              sm={12}
              md={12}
              lg={12}
              xl={4}
            >
              <Row gutter={[12, 12]}>
                {Object.entries(chart).map(([cardKey, cardConfig]: [string, any]) => {
                  const CardChartComponent = ChartComponents[cardConfig.type];

                  if (!CardChartComponent) {
                    console.error(`No chart component found for card type: ${cardConfig.type}`);
                    return (
                      <Col key={cardKey} span={24}>
                        <Text type="danger">
                          Error: Card chart type "{cardConfig.type}" not found
                        </Text>
                      </Col>
                    );
                  }

                  // Get data for this specific card
                  const cardData = transactionData?.[cardKey] || [];

                  return (
                    <Col
                      key={cardKey}
                      xs={24}
                      sm={12}
                      md={12}
                      lg={cardConfig.col || 12}
                      xl={cardConfig.col || 12}
                      className="cls-dynamicChart"
                    >
                      <Flex vertical>
                        {loading ? (
                          renderSkeleton(cardConfig)
                        ) : (
                          <Suspense fallback={renderSkeleton(cardConfig)}>
                            <CardChartComponent
                              config={cardConfig}
                              data={cardData}
                            />
                          </Suspense>
                        )}
                      </Flex>
                    </Col>
                  );
                })}
              </Row>
            </Col>
          );
        }

        const StatsCard = (apiStats:any) => {
          const successData = apiStats?.[key]?.find(
            (item: any) => item?.name?.toLowerCase() === "success" || item?.name.toLowerCase() === "success count"
          ) || { name: "Success", value: 0 };

          const errorData = apiStats?.[key]?.find(
            (item: any) => item?.name?.toLowerCase() === "failure" || item?.name.toLowerCase() === "error count" || item?.name.toLowerCase() === "failure count"
          ) || { name: "Failure", value: 0 };

          return (
            <Card
              style={{
                height: "100%",
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                overflow: 'hidden',
              }}
              bodyStyle={{
                height: '100%',
                padding: 15,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Title level={5} style={{ margin: 0 }}>{t(chartConfig?.[key]?.title || "response_stats")}</Title>
              {/* <Carousel autoplay dots={false} style={{ flex: 1, textAlign: "center" }}> */}
              {/* Success Slide */}
              <Flex
                vertical
                align="center"
                justify="center"
                style={{
                  height: '100%',
                  textAlign: 'center',
                }}
              >
                <Space align="center" size={12} className="pt-40 pb-40" style={{ borderBlockEnd: "2px solid #efefef" }}>
                  <Flex
                    align="center"
                    justify="center"
                    style={{
                      backgroundColor: '#52c41a20',
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      fontSize: 32,
                      color: '#52c41a',
                    }}
                  >
                    <CheckCircleOutlined />
                  </Flex>
                  <Flex wrap>
                    <Text style={{ fontSize: 16, textAlign: "left" }} className="d-block w-100 cls-grey-lite">{t("success")}</Text>
                    <Title level={3} style={{ color: '#52c41a', margin: 0 }}>
                      {successData.value.toLocaleString()} <ArrowUpOutlined />
                    </Title>
                  </Flex>
                </Space>
              </Flex>

              {/* Error Slide */}
              <Flex
                vertical
                align="center"
                justify="center"
                style={{
                  height: '100%',
                  textAlign: 'center',
                }}
              >
                <Space align="center" size={12} className="pb-30">
                  <Flex
                    align="center"
                    justify="center"
                    style={{
                      backgroundColor: '#f5222d20',
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      fontSize: 32,
                      color: '#f5222d',
                    }}
                  >
                    <CloseCircleOutlined />
                  </Flex>
                  <Flex wrap>
                    <Text style={{ fontSize: 16, textAlign: "left" }} className="d-block w-100 cls-grey-lite">{t("failure")}</Text>
                    <Title level={3} style={{ color: '#f5222d', margin: 0 }}>
                      {errorData.value.toLocaleString()} <ArrowDownOutlined />
                    </Title>
                  </Flex>
                </Space>
              </Flex>
              {/* </Carousel> */}
            </Card>
          );
        };

        if (!ChartComponent) {
          console.error(`No chart component found for type: ${chart.type}`);
          return (
            <Text type="danger" key={key}>
              Error: Chart type "{chart.type}" not found
            </Text>
          );
        }

        if (!activeChart?.[configKey]?.[key]?.showChart) return null;

        return (
          <Col
            key={key}
            sm={12}
            md={12}
            lg={12}
            xl={chart.col}
            className="cls-dynamicChart"
          >
            <Flex vertical>
              {loading || !transactionData?.[key] ? (
                renderSkeleton(chart)
              ) : (
                <Suspense fallback={renderSkeleton(chart)}>
                  {(key === "apiStats" || key === "responseVolume" || key === "ssoVolume" || key === "ApplicationResponseStats") ? (
                    StatsCard(transactionData)
                  ) : (
                    <ChartComponent
                      config={chart}
                      data={sortedData?.length ? sortedData : transactionData?.[key]}
                    />
                  )}

                </Suspense>
              )}
            </Flex>
          </Col>
        );
      })}
    </>
  );

};

export default memo(DynamicChart);


// import "./DynamicChart.scss";
// import CFG from "@/config/config.json";
// import { Suspense, lazy, memo, useMemo } from "react";
// import { ChartComponentProp } from "../Charts";
// import { Card, Col, Flex, Row, Skeleton, Space, Typography } from "antd";
// import { useAppSelector } from "@/hooks/App.hook";
// import { CheckCircleOutlined, CloseCircleOutlined, ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
// import { useTranslation } from "react-i18next";
// import { ErrorBoundary } from "react-error-boundary";
// import ServerError from "@/pages/ServerError/ServerError";

// const { Text, Title } = Typography;

// interface DynamicChartProps {
//   customConfigKey?: string;
//   transactionData?: Record<string, any>;
//   loading: boolean;
// }

// interface ApiStatData {
//   name: string;
//   value: number;
// }

// // Chart components map with lazy loading
// const ChartComponents: Record<
//   string,
//   React.ComponentType<ChartComponentProp>
// > = {
//   area: lazy(() => import(`@/components/Charts/StackedAreaChart/StackedAreaChart`)),
//   line: lazy(() => import("@/components/Charts/SimpleLineChart/SimpleLineChart")),
//   bar: lazy(() => import("@/components/Charts/SimpleBarChart/SimpleBarChart")),
//   pie: lazy(() => import("@/components/Charts/PieChart/PieChart")),
//   guage: lazy(() => import("@/components/Charts/Guage/Guage")),
//   progress: lazy(() => import("@/components/Charts/Progress/Progress")),
//   stat: lazy(() => import("@/components/Charts/Stat/Stat")),
// };

// // Memoized skeleton loader
// const ChartSkeleton = memo(({ height }: { height?: string | number }) => (
//   <Flex vertical gap={10} style={{ height, overflow: "hidden" }}>
//     <Skeleton.Button block active />
//     <Skeleton active />
//     {Array.from({ length: 10 }).map((_, idx) => (
//       <Skeleton.Button key={idx} block active />
//     ))}
//   </Flex>
// ));

// const StatsCardSkeleton = memo(() => (
//   <Card className="stats-card">
//     <Flex vertical gap={16}>
//       <Skeleton.Input active size="small" style={{ width: 120 }} />
//       <Flex gap={16} align="center">
//         <Skeleton.Avatar active size={52} shape="circle" />
//         <Flex vertical>
//           <Skeleton.Input active size="small" style={{ width: 80 }} />
//           <Skeleton.Input active size="large" style={{ width: 100 }} />
//         </Flex>
//       </Flex>
//       <Flex gap={16} align="center">
//         <Skeleton.Avatar active size={52} shape="circle" />
//         <Flex vertical>
//           <Skeleton.Input active size="small" style={{ width: 80 }} />
//           <Skeleton.Input active size="large" style={{ width: 100 }} />
//         </Flex>
//       </Flex>
//     </Flex>
//   </Card>
// ));

// const StatsCard = memo(({ title, stats }: { title: string; stats: ApiStatData[] }) => {
//   const { t } = useTranslation();
//   const successData = stats.find(item => item.name === "Success") || { name: "Success", value: 0 };
//   const errorData = stats.find(item => item.name === "Failure") || { name: "Failure", value: 0 };

//   return (
//     <Card className="stats-card">
//       <Title level={5} className="stats-title">{t(title)}</Title>
//       <div className="stats-container">
//         <div className="stat-item success">
//           <div className="stat-icon">
//             <CheckCircleOutlined />
//           </div>
//           <div className="stat-content">
//             <div className="stat-label">{t('success')}</div>
//             <div className="stat-value">
//               {successData.value.toLocaleString()} <ArrowUpOutlined />
//             </div>
//           </div>
//         </div>
//         <div className="stat-item error">
//           <div className="stat-icon">
//             <CloseCircleOutlined />
//           </div>
//           <div className="stat-content">
//             <div className="stat-label">{t('failure')}</div>
//             <div className="stat-value">
//               {errorData.value.toLocaleString()} <ArrowDownOutlined />
//             </div>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// });

// const DynamicChart: React.FC<DynamicChartProps> = ({
//   customConfigKey,
//   transactionData = {},
//   loading
// }) => {
//   const { activeRoute } = useAppSelector((state) => state.MenuReducer);
//   const activeChart = useAppSelector((state) => state.MenuReducer.chartData);
//   const { t } = useTranslation();

//   const configKey: any = customConfigKey || activeRoute?.component;
//   const chartConfig: any = (CFG["chart"] as any)[configKey as string] || [];

//   if (!chartConfig) {
//     console.error(`No config found for type: ${configKey}`);
//     return (
//       <Text type="danger">
//         {t('error.configNotFound', { configKey })}
//       </Text>
//     );
//   }

//   const renderChart = useMemo(() => (key: string, chart: any) => {
//     if (!activeChart?.[configKey]?.[key]?.showChart) return null;

//     const ChartComponent = ChartComponents[chart.type];
//     if (!ChartComponent) {
//       console.error(`No chart component found for type: ${chart.type}`);
//       return (
//         <Text type="danger" key={key}>
//           {t('error.chartTypeNotFound', { type: chart.type })}
//         </Text>
//       );
//     }

//     const data = key === "responseTime"
//       ? (Array.isArray(transactionData[key])
//         ? [...transactionData[key]]
//           .sort((a, b) => b.time.localeCompare(a.time))
//           .slice(0, 5)
//         : [])
//       : transactionData[key];

//     return (
//       <Col key={key} sm={24} md={12} lg={12} xl={chart.col || 12}>
//         <ErrorBoundary fallback={<ServerError />}>
//           <Suspense fallback={<ChartSkeleton height={chart.height} />}>
//             {loading ? (
//               <ChartSkeleton height={chart.height} />
//             ) : (
//               <ChartComponent config={chart} data={data || []} />
//             )}
//           </Suspense>
//         </ErrorBoundary>
//       </Col>
//     );
//   }, [configKey, activeChart, transactionData, loading, t]);

//   const renderCards = useMemo(() => (cards: Record<string, any>) => {
//     return Object.entries(cards).map(([cardKey, cardConfig]) => {
//       const CardChartComponent = ChartComponents[cardConfig.type];
//       if (!CardChartComponent) {
//         return (
//           <Col key={cardKey} span={24}>
//             <Text type="danger">
//               {t('error.cardTypeNotFound', { type: cardConfig.type })}
//             </Text>
//           </Col>
//         );
//       }

//       return (
//         <Col key={cardKey} xs={24} sm={12} md={12} lg={cardConfig.col || 12} xl={cardConfig.col || 12}>
//           <ErrorBoundary fallback={<Text type="danger">{t('error.cardRenderFailed')}</Text>}>
//             <Suspense fallback={<ChartSkeleton height={cardConfig.height} />}>
//               {loading ? (
//                 <ChartSkeleton height={cardConfig.height} />
//               ) : (
//                 <CardChartComponent config={cardConfig} data={transactionData[cardKey] || []} />
//               )}
//             </Suspense>
//           </ErrorBoundary>
//         </Col>
//       );
//     });
//   }, [transactionData, loading, t]);

//   return (
//     <Row gutter={[16, 16]} className="dynamic-chart-container">
//       {Object.entries(chartConfig).map(([key, chart]:[string, any]) => {
//         if (key === "cards") {
//           return (
//             <Col key={key} xs={24} lg={4}>
//               <Row gutter={[16, 16]}>
//                 {renderCards(chart)}
//               </Row>
//             </Col>
//           );
//         }

//         if (['apiStats', 'responseVolume', 'ssoVolume', 'ApplicationResponseStats'].includes(key)) {
//           return (
//             <Col key={key} sm={24} md={12} lg={12} xl={4}>
//               {loading ? (
//                 <StatsCardSkeleton />
//               ) : (
//                 <ErrorBoundary fallback={<Text type="danger">{t('error.statsRenderFailed')}</Text>}>
//                   <StatsCard title={key} stats={transactionData[key] || []} />
//                 </ErrorBoundary>
//               )}
//             </Col>
//           );
//         }

//         return renderChart(key, chart);
//       })}
//     </Row>
//   );
// };

// export default memo(DynamicChart);