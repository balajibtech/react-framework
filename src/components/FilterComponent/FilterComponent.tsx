/**
 * Title       : Filter component
 * Description : This component provides a filter interface to allow users to filter a given dataset. It supports multiple filter types 
 *               such as text, select, date pickers, and time range filters
 */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button, Col, DatePicker, Drawer, Flex, Form, Input, Row, Select, Typography } from 'antd';
import { useToggle } from '@/hooks/Toggle.hook';
import { useTranslation } from 'react-i18next';
import utc from 'dayjs/plugin/utc';
import './FilterComponent.scss';
import dayjs from 'dayjs';
import { useAppSelector } from "@/hooks/App.hook";
import { useDispatch } from "react-redux";
import { SetFilterData } from '@/stores/Chart.store';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';

dayjs.extend(utc);
const { RangePicker } = DatePicker;
const { Text } = Typography;

type FilterFormData = { name: string; type: string; defaultValue: string; label?: string, option?: any };

type FilterComponentType = {
    filterByValue?: string;
    activeTabKeyString?: any;
    drawerMode: boolean;
    serviceOptions?: any;
    propsFilterFormData?: FilterFormData[];
    removeFilterData?: string;
    filteredDataHandler: (filteredData: string, formValues?: any) => void;
    initialColumns?: any
};


const DEFAULT_SERVICE_OPTIONS = [{ value: 'All service', label: 'All service' }];

const DEFAULT_FILTER_FORM_DATA = [
    { name: 'filterBy', type: 'filterBy', defaultValue: "today" },
    { name: 'search', type: 'search', label: "search" },
    { name: 'service', type: 'select' }
];

const inlineDefaultForm = [
    { name: 'inlineFilterBy', type: 'filterBy', defaultValue: "today" },
    { name: 'search', type: 'search', label: "search" },
    { name: 'service', type: 'select' }
];

export const FILTER_OPTIONS = [
    { value: 'today', label: 'today', defaultValue: "today" },
    { value: 'yesterday', label: 'yesterday' },
    { value: 'this_week', label: 'this_week' },
    { value: 'last_week', label: 'last_week' },
    { value: 'this_month', label: 'this_month' },
    { value: 'last_month', label: 'last_month' },
    { value: 'custom', label: 'custom' }
];

/**
 * Component which provides a filter interface to allow users to filter a given dataset
 * @param props 
    - drawerMode - Optional prop to enable drawer mode
    - serviceOptions - Options for service filter dropdown
    - filterFormData - Configuration of filter form
    - removeFilterData - data from parent component to reset the filter applied
    - filteredDataHandler - Handler to update filtered data in parent component
 */
