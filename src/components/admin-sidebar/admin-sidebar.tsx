import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./admin-sidebar.scss";

const adminLinks = [
  { key: "dashboard", path: "/admin/dashboard", labelKey: "dashboard.title" },
  { key: "users", path: "/admin/users", labelKey: "admin.users" },
  { key: "settings", path: "/admin/settings", labelKey: "admin.settings" },
];

const AdminSidebar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Row
      className="admin-sidebar"
      gutter={[0, 16]}
      role="navigation"
      aria-label={t("admin.nav")}
    >
      {adminLinks.map((link) => (
        <Col span={24} key={link.key}>
          <Link to={link.path} aria-label={t(link.labelKey)}>
            {t(link.labelKey)}
          </Link>
        </Col>
      ))}
    </Row>
  );
};

export default AdminSidebar;
