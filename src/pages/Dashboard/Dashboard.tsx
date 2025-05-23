import { Col, Row, notification } from "antd";
import { useTranslation } from "react-i18next";
import "./Dashboard.scss";
import DynamicChart from "../../components/Charts/DynamicChart/DynamicChart";
import DescriptionHeader, {
  DescriptionHeaderProps
} from "@/components/DescriptionHeader/DescriptionHeader";
import { useGetDashboardSummaryMutation, useLazyGetDashboardSummaryByFilterQuery } from "@/services/Dashboard/Dashboard";
import { useEffect, useState } from "react";
// import localData from "public/api/localeData.json";
import FilterComponent from "@/components/FilterComponent/FilterComponent";
import ChartMenu from "@/components/ChartMenu/ChartMenu";

/**
 * Dashboard component renders the main dashboard content, including the title
 * and dynamic charts.
 *
 * @returns {JSX.Element} The dashboard JSX element.
 */
const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  const headerProps: DescriptionHeaderProps["data"] = {
    title: t("dashboard")
  };

  const [getDashboardSummaryService, dashboardSummaryResponse] = useGetDashboardSummaryMutation();
  const [getDashboardSummaryByFilterService] = useLazyGetDashboardSummaryByFilterQuery();
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState<any>(false);
  const [filterBy] = useState("today");

  useEffect(() => {
    getDashboardSummaryService();
  }, [])

  useEffect(() => {
    if (
      dashboardSummaryResponse?.data &&
      dashboardSummaryResponse?.data?.responseCode === 0 &&
      dashboardSummaryResponse?.data?.response?.data
    ) {

      let data: any = dashboardSummaryResponse?.data?.response?.data;
      data = enrichedData(data);
      setSummaryData(data);
    }
    // else {
    //   setSummaryData(localData?.Dashboard);
    // }
  }, [dashboardSummaryResponse]);

  const enrichedData = (data: Record<string, any>) => {
    return {
      ...data,
      totalRequest: {
        icon: "dashboardOutlined",
        name: "total_request",
        fill: "var(--t-total-request-icon)",
        value: data.totalRequest,
      },
      apiRequest: {
        icon: "apiOutlined",
        name: "web_service",
        fill: "var(--t-api-request-icon)",
        value: data.apiRequest,
        path: "webservice"
      },
      ssoRequest: {
        icon: "loginOutlined",
        name: "SSO",
        fill: "var(--t-sso-request-icon)",
        value: data.ssoRequest,
        path: "sso"
      },
      userActions: {
        icon: "fundViewOutlined",
        name: "user_action",
        fill: "var(--t-user-actions-icon)",
        value: data.userActions,
        path: "useraction"
      },
    }
  };

  const filteredDataHandler = async (value: unknown) => {
    if (value) {
      setLoading(true);
      try {
        // Clear any existing interval on subsequent calls
        let intervalId: NodeJS.Timeout | null = null;
        // Fetch data based on conditions
        const serviceResponse: any = value
          ? await getDashboardSummaryByFilterService({ filterData: value }).unwrap()
          : await getDashboardSummaryService().unwrap();

        // Polling for response completion
        intervalId = setInterval(() => {
          if (serviceResponse?.responseCode === 0) {
            let data: any = enrichedData(serviceResponse?.response?.data);
            setSummaryData(data);
            if (intervalId) clearInterval(intervalId);
          }
          setLoading(false);
        }, 1000);

        // Cleanup function to clear interval
        return () => {
          if (intervalId) clearInterval(intervalId);
        };

      } catch (error: unknown) {
        setLoading(false);
        const errorMessage = error instanceof Error
          ? error.message
          : 'An unknown error occurred';
        console.error("API Error:", error);
        notification.error({
          key: 'api-error',
          message: 'Request Failed',
          description: errorMessage,
          duration: 5,
        });
      }
    }
  };

  return (
    <Row className="cls-dashboard">
      <DescriptionHeader data={headerProps} />
      <Col span={24}>
        <Row align="bottom" justify="end">
          <Col span={24}>
            <Row align='bottom' justify="end" className="mb-20 cls-filterRow">
              <Col span={23}>
                <FilterComponent
                  filterByValue={filterBy}
                  drawerMode={false}
                  propsFilterFormData={
                    [{
                      name: "inlineFilterBy",
                      type: "filterBy",
                      defaultValue: "today"
                    }]
                  }
                  filteredDataHandler={filteredDataHandler}
                />
              </Col>
              <Col span={1}>
                <ChartMenu chartKey="Dashboard" />
              </Col>
            </Row>
            <Row gutter={[10, 12]}>
              {/* Dynamic charts based on config */}
              <DynamicChart
                transactionData={summaryData}
                loading={loading}
              />
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Dashboard;