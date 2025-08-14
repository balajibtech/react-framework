import {
  ConfigProvider,
  Layout,
  theme as antdTheme,
  Input,
  Badge,
  Dropdown,
  Space,
  Avatar,
} from "antd";
import {
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  DownOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useState } from "react";

import { useTranslation } from "react-i18next";
import AdminSidebar from "../../components/admin-sidebar/admin-sidebar";
import "./admin-layout.scss";
import { Outlet, useNavigate } from "react-router-dom";
import LanguageSelect from "../../components/language-select/language-select";
import ThemeToggle from "../../components/theme-toggle/theme-toggle";

const { Sider, Content, Header } = Layout;

const AdminLayout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"light" | "dark">(
    import.meta.env.VITE_DEFAULT_THEME || "light"
  );

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Placeholder for logged-in user - replace with your auth logic
  const [loggedInUser, setLoggedInUser] = useState<{ username: string } | null>(
    { username: "AdminUser" }
  ); // Simulate a logged-in user

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Admin logging out...");
    setLoggedInUser(null); // Simulate logout
    // Redirect to login page or homepage after logout
    navigate('/login');
  };

  const items: MenuProps["items"] = [
    {
      key: "theme",
      label: <ThemeToggle theme={theme} toggleTheme={toggleTheme} />,
      // You would typically have a ThemeToggle component here
    },
    {
      key: "language",
      label: <LanguageSelect />,
      // You would typically have a LanguageSelect component here
    },
    {
      key: "logout",
      label: <a onClick={handleLogout}>{t("logout")}</a>,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm:
          theme === "light"
            ? antdTheme.defaultAlgorithm
            : antdTheme.darkAlgorithm,
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
              {loggedInUser ? (
                <Dropdown menu={{ items }} trigger={["click"]}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <Avatar size={40} icon={<UserOutlined />} />
                      {loggedInUser.username}
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              ) : (
                <Avatar size={40} icon={<UserOutlined />} />
              )}
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
