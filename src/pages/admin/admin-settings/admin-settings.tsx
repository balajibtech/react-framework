import { Row, Col, Typography } from "antd";
import { useTranslation } from "react-i18next";
import "./admin-settings.scss";

const { Title } = Typography;

const AdminSettings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Row justify="center" className="admin-settings">
      <Col xs={24} sm={20} md={18}>
        <Title level={2} aria-label={t("admin.settings")}>
          {t("admin.settingsContent")}
        </Title>
      </Col>
    </Row>
  );
};

export default AdminSettings;
