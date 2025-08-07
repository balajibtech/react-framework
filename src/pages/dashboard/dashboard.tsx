import { Row, Col, Typography } from "antd";
import { useTranslation } from "react-i18next";
import "./dashboard.scss";

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Row justify="center" className="dashboard">
      <Col xs={24} sm={20} md={18}>
        <Title level={2} aria-label={t("dashboard.title")}>
          {t("dashboard.content")}
        </Title>
      </Col>
    </Row>
  );
};

export default Dashboard;
