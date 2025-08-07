import {
  ConfigProvider,
  Layout,
  theme as antdTheme,
  Input,
  Space,
  Avatar,
  Badge,
} from "antd";
import { UserOutlined, BellOutlined, SettingOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import AdminSidebar from "../../components/admin-sidebar/admin-sidebar";
import "./admin-layout.scss";
import { Outlet } from "react-router-dom";

const { Sider, Content, Header } = Layout;

const AdminLayout: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ConfigProvider
      theme={{
        algorithm: antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#7B61FF",
          borderRadius: 16,
          colorBgContainer: "#F6F7FB",
        },
      }}
    >
      <Layout className="admin-layout" style={{ minHeight: "100vh" }}>
        <Sider
          width={260}
          className="admin-sider"
          style={{
            background: "#fff",
            borderRadius: "16px",
            margin: 16,
            minHeight: "calc(100vh - 32px)",
            boxShadow: "0 2px 16px 0 rgba(80, 80, 80, 0.04)",
            padding: "24px 0",
            position: "relative",
          }}
        >
          <AdminSidebar />
        </Sider>
        <Layout style={{ background: "transparent" }}>
          <Header
            className="admin-header"
            style={{
              background: "#fff",
              borderRadius: "16px",
              margin: "16px 16px 0 0",
              padding: "0 32px",
              minHeight: 80,
              display: "flex",
              alignItems: "center",
              boxShadow: "0 2px 16px 0 rgba(80, 80, 80, 0.04)",
              justifyContent: "space-between",
            }}
          >
            {/* Search, notification, and user profile */}
            <Input.Search
              placeholder={t(
                "admin.searchPlaceholder",
                "Search your course..."
              )}
              className="admin-header__search-input"
              style={{ width: 320, borderRadius: 12, background: "#f6f7fb" }}
            />
            <Space size="large" className="admin-header__actions">
              <Badge count={3} size="small">
                <BellOutlined style={{ fontSize: 20 }} />
              </Badge>
              <SettingOutlined style={{ fontSize: 20 }} />
              <Avatar size={40} icon={<UserOutlined />} />
            </Space>
          </Header>
          <Content
            className="admin-content"
            style={{
              margin: "16px 16px 16px 0",
              padding: 0,
              minHeight: 360,
              background: "transparent",
              display: "flex",
              gap: 24,
            }}
          >
            <Space
              className="admin-content__main"
              direction="vertical"
              style={{
                flex: 2,
                width: "100%",
                background: "transparent",
              }}
              size={0}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 32,
                  minHeight: 360,
                  boxShadow: "0 2px 16px 0 rgba(80, 80, 80, 0.04)",
                  width: "100%",
                }}
              >
                <Outlet />
              </div>
            </Space>
            <Space
              className="admin-content__aside"
              direction="vertical"
              style={{
                flex: 1,
                minWidth: 320,
                background: "transparent",
                width: "100%",
              }}
              size={0}
              align="start"
            >
              {/* Statistic, mentor, and other widgets go here */}
              {/* Example: <AdminWidgets /> */}
            </Space>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AdminLayout;
