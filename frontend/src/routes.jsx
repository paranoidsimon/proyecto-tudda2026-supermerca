import { Outlet } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import User from './pages/User';

const routes = [
  {
    path: '/',
    element: <MainLayout >
      <Outlet />
    </MainLayout>,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/User',
        element: <User />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

export default routes;