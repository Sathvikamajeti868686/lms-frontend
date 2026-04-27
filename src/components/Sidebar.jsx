import { X } from 'lucide-react'

function Sidebar({ title, items, activeKey, onSelect, isMobileOpen, onClose }) {
  return (
    <>
      <aside className="hidden w-72 shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70 lg:block">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{title}</p>
        <nav className="space-y-1.5">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                item.key === activeKey
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </span>
              {item.badge ? (
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
      </aside>

      {isMobileOpen ? (
        <div className="fixed inset-0 z-40 flex lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="h-full w-full bg-slate-900/40"
            aria-label="Close sidebar overlay"
            onClick={onClose}
          />
          <aside className="absolute left-0 top-0 h-full w-80 max-w-[88vw] border-r border-slate-200 bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{title}</p>
              <button
                type="button"
                className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>
            <nav className="space-y-1.5">
              {items.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    onSelect(item.key)
                    onClose()
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                    item.key === activeKey
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  {item.badge ? (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  )
}

export default Sidebar
