import React from "react";
import { Breadcrumb, Typography } from "antd";
import { Link } from "react-router-dom";
import "./Breadcrumb.scss";
import { useRedirect } from "@/hooks/Redirect.hook";

const { Text } = Typography;

export interface BreadcrumbItemProps {
  path: string;
  title: string;
  breadcrumbName: string;
  key: string;
}

export interface BreadcrumbProps {
  props: BreadcrumbItemProps[];
}

const BreadcrumbComponent: React.FC<BreadcrumbProps> = ({ props }) => {
  const {
    isCurrentPathEqual,
    getEncryptedPath,
  } = useRedirect();

  const itemRender = (route: any) => {
    // Decrypt the current pathname for comparison
    return isCurrentPathEqual(route.path) ? ( // Compare decrypted path
      <div key={route.key}>{route.title}</div>
    ) : (
      <Link
        key={route.key}
        to={getEncryptedPath(route.path)} // Encrypt the breadcrumb path
      >
        {route.title}
      </Link>
    );
  };

  return (
    <Breadcrumb
      data-testid="Breadcrumb"
      itemRender={itemRender}
      items={props}
      separator={<Text className="cls-breadcrumbSeparator Infi-Sp_32_DownIndicator"></Text>}
    />
  );
};

export default BreadcrumbComponent;
