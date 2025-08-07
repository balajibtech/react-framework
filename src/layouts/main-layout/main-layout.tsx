import { useState } from "react";
import { ConfigProvider, theme as antdTheme, Layout, Button } from "antd";
// Example for MainLayout and AdminLayout
import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MenuNavigation from "../../components/menu-navigation/menu-navigation";
import "./main-layout.scss";

const { Header, Content, Footer } = Layout;

const MainLayout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"light" | "dark">(
    import.meta.env.VITE_DEFAULT_THEME || "light"
  );

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ConfigProvider
      theme={{
        algorithm:
          theme === "light"
            ? antdTheme.defaultAlgorithm
            : antdTheme.darkAlgorithm,
      }}
    >
      <Layout className="main-layout">
        <Header className="main-header">
          <div className="main-header__left">
            <span className="logo">Logo</span>
            <MenuNavigation theme={theme} toggleTheme={toggleTheme} />
          </div>
          <Button
            type="primary"
            shape="round"
            size="large"
            className="signup-btn"
            onClick={() => navigate("/login")}
          >
            {t("login.title")}
          </Button>
        </Header>
        <Content className="main-content">
          <div className="main-content__container">
            <Outlet />
          </div>
        </Content>
        <Footer className="main-footer" aria-label={t("footer.title")}>
          <p>{t("footer.copyright")}</p>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;
