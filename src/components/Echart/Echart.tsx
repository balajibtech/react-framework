import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import { useDispatch } from "react-redux";
import { SetChartServiceModuleName, SetFilterData } from '@/stores/Chart.store';
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAppSelector } from '@/hooks/App.hook';
dayjs.extend(customParseFormat);

interface EChartProps {
  option: any;
  // option: echarts.EChartsOption;
  style?: React.CSSProperties;
}

const EChartComponent: React.FC<EChartProps> = ({ option, style }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const chartFilterData = useAppSelector((state) => state.ServiceModuleNameReducer);

  useEffect(() => {
    const chartDom = chartRef.current;
    if (!chartDom) return;

    let disposed = false;
    const existingInstance = echarts.getInstanceByDom(chartDom);
    
    if (existingInstance) {
      existingInstance?.dispose();
    }

    const chart = echarts.init(chartDom);
    chart.setOption(option, {
      notMerge: false, // ✅ allow merging (preserves animations)
      lazyUpdate: false
    });
    
    chart.on('click', (params: any) => {
      if (disposed) return;
      if (["line", "bar", "mixedLineBar"].includes(params.seriesType)) {
        const filterData = params.data?.filterData;
        if (Array.isArray(filterData)) {
          const endStr = dayjs(filterData?.[params.dataIndex], "HH:mm, DD MMM, YYYY");
          const startStr = dayjs(filterData?.[params.dataIndex - 1], "HH:mm, DD MMM, YYYY") || endStr;
          if (startStr && endStr) {
            const filterChartDate = 
              (!startStr.isValid() || !endStr.isValid()) 
               ? undefined 
               : [
                  dayjs(startStr, "HH:mm, DD MMM, YYYY"),
                  dayjs(endStr, "HH:mm, DD MMM, YYYY")
                 ];
            let data = chartFilterData?.filter?.inlineFilterBy;            
            if (filterChartDate) {
              dispatch(SetFilterData({
                filterLabel: "custom",
                filterCustomeValue: filterChartDate, // now serializable
                inlineFilterBy: data && data
              }));
            }            
          }
        }            
        dispatch(SetChartServiceModuleName(params?.data?.filterService));
      } else {
        dispatch(SetChartServiceModuleName({}));
      }
    });

    if (option?.dataZoom) {
      setTimeout(() => {
        if (disposed) return;
        try {
          chart.dispatchAction({
            type: 'dataZoom',
            start: 0,
            end: (Array.isArray(option.dataZoom)
              ? option.dataZoom[0]?.end
              : option.dataZoom?.end) as number
          });
        } catch (e) {
          // Avoid exceptions if chart is disposed
          console.warn("Chart action error:", e);
        }
      }, 500);
    }

    const handleResize = () => {
      if (!disposed) chart.resize();
    };

    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      if (!disposed) chart.resize();
    });
    resizeObserver.observe(chartDom);

    return () => {
      disposed = true;
      if (!chart.isDisposed?.()) chart.dispose();
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [option, dispatch]);

  return (
    <div ref={chartRef} style={{ width: '100%', height: '100%', ...style }} />
  );
};

export default EChartComponent;
