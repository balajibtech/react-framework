import "./Logo.scss";
import { Tooltip } from "antd";
import CFG from "@/config/config.json";
import { useTranslation } from "react-i18next";
import { sessionStorageAccessor } from "@/utils/browserStorage";
import { useAppSelector } from "@/hooks/App.hook";
import { useRedirect } from "@/hooks/Redirect.hook";

/**
 * Logo component renders the application logo.
 * It retrieves the logo image path and alt text using i18n (internationalization).
 *
 * @returns {JSX.Element} The logo JSX element.
 */
const Logo = () => {
  const { t } = useTranslation();
  const [SgetAirlineCode] = sessionStorageAccessor("airlineCode");
  const { redirect } = useRedirect();

  const { defaultRoute } = useAppSelector(
    (state) => state.MenuReducer
  );

  const dynamicImagePath = new URL(
    `../../plugins/${SgetAirlineCode() || CFG.default.airline_code}/assets/images/logo.webp`,
    import.meta.url
  ).href;

  return (
    <Tooltip
      title={t("home")}
      className="pointer cls-logo-anchor"
      data-testid="logo"
    >
      <img 
        id="logo"
        src={dynamicImagePath} 
        onClick={() => redirect(defaultRoute ? defaultRoute?.path : "/")}
        className={`${SgetAirlineCode()} cls-logoImage`} 
        alt={t("logo")} 
      />
    </Tooltip>
  );
};

export default Logo;
