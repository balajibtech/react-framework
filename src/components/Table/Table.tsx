import { Table, TableProps as AntdTableProps, Skeleton, Typography,Empty } from "antd";
import { DefaultRecordType } from "rc-table/lib/interface";
import type { TableLocale } from "antd/lib/table/interface";
import "./Table.scss";
import { FdNoDataFound } from "../Icons/Icons";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
const { Text } = Typography;

type TablePagination<T extends object> = NonNullable<
  Exclude<AntdTableProps<T>["pagination"], boolean>
>;
type TablePaginationPosition = NonNullable<
  TablePagination<any>["position"]
>[number];
type selectionType = "checkbox" | "radio";
type SizeType = AntdTableProps<DefaultRecordType>["size"];
type TableLayoutType = undefined | "fixed";

/**
 * Props interface for the TableDisplay component.
 */
interface TableRecordType extends DefaultRecordType {
  expandedRow?: React.ReactNode;
  key: string | number;
}

interface TablePropsType {
  data: any[];
  columns: AntdTableProps<TableRecordType>["columns"];
  pagination?: {
    position?: TablePaginationPosition; /* topLeft | topCenter | topRight | none | bottomLeft | bottomCenter | bottomRight */
    pageSize?: number;
    totalCount?: number;
  };
  selection?: {
    type: selectionType;
    handler: (selectedRowKeys: any[]) => void;
  };
  size?: SizeType /* large | middle | small */;
  layout?: TableLayoutType;
  scroll?: AntdTableProps<DefaultRecordType>["scroll"] & {
    /* {y : 100} scroll y-axis */ scrollToFirstRowOnChange?: boolean;
  };
  loading?: boolean;
  width?: number | string;
  footer?: any;
  border?: boolean;
  loadingRows?: Record<string | number, boolean>;
  expandedRows?: any;
  fetchNextPaginationData?: (pageNumber: string | number) => void;
  isBackendPagination?: boolean; // Toggle backend or frontend pagination
  handleExpand?: (expanded: boolean, record: any) => void;
}


/**
 * TableDisplay component renders an Ant Design Table with flexible configuration options.
 * It supports pagination, row selection, size customization, layout customization, and scrolling.
 * @param data The data to be displayed in the table.
 * @param columns The columns configuration of the table.
 * @param pagination Configuration for pagination.
 * @param selection Configuration for row selection.
 * @param size Size of the table.
 * @param layout Layout of the table.
 * @param scroll Configuration for table scrolling.
 * @param loading Loading state.
 * @param fetchNextPaginationData Function to fetch data from the API.
 * @param isBackendPagination Toggle backend or frontend pagination.
 * @returns An Ant Design Table component with flexible configuration options.
 */
