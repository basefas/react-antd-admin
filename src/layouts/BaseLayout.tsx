import React, { FC, useEffect, useState } from 'react';
import BasicLayout, { MenuDataItem } from "@ant-design/pro-layout";
import { withRouter, useHistory, useLocation } from "react-router-dom";
import RightContent from "../components/RightContent/RightContent";
import logo from "../assets/logo.svg";
import { menuIcons } from "../utils/icons";
import { systemMenuList } from "./service";

const BaseLayout: FC = (props) => {
  const history = useHistory();
  const location = useLocation();
  const [menuData, setMenuData] = useState<MenuDataItem[]>([]);
  const [pathname, setPathname] = useState(location.pathname);
  const [loading, setLoading] = useState(true);

  const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] => {
    return menus.map(({icon, children, ...item}) => ({
      ...item,
      icon: icon && menuIcons[icon as string],
      children: children && loopMenuItem(children),
    }));
  }

  const fetchData = async () => {
    const result = await systemMenuList();
    setMenuData(result.data);
    setLoading(false);
  };

  useEffect(() => {
    setMenuData([]);
    setLoading(true);
    fetchData().then();
  }, []);


  return (
    <BasicLayout
      title={"CICD"}
      logo={logo}
      menu={{
        loading,
      }}
      location={{
        pathname,
      }}
      navTheme="light"
      menuDataRender={() => loopMenuItem(menuData)}
      rightContentRender={() => <RightContent/>}
      menuItemRender={(item, dom) => (
        <div
          onClick={() => {
            setPathname(item.path || '/dashboard');
            history.push(item.path || '/dashboard');
          }}
        >
          {dom}
        </div>
      )}
    >
      <div>{props.children}</div>
    </BasicLayout>
  );
};

export default withRouter(BaseLayout);
