import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { AuthPage } from '@/features/auth/components/AuthPage'
import { AuthCallback } from '@/features/auth/components/AuthCallback'
import { DashboardPage } from '@/features/dashboard/components/DashboardPage'
import { BacklogPage } from '@/features/backlog/components/BacklogPage'
import { SearchPage } from '@/features/search/components/SearchPage'
import { ProfilePage } from '@/features/profile/components/ProfilePage'

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'backlog', element: <BacklogPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
])
