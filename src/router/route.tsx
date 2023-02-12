// 使用路由懒加载
// import { lazy } from "react";
// 引入组件
import { Suspense, lazy, ReactNode } from "react";
import { Outlet, Navigate, useRoutes, Route } from "react-router-dom";

const NewCoin = lazy(() => import("../views/newCoin"));
const Index = lazy(() => import("../views/index/index"));
const Not = lazy(() => import("../views/not"));

export interface Router {
  name?: string;
  path: string;
  children?: Array<Router>;
  element: any;
  auth: boolean;
}
export const routers: Array<Router> = [
  { path: "/", element: Index, auth: false },

  { path: "/newCoin", element: NewCoin, auth: true },

  { path: "*", element: Not, auth: true },
];
