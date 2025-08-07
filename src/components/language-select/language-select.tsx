import { Select } from "antd";
import { useTranslation } from "react-i18next";
import "./language-select.scss";

const { Option } = Select;

const LanguageSelect: React.FC = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Select
      onChange={changeLanguage}
      defaultValue={i18n.language}
      aria-label={t("nav.language")}
      className="language-select"
      style={{ width: 120 }}
    >
      <Option value="en">{t("nav.english")}</Option>
      <Option value="es">{t("nav.spanish")}</Option>
    </Select>
  );
};

export default LanguageSelect;
