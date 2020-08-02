import React, {Component} from 'react';
import {Menu, message} from 'antd';
import {Link} from "react-router-dom";
import './GlobalMenu.less'
import {withRouter} from "react-router-dom";
import {menuIcons} from "../../utils/icons";
import {menuList} from "./service";

const {Item, SubMenu} = Menu;

class GlobalMenu extends Component {
  state = {
    menus: [],
  };

  constructor(props) {
    super(props);
    this.defaultOpenKeys = this.getDefaultOpenKeys(this.props.history.location.pathname);
  }

  componentDidMount() {
    this.getMenuList();
  }

  getDefaultOpenKeys = (path) => {
    const keys = path.split('/');
    const openKeys = [];
    for (let i = 1; i < keys.length - 1; i++) {
      if (i === 1) {
        openKeys.push('/' + keys[i])
      } else {
        openKeys.push(openKeys[i - 2] + '/' + keys[i])
      }
    }
    return openKeys
  };

  getMenuList = async () => {
    const res = await menuList();
    if (res.code === 0) {
      this.setState(
        {
          menus: res.data,
        }
      );
    } else {
      message.error(res.message)
    }
  };

  setMenu = (menu) => {
    return menu.map(item => {
        if (item.children.length !== 0) {
          return (
            <SubMenu key={item.path} title={item.name} icon={menuIcons[item.icon]}
            >
              {this.setMenu(item.children)}
            </SubMenu>
          )
        } else {
          return (
            <Item key={item.path} icon={menuIcons[item.icon]}
                  onClick={this.onItemClick}
            >
              {item.name}
            </Item>
          )
        }
      }
    );
  };

  onItemClick = (p) => {
    this.props.history.push(p.key)
  };

  render() {
    const {menus} = this.state;
    const openKeys = this.defaultOpenKeys;
    return (
      <div className={'global-menu'}>
        <Link to={'/dashboard'} className={'menu-header'}>
          <h1>Admin</h1>
        </Link>
        <Menu
          mode="inline"
          style={{height: '100%', borderRight: 0, width: '100%'}}
          selectedKeys={[this.props.history.location.pathname]}
          defaultOpenKeys={openKeys}
        >
          {this.setMenu(menus)}
        </Menu>
      </div>
    );
  }
}

export default withRouter(GlobalMenu);
