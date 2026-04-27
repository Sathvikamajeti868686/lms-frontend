import EmptyState from '../EmptyState'

function AssignmentsList({ assignments }) {
  if (!assignments.length) {
    return <EmptyState title="No assignments available" description="Teacher assignments will appear here." />
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {assignments.map((assignment) => (
        <article
          key={assignment.id}
          className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-blue-50 p-4"
        >
          <h3 className="font-display text-base font-semibold text-slate-900">{assignment.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{assignment.description}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Due: {assignment.dueDate || assignment.deadline}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(assignment.allowedFileTypes || (assignment.fileType ? assignment.fileType.split(',') : [])).map((type) => (
              <span
                key={`${assignment.id}-${type.trim()}`}
                className="rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700"
              >
                .{type.trim().replace(/^\./, '')}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}

export default AssignmentsList
