import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import Button from '../Button'
import EmptyState from '../EmptyState'
import InputField from '../InputField'

function GradingPanel({ selectedSubmission, onSaveGrade }) {
  const [marks, setMarks] = useState(
    selectedSubmission?.marks === null || selectedSubmission?.marks === undefined
      ? ''
      : String(selectedSubmission.marks),
  )
  const [feedback, setFeedback] = useState(selectedSubmission?.feedback || '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!selectedSubmission) {
      setError('Select a submission first.')
      return
    }

    const parsedMarks = Number(marks)
    if (!Number.isFinite(parsedMarks) || parsedMarks < 0 || parsedMarks > 100) {
      setError('Marks should be a number between 0 and 100.')
      return
    }

    try {
      setSaving(true)
      await Promise.resolve(
        onSaveGrade({
          submissionId: selectedSubmission.id,
          marks: parsedMarks,
          feedback: feedback.trim(),
        }),
      )
    } catch (saveError) {
      setError(saveError?.message || 'Failed to save grade.')
    } finally {
      setSaving(false)
    }
  }

  if (!selectedSubmission) {
    return (
      <EmptyState
        title="No submission selected"
        description="Select a row from the submissions table to grade."
      />
    )
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-sm font-semibold text-slate-900">{selectedSubmission.assignmentTitle}</p>
        <p className="mt-1 text-sm text-slate-600">
          {selectedSubmission.studentName} - {selectedSubmission.fileName}
        </p>
      </div>

      <InputField
        id="grade-marks"
        label="Marks (0-100)"
        value={marks}
        onChange={(event) => setMarks(event.target.value)}
        placeholder="Enter marks"
        required
      />

      <label className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Feedback</span>
        <textarea
          rows={4}
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          placeholder="Write feedback for student"
        />
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button type="submit" loading={saving} icon={<CheckCircle2 size={16} />} className="w-fit">
        Save Grade
      </Button>
    </form>
  )
}

export default GradingPanel
