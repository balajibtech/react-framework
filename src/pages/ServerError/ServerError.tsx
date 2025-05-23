import "./ServerError.scss";
import { Button, Col, Flex, List, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";
// import { useAuth } from "@/hooks/Auth.hook";

const ServerError: React.FC = () => {
  const { Text, Title } = Typography;
  const { t } = useTranslation();
  //To redirect on login page after logout
  // const { isAuthenticated, logout } = useAuth();

  const redirectToLoginHandler = async () => {
    // if(isAuthenticated) await logout();
    window.location.href = "/";
  };

  const data = [
    "Ensure that you are connected to the internet.",
    "Try clearing your browser's cache and cookies.",
    "The issue might be temporary. Please try again later.",
    "If the problem persists, please contact our support team.",
  ];

  const dynamicImagePath = new URL(
    `@/assets/images/common/server-error.webp`,
    import.meta.url
  ).href;

  return (
    <Row
      data-testid="serverError"
      align="middle"
      justify="center"
      className="cls-server-error-container"
    >
      <Col span={12}>
        <img src={dynamicImagePath} alt={t("error_occured")} height="100%" width="100%" />
      </Col>
      <Col span={12} className="pr-30">
        <Title className="cls-heading mt-15">Something went wrong !</Title>
        <Text className="cls-helpText d-block p-clr mb-15">
          We encountered an unexpected error.
        </Text>
        <List
          bordered
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </List.Item>
          )}
        ></List>
        <Flex align="center" className="mt-10">
          <Text>
            You can return to the{" "}
            <Button
              type="link"
              className="cls-loginBtn fs-14 f-med p-0"
              onClick={redirectToLoginHandler}
            >
              login
            </Button>{" "}
            page and navigate from there.
          </Text>
        </Flex>
      </Col>
    </Row>
  );
};

export default ServerError;
