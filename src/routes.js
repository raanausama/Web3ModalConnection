import { Navigate, useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
// layouts
import DashboardLayout from './layouts/dashboard/DashboardLayout';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import NotFound from './pages/Page404';
import Register from './pages/Register';

import ConnectionToMetamask from './pages/ConnectionToMetamask';

// ----------------------------------------------------------------------

export default function Router({ socket, setSocket }) {
  const { user } = useSelector(
    state => state.user
  );
  // element: user?.token ? <DashboardLayout /> : <Navigate to="/login" replace />,

  return useRoutes([
    {
      path: '/dashboard',
      element: user?.token ? <DashboardLayout socket={socket} /> : <Navigate to="/login" replace />,
      children: [
        { path: 'blockchainconnection', element:  <ConnectionToMetamask  /> },
        
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: user?.token ? <Navigate to="/dashboard" /> : <Navigate to="/blockchainconnection" replace /> },
        { path: '/callback', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
