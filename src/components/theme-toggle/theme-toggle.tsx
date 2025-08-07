import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { BulbOutlined, MoonOutlined } from "@ant-design/icons";
import "./theme-toggle.scss";

export interface ThemeToggleProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  const { t } = useTranslation();
  return (
    <Button
      onClick={toggleTheme}
      aria-label={t("nav.toggleTheme")}
      icon={theme === "light" ? <MoonOutlined /> : <BulbOutlined />}
      className="theme-toggle"
    />
  );
};

export default ThemeToggle;
