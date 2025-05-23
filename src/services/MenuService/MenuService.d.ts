

export interface RouterResponse {
    default?: boolean;
    component: string;
    path: string;
    route_id: number | string;
    layout: string;
    permission: string[];
}

export interface MenuInterface {
    name: string;
    menu_code: string;
    path: string;
    icon_name: string;
    subMenu?: SubMenuInterface[];
}

export interface SubMenuInterface {
    name: string;
    menu_code: string;
    parent_menu: string;
    path: string;
    icon_name?: string;
}

export interface MenuRoutesInterface {
    menu: MenuInterface[];
    route: RouterResponse[];
}
