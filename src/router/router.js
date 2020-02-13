import React from 'react';
import asyncComponent from "../components/asyncComponent/asyncComponent";
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import { baseRoute, routerConfig } from '../config/router.config';
import { isUserLogin } from '../middleware/localStorage/login';

import Login from "../pages/login";
const Admin = asyncComponent(() => import("../pages/admin"));
const OperManage = asyncComponent(() => import("../pages/oper/OperManage"));
const CustomerManage = asyncComponent(() => import("../pages/customer/CustomerManage"));
const Passwprd = asyncComponent(() => import("../pages/setting/Password"));
const RoleManage = asyncComponent(() => import("../pages/roleManage/RoleManage"));
const AreaManage = asyncComponent(() => import("../pages/globalConfig/areaManage"));


export default class GlobalRouter extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact={true} path="/" render={() => (
            isUserLogin() ?
              <Redirect to={routerConfig["customer.customerManage"].path} />
              :
              <Redirect to={{ pathname: routerConfig["login"].path }} />
          )} />
   
          <Route exact={true} path={routerConfig["login"].path} component={Login} />
          <Route path={baseRoute} render={() => (
            isUserLogin() ?
              <Admin>
                <Switch>
                <PrivateRoute path={routerConfig["operManage.operManage"].path} component={OperManage} />
                <PrivateRoute path={routerConfig["customer.customerManage"].path} component={CustomerManage} />
                <PrivateRoute path={routerConfig["setting.password"].path} component={Passwprd} />
                <PrivateRoute path={routerConfig["roleManage.roleManage"].path} component={RoleManage} />
                <PrivateRoute path={routerConfig["globalConfig.areaManage"].path} component={AreaManage} />
                </Switch>
              </Admin>
              : <Redirect to={{ pathname: routerConfig["login"].path }} />
          )} />
        </Switch>
      </Router >
    )
  }
}

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={
        props =>
          isUserLogin() ?
            <Component {...props} />
            : <Redirect to={{ pathname: routerConfig["login"].path, state: { from: props.location } }} />
      }
    />
  )
}
