import { Avatar, Card, Col, Flex, Row, Typography } from "antd";
import {
  ApiOutlined,
  DashboardOutlined,
  DollarOutlined,
  FundViewOutlined,
  LoginOutlined,
  ShoppingCartOutlined,
  TruckOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ChartComponentProp } from "../Charts";
import { useTranslation } from "react-i18next";
import { useRedirect } from "@/hooks/Redirect.hook";
const { Text } = Typography;

/**
 * Stat component renders a card displaying a statistical value with an icon and label.
 *
 * This component displays a statistical value with an icon, label, and value. It takes a
 * configuration object (`config`) as a prop, which should contain an array of statistics objects.
 * Each statistics object is expected to have `icon`, `name`, `fill`, and `value` properties, which are
 * used to display the icon, label, fill color, and value for the statistic.
 *
 * @param {ChartComponentProp} props - The configuration object for the chart.
 * @returns {JSX.Element|null} - The statistic card JSX element, or null if config or statistics is missing.
 */
const Stat: React.FC<ChartComponentProp> = ({
  config,
  data,
}: ChartComponentProp) => {
  // if (!config || !config.statistics) return null;
  if (!config?.statistics?.length || !data) {
    return null;
  }

  const { dataKey, dataValueKey } = config?.statistics?.[0];
  const { t } = useTranslation();

  interface IconMap {
    [key: string]: React.ReactElement;
  }

  const icons: IconMap = {
    dashboardOutlined: <DashboardOutlined />,
    apiOutlined: <ApiOutlined />,
    loginOutlined: <LoginOutlined />,
    fundViewOutlined: <FundViewOutlined />,
    userOutlined: <UserOutlined />,
    shoppingCartOutlined: <ShoppingCartOutlined />,
    dollarOutlined: <DollarOutlined />,
    truckOutlined: <TruckOutlined />,
  };

  // Only render if we have both required keys
  if (!dataKey || !dataValueKey) {
    return null;
  }

  const {redirect } = useRedirect();  // Redirection hook

  const navigateToPage = (pageData:any) =>{
    redirect(pageData.path)
  }

  /* Using 0 index of data for temporary, need to work on fetching dynamic data */
  return (
    <Card className={data.path ? "hover-effect" : ""}>
      <Row>
        <Col span={24}>
          <Row style={  data.path && { cursor:"pointer"}} onClick={()=>data.path && navigateToPage(data)} title={data.path && `Go to ${t(data?.[dataKey])} page` } align="middle" gutter={[20, 20]}>
            <Col>
              <Avatar
                size={44}
                icon={icons[data?.icon as keyof IconMap]}
                style={{ backgroundColor: data?.fill }}
              />
            </Col>
            <Col>
              <Flex vertical>
                <Text className="fs-13 lh-19 f-reg cls-grey-lite">{t(data?.[dataKey])}</Text>
                <Text className="fs-24 lh-28 f-bold p-clr">{data?.[dataValueKey]?.toLocaleString()}</Text>
              </Flex>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default Stat;
