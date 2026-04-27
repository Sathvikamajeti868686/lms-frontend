import EmptyState from '../EmptyState'

function ResultsList({ grades }) {

  if (!grades || grades.length === 0) {
    return (
      <EmptyState
        title="No graded submissions yet"
        description="Your results will show here once teacher completes grading."
      />
    )
  }

  return (
    <div>

      {/* ✅ HEADING ONLY ONCE */}
      <h2 className="text-xl font-bold mb-4">Your Results</h2>

      <div className="space-y-3">
        {grades.map((grade) => {

          const isGraded = grade.marks !== null && grade.marks !== undefined
          const status = isGraded ? "Graded" : "Pending"
          const assignmentTitle = `Assignment #${grade.assignmentId || '-'}`
          const marks = isGraded ? grade.marks : '-'
          const feedback = grade.feedback || 'No feedback provided'
          const gradeLabel = isGraded ? `${grade.marks}/100` : '-'

          return (
            <article
              key={grade.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >

              <div className="flex justify-between">
                <h3 className="font-semibold">{assignmentTitle}</h3>

                <span className={`px-2 py-1 text-xs rounded ${
                  status === 'Graded'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {status}
                </span>
              </div>

              <p className="mt-2">Marks: {marks} / 100</p>
              <p>Grade: {gradeLabel}</p>
              <p>Feedback: {feedback}</p>

            </article>
          )
        })}
      </div>

    </div>
  )
}

export default ResultsList