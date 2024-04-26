import React, { useState } from 'react';
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

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <div>404 NOT FOUND</div>,
      children: [
        { index: true, element: <Home /> },
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
      <RouterProvider router={router} />
    </>
  );
}
