import LoadingSpinner from './LoadingSpinner'

const variantClasses = {
  primary:
    'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-200/70 hover:from-blue-700 hover:to-cyan-600',
  secondary: 'border border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700',
  ghost: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
  danger: 'bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600',
}

function Button({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  icon,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-65 ${variantClasses[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <LoadingSpinner size="small" /> : icon ? <span>{icon}</span> : null}
      <span>{children}</span>
    </button>
  )
}

export default Button
