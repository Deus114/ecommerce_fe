import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './pages/login';
import { Outlet } from "react-router-dom";
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home';
import RegisterPage from './pages/register';
import './App.scss';
import { fetchAccount } from './services/apiServices';
import { useDispatch, useSelector } from 'react-redux';
import { doLoginAction } from './redux/account/accountSlice';
import Loading from './components/Loading';
import NotFound from './components/NotFound';
import AdminPage from './pages/admin';
import ProtectedAdmin from './ProtectedPdge/admin';
import LayoutAdmin from './components/Admin/LayoutAdmin';

const Layout = () => {
  return (
    <div className='layout-app'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.account.isAuthenticated);

  const getAccount = async () => {
    if (window.location.pathname === '/login'
      || window.location.pathname === '/register'
    )
      return;
    const res = await fetchAccount();
    if (res && res.data) dispatch(doLoginAction(res.data));
  }

  useEffect(() => {
    getAccount();
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
      ],
    },

    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element:
            <ProtectedAdmin>
              <AdminPage />
            </ProtectedAdmin>
        },
      ],
    },


    {
      path: "/login",
      element: <LoginPage />,
    },

    {
      path: "/register",
      element: <RegisterPage />,
    },

  ]);

  return (
    <>
      {isAuthenticated === true
        || window.location.pathname === '/login'
        || window.location.pathname === '/register'
        || window.location.pathname === '/'
        ?
        <RouterProvider router={router} />
        :
        <Loading />
      }
    </>
  );
}
