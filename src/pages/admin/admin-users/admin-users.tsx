import { Row, Col, Typography } from "antd";
import { useTranslation } from "react-i18next";
import "./admin-users.scss";

const { Title } = Typography;

const AdminUsers: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Row justify="center" className="admin-users">
      <Col xs={24} sm={20} md={18}>
        <Title level={2} aria-label={t("admin.users")}>
          {t("admin.usersContent")}
        </Title>
      </Col>
    </Row>
  );
};

export default AdminUsers;
