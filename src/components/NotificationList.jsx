import EmptyState from './EmptyState'

function formatDate(isoDate) {
  if (!isoDate) {
    return ''
  }
  return new Date(isoDate).toLocaleString()
}

function NotificationList({ notifications }) {
  if (!notifications.length) {
    return <EmptyState title="No notifications yet" description="New updates will appear here." />
  }

  return (
    <div className="space-y-2">
      {notifications.map((note) => (
        <article key={note.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm text-slate-800">{note.message}</p>
          <p className="mt-1 text-xs text-slate-500">{formatDate(note.createdAt)}</p>
        </article>
      ))}
    </div>
  )
}

export default NotificationList
