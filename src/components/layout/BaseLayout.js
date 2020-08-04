import React, {Component} from 'react';
import {Layout} from 'antd';
import {Redirect, withRouter} from "react-router-dom";
import {loggedIn} from "../../utils/auth";
import GlobalHeader from "../header/GlobalHeader";
import "./BaseLayout.less"
import GlobalMenu from "../menu/GlobalMenu";

const {Sider, Content} = Layout;

class BaseLayout extends Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    const {collapsed} = this.state;
    const toggleMethods = {
      toggle: this.toggle,
    };
    return (
      loggedIn() ?
        <Layout className="base">
          <Sider className={'base-sider'}
                 trigger={null}
                 collapsible
                 collapsed={collapsed}>
            <GlobalMenu collapsed={collapsed}/>
          </Sider>
          <Layout>
            <GlobalHeader {...toggleMethods} collapsed={collapsed}/>
            <Content className={'base-content'}>{this.props.children}</Content>
          </Layout>
        </Layout> : <Redirect to={'/login'}/>
    );
  }
}

export default withRouter(BaseLayout);
