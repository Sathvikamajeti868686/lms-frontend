import { Link } from 'react-router-dom'

function tabClasses(active) {
  return `rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
    active
      ? 'bg-blue-50 text-blue-700 underline decoration-2 underline-offset-4 shadow-sm'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`
}

function AuthSwitch({ activeTab }) {
  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      <Link to="/login" className={tabClasses(activeTab === 'login')}>
        Login
      </Link>
      <Link to="/signup" className={tabClasses(activeTab === 'signup')}>
        Signup
      </Link>
    </div>
  )
}

export default AuthSwitch
