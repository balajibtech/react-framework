import "./Loader.scss";
import { memo } from "react";
import CFG from "@/config/config.json";
import { useTranslation } from "react-i18next";
import { sessionStorageAccessor } from "@/utils/browserStorage";
import { Spin } from "antd";
// const DEFAULT_AIRLINE = "VA";

interface LoaderProps {
  fallback?: boolean;
}

const Loader = memo(({ fallback }: LoaderProps) => {
  const { t } = useTranslation();
  const [SgetAirlineCode] = sessionStorageAccessor("airlineCode");
  const airlineCode = SgetAirlineCode() || CFG?.default?.airline_code;

  let dynamicImagePath: string;

  try {
    // This will break if file doesn't exist — which is caught below
    dynamicImagePath = new URL(`/src/plugins/${airlineCode}/assets/loader.gif`, import.meta.url).href;
  } catch (e) {
    console.warn(`Loader not found for airline: ${airlineCode}`, e);
    try {
      dynamicImagePath = new URL(`/src/plugins/${airlineCode}/assets/images/logo.svg`, import.meta.url).href;
    } catch (logoErr) {
      console.error("Fallback logo also failed.", logoErr);
      // Optional hardcoded fallback
      dynamicImagePath = new URL(`/src/plugins/RM/assets/loader.gif`, import.meta.url).href;
    }
  }

  const imgCheck = dynamicImagePath.split('/').filter(Boolean).pop();

  return fallback ? (
    <div data-testid="loader" className="cls-loaderContainer">
      <div className="cls-loader">
        <span className="d-block w-100 text-center">
          {imgCheck !== "undefined"
            ? <img src={dynamicImagePath} alt="Loader" width={125} />
            : <Spin size="large">
              <div style={{ minHeight: 80 }} />
            </Spin>
          }
          <span className="d-block fs-16 f-med p-clr" style={{ marginBlockStart: 0 }}>
            {t("please_wait")}
          </span>
        </span>
      </div>
    </div>
  ) : null;
});

export { Loader };
