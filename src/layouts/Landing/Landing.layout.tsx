import { 
  Layout, 
  // Typography, 
  Row, 
  Col, 
  Grid, 
  Flex 
} from "antd";
import "./Landing.layout.scss";
import { useTranslation } from "react-i18next";
import { LandingLogo } from "@/components/Icons/HeaderIcon";
import Logo from "@/components/Logo/Logo";
import CFG from "@/config/config.json";
import { sessionStorageAccessor } from "@/utils/browserStorage";
import { Theme } from "@/components/Theme/Theme";
import Language from "@/components/Language/Language";

// Destructure Ant Design hooks and components
const { useBreakpoint } = Grid;
const { Content, Sider } = Layout;
// const { Text } = Typography;

// Interface defining the props for LandingLayout component
interface LandingLayout {
  children: React.ReactNode;
}

/**
 * Landing page layout component
 * Handles two-column layout with content on left and login form on right
 * Responsively adjusts for mobile devices
 */
const LandingLayout: React.FC<LandingLayout> = ({ children }) => {
  // Internationalization hook for translations
  const { t } = useTranslation();
  
  // Get airline code from session storage or fallback to config default
  const [SgetAirlineCode] = sessionStorageAccessor("airlineCode");
  
  // Responsive breakpoints detection
  const screens = useBreakpoint();
  const isMobile = !screens['md']; // Mobile detection using 'md' breakpoint

  return (
    <Layout className="cls-landingLayout">
      {/* Content Area (Left Side) */}
      <Content className="cls-landing-container">
        <Row justify="center" align="middle" className="w-100">
          <Col xs={24} sm={24} md={16} lg={17} className="text-center">
            {/* Dynamic logo based on airline code */}
            <LandingLogo airline={SgetAirlineCode() || CFG.default.airline_code} />
            {/* <Text className="f-sbold cls-description-heading w-100 d-iblock">
              {t("login_registered_users_get_more_offers")}
            </Text> */}
            
            {/* Feature points list */}
            <div className="fs-21 mt-20 ml-40 cls-description-points text-start">
              <ul className="cls-ulPoints">
                <li>{t("login_page_point_1")}</li>
                <li>{t("login_page_point_2")}</li>
                <li>{t("login_page_point_3")}</li>
                <li>{t("login_page_point_4")}</li>
              </ul>
            </div>
          </Col>
        </Row>
      </Content>

      {/* Login Area (Right Side) - transforms to full width on mobile */}
      <Sider 
        width={isMobile ? '100%' : '50%'} // Responsive width handling
        className="text-center"
        theme="light" // Light theme variant
      >
        {/* Theme and language selector controls */}
        <Flex justify="end" gap={15} align="middle" className="px-15 p-20">
          <Theme />
          <Language />
        </Flex>
        
        {/* Login form container */}
        <Row justify="center" align="middle" className="cls-loginContainer mt-20 mb-40">
          <Col span={16}>
            {/* Show logo only on mobile view */}
            {isMobile && (
              <Col span={24} className="cls-mobLogo">
                <Logo />
              </Col>
            )}
            
            {/* Render child components (login form) */}
            {children}
          </Col>
        </Row>
      </Sider>
    </Layout>
  );
};

export default LandingLayout;