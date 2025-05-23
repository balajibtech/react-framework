import {
  Form,
  Input,
  Row,
  Col,
  Checkbox,
  Button,
  Typography,
  message,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "./Login.scss";
import { useEffect, useState } from "react";
import { FormTitle } from "@/components/Title/Title";
import { useAuth } from "@/hooks/Auth.hook";
import { useAuthenticateService } from "@/services/User/User";
import {
  FdLinkedInIcon,
  FdGmailIcon,
  FdFbIcon,
} from "@/components/Icons/Icons";
import { localStorageAccessor } from "@/utils/browserStorage";
import ForgotPassword from "../ForgotPassword/ForgotPassword";
import LoginWithOTP from "../LoginWithOTP/LoginWithOTP";
import { useRedirect } from "@/hooks/Redirect.hook";
import { setRoutePath } from "@/stores/Menu.store";
const Text = Typography;

const Login = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loginService, apiStatus] = useAuthenticateService();
  const [showOTPpage] = useState(false);
  const [showForgetPswdPage] = useState(false);
  const { redirect } = useRedirect();
  const { isAuthenticated } = useAuth();
  // const [routeLocalService, routeLocalServiceResponse] = useGetMenusMutation();
  // const [routeService, routeServiceResponse] = useGetMenuServiceMutation();

  /* Localstorage 'email id' value & handlers */
  const [LgetRememberMe, LsetRememberMe, LremoveRememberMe] = localStorageAccessor<string>("rme");

  // To check the API status and display an error message
  useEffect(() => {
    const setMessage = (message: string) => {
      form.setFields([
        { name: "email", errors: [] },
        { name: "password", errors: [message] }
      ]);
    };
    if (apiStatus.isError) {
      const { error } = apiStatus as unknown as { error: { status: string } };
      if (error && error.status === "FETCH_ERROR") {
        message.error(error.status + " check CORS");
        setMessage("unable to contact server");
      }
    } else if (apiStatus.isSuccess) {
      const data = apiStatus.data;
      if (data?.responseCode === 1) {
        setMessage(data.response.Message);
      }
    }
  }, [apiStatus.isSuccess, apiStatus.isError, apiStatus, form]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const changeValues = (field: string) => {
    setErrors((errors) => ({
      ...errors,
      [field]: "",
    }));
  };

  const UseInputValidation = ({ value, pattern }: { value: string, pattern: any }) => {
    if (!value) return false; // Empty value is invalid
    return pattern.test(value); // Returns true if valid, false if invalid
  };

  const onFinish = (values: any) => {
    const newErrors: { [key: string]: string } = {};
    const emailCheck = UseInputValidation({
      value: values.email,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    });
    const passwordCheck = UseInputValidation({
      value: values.password,
      pattern: /^[\s\S]{8,}$/
    });

    if (!emailCheck) {
      newErrors.email = t("msg_invalid_email");
    }

    if (!passwordCheck) {
      values.password.length < 8
        ? (newErrors.password = t("password_length_msg"))
        : (newErrors.password = t("password") + " " + t("invalid"));
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) {
      return false;
    }

    if (values.remember_me) {
      LsetRememberMe(`${btoa(values.email + "&&" + values.password)}`);
    } else LremoveRememberMe();
    loginService({ email_id: values.email, password: values.password });
  };

  let initialValues = {};
  let LrememberMe = LgetRememberMe()
  if (LrememberMe) {
    try {
      const [emailId, password] = atob(LrememberMe).split("&&");
      initialValues = {
        email: emailId,
        password: password,
        remember_me: true,
      };
    } catch (e) {
      console.error("Error decoding local storage value:", e);
    }
  }
  
  useEffect(() => {
    if(isAuthenticated) {
      setRoutePath("/");
      redirect("/");
    }
  }, [isAuthenticated]);

  return (
    <>
      {showForgetPswdPage ? <ForgotPassword isModal={true} /> : ""}
      {showOTPpage ? (
        <LoginWithOTP isModal={true} />
      ) : (
        <>
          <div
            data-testid="login"
            className={`${showForgetPswdPage ? "cls-forgotPswdHeader" : ""}`}
          >
            <FormTitle title="login" subTitle="login_subtitle" />
            <Form
              layout="vertical"
              form={form}
              name="login"
              onFinish={onFinish}
              className="cls-login"
              initialValues={initialValues}
              scrollToFirstError
            >
              <Col>
                <Form.Item
                  className="cls-loginLabel"
                  label={t("email_id")}
                  name="email"
                  rules={[
                    // { type: "email", message: t("msg_invalid_email") + "!" },
                    { required: true, message: t("msg_empty_email") + "!" },
                  ]}
                >
                  <Input
                    // type="email"
                    className="cls-email-input"
                    placeholder={t("email_id_placeholder")}
                    onChange={() => changeValues("email")}
                  />
                </Form.Item>
                {errors.email && (
                  <div
                    style={{ display: "flex", flexWrap: "nowrap" }}
                    className="ant-form-item-explain ant-form-css-var ant-form-item-explain-connected"
                    role="alert"
                  >
                    <div className="ant-form-item-explain-error">
                      {errors.email}
                    </div>
                  </div>
                )}
              </Col>
              <Col>
                <Form.Item
                  label={t("password")}
                  name="password"
                  className="cls-password-input-container"
                  rules={[
                    { required: true, message: t("msg_empty_password") + "!" },
                    // { min: 8 },
                  ]}
                >
                  <Input.Password
                    className="cls-login-psw-section"
                    placeholder={t("password_help")}
                    onChange={() => changeValues("password")}
                  />
                </Form.Item>
                {errors.password && (
                  <div
                    style={{ display: "flex", flexWrap: "nowrap" }}
                    className="ant-form-item-explain ant-form-css-var ant-form-item-explain-connected"
                    role="alert"
                  >
                    <div className="ant-form-item-explain-error">
                      {errors.password}
                    </div>
                  </div>
                )}
              </Col>
              <Row className="cls-rememberRow mt-25 mb-10">
                <Col span={12} className="cls-remember text-start">
                  <Form.Item name="remember_me" valuePropName="checked">
                    <Checkbox className="link">{t("remember_me")}</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item className="forgot">
                    <Button
                      onClick={() => {
                        redirect("forgot-password");
                      }}
                      className="link justify-end w-100 p-0"
                      type="link"
                    >
                      {t("forgot_password")}?
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item className="cls-loginBtn">
                <Button
                  className="cls-primaryBtn w-100 h-48"
                  type="primary"
                  htmlType="submit"
                >
                  { 
                    apiStatus.isLoading ? (
                      <LoadingOutlined spin style={{ fontSize: "24px" }} />
                    ) : (
                      t("login")
                    )
                  }
                </Button>
              </Form.Item>
              <Form.Item className="cls-loginBtn">
                <Button
                  className="cls-loginOTPBtn w-100 h-48"
                  type="default"
                  htmlType="button"
                  onClick={() => redirect("login-with-otp")}
                >
                  {t("login_with_otp")}
                </Button>
              </Form.Item>
              <Row justify="center" align="middle">
                <Col className="cls-sm-col mb-15" span={24}>
                  <Text className="cls-socialmedia">{t("or_login_with")}</Text>
                </Col>
                <Col span={4} sm={6} xs={6} className="pointer">
                  <FdGmailIcon />
                </Col>
                <Col span={4} sm={6} xs={6} className="pointer">
                  <FdFbIcon />
                </Col>
                <Col span={4} sm={6} xs={6} className="pointer">
                  <FdLinkedInIcon />
                </Col>
              </Row>
            </Form>
          </div>
        </>
      )}
    </>
  );
};

export default Login;
