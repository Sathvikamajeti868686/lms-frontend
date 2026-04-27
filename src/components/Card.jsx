function Card({ title, subtitle, action, children, className = '' }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70 transition duration-200 hover:shadow-md hover:shadow-slate-200/90 ${className}`}
    >
      {(title || subtitle || action) ? (
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title ? <h2 className="font-display text-lg font-semibold text-slate-900">{title}</h2> : null}
            {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
          </div>
          {action ? <div>{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  )
}

export default Card
