import EmptyState from '../EmptyState'

function formatDate(isoDate) {
  if (!isoDate) {
    return '-'
  }
  return new Date(isoDate).toLocaleString()
}

function SubmissionsTable({ submissions, onSelectSubmission, selectedId }) {
  if (!submissions.length) {
    return <EmptyState title="No submissions yet" description="Student uploads will appear here." />
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-[720px] w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="px-3 py-2 font-semibold">Student</th>
            <th className="px-3 py-2 font-semibold">Assignment</th>
            <th className="px-3 py-2 font-semibold">File</th>
            <th className="px-3 py-2 font-semibold">Submitted At</th>
            <th className="px-3 py-2 font-semibold">Status</th>
          </tr>
        </thead>

        <tbody>
          {submissions.map((submission) => {
            const isSelected = selectedId === submission.id

            return (
              <tr
                key={submission.id}
                className={`cursor-pointer border-t border-slate-200 transition hover:bg-blue-50 ${
                  isSelected ? 'bg-blue-50' : 'bg-white'
                }`}
                onClick={() => onSelectSubmission(submission.id)}
              >
                
                {/* ✅ Student */}
                <td className="px-3 py-2 text-slate-800">
                  Student #{submission.studentId}
                </td>

                {/* ✅ Assignment */}
                <td className="px-3 py-2 text-slate-700">
                  Assignment #{submission.assignmentId}
                </td>

                {/* ✅ File */}
                <td className="px-3 py-2 text-slate-700">
                  <a
                    href={`http://localhost:8080${submission.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    View File
                  </a>
                </td>

                {/* ✅ Date */}
                <td className="px-3 py-2 text-slate-600">
                  {formatDate(submission.submittedAt)}
                </td>

                {/* ✅ Status */}
                <td className="px-3 py-2">
                  <span className="rounded-full px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700">
                    Submitted
                  </span>
                </td>

              </tr>
            )
          })}
        </tbody>

      </table>
    </div>
  )
}

export default SubmissionsTable