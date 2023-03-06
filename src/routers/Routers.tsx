import React from 'react';
import { Navigate, redirect } from 'react-router-dom'
import { loggedIn } from "../utils/auth";
import BaseLayout from "../layouts/BaseLayout";
import NoFoundPage from "../pages/404";
import Login from "../pages/login/Login";
import Menu from "../pages/settings/menu/Menu";
import Role from "../pages/settings/role/Role";
import Group from "../pages/settings/group/Group";
import User from "../pages/settings/user/User";
import Dashboard from "../pages/dashboard/Dashboard";

const isLogIn = async () => {
  console.log(loggedIn())
  if (loggedIn()) {
    redirect("/login")
  } else {
    redirect("/dashboard")
  }
  return {}
}
const loaderBase = async () => {
  if (!loggedIn()) {
    return redirect("/login");
  }
  return null;
};

const loaderLogin = async () => {
  if (loggedIn()) {
    return redirect("/dashboard");
  }
  return null;
};

export default [
  {
    path: "/login",
    element: <Login />,
    loader: loaderLogin,
  },
  {
    path: "/",
    element: <BaseLayout />,
    loader: loaderBase,
    children: [
      {
        errorElement: <NoFoundPage />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />
          },
          {path: "/dashboard", element: <Dashboard />},
          {path: "/settings/users", element: <User />},
          {path: "/settings/groups", element: <Group />},
          {path: "/settings/roles", element: <Role />},
          {path: "/settings/menus", element: <Menu />},
          {path: "*", element: <NoFoundPage />},
        ],
      }
    ]
  },
]