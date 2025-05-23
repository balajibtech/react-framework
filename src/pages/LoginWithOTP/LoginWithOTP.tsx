import { Form, Input, Col, Button, message } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import "./LoginWithOTP.scss";
import { FormTitle } from "@/components/Title/Title";
import {
  useAuthenticateService,
  // useOTPAuthService,
  // useSendOtpService,
} from "@/services/User/User";
import { localStorageAccessor } from "@/utils/browserStorage";
// import { useSendEmailMutation } from "@/services/email/Email";
import { useRedirect } from "@/hooks/Redirect.hook";
// import { useGetMenuServiceMutation, useGetMenusMutation } from "@/services/initializer/Initializer";

const LoginWithOTP = (props: any) => {
  const {redirect} = useRedirect();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  /* Service states */
  const [apiStatus]:any = useAuthenticateService();
  // const [otpService, optServiceResponse] = useSendOtpService();
  // const [sendEmailService, sendEmailResponse] = useSendEmailMutation();
  // const [otpAuthService, otpAuthServiceResponse] = useOTPAuthService();

  const [requestOtp, setRequestOtp] = useState(false);
  const [Disablebtn, setDisablebtn] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  // const [routeLocalService, routeLocalServiceResponse] = useGetMenusMutation();
  // const [routeService, routeServiceResponse] = useGetMenuServiceMutation();

  /* Localstorage 'email id' value & handlers */
  const [LgetRememberMe, LsetRememberMe, LremoveRememberMe] =
    localStorageAccessor<string>("rme");

  //To redirect on auth is success
  // const isAuthenticated = false;

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     let menuUrl = `${process.env.VITE_API_URL}`;
  //     routeService({
  //       url: `${menuUrl?.slice(0, menuUrl.lastIndexOf("/"))}/menu/reschedule/`,
  //     });
  //     routeLocalService([]); // Call route services after authentication
  //   }
  // }, [isAuthenticated]);

  // To check the API status and display an error message
  useEffect(() => {
    const setMessage = (message: string) => {
      form.setFields([
        { name: "email_id", errors: [] },
        { name: "user_password", errors: [message] },
      ]);
    };
    if (apiStatus.isError) {
      const { error } = apiStatus as unknown as { error: { status: string } };
      if (error && error.status === "FETCH_ERROR") {
        message.error(error.status + " check CORS");
        setMessage("unable to contact server");
      }
    } else if (apiStatus.isSuccess) {
      const data:any = apiStatus.data;
      if (data?.responseCode === 1) {
        setMessage(data.response.Message);
      }
    }
  }, [apiStatus, form]);

  const setName = (event: any) => {
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (event.match(pattern)) {
      setDisablebtn(true);
    } else {
      setDisablebtn(false);
    }
  };


  const onFinish = (values: any) => {
    if (values.remember_me) {
      LsetRememberMe(`${btoa(values.email + "&&" + values.password)}`);
    } else LremoveRememberMe();
    // loginService({ email_id: values.email_id, password: values.user_password });
  };

  const handleForm = (e: any) => {
    if (e.target.name === "otp") {
      const otp = e.target.value;
      setDisablebtn(!!!otp)
    }
  };

  /* Call backend service to get OTP */
  const sendOTP = () => {
    // otpService({ email: form.getFieldValue("email_id") });
    setRequestOtp(!requestOtp);
  };

  // useEffect(() => {
  //   if (!optServiceResponse.isUninitialized && !optServiceResponse.isLoading) {
  //     let message: any = {};
  //     if (optServiceResponse.isSuccess) {
  //       const code = (optServiceResponse.data.response as any).data.otp;
  //       if (code) {
  //         const postData: any = {
  //           setting_id: 173,
  //           globalData: {
  //             otp: code,
  //           },
  //           recipientList: [
  //             {
  //               action_name: "rs_otp",
  //               language_code: "EN",
  //               to: [form.getFieldValue("email_id")],
  //               cc: [],
  //               bcc: [],
  //               data: {},
  //             },
  //           ],
  //           attachments: [],
  //         };

  //         sendEmailService(postData);
  //         return;
  //       } else {
  //         message = {
  //           type: "success",
  //           content: "Kindly check you mailbox for OTP!",
  //         };
  //       }
  //     } else {
  //       message = {
  //         type: "error",
  //         content: "Email not registered!",
  //       };
  //     }
  //     messageApi.open(message);
  //   }
  // }, [optServiceResponse, form, messageApi, sendEmailService]);

  // useEffect(() => {
  //   if (!sendEmailResponse?.isUninitialized && !sendEmailResponse?.isLoading) {
  //     let message: any = {};
  //     if (sendEmailResponse.isSuccess) {
  //       message = {
  //         type: "success",
  //         content: "OTP sent!",
  //       };
  //     } else {
  //       message = {
  //         type: "success",
  //         content: (sendEmailResponse.data as any).response.data,
  //       };
  //     }

  //     messageApi.open(message);
  //   }
  // }, [sendEmailResponse, messageApi]);

  const selectAfter = (
    <Col className="cls-resend-code f-sbold" style={{ cursor: "pointer" }}>
      <Button type="link" className="fs-12 h-47 w-100" onClick={sendOTP}>
        Resend code
      </Button>
    </Col>
  );
  const otpLoginHandler = () => {
    const formData = form.getFieldsValue();
    if(formData?.otp){
      // otpAuthService({ email: formData.email_id, otp: formData.otp });
    }
    else{
      messageApi.open({
        type: "error",
        content: "Enter OTP !",
      });
    }
  };

  // useEffect(() => {
  //   if (otpAuthServiceResponse.isError) {
  //     const { error } = apiStatus as unknown as { error: { status: string } };
  //     if (error && error.status === "FETCH_ERROR") {
  //       message.error(error.status + " check CORS");
  //       messageApi.open({
  //         type: "error",
  //         content: "Unable to contact server",
  //       });
  //     } else if (
  //       (otpAuthServiceResponse?.error as any)?.data?.responseCode === 1
  //     ) {
  //       form.setFields([
  //         {
  //           name: "otp",
  //           errors: [""],
  //         },
  //       ]);
  //       messageApi.open({
  //         type: "error",
  //         content: "The OTP you entered is incorrect. Please try again.",
  //       });
  //     }
  //   }
  // }, [otpAuthServiceResponse.isError, apiStatus, messageApi]);

  // useEffect(() => {
    // if (isAuthenticated) {
      // // Helper function to extract the route data from API response
      // const getRouteData = (response: any) => response?.data?.response?.data;
  
      // // Extract route data from local service response if successful, otherwise use an empty array
      // const routeServiceData = 
      //   routeServiceResponse?.isSuccess
      //   ? getRouteData(routeServiceResponse) || []
      //   : routeServiceResponse?.isError && routeLocalServiceResponse?.isSuccess
      //     ? getRouteData(routeLocalServiceResponse) || []
      //     : [];
  
      // // Find the default route path from the retrieved route data
      // const defaultRoutePath = routeServiceData?.route?.find((route: any) => route.default)?.path ?? "";
      
      // // Redirect user to the default route path if available, otherwise fallback to "/"
  //     redirect(defaultRoutePath ? defaultRoutePath : "/");
  //   }
  // }, [isAuthenticated, routeLocalServiceResponse, routeServiceResponse]);

  useEffect(() => {
    let LrememberMe = LgetRememberMe();
    if (LrememberMe) {
      try {
        const [emailId] = atob(LrememberMe).split("&&");
        form.setFieldValue("email_id", emailId);
        setName(emailId);
      } catch (e) {
        console.error("Error decoding local storage value:", e);
      }
    }
  }, [LgetRememberMe(), form]);

  return (
    <>
      {/* {showLoginpage ? (
        <Login model={true} />
      ) : ( */}
        <div className={`cls-loginWithOtp`} datatest-id="loginWithOTP">
          <div className={`${props?.isModal ? "cls-login-modal" : ""}`}>
            <div>
              <FormTitle
                title="login_with_otp"
                subTitle={
                  !requestOtp
                    ? "login_with_otp_subtitle"
                    : "login_with_otp_subtitle_2"
                }
              />
              <Form
                layout="vertical"
                form={form}
                name="login"
                onChange={handleForm}
                onFinish={onFinish}
                className="cls-login cls-login-otp"
                // initialValues={initialValues}
                scrollToFirstError
              >
                <Form.Item
                  className="cls-loginLabel"
                  name="email_id"
                  rules={[
                    { required: true, message: t("msg_empty_email") + "!" },
                  ]}
                >
                  <Input
                    data-testid="log_in_textarea"
                    type="email"
                    className="cls-email-input"
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                    addonAfter={requestOtp ? selectAfter : ""}
                    placeholder={t("email_id_placeholder")}
                  />
                </Form.Item>
                {requestOtp ? (
                  <Col>
                    <Form.Item
                      className="cls-loginLabel"
                      name="otp"
                      required
                    >
                      <Input.Password
                        data-testid="log_in_textarea"
                        type={"password"}
                        name="otp"
                        autoComplete="off"
                        maxLength={4}
                        placeholder={t("enter_your_otp")}
                        className="hide-number-arrows cls-otp-input"
                      />
                    </Form.Item>{" "}
                    <Form.Item className="cls-loginotp-btn">
                      <Button
                        data-testid="log_in_btn"
                        className="cls-primaryBtn h-47 w-100"
                        type="primary"
                        htmlType="button"
                        disabled={Disablebtn}
                        onClick={otpLoginHandler}
                        // loading={otpAuthServiceResponse.isLoading}
                      >
                        {t("login")}
                      </Button>
                    </Form.Item>
                  </Col>
                ) : (
                  <Form.Item className="cls-loginotp-btn">
                    <Button
                      data-testid="log_in_btn"
                      type="primary"
                      className="cls-fp-btn cls-primaryBtn cls-login-with-otp-btn h-47 w-100"
                      disabled={!Disablebtn}
                      htmlType="button"
                      onClick={sendOTP}
                    >
                      {t("request_otp")}
                    </Button>
                  </Form.Item>
                )}
                <Button
                  className="cls-back-to-login h-47 w-100"
                  onClick={() => {
                    redirect("login");
                    // isCurrentPathEqual('login-with-otp')
                    //   ? redirect("login")
                    //   : goBackToLogin();
                  }}
                >
                  {t("back_to_login")}
                </Button>
              </Form>
            </div>
          </div>
          {contextHolder}
        </div>
      {/* )} */}
    </>
  );
};

export default LoginWithOTP;
