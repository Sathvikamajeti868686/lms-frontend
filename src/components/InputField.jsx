function InputField({
  label,
  id,
  error,
  icon,
  rightElement,
  className = '',
  inputClassName = '',
  ...props
}) {
  return (
    <label htmlFor={id} className={`flex flex-col gap-2 ${className}`}>
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        ) : null}
        <input
          id={id}
          className={`w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${icon ? 'pl-10' : ''} ${rightElement ? 'pr-16' : ''} ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''} ${inputClassName}`}
          {...props}
        />
        {rightElement ? (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        ) : null}
      </div>
      {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
    </label>
  )
}

export default InputField
