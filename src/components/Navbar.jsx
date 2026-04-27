import { Bell, LogOut, Menu } from 'lucide-react'
import Button from './Button'

function Navbar({ user, notificationCount, onMenuToggle, onLogout, onNotificationsClick }) {
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <header className="sticky top-4 z-30 rounded-2xl border border-blue-100 bg-white/95 px-4 py-3 shadow-lg shadow-blue-200/50">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            onClick={onMenuToggle}
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Online LMS Portal</p>
            <h1 className="font-display text-lg font-semibold text-slate-900">Welcome, {user?.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100"
            aria-label="Notifications"
            onClick={onNotificationsClick}
          >
            <Bell size={18} />
            {notificationCount > 0 ? (
              <span className="absolute -right-1 -top-1 rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white transition-all duration-200">
                {notificationCount}
              </span>
            ) : null}
          </button>

          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {userInitial}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-slate-900">{user?.name}</p>
              <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{user?.role}</p>
            </div>
          </div>

          <Button
            variant="secondary"
            className="px-3 py-2"
            icon={<LogOut size={16} />}
            onClick={onLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
