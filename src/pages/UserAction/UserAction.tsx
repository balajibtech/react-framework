import DynamicChart from "@/components/Charts/DynamicChart/DynamicChart";
import { Col, Flex, Row, Tabs, Typography, Collapse, notification, Tag } from "antd";
import dayjs from "dayjs";
import FilterComponent, { FILTER_OPTIONS } from "@/components/FilterComponent/FilterComponent";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DescriptionHeader, { DescriptionHeaderProps } from "@/components/DescriptionHeader/DescriptionHeader";
import CustomTableColumn from "@/components/CustomTableColumn/CustomTableColumn";
import TableDisplay from "@/components/Table/Table";
import {
    useGetUserActionDetailMutation,
    useGetUserActionServicesMutation,
    useGetUserActionSummaryMutation,
    useLazyGetUserActionDetailByFilterQuery,
    useLazyGetUserActionSummaryByFilterQuery
} from "@/services/UserAction/useraction";
import { readableTimeFormat } from "@/utils/date";
// import localData from "public/api/localeData.json";
import ChartMenu from "@/components/ChartMenu/ChartMenu";
import Timestamp from "@/components/Timestamp/Timestamp";

const UserAction: React.FC = () => {
    const { Title, Text } = Typography;
    const { t } = useTranslation();
    const [activeTabKey, setActiveTabKey] = useState<string>("summary"); // default active key
    const [pageNumber, setPageNumber] = useState<number | string>(1);
    const [loading, setLoading] = useState<any>(false);
    const [summaryData, setSummaryData] = useState<any>([]);
    const [detailedReportsData, setDetailedReportsData] = useState<any>([]);
    const [tableData, setTableData] = useState<any>([]);
    const [filterBy]=useState("today");
    const [
        serviceOptions,
        setServiceOptions
    ] = useState(
        {
            "action_modules": [
                {
                    "value": "adhocInstantQuoteRequest",
                    "label": "adhocInstantQuoteRequest"
                },
                {
                    "value": "loginForm",
                    "label": "loginForm"
                },
                {
                    "value": "logout",
                    "label": "logout"
                },
                {
                    "value": "processDashBoard",
                    "label": "processDashBoard"
                },
                {
                    "value": "menuV1",
                    "label": "menuV1"
                }
            ]
        }
    );
    const [currentFilterQuery, setCurrentFilterQuery] = useState<any>();
    const [appliedFilters, setAppliedFilters] = useState<any>({});
    const [removeFilterData, setRemoveFilterData] = useState<any>("");

    const [getUserActionSummaryService, getUserActionSummaryResponse] = useGetUserActionSummaryMutation();
    const [getUserActionSummaryByFilterService] = useLazyGetUserActionSummaryByFilterQuery();
    const [getUserActionDetailService, getUserActionDetailResponse] = useGetUserActionDetailMutation();
    const [getUserActionDetailByFilterService, getUserActionDetailByFilterResponse] = useLazyGetUserActionDetailByFilterQuery();
    const [getUserActionServices, getUserActionServicesResponse] = useGetUserActionServicesMutation();

    useEffect(() => {
        // API call for web service summary
        getUserActionSummaryService();
        getUserActionServices();
    }, []);

    useEffect(() => {
        // API call for user action - detailed reports
        if (currentFilterQuery) {
            getUserActionDetailByFilterService({ filterData: currentFilterQuery + "&page=" + pageNumber });
        } else {
            getUserActionDetailService({ pageNumber: pageNumber });
        }
    }, [pageNumber]);

    const getNextPaginationData = (pageNumber: number | string) => {
        setPageNumber(pageNumber);
    };

    const extractResponseData = (response: any) => {
        if (response?.isSuccess || response?.data?.responseCode === 0) {
            return response?.data?.response?.data;
        }
        return null;
    };

    useEffect(() => {
        const data = extractResponseData(getUserActionSummaryResponse);
        if (data) setSummaryData(data);
    }, [getUserActionSummaryResponse]);

    useEffect(() => {
        const data = extractResponseData(getUserActionDetailResponse);
        if (data) setDetailedReportsData(data);
    }, [getUserActionDetailResponse]);

    useEffect(() => {
        const data = extractResponseData(getUserActionDetailByFilterResponse);
        if (data) setDetailedReportsData(data);
    }, [getUserActionDetailByFilterResponse]);

    useEffect(() => {
        const data = extractResponseData(getUserActionServicesResponse);
        if (data) setServiceOptions(data);
    }, [getUserActionServicesResponse]);


    const headerProps: DescriptionHeaderProps["data"] = {
        title: t("user_action"),
        breadcrumbProps: [
            {
                path: "dashboard",
                title: t("dashboard"),
                breadcrumbName: "Dashboard",
                key: "Dashboard",
            },
            {
                path: "useraction",
                title: t("user_action"),
                breadcrumbName: t("user_action"),
                key: t("user_action"),
            }
        ],
    };

    /* Detailed report user action column */
    const initialColumns = [
        {
            title: "Module name",
            dataIndex: "moduleName",
            key: "service_name",
            width: "15%",
            ellipsis: true,
            addFilter: true
        },
        {
            title: "Login ID",
            dataIndex: "loginId",
            key: "loginId",
            width: "18%",
            ellipsis: true,
            filter: true,
            type: "search",
            label: "search_login_Id",
            name: "loginId",
        },
        {
            title: "Browser",
            dataIndex: "browser",
            key: "browser",
        },

        {
            title: "Request time stamp",
            dataIndex: "start_date",
            key: "start_date",
            filter: true,
            type: "date",
            label: "search_request_time_stamp",
            name: "start_date"
        },
        {
            title: "Response time stamp",
            dataIndex: "action_date",
            key: "action_date",
            filter: true,
            type: "date",
            label: "search_response_time_stamp",
            name: "action_date"
        },
        {
            title: "Response time",
            dataIndex: "responseTime",
            key: "responseTime",
            filter: false,
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
            filter: true,
            type: "selectFilter",
            label: "select_status",
            name: "status",
            option: [
                { value: 'success', label: 'Success' },
                { value: 'faliure', label: 'Faliure' }
            ],
            render: (status: string) => (
                <Tag color={status === "SUCCESS" ? "green" : "red"}>
                    {status}
                </Tag>
            ),
        },
    ];

    /* Table custom column functionality */
    const [visibleColumns, setVisibleColumns] = useState<any>(initialColumns);

    const prepareTableData = (userActionData: any) => {
        return {
            moduleName: userActionData.action_module || <Text className="d-iblock pl-30">-</Text>,
            loginId: userActionData.login_id || <Text className="d-iblock pl-30">-</Text>,
            // startTime: readableTimeFormat(userActionData.start_microseconds) || <Text className="d-iblock pl-30">-</Text>,
            // endTime: readableTimeFormat(userActionData.action_microseconds) || <Text className="d-iblock pl-30">-</Text>,
            start_date: dayjs(userActionData.start_date).format("HH:mm:ss, DD MMM, YYYY") || <Text className="d-iblock pl-30">-</Text>,
            action_date: dayjs(userActionData.action_date).format("HH:mm:ss, DD MMM, YYYY") || <Text className="d-iblock pl-30">-</Text>,
            os: userActionData.os || <Text className="d-iblock pl-30">-</Text>,
            browser: userActionData.browser || <Text className="d-iblock pl-30">-</Text>,
            responseTime: readableTimeFormat(userActionData.response_time) || <Text className="d-iblock pl-30">-</Text>,
            status: userActionData.status || <Text className="d-iblock pl-30">-</Text>,
            ...(userActionData?.expandedRow && {
                expandedRow: <Collapse defaultActiveKey={['1']} items={generateNestedItems(userActionData?.expandedRow, userActionData.key)} />
            })
        }
    }

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

            setTableData(detailedReportsData?.results?.map(prepareTableData));
        }
    }, [detailedReportsData?.results, visibleColumns]);

    const generateTabs = (data: any) => {
        return data.tabData.map((tabData: any) => ({
            key: tabData.id, label: tabData.label, children: tabData.content
        }))
    };

    // Function to generate nested collapsible items
    const generateNestedItems = (data: any, panelIndex: number) => {
        return data?.childData.map((nestedData: any, index: number) =>
        ({
            key: `${panelIndex}-${index + 1}`,
            label: (
                <Row className="space-between">
                    <Col style={{ color: `${nestedData.status === "success" ? "var(--t-success-color)" : "var(--t-color-error)"}` }}>{nestedData.label.serviceName}</Col>
                    <Col style={{ color: `${nestedData.status === "success" ? "var(--t-success-color)" : "var(--t-color-error)"}` }}>{nestedData.label.date}</Col>
                    <Col style={{ color: `${nestedData.status === "success" ? "var(--t-success-color)" : "var(--t-color-error)"}` }}>EAT : {nestedData.label.eta}</Col>
                </Row>
            ),
            children:
                <Row>
                    <Col className="my-15"> <Text className="">End Point : </Text>{nestedData.endPoint}</Col>
                    <Col>
                        <Tabs defaultActiveKey="1" type="card" items={generateTabs(nestedData)} />
                    </Col>
                </Row>,
            style: {
                background: `${nestedData.status === "success" ? "var(--t-success-bg)" : "var(--t-failed-bg)"}`,
            },
        }));
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
                        ? getUserActionSummaryByFilterService({ filterData: value }).unwrap()
                        : getUserActionDetailByFilterService({ filterData: value }).unwrap())
                    : await (activeTabKey === "summary"
                        ? getUserActionSummaryService().unwrap()
                        : getUserActionDetailService({ pageNumber }).unwrap());

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
                                lg={8} xl={9}>
                                <Title className="cls-title" level={3}>
                                    {t("user_action_matrics")} <Timestamp />
                                </Title>
                            </Col>
                            <Col xs={24} md={12} lg={16} xl={15}>
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
                                        <ChartMenu chartKey="userAction-summary" />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    {/* Dynamic chart */}
                    <Col span={24}>
                        <Row gutter={[10, 20]}>
                            <DynamicChart
                                customConfigKey="userAction-summary"
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
        <Row className="cls-userAction">
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

export default UserAction;