const Tabular = ({
  data,
  columns,
  pagination,
  selection,
  size,
  layout,
  scroll,
  loading,
  footer,
  border,
  fetchNextPaginationData,
  isBackendPagination = false, // Default to frontend pagination
  loadingRows = {},
  expandedRows = {},
  width,
  handleExpand
}: TablePropsType) => {
  const { t } = useTranslation();
  const [expandedRowKeys, setExpandedRowKeys] = useState<(string | number)[]>([]);
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [paginationInfo, setPaginationInfo] = useState({
    next: null,
    previous: null,
    total: pagination?.totalCount,
    pageSize: 6,
    currentPage: 1,
  });

  /* Setup hook to set the update state when data changes */
  useEffect(() => {
    setCurrentData(data);
    setExpandedRowKeys([]); // Update expanded keys
  }, [data]);

  useEffect(() => {
    setPaginationInfo((prev) => ({
      ...prev,
      total: pagination?.totalCount,
      currentPage: 1
    }));
  }, [pagination?.totalCount]);

  /* Handler function for row selection change */
  const rowSelection = {
    onChange: (_selectedRowKeys: React.Key[], selectedRows: any[]) => {
      selection?.handler(selectedRows);
    },
  };

  const customLocale: TableLocale = {
    emptyText: (
      <div style={{ textAlign: "center" }} className="my-30">
        <FdNoDataFound />
        <div className="mt-10 fs-16 f-med">{t("no_data_found")}</div>
      </div>
    ),
  };

  /* Update current page value to pagination on page change */
  const handleTableChange = (pagination: any) => {
    if (isBackendPagination && fetchNextPaginationData) {
      setPaginationInfo((prev) => ({
        ...prev,
        currentPage: pagination.current
      }));
      fetchNextPaginationData(pagination.current);
    }
  };

  // const handleRowExpand = (expanded: boolean, record: TableRecordType) => {
  //   if (handleExpand) {
  //     handleExpand(expanded, record);
  //   }
  //   setExpandedRowKeys(prevKeys =>
  //     expanded
  //       ? [...prevKeys, record.key]
  //       : prevKeys.filter(key => key !== record.key)
  //   );
  // };

  // const ExpandedRowContent = ({ loading, data, error }: ExpandedRowProps) => {
  //   const { t } = useTranslation();
  //   if (loading) return <Skeleton active />;
  //   if (error) return <Text type="danger">{t('error.loading_failed')}</Text>;
  //   if (!data) return <Text type="secondary">{t('no_data_found')}</Text>;
  
  //   return (
  //     <div className="expanded-row-content">
  //       {/* Render your expanded row data here */}
  //       {JSON.stringify(data, null, 2)}
  //     </div>
  //   );
  // };

  const handleRowExpand = async (expanded: boolean, record: TableRecordType) => {
    try {
      if (handleExpand) {
        await handleExpand(expanded, record);
      }
      setExpandedRowKeys(prevKeys =>
        expanded
          ? [...prevKeys, record.key]
          : prevKeys.filter(key => key !== record.key)
      );
    } catch (error) {
      console.error("Error expanding row:", error);
    }
  };

  return (
    <Table
      dataSource={currentData}
      columns={columns}
      className="cls-table-display"
      pagination={{
        hideOnSinglePage: true,
        position: [pagination?.position ?? "bottomRight"],
        ...(isBackendPagination
          ? {
            current: paginationInfo.currentPage,
            total: pagination?.totalCount,
            showSizeChanger: false,
            pageSize: 6
          }
          : {
            pageSize: 6,
            total: pagination?.totalCount,
          }),
      }}
      onChange={handleTableChange}
      rowSelection={
        selection
          ? {
            type: selection.type,
            ...rowSelection,
          }
          : undefined
      }
      size={size ?? "middle"}
      tableLayout={layout ? layout : undefined}
      scroll={scroll || { x: 1000 }}
      locale={customLocale}
      loading={!!loading && { spinning: true }}
      style={{ width: width ?? "auto" }}
      bordered={border ?? false}
      footer={footer ? footer : undefined}
      expandedRowKeys={expandedRowKeys}
      expandable={{
        // expandedRowRender: (record: TableRecordType) => {
        //   if (loadingRows[record.key]) {
        //     return <Skeleton active />;
        //   }
          
        //   if (expandedRows[record.key]) {
        //     return expandedRows[record.key];
        //   }
          
        //   return (
        //     <div style={{ textAlign: "center", padding: 16 }}>
        //       <Text type="secondary">{t("no_data_found")}</Text>
        //     </div>
        //   );
        // },

        // expandedRowRender: (record) => (
        //   <ExpandedRowContent 
        //     loading={loadingRows[record.key]} 
        //     data={expandedRows[record.key]}
        //     error={expandedRows[record.key]?.error}
        //   />
        // ),
        // rowExpandable: (record: TableRecordType) => !!record?.expandedRow,
        // // rowExpandable: (record: TableRecordType) => true,
        // expandIconColumnIndex: currentData?.some((item) => !!item.expandedRow) ? 0 : -1,
        // onExpand: handleRowExpand,
        expandedRowRender: (record) => {
          if (loadingRows[record.key]) {
            return <Skeleton active />;
          }
          return expandedRows[record.key] || <Text type="secondary">{<Empty />}</Text>;
        },
        rowExpandable: (record) => !!record.canExpand,
        onExpand: handleRowExpand,
        expandIconColumnIndex: data.some(item => item.canExpand) ? 0 : -1
      }}
    />
  );
};

export default Tabular;