const FilterComponent: React.FC<FilterComponentType> = ({
    activeTabKeyString = "summary",
    drawerMode = false,
    serviceOptions = DEFAULT_SERVICE_OPTIONS,
    propsFilterFormData = activeTabKeyString === "summary" ? inlineDefaultForm : DEFAULT_FILTER_FORM_DATA,
    removeFilterData = "",
    filteredDataHandler,
    initialColumns,
}) => {
    /* --- Hook variables --- */
    const { t } = useTranslation();
    const [filterForm] = Form.useForm();
    const [inlinefilterForm] = Form.useForm();
    const [open, toggleOpen] = useToggle(false);
    const dispatch = useDispatch();

    /* --- State variables --- */
    const [filterByValue, setFilterByValue] = useState("today");
    const [inlineFilterByValue, setInlineFilterByValue] = useState("today");
    const [searchValue, setSearchValue] = useState("");
    const chartFilterData = useAppSelector((state) => state.ServiceModuleNameReducer);
    const initialValueJSON: any = {}
    const [filterFormData] = useState(propsFilterFormData)
    const [adderFilter, setAdderFilter] = useState<any[]>([]);

    const prepareColFilterData = useCallback((colData: any) => {
        if (!colData) return null;
        return colData;
    }, []);

    // Effect 1: Process initial columns and set adderFilter
    useEffect(() => {
        if (!initialColumns) return;

        const newFilterFormData = initialColumns
            .filter((colData: any[]) => colData.filter)
            .map(prepareColFilterData)
            .filter(Boolean);

        setAdderFilter(newFilterFormData);
    }, [initialColumns, prepareColFilterData]);



    useEffect(() => {
        filterFormData.map((item: any) => {
            if (item?.defaultValue) {
                initialValueJSON[item.name] = item?.defaultValue;
                activeTabKeyString === "summary" ?
                    inlinefilterForm.setFieldValue([item.name], item?.defaultValue) :
                    filterForm.setFieldValue([item.name], item?.defaultValue);
            }
        })
    }, [])

    /**
     * useEffect hook to reset and remove filter applied
     */
    useEffect(() => {
        if (removeFilterData) {
            filterForm.setFieldValue(removeFilterData, undefined);
            if (removeFilterData === "filterBy") {
                setFilterByValue("today");
                filterForm.setFieldValue("customDate", undefined);
            }
            else if (removeFilterData === "inlineFilterBy") {
                setInlineFilterByValue("today");
                inlinefilterForm.setFieldValue("customDate", undefined);
            }
            filterHandler(false);
        }
    }, [removeFilterData]);

    useEffect(() => {
        setInlineFilterByValue(chartFilterData?.filter?.filterBy ? chartFilterData?.filter?.filterBy : chartFilterData?.filter?.inlineFilterBy || "today")
    }, [])

    useEffect(() => {


        if (chartFilterData?.filter?.filterLabel && activeTabKeyString === "detailedReports") {
            if (chartFilterData.services.time) {
                dispatch(SetFilterData({
                    filterLabel: "custom",
                }))
                setFilterByValue("custom")
                filterForm.setFieldValue("filterBy", "custom");
            }
            if (chartFilterData?.filter?.filterLabel === "custom" && chartFilterData?.filter?.filterCustomeValue) {
                let customValue = chartFilterData?.filter?.filterCustomeValue;
                filterForm.setFieldValue("filterBy", "custom");
                filterForm.setFieldValue("customDate", customValue.map((d: any) => dayjs(d)))
                setFilterByValue(chartFilterData?.filter?.filterLabel)
                // dispatch(SetFilterData({
                //     filterLabel: filterByValue,
                // }));
            } else {
                filterForm.setFieldValue("customDate", "");
                filterForm.setFieldValue("filterBy", chartFilterData?.filter?.filterLabel);
                setFilterByValue(chartFilterData?.filter?.filterLabel);
            }

            if (chartFilterData.services) {
                Object.entries(serviceOptions)?.forEach(([key]: any) => {
                    if (chartFilterData?.services[key] !== undefined && chartFilterData?.services[key] !== null && chartFilterData?.services[key] !== "") {

                        filterForm.setFieldValue(key, chartFilterData?.services[key]);
                        filterForm.setFieldValue("customDate", "");
                        filterForm.setFieldValue("filterBy", chartFilterData?.filter?.filterLabel);

                    }
                    else {
                        filterForm.setFieldValue(key, null);
                    }
                });
                activeTabKeyString === "detailedReports" && filterHandler(false);
            } else {
                filterHandler(false);
            }
        } else {
            if (chartFilterData?.filter?.filterLabel) {
                setInlineFilterByValue(chartFilterData?.filter?.filterLabel)
                inlinefilterForm.setFieldValue("inlineFilterBy", chartFilterData?.filter?.filterLabel);
                filterHandler(false);
            }
        }
    }, [activeTabKeyString]);


    const customDate = filterForm.getFieldValue("customDate");

    useEffect(() => {
        const valid = Object.entries(serviceOptions).some(
            ([key]: any) => chartFilterData?.services?.[key] !== ""
        );

        if (filterByValue === "custom" && Array.isArray(customDate) && !valid) {
            const serializedDates = customDate.map((d) =>
                dayjs.isDayjs(d) ? d.toISOString() : d
            );

            dispatch(SetFilterData({
                filterLabel: "custom",
                filterCustomeValue: serializedDates
            }));
        } else {
            dispatch(SetFilterData({
                filterLabel: inlineFilterByValue,
                filterCustomeValue: undefined,
                inlineFilterBy: inlineFilterByValue
            }));
        }
    }, [filterByValue, customDate, inlineFilterByValue]);


    /**
     * Generates date range parameters based on filter selection
     * @param filterValue - The selected filter option (e.g., 'today', 'this_week')
     * @param customRange - Optional custom date range (used when filterValue is 'custom')
     * @returns Object containing start (st_dt) and end (ed_dt) dates in UTC format
     */
    const getDateRangeParams = useCallback((filterValue: string, customRange?: { start: Date; end: Date }) => {
        // Get current timestamp using dayjs
        const now = dayjs();

        // Initialize result object to store date parameters
        const result: Record<string, string> = {};

        // Define UTC format string for API compatibility (ISO 8601 with Zulu time)
        const utcFormat = 'YYYY-MM-DDTHH:mm:ss[Z]';

        // Handle different filter cases
        switch (filterValue) {
            // Today's date range (start of day to now)
            case 'today':
                result.st_dt = now.startOf('day').format(utcFormat);
                result.ed_dt = now.endOf('day').format(utcFormat);
                break;
            // Yesterday's date range (start to end of previous day)
            case 'yesterday':
                result.st_dt = now.subtract(1, 'day').startOf('day').format(utcFormat);
                result.ed_dt = now.subtract(1, 'day').endOf('day').format(utcFormat);
                break;
            // Current week range (start of week to now)
            case 'this_week':
                result.st_dt = now.startOf('week').format(utcFormat);
                result.ed_dt = now.format(utcFormat);
                break;
            // Previous week range (full week)
            case 'last_week':
                result.st_dt = now.subtract(1, 'week').startOf('week').format(utcFormat);
                result.ed_dt = now.subtract(1, 'week').endOf('week').format(utcFormat);
                break;
            // Current month range (start of month to now)
            case 'this_month':
                result.st_dt = now.startOf('month').format(utcFormat);
                result.ed_dt = now.format(utcFormat);
                break;
            // Previous month range (full month)
            case 'last_month':
                result.st_dt = now.subtract(1, 'month').startOf('month').format(utcFormat);
                result.ed_dt = now.subtract(1, 'month').endOf('month').format(utcFormat);
                break;
            // Custom date range provided by user
            case 'custom':
                if (customRange?.start && customRange?.end) {
                    result.st_dt = dayjs(customRange.start).format(utcFormat);
                    result.ed_dt = dayjs(customRange.end).format(utcFormat);
                }
                break;
            // Default case (same as 'today')
            default:
                result.st_dt = now.startOf('day').format(utcFormat);
        }

        return result;
    }, []);

    /**
     * Reset functionality handler 
     */
    const resetHandler = useCallback(() => {
        filterForm.resetFields();
        activeTabKeyString === "summary" ? setInlineFilterByValue("today") : setFilterByValue("today");
        filteredDataHandler("", {});
    }, [filterForm, filteredDataHandler]);

    /**
     * Handles form submission and constructs the filter query parameters
     *      - Applies filters based on form values
     *      - Constructs proper query string for API calls
     *      - Manages drawer state when in drawer mode
     * @param openBool - Controls whether to toggle the drawer open/close state (default: true)
     */
    const filterHandler = useCallback((openBool: boolean = true) => {

        if (activeTabKeyString !== "detailedReports") {
            const filterByValue = filterForm.getFieldValue("filterBy");
            filterForm.resetFields(); // resets all
            filterForm.setFieldValue("filterBy", filterByValue); // restores "filterBy"
        }

        // Toggle drawer open if in drawer mode and openBool is true
        (drawerMode && openBool) && toggleOpen();

        // Get all current form field values
        const formValues = filterForm.getFieldsValue(true);
        const formInlineValue = inlinefilterForm.getFieldsValue(true);
        // Extract filter type and custom date range if available
        const filterValue = activeTabKeyString === "detailedReports" ? formValues?.filterBy || "today" : formInlineValue.inlineFilterBy || "today";
        const customRange = {
            start: formValues?.customDate?.[0]?.toDate(),  // Convert first date to Date object
            end: formValues?.customDate?.[1]?.toDate()    // Convert second date to Date object
        };

        // Get date range parameters based on selected filter
        const dateSelected = getDateRangeParams(filterValue, customRange);

        // Convert date parameters to query string format (key=value&key2=value2)
        const dateQueryString = Object.entries(dateSelected)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');

        // Handle search parameter with special formatting
        const searchParam = formValues?.search
            ? `q=${formValues.search}`  // Search parameter prefix
            : '';

        // Process all other form parameters (excluding special fields)
        const otherParams = Object.entries(formValues)
            // Exclude filterBy, customDate and search fields
            .filter(([key]) => !['filterBy', 'customDate', 'search'].includes(key))
            // Remove empty/null/undefined values
            .filter(([_, value]) => value !== undefined && value !== null && value !== '')
            // Convert to key=value strings
            .map(([key, value]: any) => `${key}=${encodeURIComponent(JSON.stringify(Array.isArray(value) ? value : [value]))}`)
            .join('&');

        // Combine all parameter strings (search, other params, dates) and filter out empty strings and join with '&'
        const allParams = [
            searchParam,
            otherParams,
            dateQueryString
        ].filter(Boolean).join('&');

        // Send the constructed query string to parent component and also passes full form values if in drawer mode
        filteredDataHandler(allParams, drawerMode ? formValues : {});
        // dispatch(SetChartServiceModuleName());

    }, [
        // Dependency array
        drawerMode,
        filterForm,
        inlinefilterForm,
        getDateRangeParams,
        filteredDataHandler,
        toggleOpen,
        filterByValue,
        inlineFilterByValue
    ]);

    /**
     * Memoized callback handler for form input changes
     * Combines form field update with optional filter triggering
     */
    const handleInputChange = useCallback(
        (field: string, value: any, shouldFilter = false) => {
            activeTabKeyString === "summary" ?
                inlinefilterForm.setFieldsValue({ [field]: value }) :
                filterForm.setFieldsValue({ [field]: value })
            shouldFilter && filterHandler();
        }, [filterForm, filterHandler, inlinefilterForm]
    );

    /**
     * Memoized component renderer for different filter field types
     */
    const renderFilterField = useCallback((filterItem: FilterFormData) => {
        // Switch based on the filter field type
        switch (filterItem.type) {
            case 'filterBy':
                return (
                    <React.Fragment>
                        <Form.Item className="mt-5 mb-0" name={filterItem?.name}>
                            <Text className="cls-selectFloatingInput d-block">
                                <Select
                                    className="cls-floatingSelect w-100"
                                    onChange={(value) => {
                                        setFilterByValue(value);
                                        handleInputChange(filterItem?.name, value || "today");
                                        filterForm.setFieldValue("customDate", null);
                                    }}
                                    value={filterByValue}
                                    // defaultValue="today"
                                    allowClear
                                    options={FILTER_OPTIONS.map(opt => ({ ...opt, label: t(opt.label) }))}
                                />
                                <label className="floating-label">{t('filter_by')}</label>
                            </Text>
                        </Form.Item>
                        {filterByValue === "custom" && (
                            <Form.Item className="w-100 mb-22" name="customDate">
                                <RangePicker
                                    size="small"
                                    showTime={{
                                        defaultValue: [dayjs().startOf('day'), dayjs().endOf('day')],
                                    }}
                                    disabledDate={(current) => current && current > dayjs().endOf('day')}
                                    format="DD MMM, YYYY HH:mm:ss"
                                    onChange={(dates) => handleInputChange("customDate", dates)}
                                />
                            </Form.Item>
                        )}
                    </React.Fragment>
                );
            case 'search':
                return (
                    <Form.Item name={filterItem?.name}>
                        <Input
                            value={filterForm.getFieldValue(filterItem?.name)}
                            className={`floating-input ${searchValue ? "has-value" : ""}`}
                            allowClear
                            onChange={(e: { target: { value: any }; }) => {
                                setSearchValue(e.target.value);
                                handleInputChange(filterItem.name, e.target.value);
                            }}
                        />
                        <label className="floating-label">{t(filterItem.label || "Enter")}</label>
                    </Form.Item>
                );
            case 'select':
                return (
                    <React.Fragment>
                        {Object.entries(serviceOptions).map(([key, value]: any) => (
                            <Form.Item className="mb-0" name={`${key}`} key={key}>
                                <Text className="cls-selectFloatingInput d-block">
                                    <Select
                                        className="cls-floatingSelect w-100"
                                        onChange={(value) => handleInputChange(key, value)}
                                        options={value}
                                        allowClear
                                        value={filterForm.getFieldValue(key)}
                                    />
                                    <label className="floating-label">{t(key)}</label>
                                </Text>
                            </Form.Item>
                        ))}
                    </React.Fragment>
                );
            case "selectFilter":
                return (
                    <React.Fragment>
                        <Form.Item className="mb-0" name={filterItem.name} key={filterItem.name}>
                            <Text className="cls-selectFloatingInput d-block">
                                <Select
                                    className="cls-floatingSelect w-100"
                                    onChange={(value) => handleInputChange(filterItem.name, value)}
                                    options={filterItem.option}
                                    allowClear
                                    value={filterForm.getFieldValue(filterItem.name)}
                                />
                                <label className="floating-label">{t(filterItem?.label || "Select date")}</label>
                            </Text>
                        </Form.Item>
                    </React.Fragment>
                );
            case 'date':
                return (
                    <>
                        <Form.Item
                            className="w-100 mb-20"
                            style={{ width: "100%" }}
                            name={filterItem.name}
                        >
                            <DatePicker
                                style={{ width: "100%" }}
                                showTime={{
                                    format: 'HH:mm:ss',
                                    defaultValue: dayjs('00:00:00', 'HH:mm:ss')
                                }}
                                placeholder={t(filterItem?.label || "Select date")}
                                format="DD MMM, YYYY HH:mm:ss"
                                onChange={(dates: any) => {
                                    handleInputChange(filterItem.name, dates, false);
                                }}
                            />
                        </Form.Item>
                    </>
                )
            default:
                return null; // Return nothing for unknown types
        }
    }, [filterByValue, handleInputChange, serviceOptions, t]);

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: <Text className="fs-12 f-reg">{t('advance_search')}</Text>,
            children:
                <>
                    {
                        adderFilter.map((item: any) => {
                            return renderFilterField(item)
                        })
                    }
                </>,
        },
    ]

    /**
     * Memoized component renderer for filter in drawer mode
     */
    const drawerContent = useMemo(() => (
        <Row className="cls-filter-component">
            <Col className="cls-filterCloseIcon" onClick={() => toggleOpen()}>
                <Text className="Infi-Sp_30_CloseMark" />
            </Col>
            <Flex className="cls-filter-header h-62" justify="space-between">
                <Text className="d-flex">
                    <Text className="Infi-Sp_26_Filter cls-filter-icon" />
                    <Text className="cls-filter-title">{t('filters')}</Text>
                </Text>
                <Button htmlType="button" className="cls-reset-button" type="link" onClick={resetHandler}>
                    {t('reset_all')}
                </Button>
            </Flex>
            <Col span={24} className="cls-filter-body">
                <Form form={filterForm} initialValues={initialValueJSON} >
                    {filterFormData.map((item: any) => (
                        <React.Fragment key={item?.name}>
                            {renderFilterField(item)}
                        </React.Fragment>
                    ))}

                    <Collapse className="cls-advanceSearchContainer" ghost items={items} />

                </Form>
            </Col>
            <Col span={24} className="cls-filter-button px-20">
                <Button type="primary" className="w-100" onClick={() => filterHandler()}>
                    {t('apply')}
                </Button>
            </Col>
        </Row>
    ), [filterForm, filterFormData, filterHandler, renderFilterField, resetHandler, t, toggleOpen]);

    /**
     * Memoized component renderer for filter in inline mode
     */
    const inlineFilters = useMemo(() => (
        <Row className="justify-end" gutter={[10, 10]}>
            <Col xl={24}>
                <Form form={inlinefilterForm} initialValues={initialValueJSON} className="d-flex g-10 justify-end flex-wrap">
                    {filterFormData.map((filterItem, index) => (
                        <React.Fragment key={index}>
                            {filterItem.type === "filterBy" && (
                                <>
                                    <Form.Item className="mb-0" name={filterItem?.name} style={{ width: "120px" }}>
                                        <Select
                                            onChange={(value) => {
                                                setInlineFilterByValue(value);
                                                handleInputChange(filterItem.name, value || "today", true);
                                            }}
                                            value={inlineFilterByValue}
                                            // defaultValue="today"
                                            allowClear
                                            options={FILTER_OPTIONS.map((opt) => ({ ...opt, label: t(opt.label) }))}
                                        />
                                    </Form.Item>
                                    {inlineFilterByValue === "custom" && (
                                        <Form.Item
                                            className="w-50 mb-0"
                                            style={{ maxWidth: "375px" }}
                                            name="customDate"
                                        >
                                            <RangePicker
                                                showTime={{
                                                    defaultValue: [
                                                        dayjs().startOf("day"),
                                                        dayjs().endOf("day"),
                                                    ],
                                                }}
                                                format="DD MMM, YYYY HH:mm:ss"
                                                onChange={(dates) => {
                                                    handleInputChange("customDate", dates, true);
                                                }}
                                            />
                                        </Form.Item>
                                    )}
                                </>
                            )}

                            {filterItem.type === "search" && (
                                <Form.Item
                                    className="w-50 mb-0"
                                    name={filterItem?.name}
                                    style={{ maxWidth: "200px" }}
                                >
                                    <Input
                                        placeholder={t("search")}
                                        allowClear
                                        onChange={(e) => {
                                            handleInputChange(filterItem?.name, e.target.value, true);
                                        }}
                                    />
                                </Form.Item>
                            )}

                            {filterItem.type === "select" && (
                                <React.Fragment>
                                    {Object.entries(serviceOptions).map(([category, options]: any) => (
                                        <Form.Item
                                            key={category}
                                            className="mb-0"
                                            name={`${category}`}
                                            style={{ maxWidth: "200px" }}
                                        >
                                            <Select
                                                placeholder={`Select ${category}`}
                                                options={options}
                                                value={filterForm.getFieldValue(category)}
                                                onChange={(val) => handleInputChange(`${category}`, val, true)}
                                                allowClear
                                            />
                                        </Form.Item>
                                    ))}
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    ))}
                </Form>
            </Col>
        </Row>
    ), [inlineFilterByValue, inlinefilterForm, handleInputChange, serviceOptions, t]);

    if (drawerMode) {
        /* Drawer mode filter section */
        return (
            <>
                <Button className="Infi-Sp_26_Filter cls-filterOpenIcon" onClick={() => toggleOpen()} />
                <Drawer
                    onClose={() => toggleOpen()}
                    open={open}
                    styles={{ header: { display: 'none' } }}
                    closable
                >
                    {drawerContent}
                </Drawer>
            </>
        );
    }

    /* Inline mode filter section */
    return inlineFilters;
};

export default React.memo(FilterComponent);
