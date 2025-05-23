export interface MenuItem {
  menu_code: string;
  path: string;
  icon_name: string;
  subMenu?: SubMenuItem[];
}

export interface SubMenuItem {
  menu_code: string;
  parent_menu: string;
  path: string;
  icon_name?: string;
}

export interface RouteItem {
  route_id: number;
  path: string;
  layout: string;
  component: string;
  default: number;
  permission: string[];
}

export interface RouterResponse {
  description: any;
  title: any;
  menu: MenuItem[];
  route: RouteItem[];
}


export interface SystemSettingsType {
  [key: string]: {
    [key: string]: string | number | boolean | any | Array<any>;
  };
}
