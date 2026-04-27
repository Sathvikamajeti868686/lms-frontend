function toneClasses(tone) {
  if (tone === 'success') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }

  if (tone === 'error') {
    return 'border-red-200 bg-red-50 text-red-700'
  }

  return 'border-blue-200 bg-blue-50 text-blue-700'
}

function StatusToast({ message, tone = 'info', onClose }) {
  if (!message) {
    return null
  }

  return (
    <div className="fixed right-4 top-4 z-50 max-w-md animate-[lift-in_250ms_ease]">
      <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-xl ${toneClasses(tone)}`}>
        <p className="text-sm font-medium">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-current/20 px-2 py-0.5 text-xs font-semibold hover:bg-white/30"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default StatusToast
