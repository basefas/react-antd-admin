import React from 'react';
import Login from "../pages/login/Login";
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import BaseLayout from "../components/layout/BaseLayout";
import {loggedIn} from "../utils/auth";
import Dashboard from "../pages/dashboard/Dashboard";
import PageNotFound from "../pages/exception/PageNotFound";
import User from "../pages/settings/user/User";
import Group from "../pages/settings/group/Group";
import Role from "../pages/settings/role/Role";
import Menu from "../pages/settings/menu/Menu";

export default () =>
  <Router>
    <Switch>
      <Route exact path="/">{loggedIn() ? <Redirect to="/dashboard"/> : <Login/>}</Route>
      <Route exact path={'/login'} component={Login}/>
      <Route path="/" children={() =>
        <BaseLayout>
          <Switch>
            <Route path={'/dashboard'} component={Dashboard}/>
            <Route path={'/settings/users'} component={User}/>
            <Route path={'/settings/groups'} component={Group}/>
            <Route path={'/settings/roles'} component={Role}/>
            <Route path={'/settings/menus'} component={Menu}/>
            <Route component={PageNotFound}/>
          </Switch>
        </BaseLayout>
      }/>
    </Switch>
  </Router>;

