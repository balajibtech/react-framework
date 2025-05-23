import { Row, Col, Typography, Skeleton, Tooltip } from "antd";
import "./DescriptionHeader.scss";
// import { useAuth } from "@/hooks/Auth.hook";
import { useTranslation } from "react-i18next";
import BreadcrumbComponent from "../Breadcrumb/Breadcrumb";
import { useResize } from "@/utils/resize";
import Timestamp from "../Timestamp/Timestamp";
export interface DescriptionHeaderProps {
  data: {
    title: string;
    description?: string;
    primaryHeading?: string;
    primaryValue?: string;
    secondaryHeading?: string;
    secondaryValue?: string;
    breadcrumbProps?: any | undefined;
  } | undefined;
}

const DescriptionHeader = (props: DescriptionHeaderProps) => {
  const headerData = props?.data;
  const { Title, Text } = Typography;
  // const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { isSmallScreen } = useResize();

  return (
    <div data-testid="DescriptionHeader" className="cls-description-header w-100">
      {headerData?.breadcrumbProps ? (
        <BreadcrumbComponent
          key={headerData.title + "breadcrumb"}
          props={headerData?.breadcrumbProps}
        />
      ) : (
        <></>
      )}
      {headerData ? (
        <Row
          className={`mb-15 cls-headerTitle`}
          justify="space-between"
        >
          <Col className="cls-header-left" xs={24} sm={11} md={12} lg={12} xl={16}>
            <Title level={3} className="cls-heading d-flex f-sbold">
              {headerData.title}
              {headerData?.title === t("dashboard") && (
                <Timestamp />
              )}
              {headerData?.description ?
                <Tooltip
                  className="pointer"
                  title={<Text className="cls-description-tooltip fs-13 f-reg"> {headerData?.description} </Text>}
                  placement="bottom"
                >
                  <Text className={`Infi-Sp_05_Info d-iblock ${isSmallScreen ? "fs-23" : "fs-27"} pl-5 p-clr sbold v-align-middle`} />
                </Tooltip>
                : <></>
              }
            </Title>
          </Col>
          {headerData?.primaryHeading && (
            <Col className="cls-pnr-section cls-bgLayout-text-color" xs={24} sm={13} md={12} lg={12} xl={8}>
              <Row justify="end">
                <Col className="cls-pnr-text">
                  {t(`${headerData.primaryHeading}`)} :
                  <Title
                    className={`cls-pnr-code cls-bgLayout-text-color d-iblock ${isSmallScreen ? "fs-14" : "fs-18"}`}
                    level={5}
                  >
                    &nbsp;{headerData.primaryValue}
                  </Title>
                </Col>
              </Row>
              {headerData?.secondaryHeading && (
                <Row justify="end" style={{ marginLeft: isSmallScreen ? 0 : -10 }}>
                  <Col className="cls-pnr-text">
                    {t(`${headerData.secondaryHeading}`)} :
                    <Text className={`cls-dob f-sbold ${isSmallScreen ? "py-5 fs-13" : "pl-5 fs-14"}`}>
                      {headerData?.secondaryValue}
                    </Text>
                  </Col>
                </Row>
              )}
            </Col>
          )}
        </Row>
      ) : (
        <>
          <Skeleton.Input active size="large" className="w-50 h-35 mb-15" />
          <Skeleton.Input active size="large" className="w-100 h-30 mb-15" />
        </>
      )}
    </div>
  );
};

export default DescriptionHeader;
