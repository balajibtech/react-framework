
import dayjs from "dayjs";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useGetTimestampServiceMutation } from "@/services/Common/Common";
import "./Timestamp.scss";
const Timestamp = () => {

    const [getTimestampService, getTimestampServiceResponse] = useGetTimestampServiceMutation();
    const [timestampData, setTimestampData] = useState<any>("");
    const { Text } = Typography;
    const { t } = useTranslation();

    const extractResponseData = (response: any) => {
        if (response?.isSuccess || response?.data?.responseCode === 0) {
            return response?.data?.response?.data;
        }
        return null;
    };

    useEffect(() => {
        getTimestampService();
    }, [])

    useEffect(() => {
        const data = extractResponseData(getTimestampServiceResponse);
        if (data) setTimestampData(data?.[data.length - 1]?.timestamp)
    }, [getTimestampServiceResponse]);

    return (
        <>
            {timestampData && <Text className="cls-timeStamp">{t("last_refreshed")} {":"}
                {dayjs(timestampData).format("HH:mm:ss, DD MMM, YYYY")}</Text>}
        </>
    )
}



export default Timestamp;
