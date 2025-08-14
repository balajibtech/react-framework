import { Row, Col } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ThemeToggle, {
  type ThemeToggleProps,
} from "../theme-toggle/theme-toggle";
import LanguageSelect from "../language-select/language-select";
import "./menu-navigation.scss";

// Define your menu items here or import from a config file
const menuItems = [{ key: "home", labelKey: "nav.home", path: "/" }];

const MenuNavigation: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <Row className="menu-navigation" align="middle" justify="space-between">
      <Col>
        <Row gutter={[16, 16]} align="middle">
          {menuItems.map((item) => (
            <Col key={item.key}>
              <Link
                to={item.path}
                aria-label={t(item.labelKey)}
                className={location.pathname.startsWith(item.path) ? "active" : ""}
              >
                {t(item.labelKey)}
              </Link>
            </Col>
          ))}
        </Row>
      </Col>
      <Col>
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </Col>
          <Col>
            <LanguageSelect />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default MenuNavigation;
