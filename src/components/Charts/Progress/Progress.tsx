import {
  Card,
  // Empty, 
  Statistic,
  Typography,
  Row,
  Col
} from "antd";
import './Progress.scss';
import { ChartComponentProp } from "../Charts";
import { useTranslation } from "react-i18next";

/**
 * ProgressChart component renders a series of progress bars with labels and values.
 *
 * This component displays progress bars using Ant Design's `Progress` component. It takes a
 * configuration object (`config`) as a prop, which should contain an array of statistics objects.
 * Each statistics object is expected to have `dataKey` and `dataValueKey` properties, which are used
 * to extract the label and value for each progress bar.
 *
 * @param {ChartComponentProp} props - The configuration object for the chart.
 * @returns {JSX.Element|null} - The progress bar JSX element, or null if config or statistics is missing.
 */
const ProgressChart: React.FC<ChartComponentProp> = ({
  config,
  data,
}: ChartComponentProp) => {
  const { Title, Text } = Typography;
  const { t } = useTranslation();

  if (!config || !config.statistics) return null;

  const { title } = config;

  data = data?.length ? data : [
    {
      "name": "Success count",
      "value": 0
    },
    {
      "name": "Error count",
      "value": 0
    }
  ];

  // let yAxisData = config?.statistics.map((item: any) => {
  //   return data?.map((dataMap: any) => {
  //     return dataMap[item?.dataKey];
  //   })
  // })

  // let progressData = config?.statistics.map((item: any) => {
  //   return data?.map((dataMap: any) => {
  //     return dataMap[item?.dataValueKey];
  //   })
  // })

  // const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--t-common-primary').trim();
  // const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--t-common-secondary').trim();
  // const rawData = progressData[0]; // e.g., [127, 1839]
  // const total = rawData?.reduce((sum: number, val: number) => sum + val, 0);

  // const percentageData = rawData?.map((value: number) => ({
  //   value: (value / total) * 100 || 0,  // bar width (percent)
  //   original: value                // for label display
  // }));

  // let option: any = {
  //   grid: gridData,
  //   xAxis: {
  //     type: 'value',
  //     min: 0,
  //     max: 100,
  //     boundaryGap: [0, 0],
  //     splitLine: { show: false },
  //     axisLine: { show: false },
  //     axisLabel: { show: false },
  //     axisTick: { show: false },
  //   },
  //   yAxis: {
  //     type: 'category',
  //     data: yAxisData[0], // ["success_count", "error_count"]
  //     axisLine: { show: false },
  //     axisTick: { show: false },
  //     axisLabel: {
  //       show: true,
  //       fontSize: 14,
  //       color: '#333',
  //       margin: 10,  // more space from axis
  //       align: 'left',
  //       verticalAlign: 'bottom', // 👈 Move label towards top
  //       padding: [0, 0, 40, 15], // 👈 push text slightly up (adjust this as needed)
  //     }
  //   },
  //   dataZoom: [config.zoom],
  //   series: [
  //     {
  //       name: 'Background',
  //       type: 'bar',
  //       data: Array(progressData[0]?.length).fill(100),
  //       barWidth: 10,
  //       itemStyle: {
  //         color: '#eee',
  //         borderRadius: 5
  //       },
  //       z: 1
  //     },
  //     {
  //       name: 'Progress',
  //       type: 'bar',
  //       data: percentageData,
  //       barWidth: 10,
  //       barGap: '-100%', // 👈 Full overlap
  //       itemStyle: {
  //         borderRadius: 5,
  //         color: (params: any) => {
  //           const statusColors = data?.map((item: { name: string }) => {

  //             if (item?.name === "Success count") {
  //               return "green";
  //             } else if (item?.name === "Failure Count" || item?.name === "Error count") {
  //               return "red";
  //             } else {
  //               return primaryColor;
  //             }
  //           });

  //           // Optionally swap primary/secondary based on your custom logic
  //           if (statusColors[0] === primaryColor) {
  //             statusColors[1] = secondaryColor;
  //           }
  //           return statusColors[params.dataIndex];
  //         }
  //       },
  //       label: {
  //         show: true,
  //         align: 'left',
  //         position: [0, '-250%'],
  //         formatter: (params: any) => `${params.data.original}`, // 👈 raw number only
  //         color: '#000',
  //         fontSize: 16,
  //         fontWeight: 'bold',
  //         offset: [10, 0]
  //       },
  //       z: 2
  //     }
  //   ]
  // };

  const updatedData = data.map((item: { value: number; }, i: number, arr: { value: number; }[]) => ({
    ...item,
    isGreater: item.value > arr[1 - i].value
  }));

  return (
    <Card className="cls-progress ">
      {title && <Title level={5}>{t(title)}</Title>}
      {/* {data?.length ? */}
      {/* <EChartComponent option={option} style={{ height: option?.dataZoom[0]?.show ? "100%" : 300 }} /> */}

      <Row style={{ height: "inherit", alignItems: "center" }} className="space-evenly">
        {updatedData && updatedData.map((item: any) => {

          return (
            <Col className="d-flex py-15 px-15 hover-effect ant-card-bordered cls-progress-col">
              <Statistic
                title={<Text className="f-bold">{item?.name}</Text>}
                value={item.value}
                valueStyle={{ color: item.isGreater ? "green" :  "red" }}>
              </Statistic>

            </Col>
          )
        })}

      </Row>


      {/* :
        // <Empty className="pb-20" />
      } */}
    </Card>
  );
};

export default ProgressChart;
