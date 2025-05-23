import DynamicChart from "@/components/Charts/DynamicChart/DynamicChart";
import { Col, Flex, Row, Tabs, Typography, notification, Tag, Card } from "antd";
import dayjs from "dayjs";
import FilterComponent, { FILTER_OPTIONS } from "@/components/FilterComponent/FilterComponent";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DescriptionHeader, { DescriptionHeaderProps } from "@/components/DescriptionHeader/DescriptionHeader";
import CustomTableColumn from "@/components/CustomTableColumn/CustomTableColumn";
import TableDisplay from "@/components/Table/Table";
import {
  useGetWebserviceSummaryMutation,
  useLazyGetWebServiceSummaryByFilterQuery,
  useGetWebserviceDetailMutation,
  useLazyGetWebServiceDetailByFilterQuery,
  useGetWebServiceServicesMutation,
  useLazyGetWebserviceDetailExpandQuery
} from "@/services/WebService/WebService";
import { readableTimeFormat } from "@/utils/date";
import ChartMenu from "@/components/ChartMenu/ChartMenu";
import { CopyOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/hooks/App.hook";
import Timestamp from "@/components/Timestamp/Timestamp";
// import localData from "public/api/localeData.json";

const WebService: React.FC = () => {
  const { Title, Text } = Typography;
  const { t } = useTranslation();
  const [activeTabKey, setActiveTabKey] = useState<string>("summary"); // default active key
  const [pageNumber, setPageNumber] = useState<number | string>(1);
  const [loading, setLoading] = useState<any>(false);
  const [summaryData, setSummaryData] = useState<any>([]);
  const [detailedReportsData, setDetailedReportsData] = useState<any>([]);
  const [tableData, setTableData] = useState<any>([]);
  const [expandedRows, setExpandedRows] = useState<any>({});
  const [loadingRows, setLoadingRows] = useState<any>({});
  const [
    serviceOptions,
    setServiceOptions
  ] = useState({
    groups: [
      {
        value: "airline",
        label: "airline"
      }
    ]
  });
  const [currentFilterQuery, setCurrentFilterQuery] = useState<any>();
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [removeFilterData, setRemoveFilterData] = useState<any>("");
  const [filterBy]=useState("today");

  const [getWebserviceSummaryService, getWebserviceSummaryResponse] = useGetWebserviceSummaryMutation();
  const [getWebserviceSummaryByFilterService] = useLazyGetWebServiceSummaryByFilterQuery();
  const [getWebserviceDetailService, getWebserviceDetailResponse] = useGetWebserviceDetailMutation();
  const [getWebserviceDetailByFilterService, getWebserviceDetailByFilterResponse] = useLazyGetWebServiceDetailByFilterQuery();
  const [getWebserviceServices, getWebserviceServicesResponse] = useGetWebServiceServicesMutation();
  const [getExpandedRowData] = useLazyGetWebserviceDetailExpandQuery();

  useEffect(() => {
    // API call for web service summary & detailed report services
    getWebserviceSummaryService();    
    getWebserviceServices();
  }, []);

  useEffect(() => {
    // API call for web service - detailed reports
    if (currentFilterQuery) {
      getWebserviceDetailByFilterService({ filterData: currentFilterQuery + "&page=" + pageNumber });
    } else {
      getWebserviceDetailService({ pageNumber: pageNumber });
    }
  }, [pageNumber]);

  const getNextPaginationData = (pageNumber: number | string) => {
    setPageNumber(pageNumber);
  };

  const handleApiResponse = (response: any, setState: (data: any) => void, transformFn?: (data: any) => any) => {
    if (response?.isSuccess || response?.data?.responseCode === 0) {
      const data = response?.data?.response?.data;
      if (data) {
        setState(transformFn ? transformFn(data) : data);
      }
    }
  };

  useEffect(() => {
    handleApiResponse(getWebserviceSummaryResponse, setSummaryData);
  }, [getWebserviceSummaryResponse]);

  useEffect(() => {
    handleApiResponse(getWebserviceDetailResponse, setDetailedReportsData);
  }, [getWebserviceDetailResponse]);

  useEffect(() => {
    handleApiResponse(getWebserviceDetailByFilterResponse, setDetailedReportsData);
  }, [getWebserviceDetailByFilterResponse]);

  useEffect(() => {
    handleApiResponse(getWebserviceServicesResponse, setServiceOptions);
  }, [getWebserviceServicesResponse]);

  const headerProps: DescriptionHeaderProps["data"] = {
    title: t("web_service"),
    breadcrumbProps: [
      {
        path: "dashboard",
        title: t("dashboard"),
        breadcrumbName: "Dashboard",
        key: "Dashboard",
      },
      {
        path: "webservice",
        title: t("web_service"),
        breadcrumbName: t("web_service"),
        key: t("web_service"),
      }
    ],
  };

  /* Detailed report user action column */
  const initialColumns = [
    {
      title: "Request ID",
      dataIndex: "group_request_ID",
      key: "group_request_ID",
      name: "group_request_ID",
      filter:true,
      type:"search",
      label:"search_request_id"
    },
    {
      title: "Module",
      dataIndex: "method",
      key: "method",    
      filter:false,
    },
    {
      title: "Service",
      dataIndex: "serviceName",
      key: "serviceName",
      filter:false,
    },
    {
      title: "Request time stamp",
      dataIndex: "RQ_date_time_stamp",
      key: "RQ_date_time_stamp",
      name: "RQ_date_time_stamp",
      filter:true,
      type:"date",
      label:"search_rq_date_time_stamp"
    },
    {
      title: "Response time stamp",
      dataIndex: "RS_date_time_stamp",
      key: "RS_date_time_stamp",
      name: "RS_date_time_stamp",
      filter:true,
      type:"date",
      label:"search_rs_date_time_stamp"
    },
    {
      title: "Response time",
      dataIndex: "TAT",
      key: "TAT",
      filter:false
    },
    {
      title: () => (
        <Flex align="center" justify="space-between" gap={10}>
          {t("status")}
          <CustomTableColumn
            setVisibleColumns={setVisibleColumns}
            initialColumns={initialColumns}
            hideableColumns={["status"]}
          />
        </Flex>
      ),
      dataIndex: "status",
      key: "status",
      name:"status",
      filter:true,
      label:"select_status",
      type:"selectFilter",
      option:[
        { value: 'success', label: 'Success' },
        { value: 'faliure', label: 'Faliure' }
      ],
      
      render: (status: string) => (
        <Tag color={status === "SUCCESS" ? "green" : "red"}>
          {status}
        </Tag>
      ),
    }
  ];

  /* Table custom column functionality */
  const [visibleColumns, setVisibleColumns] = useState<any>(initialColumns);

  const prepareTableData = (webServiceData: any, index: number) => {
    return {
      serviceName: webServiceData.method || <Text className="d-iblock pl-30">-</Text>,
      method: webServiceData.serviceName || <Text className="d-iblock pl-30">-</Text>,
      group_request_ID: webServiceData.requestId || <Text className="d-iblock pl-30">-</Text>,
      service_unique_key: webServiceData.serviceKey || <Text className="d-iblock pl-30">-</Text>,
      RQ_date_time_stamp: dayjs(webServiceData.startTime).format("HH:mm:ss, DD MMM, YYYY") || <Text className="d-iblock pl-30">-</Text>,
      RS_date_time_stamp: dayjs(webServiceData.endTime).format("HH:mm:ss, DD MMM, YYYY") || <Text className="d-iblock pl-30">-</Text>,
      TAT: readableTimeFormat(webServiceData.timeDifference) || <Text className="d-iblock pl-30">-</Text>,
      status: webServiceData.response || <Text className="d-iblock pl-30">-</Text>,
      key: index,
      canExpand: true
    }
  }

  useEffect(() => {
    if (detailedReportsData?.results) {
      setTableData(detailedReportsData?.results?.map((data: any, index: number) => prepareTableData(data, index)));
    }
  }, [detailedReportsData?.results, visibleColumns]);

  const chartFilterData = useAppSelector((state) => state.ServiceModuleNameReducer);

  useEffect(() => {    
    const hasValidValueServices = chartFilterData?.services && Object.values(chartFilterData?.services).some(value => value !== undefined && value !== null && value !== "");
    // const hasValidValueDate = chartFilterData?.filter && Object.values(chartFilterData?.filter).some(value => value !== undefined && value !== null && value !== "");

    if ((hasValidValueServices) && currentFilterQuery && activeTabKey==="summary") {      
      setActiveTabKey("detailedReports");
    }
  }, [chartFilterData.services]);

  const prepareTabItems = (apiData: any) => {
    // Helper function to safely stringify data
    const safeStringify = (data: any) => {
      try {
        if (typeof data === 'string') {
          return data;
        }
        return JSON.stringify(data, null, 2);
      } catch (error) {
        console.error('Error stringifying data:', error);
        return 'Unable to display content';
      }
    };

    return [
      {
        key: "header",
        label: "Service headers",
        children: (
          <>
            <Flex justify="end">
              {apiData?.header && (
                <Text
                  copyable={{
                    icon: <CopyOutlined />,
                    text: safeStringify(apiData.header),
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
              {apiData?.header ? (
                <pre>{safeStringify(apiData.header)}</pre>
              ) : (
                <Text type="secondary">No headers</Text>
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
              {apiData.request_body && (
                <Text
                  copyable={{
                    icon: <CopyOutlined />,
                    text: safeStringify(apiData.request_body),
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
              {apiData.request_body ? (
                <pre>{safeStringify(apiData.request_body)}</pre>
              ) : (
                <Text type="secondary">No request data</Text>
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
              {apiData.response && (
                <Text
                  copyable={{
                    icon: <CopyOutlined />,
                    text: safeStringify(apiData.response),
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
              {apiData.response ? (
                <pre>{safeStringify(apiData.response)}</pre>
              ) : (
                <Text type="secondary">No response data</Text>
              )}
            </Text>
          </>
        ),
      },
    ];
  };


  // Handle row expansion
  const handleExpand = async (expanded: boolean, record: any) => {
    if (expanded && !expandedRows[record.key]) {
      try {
        setLoadingRows((prev: any) => ({ ...prev, [record.key]: true }));

        const st_dt = dayjs(record.RQ_date_time_stamp, 'HH:mm:ss, DD MMM, YYYY').toISOString();
        const ed_dt = dayjs(record.RS_date_time_stamp, 'HH:mm:ss, DD MMM, YYYY').toISOString();

        const response: any = await getExpandedRowData({
          expandData: `service_key=${record.service_unique_key}&st_dt=${st_dt}&ed_dt=${ed_dt}`
        }).unwrap();

        if (response?.responseCode === 0) {
          // Make sure response.data is properly structured
          // let rowData:0 any = {
          //   "service_key": "40466793900_190318",
          //   "service_name": "ExchangeCouponTickets_V1",
          //   "timestamp": "2025-04-23 02:29:38",
          //   "method": "Queue_list",
          //   "end_point": "/home/Staging/shell_scripts/QUERY_FILE/Test_APPLICATION/WN_Test/flightWebServices/WSDL/WN_3.0/1ASIWGRPWNU_TST_20240611_150209.wsdl",
          //   "request": "POST",
          //   "header": {
          //     "Host": "nodeA3.production.webservices.amadeus.com",
          //     "Connection": "Keep-Alive",
          //     "'User-Agent'": "PHP-SOAP/7.3.33",
          //     "'Accept-Encoding'": "gzip, deflate",
          //     "'Content-Type'": "text/xml; charset=utf-8",
          //     "SOAPAction": "http://webservices.amadeus.com/PNRADD_21_1_1A",
          //     "'Content-Length'": "1347",
          //     "Vary": "Accept-Encoding"
          //   },
          //   "request_body": '<?xml version="1.0" encoding="UTF-8"?>\n' +
          //     '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://xml.amadeus.com/PNRADD_21_1_1A" xmlns:ns2="http://xml.amadeus.com/ws/2009/01/WBS_Session-2.0.xsd"><SOAP-ENV:Header>\t\t<ses:Session xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3" TransactionStatusCode="End">\n' +
          //     '<ses:SessionId>0F10FGV2WU</ses:SessionId>\n' +
          //     '<ses:SequenceNumber>9</ses:SequenceNumber>\n' +
          //     '<ses:SecurityToken>2QL7X0QQMPS1M1JO0CSSMYXBOQ</ses:SecurityToken>\n' +
          //     '</ses:Session>\n' +
          //     '<add:MessageID xmlns:add="http://www.w3.org/2005/08/addressing">d1dftxd-u41i-mitg-iitz-wvnp9voywa</add:MessageID>\n' +
          //     '<add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/PNRADD_21_1_1A</add:Action>\n' +
          //     '<add:To xmlns:add="http://www.w3.org/2005/08/addressing">https://nodeA3.production.webservices.amadeus.com/1ASIWGRPWN</add:To>\n' +
          //     '<link:TransactionFlowLink xmlns:link="http://wsdl.amadeus.com/2010/06/ws/Link_v1">\n' +
          //     '<link:Consumer>\n' +
          //     '<link:UniqueID>kbevnks-ccsz-snv2-bwhr-umk9ipxmds</link:UniqueID>\n' +
          //     '</link:Consumer>\n' +
          //     '</link:TransactionFlowLink>\n' +
          //     '\n' +
          //     '</SOAP-ENV:Header><SOAP-ENV:Body><ns1:PNR_AddMultiElements><ns1:pnrActions><ns1:optionCode>20</ns1:optionCode></ns1:pnrActions><ns1:dataElementsMaster><ns1:marker1/></ns1:dataElementsMaster></ns1:PNR_AddMultiElements></SOAP-ENV:Body></SOAP-ENV:Envelope>',
          //   "start_time": "2025-04-23 02:29:37",
          //   "end_time": "2025-04-23 02:29:38",
          //   "time_taken": "00:00:00",
          //   "response": "HTTP/1.1 200 OK\n" +
          //     "Content-Encoding: gzip\n" +
          //     "Content-Type: text/xml; charset=utf-8\n" +
          //     "Content-Length: 996\n" +
          //     "\n" +
          //     '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:awsl="http://wsdl.amadeus.com/2010/06/ws/Link_v1" xmlns:awsse="http://xml.amadeus.com/2010/06/Session_v3" xmlns:wsa="http://www.w3.org/2005/08/addressing"><SOAP-ENV:Header><wsa:To>http://www.w3.org/2005/08/addressing/anonymous</wsa:To><wsa:From><wsa:Address>https://nodeA3.production.webservices.amadeus.com/1ASIWGRPWN</wsa:Address></wsa:From><wsa:Action>http://webservices.amadeus.com/PNRADD_21_1_1A</wsa:Action><wsa:MessageID>urn:uuid:55b9f92d-1d66-c734-0dc9-4b1f7ad7a8d0</wsa:MessageID><wsa:RelatesTo RelationshipType="http://www.w3.org/2005/08/addressing/reply">d1dftxd-u41i-mitg-iitz-wvnp9voywa</wsa:RelatesTo><awsl:TransactionFlowLink><awsl:Consumer><awsl:UniqueID>kbevnks-ccsz-snv2-bwhr-umk9ipxmds</awsl:UniqueID></awsl:Consumer><awsl:Receiver><awsl:ServerID>urn:uuid:5388f758-3379-5e7e-b4f6-31ee0a686645</awsl:ServerID></awsl:Receiver></awsl:TransactionFlowLink><awsse:Session TransactionStatusCode="End"><awsse:SessionId>0F10FGV2WU</awsse:SessionId><awsse:SequenceNumber>9</awsse:SequenceNumber><awsse:SecurityToken>2QL7X0QQMPS1M1JO0CSSMYXBOQ</awsse:SecurityToken></awsse:Session></SOAP-ENV:Header><SOAP-ENV:Body><PNR_Reply xmlns="http://xml.amadeus.com/PNRACC_21_1_1A"><pnrHeader><reservationInfo><reservation><companyId>1A</companyId></reservation></reservationInfo></pnrHeader><securityInformation><responsibilityInformation><typeOfPnrElement>RP</typeOfPnrElement><officeId>DALWN08GT</officeId><iataCode>45997361</iataCode></responsibilityInformation><queueingInformation><queueingOfficeId>DALWN08GT</queueingOfficeId></queueingInformation><cityCode>DAL</cityCode></securityInformation><sbrPOSDetails><sbrUserIdentificationOwn><originIdentification><inHouseIdentification1> </inHouseIdentification1></originIdentification></sbrUserIdentificationOwn><sbrSystemDetails><deliveringSystem><companyId> </companyId></deliveringSystem></sbrSystemDetails><sbrPreferences><userPreferences><codedCountry> </codedCountry></userPreferences></sbrPreferences></sbrPOSDetails><sbrCreationPosDetails><sbrUserIdentificationOwn><originIdentification><inHouseIdentification1> </inHouseIdentification1></originIdentification></sbrUserIdentificationOwn><sbrSystemDetails><deliveringSystem><companyId> </companyId></deliveringSystem></sbrSystemDetails><sbrPreferences><userPreferences><codedCountry> </codedCountry></userPreferences></sbrPreferences></sbrCreationPosDetails><sbrUpdatorPosDetails><sbrUserIdentificationOwn><originIdentification><originatorId>45997361</originatorId><inHouseIdentification1>DALWN08GT</inHouseIdentification1></originIdentification><originatorTypeCode>A</originatorTypeCode></sbrUserIdentificationOwn><sbrSystemDetails><deliveringSystem><companyId>WN</companyId><locationId>DAL</locationId></deliveringSystem></sbrSystemDetails><sbrPreferences><userPreferences><codedCountry>US</codedCountry></userPreferences></sbrPreferences></sbrUpdatorPosDetails></PNR_Reply></SOAP-ENV:Body></SOAP-ENV:Envelope>'
          // };

          let data = response?.data;
          // || rowData;

          const formattedData = {
            ...data,
            // Ensure these fields are strings or properly stringifiable
            header: data.header || {},
            request_body: data.request_body || '',
            response: data.response || ''
          };

          setExpandedRows((prev: any) => ({
            ...prev,
            [record.key]: (
              <Card>
                <Text
                  className="f-sbold fs-18 d-block mb-10"
                  style={{ color: "var(--ant-color-text-heading)" }}
                >
                  API data summary
                </Text>

                <Flex wrap={true} gap={20} className="mb-20">
                  <Row className="w-100">
                    <Col xl={8} sm={24}>
                      <Text className="fs-13 f-sbold">Service Name: </Text>
                      <Text className="fs-13 f-reg">{data?.service_name}</Text>
                    </Col>
                    <Col xl={8} sm={24}>
                      <Text className="fs-13 f-sbold">Method: </Text>
                      <Text className="fs-13 f-reg">{data?.method}</Text>
                    </Col>
                    <Col xl={8} sm={24}>
                      <Text className="fs-13 f-sbold">Endpoint: </Text>
                      <Text className="fs-13 f-reg">{data?.end_point}</Text>
                    </Col>
                  </Row>

                  <Row className="w-100 mb-15">
                    <Col xl={8} sm={24}>
                      <Text className="fs-13 f-sbold">Start Time: </Text>
                      <Text className="fs-13 f-reg">
                        {dayjs(data?.start_time).format("HH:mm:ss, DD MMM, YYYY")}
                      </Text>
                    </Col>
                    <Col xl={8} sm={24}>
                      <Text className="fs-13 f-sbold">End Time: </Text>
                      <Text className="fs-13 f-reg">
                        {dayjs(data?.end_time).format("HH:mm:ss, DD MMM, YYYY")}
                      </Text>
                    </Col>
                    <Col xl={8} sm={24}>
                      <Text className="fs-13 f-sbold">Time difference: </Text>
                      <Text className="fs-13 f-reg">{data?.time_taken}</Text>
                    </Col>
                  </Row>
                </Flex>

                {
                  (response.responseCode !== 0) ? (
                    <Text type="danger">Error loading API data</Text>
                  ) : (
                    <Tabs items={prepareTabItems(formattedData)} type="card" />
                  )
                }

              </Card>
            )
          }));
        }
      } catch (error) {
        notification.error({
          message: t('error.loading_details'),
          description: t('error.expanded_row_fetch_failed'),
        });
      } finally {
        setLoadingRows((prev: any) => ({ ...prev, [record.key]: false }));
      }
    }
  };

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
            ? getWebserviceSummaryByFilterService({ filterData: value }).unwrap()
            : getWebserviceDetailByFilterService({ filterData: value }).unwrap())
          : await (activeTabKey === "summary"
            ? getWebserviceSummaryService().unwrap()
            : getWebserviceDetailService({ pageNumber }).unwrap());

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

        notification.error({
          key: 'api-error',
          message: 'Request Failed',
          description: errorMessage,
          duration: 5,
        });

        console.error("API Error:", error);
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
          {value && formattedFilters.push(
            <Tag key="custom-date" className="p-clr py-3 px-10">
              {`Custom: ${dayjs(start).format("DD MMM, YYYY HH:mm")} - ${dayjs(end).format("DD MMM, YYYY HH:mm")}`}
              <Text
                className="Infi-Sp_03_CloseIcon fs-14 absolute tm-5 rm-7 pointer cls-closeIcon error-clr"
                onClick={() => {
                  setRemoveFilterData("filterBy");
                }}
              />
            </Tag>
          )}
        } else if ((key === "filterBy" && value !== "custom") || key !== "filterBy") {
          const displayValue = getFilterLabel(value);
          {displayValue && formattedFilters.push(
         <Tag key={key} className="p-clr mb-10 py-3 px-10">
              {`${t(key)}: ${displayValue}`}
              <Text
                className="Infi-Sp_03_CloseIcon fs-14 absolute tm-5 rm-7 pointer cls-closeIcon error-clr"
                onClick={() => setRemoveFilterData(key)}
              />
            </Tag>
          )}
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
              <Col
                xs={24}
                md={12}
                lg={8}
                xl={8}
              >
                <Title className="cls-title" level={3}>
                  {t("API_matrics")}  <Timestamp />
                </Title>
              </Col>
              <Col
                xs={24}
                md={12}
                lg={16}
                xl={16}
              >
                <Row align="bottom" justify="end" className="px-10">
                  <Col span={23}>
                    <FilterComponent
                      filterByValue={filterBy}
                      drawerMode={false}
                      propsFilterFormData={
                        [{
                          name: "inlineFilterBy",
                          type: "filterBy",
                          defaultValue:"today"
                        }]
                      }
                      filteredDataHandler={filteredDataHandler}
                    />
                  </Col>
                  <Col span={1}>
                    <ChartMenu chartKey="webservice-summary" />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          {/* Dynamic chart */}
          <Col span={24}>
            <Row gutter={[10, 20]}>
              <DynamicChart
                customConfigKey="webservice-summary"
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
                  expandedRows={expandedRows}
                  loadingRows={loadingRows}
                  handleExpand={handleExpand}
                  loading={activeTabKey === "detailedReports" ? loading : false}
                  columns={visibleColumns}
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
    loading,
    visibleColumns,
    removeFilterData,
    expandedRows,
    loadingRows,
    activeTabKey
  ]);

  return (
    <Row className="cls-webService">
      <Col span={24}>
        <DescriptionHeader data={headerProps} />
        <Tabs
          type="card"
          activeKey={activeTabKey}
          onChange={(key) => { 
            setActiveTabKey(key)
           }}
          items={tabItems}
        />
      </Col>
    </Row>
  );
};

export default WebService;
