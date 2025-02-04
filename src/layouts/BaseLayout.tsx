import { FC, useEffect, useState } from "react";
import ProLayout, { MenuDataItem } from "@ant-design/pro-layout";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { menuIcons } from "../utils/icons";
import { systemMenuList } from "./service";
import { Dropdown, MenuProps } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { getCurrentUser } from "../utils/auth";
import LogoutModal from "./components/LogoutModal";

const BaseLayout: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuData, setMenuData] = useState<MenuDataItem[]>([]);
  const [pathname, setPathname] = useState(location.pathname);
  const [loading, setLoading] = useState(true);

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [user, setUser] = useState("User");

  const changeLogoutModalVisible = (status: boolean) => {
    setLogoutModalVisible(status)
  }

  const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] => {
    if (menus != null && menus.length > 0) {
      return menus.map(({icon, children, locale, ...item}) => ({
        ...item,
        icon: icon && menuIcons[icon as string],
        children: children && loopMenuItem(children),
      }));
    } else {
      return [];
    }
  };

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

  useEffect(() => {
    let currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }

  }, [getCurrentUser()]);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div>
          <LogoutOutlined />
          退出登录
        </div>
      ),
      onClick: () => {
        setLogoutModalVisible(true)
      }
    },
  ];
  return (
    <ProLayout
      title={import.meta.env.VITE_PLATFORM_NAME || "React Antd Admin"}
      logo={logo}
      loading={loading}
      location={{pathname}}
      layout="mix"
      navTheme='light'
      menuDataRender={() => loopMenuItem(menuData)}
      menuItemRender={(item, dom) => (
        <div onClick={() => {
          setPathname(item.path || "/dashboard");
          navigate(item.path || "/dashboard");
        }}>
          {dom}
        </div>
      )}
      avatarProps={{
        icon: user.slice(0, 1).toUpperCase(),
        size: 'small',
        title: user,
        render: (_props, dom) => {
          return (
            <Dropdown
              menu={{items}}
            >
              {dom}
            </Dropdown>
          );
        },
      }}
      actionsRender={() => {
        return [];
      }}
      token={{
        sider: {
          colorBgMenuItemSelected: '#e6f7ff',
          colorTextMenuSelected: '#1890ff',
        },
      }}
    >
      <Outlet />
      {logoutModalVisible ?
        <LogoutModal
          open={logoutModalVisible}
          changeLogoutModalVisible={changeLogoutModalVisible} /> : null}
    </ProLayout>
  );
};

export default BaseLayout;
