import React from "react";
import "./Menu.scss";
import { Icons } from "@/utils/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { setActiveRoute, setRoutePath } from "@/stores/Menu.store";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/hooks/App.hook";
import { useResize } from "@/utils/resize";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type MenuItem = Required<MenuProps>["items"][number];

interface MenuBarProps {
    position: MenuProps["mode"] | undefined;
    onData?: (data: any) => void;
}

/**
 * Sidebar component renders the application's sidebar menu.
 * It uses the Ant Design Menu component and connects to Redux for state management.
 * It dispatches an action to set the active menu item when a menu item is clicked.
 *
 * @returns {JSX.Element} The sidebar JSX element.
 */
const MenuBar: React.FC<MenuBarProps> = ({ position, onData }) => {

    const navigate = useNavigate();
    const { t } = useTranslation();
    const { routeStore, menuStore, routePath } = useAppSelector(
        (state) => state.MenuReducer
    );

    const dispatch = useDispatch();
    const { isSmallScreen } = useResize(767);

    /* Sends data to parent component */
    const sendDataToParent = (condition: any) => {
        if (onData) {
        onData(condition);
        }
    };

    const onClick: MenuProps["onClick"] = (e) => {
        const currentRoute:any = routeStore?.find((route) => route.path === e.key);
        dispatch(setRoutePath(e.key));
        dispatch(setActiveRoute(currentRoute));
        isSmallScreen && sendDataToParent(false);
        navigate(e.key);
    };

    const items = menuStore?.map((menu): MenuItem => {
        return {
            key: menu.path,
            label: t(menu.menu_code),
            icon: Icons.get(menu.icon_name) || "",
        };
    });

    return (
        <Menu
            className="cls-menu"
            mode={ position || "vertical"}
            onClick={onClick}
            selectedKeys={routePath ? [routePath] : undefined}
            items={items}
        />
    );
};

export default MenuBar;
