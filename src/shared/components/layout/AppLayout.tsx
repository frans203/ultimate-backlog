import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Snackbar } from '@/shared/components/ui'
import { usePageTransition } from '@/shared/hooks/use-page-transition'

export function AppLayout() {
  const containerRef = usePageTransition()

  return (
    <>
      <Sidebar />
      <main id="main">
        <div ref={containerRef}>
          <Outlet />
        </div>
      </main>
      <BottomNav />
      <Snackbar />
    </>
  )
}
