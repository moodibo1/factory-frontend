import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import AdminRoute from '@/components/shared/AdminRoute'
import LoginPage from '@/pages/auth/LoginPage'
import AuthCallback from '@/pages/auth/AuthCallback'
import HomePage from '@/pages/home/HomePage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import ChannelPage from '@/pages/channel/ChannelPage'
import AdminPage from '@/pages/admin/AdminPage'
import ProfilePage from '@/pages/profile/ProfilePage'
import SearchPage from '@/pages/search/SearchPage'

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/auth/callback', element: <AuthCallback /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'channel/:id', element: <ChannelPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'search', element: <SearchPage /> },
          {
            element: <AdminRoute />,
            children: [
              { path: 'dashboard', element: <DashboardPage /> },
              { path: 'admin', element: <AdminPage /> },
            ],
          },
        ],
      },
    ],
  },
])

export default router
