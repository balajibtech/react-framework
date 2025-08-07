import { useState } from "react";
import { Row, Col, Input, Button, Typography, Alert } from "antd";
import { useTranslation } from "react-i18next";
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
    <Row
      justify="center"
      role="form"
      aria-label={t("login.title")}
      className="login"
    >
      <Col xs={24} sm={12} md={8}>
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <Title level={3}>{t("login.title")}</Title>
          </Col>
          {error && (
            <Col span={24}>
              <Alert type="error" message={error} showIcon />
            </Col>
          )}
          <Col span={24}>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("login.username")}
              aria-label={t("login.username")}
            />
          </Col>
          <Col span={24}>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("login.password")}
              aria-label={t("login.password")}
            />
          </Col>
          <Col span={24}>
            <Button
              type="primary"
              onClick={handleLogin}
              aria-label={t("login.submit")}
              loading={isLoading}
              block
            >
              {t("login.submit")}
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Login;
