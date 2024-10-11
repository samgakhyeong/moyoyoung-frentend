// 최초 생성자 : Haein
// 추가 작성자 : Junhee

import { Suspense, lazy } from "react";
import GroupRouter from "./groupRouter";

const { createBrowserRouter } = require("react-router-dom");

// Loading
const Loading = <div>Loading···</div>;
// Member
const Main = lazy(() => import("../pages/MainPage"));
const Login = lazy(() => import("../components/allMemberLogin/Login"));
const LoginJoin = lazy(() => import("../components/allMemberLogin/LoginJoin"));
const FindId = lazy(() => import("../components/allMemberLogin/FindId"));
const FindPassWord = lazy(() =>
  import("../components/allMemberLogin/FindPassWord")
);
// Board
const BoardMain = lazy(() => import("../components/allBoard/BoardMain"));
const BoardInput = lazy(() => import("../components/allBoard/BoardInput"));
const BoardDetail = lazy(() => import("../components/allBoard/BoardDetail"));
// Small Group
const GroupIndex = lazy(() => import("../pages/group/IndexPage"));

const root = createBrowserRouter([
  {
    path: "",
    element: (
      <Suspense fallback={Loading}>
        <Main />
      </Suspense>
    ),
  },
  {
    path: "/allMemberLogin/Login",
    element: (
      <Suspense fallback={Loading}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/allMemberLogin/LoginJoin",
    element: (
      <Suspense fallback={Loading}>
        <LoginJoin />
      </Suspense>
    ),
  },
  {
    path: "/allMemberLogin/FindId",
    element: (
      <Suspense fallback={Loading}>
        <FindId />
      </Suspense>
    ),
  },
  {
    path: "/allMemberLogin/FindPassWord",
    element: (
      <Suspense fallback={Loading}>
        <FindPassWord />
      </Suspense>
    ),
  },
  {
    path: "/allBoard",
    element: (
      <Suspense fallback={Loading}>
        <BoardMain />
      </Suspense>
    ),
  },
  {
    path: "/allBoard/BoardInput",
    element: (
      <Suspense fallback={Loading}>
        <BoardInput />
      </Suspense>
    ),
  },
  {
    path: "/allBoard/BoardMain",
    element: (
      <Suspense fallback={Loading}>
        <BoardMain />
      </Suspense>
    ),
  },
  {
    path: "/allBoard/BoardDetail/:page/:id",
    element: (
      <Suspense fallback={Loading}>
        <BoardDetail />
      </Suspense>
    ),
  },
  {
    path: "group",
    element: (
      <Suspense fallback={Loading}>
        <GroupIndex />
      </Suspense>
    ),
    children: GroupRouter(),
  },
]);

export default root;
