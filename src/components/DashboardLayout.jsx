import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { logoutUser } from '../services/authService'

function DashboardLayout({
  user,
  sidebarTitle,
  menuItems,
  activeKey,
  onSelect,
  notificationCount = 0,
  onNotificationsClick,
  children,
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const navigate = useNavigate()

  function handleLogout() {
    logoutUser()
    navigate('/login', { replace: true })
  }

  return (
    <main className="relative min-h-screen px-4 py-6">
      <div className="mx-auto flex w-full max-w-[1400px] gap-4">
        <Sidebar
          title={sidebarTitle}
          items={menuItems}
          activeKey={activeKey}
          onSelect={onSelect}
          isMobileOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        <section className="min-w-0 flex-1">
          <Navbar
            user={user}
            notificationCount={notificationCount}
            onMenuToggle={() => setIsMobileSidebarOpen(true)}
            onLogout={handleLogout}
            onNotificationsClick={onNotificationsClick}
          />
          <div className="mt-4 animate-lift-in">{children}</div>
        </section>
      </div>
    </main>
  )
}

export default DashboardLayout
