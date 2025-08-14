import { useState } from "react";
import { Row, Col, Input, Button, Typography, Alert, Space, List, Layout } from "antd";
import { useTranslation, Trans } from "react-i18next";
import { useLoginMutation } from "../../store/auth-api";
import { useNavigate } from "react-router-dom";
import "./login.scss";

const { Title } = Typography;

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [login, { isLoading }] = useLoginMutation();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);
    try {
      await login({ username, password }).unwrap();
      navigate("/admin");
    } catch (error: any) {
      setError(error?.data?.error || t("login.error", "Login failed"));
    }
  };

 return (
 <Row className="login-page">
      {/* Left Column - Welcome Section */}
 <Col xs={24} md={12} className="welcome-section" component={Layout}>
 <Layout.Content className="welcome-content">
 <Title level={2}>Welcome to Gyaani</Title>
 <p>
              Gyaani is a comprehensive admin portal designed to streamline
              your administrative tasks.
 </p>
 <Space direction="vertical" size="large">
 <List
 size="small"
          header={<strong>Key Features:</strong>}
 dataSource={[
 "User Management",
 "Content Moderation",
 "Analytics and Reporting",
 "System Configuration",
 ]}
 renderItem={(item) => <List.Item>{item}</List.Item>}
 />
 <p>
 <strong>System Status:</strong> All systems are operational.
 </p>
 </Space>
 </Layout.Content>
 </Col>
 {/* Right Column - Login Form */}
 <Col
 xs={24}
 md={12}
 className="login-form-section"
 component={Layout}
 >
 <Layout.Content className="login-form-container">
 <Title level={3}>{t("login.title", "INFINITI Admin Portal")}</Title>
 {error && <Alert type="error" message={error} showIcon />}
 <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t("login.username")}
            aria-label={t("login.username")}
          />
 <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("login.password")}
            aria-label={t("login.password")}
          />
 <Button
 type="primary"
            onClick={handleLogin}
            aria-label={t("login.submit")}
 block
          >
 {t("login.submit")}
 </Button>
 <Typography.Text type="secondary" className="ssl-message">
 <Trans i18nKey="login.sslMessage">SSL encryption is active for secure data transmission.</Trans>
 </Typography.Text>
 </Layout.Content>
 </Col>
 </Row>
  );
};

export default Login;
