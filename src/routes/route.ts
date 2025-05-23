import { lazy } from "react";

// LAYOUTS
const Layouts = new Map();

const HomeLayout = lazy(() => import("../layouts/Home/Home.layout"));
const LandingLayout = lazy(() => import("../layouts/Landing/Landing.layout"));

Layouts.set("HomeLayout", HomeLayout);
Layouts.set("LandingLayout", LandingLayout);

// PAGES
const Pages = new Map();

const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const WebService = lazy(() => import("../pages/WebService/WebService"));
const SSO = lazy(() => import("../pages/SSO/SSO"));
const UserAction = lazy(() => import("../pages/UserAction/UserAction"));
const Settings = lazy(() => import("../pages/Settings/Settings"));
const Login = lazy(() => import("../pages/Login/Login"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword/ForgotPassword"));
const LoginWithOTP = lazy(() => import("../pages/LoginWithOTP/LoginWithOTP"));
const ResetPassword = lazy(() => import("../pages/ResetPassword/ResetPassword"));
const ComingSoon = lazy(() => import("../pages/ComingSoon/ComingSoon"));

Pages.set("Dashboard", Dashboard);
Pages.set("WebService", WebService);
Pages.set("SSO", SSO);
Pages.set("UserAction", UserAction);
Pages.set("Settings", Settings);
Pages.set("Login", Login);
Pages.set("ForgotPassword", ForgotPassword);
Pages.set("LoginWithOTP", LoginWithOTP);
Pages.set("ResetPassword", ResetPassword);
Pages.set("ComingSoon", ComingSoon);

export { Layouts, Pages };
