/**
 * Title       : ChartMenu Component
 * Description : Provides a configurable menu interface for chart visualization controls.
 *               Allows users to toggle visibility of different chart data series through
 *               a popover checkbox interface. Integrates with Redux for state management.
 */
import { GetProp, Typography } from 'antd';
import { Popover, Checkbox } from "antd";
import { useAppSelector } from "@/hooks/App.hook";
import { useEffect, useState } from 'react';
import { setChartData } from "@/stores/Menu.store";
import { useDispatch } from "react-redux";
import { MenuOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "./ChartMenu.scss";
const { Text } = Typography;

/**
 * ChartMenu component properties
 */
interface ChartMenuProps {
  chartKey: string;  // Key identifier for the specific chart being controlled
}

/**
 * ChartMenu Component
 * Provides interactive controls for configuring chart display options through a popover interface.
 * @param {ChartMenuProps} props - Component properties
 * @returns {JSX.Element} The chart configuration menu JSX element
 */
const ChartMenu = (props: ChartMenuProps) => {
    /* --- Hook Initializations --- */
    const { t } = useTranslation();  // Translation hook for internationalization
    const dispatch = useDispatch();  // Redux dispatch function
    
    /* --- State Management --- */
    const [open, setOpen] = useState(false);  // Controls popover visibility
    const [chartOptions, setChartOption] = useState<string[]>([]);  // Stores available chart options
    
    /* --- Redux Store Access --- */
    const { activeRoute } = useAppSelector((state) => state.MenuReducer);  // Current active route
    const activeChart = useAppSelector((state) => state.MenuReducer?.chartData);  // Current chart configuration

    /**
     * Effect: Updates chart options when chart data or route changes
     * Filters out statistical data and sets available visualization options
     */
    useEffect(() => {
        const json = activeChart[props.chartKey] || {};
        const visibleKeys:any = Object.entries(json) .map(([key, value]: any) =>  value?.type !== "stat" && key !== "cards" ? {label:t(key),value:key} : undefined).filter((key) => key !== undefined);      
          
        setChartOption(visibleKeys);
    }, [activeChart, activeRoute]);

    /**
     * Handles checkbox changes for chart visibility toggles
     * @param {any} checkedValues - Array of selected/checked chart options
     */
    const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues: any) => {
        // Create deep copy of current chart data
        let temp = JSON.parse(JSON.stringify(activeChart)) || {};
        
        // Update visibility flags based on checkbox selections
        Object.entries(temp[props.chartKey])?.forEach(([key, value]: any) => {
            value.showChart = checkedValues.includes(key) || value?.type === "stat" || key === "cards" ? true : false;
        });
        
        // Dispatch updated chart configuration to Redux store
        dispatch(setChartData(temp));
    };

    {/* Component Rendering */}
    return (
        <Popover
            placement="leftTop"
            title={t("edit_columns")}
            content={
                <Checkbox.Group 
                    className="configPop" 
                    options={chartOptions} 
                    defaultValue={chartOptions.map((option:any) => option.value)} 
                    onChange={onChange} 
                />
            }
            trigger="click"
            open={open}
            onOpenChange={(flag: boolean) => setOpen(flag)}
        >
            {/* Menu trigger icon */}
            <Text className="cls-customColumn pointer cls-summaryColumn">
                <MenuOutlined />
            </Text>
        </Popover>
    )
}

export default ChartMenu;