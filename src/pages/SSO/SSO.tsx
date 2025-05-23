import DynamicChart from "@/components/Charts/DynamicChart/DynamicChart";
import { Col, Flex, Row, Tabs, Typography, notification, Card, Tag, Empty } from "antd";
import FilterComponent, { FILTER_OPTIONS } from "@/components/FilterComponent/FilterComponent";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import DescriptionHeader, { DescriptionHeaderProps } from "@/components/DescriptionHeader/DescriptionHeader";
import Timestamp from "@/components/Timestamp/Timestamp";
import CustomTableColumn from "@/components/CustomTableColumn/CustomTableColumn";
import TableDisplay from "@/components/Table/Table";
import {
  useGetSSOSummaryMutation,
  useLazyGetSSOSummaryByFilterQuery,
  useGetSSODetailMutation,
  useLazyGetSSODetailByFilterQuery,
  useGetSSOServicesMutation,
} from "@/services/SSO/SSO";
import { CopyOutlined } from "@ant-design/icons";
import ChartMenu from "@/components/ChartMenu/ChartMenu";
// import localData from "public/api/localeData.json";

const SSO: React.FC = () => {
  const { Title, Text } = Typography;
  const { t } = useTranslation();
  const [activeTabKey, setActiveTabKey] = useState<string>("summary"); // default active key
  const [pageNumber, setPageNumber] = useState<number | string>(1);
  const [loading, setLoading] = useState<any>(false);
  const [summaryData, setSummaryData] = useState<any>([]);
  const [detailedReportsData, setDetailedReportsData] = useState<any>([]);
  const [tableData, setTableData] = useState<any>([]);
  const [expandedRows, setExpandedRows] = useState<any>({});
  const [
    serviceOptions,
    setServiceOptions
  ] = useState(
    {
      "services": [
        {
          "value": "PNR_Retrieve",
          "label": "PNR_Retrieve"
        },
        {
          "value": "PNR_AddMultiElements",
          "label": "PNR_AddMultiElements"
        }
      ],
      "modules": [
        {
          "value": "IssueEmdService_V1",
          "label": "IssueEmdService_V1"
        },
        {
          "value": "FlightScheduleService_V1",
          "label": "FlightScheduleService_V1"
        }
      ]
    }
  );
  const [currentFilterQuery, setCurrentFilterQuery] = useState<any>();
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [removeFilterData, setRemoveFilterData] = useState<any>("");

  const [getSSOSummaryService, getSSOSummaryResponse] = useGetSSOSummaryMutation();
  const [getSSOSummaryByFilterService] = useLazyGetSSOSummaryByFilterQuery();
  const [getSSODetailService, getSSODetailResponse] = useGetSSODetailMutation();
  const [getSSODetailByFilterService, getSSODetailByFilterResponse] = useLazyGetSSODetailByFilterQuery();
  const [getSSOServices, getSSOServicesResponse] = useGetSSOServicesMutation();
  const [filterBy] = useState("today");

  useEffect(() => {
    // API call for web service summary
    getSSOSummaryService();
    getSSOServices();
  }, []);

  useEffect(() => {
    // API call for web service - detailed reports
    if (currentFilterQuery) {
      getSSODetailByFilterService({ filterData: currentFilterQuery + "&page=" + pageNumber });
    } else {
      getSSODetailService({ pageNumber: pageNumber });
    }
  }, [pageNumber]);

  const getNextPaginationData = (pageNumber: number | string) => {
    setPageNumber(pageNumber);
  };

  /**
   * Effect: Consolidates and manages API response data for SSO reports
   * Handles four different API responses and updates corresponding state variables
   */
  const extractResponseData = (response: any) => {
    if (response?.isSuccess || response?.data?.responseCode === 0) {
      return response?.data?.response?.data;
    }
    return null;
  };

  useEffect(() => {
    const data = extractResponseData(getSSOSummaryResponse);
    if (data) setSummaryData(data);
  }, [getSSOSummaryResponse]);

  useEffect(() => {
    const data = extractResponseData(getSSODetailResponse);
    if (data) setDetailedReportsData(data);
  }, [getSSODetailResponse]);

  useEffect(() => {
    const data = extractResponseData(getSSODetailByFilterResponse);
    if (data) setDetailedReportsData(data);
  }, [getSSODetailByFilterResponse]);

  useEffect(() => {
    const data = extractResponseData(getSSOServicesResponse);
    if (data) setServiceOptions(data);
  }, [getSSOServicesResponse]);

  const headerProps: DescriptionHeaderProps["data"] = {
    title: t("SSO"),
    breadcrumbProps: [
      {
        path: "dashboard",
        title: t("dashboard"),
        breadcrumbName: "Dashboard",
        key: "Dashboard",
      },
      {
        path: "sso",
        title: t("SSO"),
        breadcrumbName: t("SSO"),
        key: t("SSO"),
      }
    ],
  };

  /* Detailed report - SSO columns */
  const initialColumns: any = [
    {
      title: "Tracking id",
      dataIndex: "tracking_id",
      key: "tracking_id",
      name: "tracking_id",
      filter: true,
      type: "search",
      label: "tracking_id"
    },
    {
      title: "User group",
      dataIndex: "group",
      key: "group",
      addFilter: false
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
      addFilter: true
    },
    {
      title: "IP address",
      dataIndex: "ip_address",
      key: "ip_address",
      addFilter: false
    },
    {
      title: "Browser",
      dataIndex: "browser",
      key: "browser",
      render: (browser: string) => (
        <Text className="d-iblock f-reg fs-13" style={{ width: 200 }}>{browser}</Text>
      ),
    },
    {
      title: () => (
        <Flex align="center" justify="space-between" gap={10}>
          Time stamp
          <CustomTableColumn
            setVisibleColumns={setVisibleColumns}
            initialColumns={initialColumns}
            hideableColumns={["time_stamp"]}
          />
        </Flex>
      ),
      dataIndex: "time_stamp",
      key: "time_stamp",
      name: "time_stamp",
      filter: true,
      type: "date",
      label: "time_stamp"
    },
  ];;

  /* Table custom column functionality */
  const [visibleColumns, setVisibleColumns] = useState<any>(initialColumns);

  const prepareTableData = (ssoData: any, key: number) => {
    if (ssoData?.api_data) {
      setExpandedRows((prev: any) => ({
        ...prev,
        [key]: (
          <Card>
            <Text className="f-sbold fs-18 d-block mb-10" style={{ color: "var(--ant-color-text-heading)" }}>API data summary</Text>
            <Flex wrap={false} gap={50} className="mb-20">
              <Row className="w-100">
                <Col xl={6} sm={24}>
                  <Text className="fs-13 f-sbold">Start Time: </Text>
                  <Text className="fs-13 f-reg">{dayjs(ssoData.api_data.start_time).format("HH:mm:ss, DD MMM, YYYY")}</Text>
                </Col>
                <Col xl={6} sm={24}>
                  <Text className="fs-13 f-sbold">End Time: </Text>
                  <Text className="fs-13 f-reg">{dayjs(ssoData.api_data.end_time).format("HH:mm:ss, DD MMM, YYYY")}</Text>
                </Col>
                <Col xl={6} sm={24}>
                  <Text className="fs-13 f-sbold">Time difference: </Text>
                  <Text className="fs-13 f-reg">{ssoData.api_data.time_taken}</Text>
                </Col>
              </Row>
            </Flex>
            <Tabs items={prepareTabItems(ssoData)} type="card" />
          </Card>
        )
      }));
    }

    return {
      tracking_id: ssoData?.tracking_id || <Text className="d-iblock pl-30">-</Text>,
      group: ssoData?.group || <Text className="d-iblock pl-30">-</Text>,
      service: ssoData?.api_data?.name || <Text className="d-iblock pl-30">-</Text>,
      ip_address: ssoData?.IP || <Text className="d-iblock pl-30">-</Text>,
      browser: ssoData?.userAgent || <Text className="d-iblock pl-30">-</Text>,
      time_stamp: dayjs(ssoData?.timestamp).format("HH:mm:ss, DD MMM, YYYY") || <Text className="d-iblock pl-30">-</Text>,
      key: key,
      canExpand: ssoData?.api_data ? true : false
    }
  }

  const prepareTabItems = (ssoData: any) => {
    // Safe access to nested data with fallbacks
    const apiData = ssoData?.api_data || {};
    const headers = apiData.header || [];
    const request = apiData.request || '';
    const response = apiData.response || '';

    // Helper function to safely render content
    const renderContent = (content: any) => {
      if (typeof content === 'string') return content;
      if (Array.isArray(content)) return content.join('\n');
      if (typeof content === 'object') return JSON.stringify(content, null, 2);
      return 'No data available';
    };

    return [
      {
        key: "header",
        label: "Service headers",
        children: (
          <>
            <Flex justify="end">
              {headers.length > 0 && (
                <Text
                  copyable={{
                    icon: <CopyOutlined />,
                    text: renderContent(headers),
                  }}
                  className="fs-13 f-reg"
                >
                  Copy Headers
                </Text>
              )}
            </Flex>
            <Text
              className="d-block cls-responseBox mb-15 px-10 py-10"
              style={{
                background: "var(--ant-layout-body-bg)",
                borderRadius: 4,
                marginBlockStart: 8,
                overflow: "auto",
                maxHeight: 300,
              }}
            >
              {headers.length > 0 ? (
                <pre>{renderContent(headers)}</pre>
              ) : (
                <Text type="secondary"><Empty /></Text>
              )}
            </Text>
          </>
        ),
      },
      {
        key: "request",
        label: "Service request",
        children: (
          <>
            <Flex justify="end">
              {request && (
                <Text
                  copyable={{
                    icon: <CopyOutlined />,
                    text: renderContent(request),
                  }}
                  className="fs-13 f-reg"
                >
                  Copy Request
                </Text>
              )}
            </Flex>
            <Text
              className="d-block cls-responseBox mb-15 px-10 py-10"
              style={{
                background: "var(--ant-layout-body-bg)",
                borderRadius: 4,
                marginBlockStart: 8,
                overflow: "auto",
                maxHeight: 300,
              }}
            >
              {request ? (
                <pre>{renderContent(request)}</pre>
              ) : (
                <Text type="secondary"><Empty /></Text>
              )}
            </Text>
          </>
        ),
      },
      {
        key: "response",
        label: "Service response",
        children: (
          <>
            <Flex justify="end">
              {response && (
                <Text
                  copyable={{
                    icon: <CopyOutlined />,
                    text: renderContent(response),
                  }}
                  className="fs-13 f-reg"
                >
                  Copy Response
                </Text>
              )}
            </Flex>
            <Text
              className="d-block cls-responseBox mb-15 px-10 py-10"
              style={{
                background: "var(--ant-layout-body-bg)",
                borderRadius: 4,
                marginBlockStart: 8,
                overflow: "auto",
                maxHeight: 300,
              }}
            >
              {response ? (
                <pre>{renderContent(response)}</pre>
              ) : (
                <Text type="secondary"><Empty /></Text>
              )}
            </Text>
          </>
        ),
      },
    ];
  };

  useEffect(() => {
    if (detailedReportsData?.results) {

      const uniqueOptions = new Map(); // Using Map for O(1) lookup time

      let dataTemp = JSON.parse(JSON.stringify(detailedReportsData?.results));
      let columnsTemp = JSON.parse(JSON.stringify(visibleColumns));

      columnsTemp.forEach((col: { addFilter: string; dataIndex: string; title: string }) => {

        if (col?.addFilter) {
          let dataIndexName = col?.dataIndex;
          (dataTemp || []).forEach((filterColData: any) => {
            const value = filterColData[dataIndexName];
            if (!uniqueOptions.has(value) && value != "") {
              uniqueOptions.set(value, { value, label: value });
            }
          });
          // setServiceOptions(Array.from(uniqueOptions.values())); // Convert Map to Array & update state
        }
      });
      setTableData(detailedReportsData?.results?.map((data: any, index: number) => prepareTableData(data, index)));
    }
  }, [detailedReportsData?.results, visibleColumns]);

  const filteredDataHandler = async (value: unknown, formData: any = {}) => {
    setCurrentFilterQuery(value);
    setRemoveFilterData("");

    const readableFilters: string[] = [];

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (key === "customDate" && Array.isArray(value)) {
          const [start, end] = value;
          readableFilters.push(
            `Start Date: ${dayjs(start).format("DD MMM, YYYY HH:mm:ss")}`,
            `End Date: ${dayjs(end).format("DD MMM, YYYY HH:mm:ss")}`
          );
        } else {
          readableFilters.push(`${key}: ${value}`);
        }
      }
    });

    setAppliedFilters(formData);

    if (value) {
      setLoading(true);
      try {
        // Clear any existing interval on subsequent calls
        let intervalId: NodeJS.Timeout | null = null;
        // Fetch data based on conditions
        const serviceResponse: any = value
          ? await (activeTabKey === "summary"
            ? getSSOSummaryByFilterService({ filterData: value }).unwrap()
            : getSSODetailByFilterService({ filterData: value }).unwrap())
          : await (activeTabKey === "summary"
            ? getSSOSummaryService().unwrap()
            : getSSODetailService({ pageNumber }).unwrap());

        // Polling for response completion
        intervalId = setInterval(() => {
          if (serviceResponse?.responseCode === 0) {
            setPageNumber(1);
            if (activeTabKey === "summary") {
              setSummaryData(serviceResponse?.response?.data);
            } else {
              setDetailedReportsData(serviceResponse?.response?.data);
            }

            setLoading(false);
            if (intervalId) clearInterval(intervalId);
          }
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

  const getFilterLabel = (value: string) => {
    const isMatched = FILTER_OPTIONS.find(opt => {
      return opt.value == value;
    });
    return t(isMatched?.label ? isMatched.label : value)
  };

  const formatFilters = () => {
    const formattedFilters: any = [];

    const validEntries = Object.entries(appliedFilters ?? {}).filter(
      ([_, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
    );

    if (validEntries.length) {
      formattedFilters.push(
        <Text key="applied-label" type="secondary" className="fs-13 mr-15 f-med">
          Applied filter(s):
        </Text>
      );

      validEntries.forEach(([key, value]: any) => {
        if (key === "customDate" && Array.isArray(value)) {
          const [start, end] = value;
          formattedFilters.push(
            <Tag key="custom-date" className="p-clr py-3 px-10">
              {`Custom: ${dayjs(start).format("DD MMM, YYYY HH:mm")} - ${dayjs(end).format("DD MMM, YYYY HH:mm")}`}
              <Text
                className="Infi-Sp_03_CloseIcon fs-14 absolute tm-5 rm-7 pointer cls-closeIcon error-clr"
                onClick={() => {
                  setRemoveFilterData("filterBy");
                }}
              />
            </Tag>
          );
        } else if ((key === "filterBy" && value !== "custom") || key !== "filterBy") {
          const displayValue = getFilterLabel(value);
          formattedFilters.push(
            <Tag key={key} className="p-clr mb-10 py-3 px-10">
              {`${t(key)}: ${displayValue}`}
              <Text
                className="Infi-Sp_03_CloseIcon fs-14 absolute tm-5 rm-7 pointer cls-closeIcon error-clr"
                onClick={() => setRemoveFilterData(key)}
              />
            </Tag>
          );
        }
      });
    }

    return formattedFilters;
  };

  const tabItems = useMemo(() => [
    {
      label: (
        <Flex>
          <Text>{t("summary")}</Text>
        </Flex>
      ),
      key: "summary",
      children: (
        <Row gutter={[10, 20]}>
          <Col span={24}>
            <Row align="bottom" justify="space-between" className="px-10">
              <Col xs={24} md={12}
                lg={8} xl={8}>
                <Title className="cls-title" level={3}>
                  {t("SSO_matrics")} <Timestamp />
                </Title>
              </Col>
              <Col xs={24} md={12} lg={16} xl={16}>
                <Row align="bottom" justify="end" className="px-10">
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
                    <ChartMenu chartKey="sso-summary" />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          {/* Dynamic chart */}
          <Col span={24}>
            <Row gutter={[10, 20]}>
              <DynamicChart
                customConfigKey="sso-summary"
                transactionData={summaryData}
                loading={activeTabKey === "summary" ? loading : false}
              />
            </Row>
          </Col>
        </Row>
      ),
    },
    {
      label: (
        <Flex>
          <Text>{t("detailed_reports")}</Text>
        </Flex>
      ),
      key: "detailedReports",
      children: (() => {
        const isFiltersValid = Object.entries(appliedFilters ?? {}).filter(
          ([_, value]) =>
            value !== undefined &&
            value !== null &&
            value !== "" &&
            !(Array.isArray(value) && value.length === 0)
        );

        return (
          <Row>
            <Col span={24} className={`${isFiltersValid.length > 0 ? "mb-10" : ""} d-flex justify-end`}>
            <FilterComponent
                drawerMode={true}
                serviceOptions={serviceOptions}
                filteredDataHandler={filteredDataHandler}
                removeFilterData={removeFilterData}
                activeTabKeyString={activeTabKey}
                initialColumns={initialColumns}
              />
              {isFiltersValid.length > 0 && <Text className="d-block mb-10 text-end">{formatFilters()}</Text>}
            </Col>

            {/* Table */}
            <Col span={24}>
              <Row gutter={[10, 20]}>
                <TableDisplay
                  data={tableData}
                  loading={activeTabKey === "detailedReports" ? loading : false}
                  columns={visibleColumns}
                  expandedRows={expandedRows}
                  isBackendPagination={true}
                  fetchNextPaginationData={getNextPaginationData}
                  pagination={{
                    totalCount: detailedReportsData?.count,
                    pageSize: detailedReportsData?.results?.length,
                    position: "bottomRight",
                  }}
                  width="100%"
                />
              </Row>
            </Col>
          </Row>
        );
      })()
    }
  ], [
    summaryData,
    detailedReportsData?.results,
    tableData,
    visibleColumns,
    loading,
    removeFilterData,
    activeTabKey
  ]);

  return (
    <Row className="cls-sso">
      <Col span={24}>
        <DescriptionHeader data={headerProps} />
        <Tabs
          type="card"
          onChange={(key) => {
            setActiveTabKey(key);
          }}
          items={tabItems}
          activeKey={activeTabKey}
        />
      </Col>
    </Row>
  );
};

export default SSO;
