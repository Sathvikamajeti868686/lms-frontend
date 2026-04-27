import { useEffect, useMemo, useRef, useState } from 'react'
import { FileUp, UploadCloud } from 'lucide-react'
import Button from '../Button'

function extension(fileName) {
  if (!fileName || typeof fileName !== 'string') {
    return ''
  }

  const dotIndex = fileName.lastIndexOf('.')
  if (dotIndex === -1) {
    return ''
  }

  return fileName.slice(dotIndex).toLowerCase()
}

function normalizeAllowedTypes(types) {
  if (!Array.isArray(types)) {
    return []
  }

  return types
    .filter((type) => typeof type === 'string' && type.trim().length > 0)
    .map((type) => `.${type.replace(/^\.+/, '').toLowerCase()}`)
}

function UploadDropzone({ assignments, onSubmit }) {
  const fileInputRef = useRef(null)

  // ✅ FIXED: assignmentId as number
  const [assignmentId, setAssignmentId] = useState(assignments[0]?.id ?? null)

  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const activeAssignment = useMemo(
    () => assignments.find((assignment) => assignment.id === assignmentId),
    [assignments, assignmentId],
  )

  // ✅ FIXED: ensure assignmentId always number
  useEffect(() => {
    if (!assignments.length) {
      setAssignmentId(null)
      return
    }

    if (!assignments.some((assignment) => assignment.id === assignmentId)) {
      setAssignmentId(Number(assignments[0].id))
    }
  }, [assignmentId, assignments])

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)
    const dropped = event.dataTransfer.files?.[0]
    if (dropped) {
      setFile(dropped)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!activeAssignment) {
      setError('Please select an assignment first.')
      return
    }

    if (!file) {
      setError('Please choose a file before submitting.')
      return
    }

    const fileExt = extension(file.name).replace(/^\./, '').toLowerCase()

    if (!fileExt) {
      setError('Unable to determine file type.')
      return
    }

    // ✅ FIXED: correct allowed types logic
    let allowed = normalizeAllowedTypes(activeAssignment?.allowedFileTypes)

    if (!allowed || allowed.length === 0) {
      allowed = normalizeAllowedTypes(activeAssignment?.fileType?.split(','))
    }

    if (!allowed || allowed.length === 0) {
      allowed = ['.pdf', '.jpg', '.jpeg', '.png', '.docx']
    }

    if (!allowed.some((type) => type.slice(1) === fileExt)) {
      setError(`File type .${fileExt} is not allowed. Supported: ${allowed.join(', ')}`)
      return
    }

    try {
      setSubmitting(true)

      // ✅ FIXED: assignmentId as number
      await onSubmit({
        assignmentId: Number(activeAssignment.id),
        file: file,
      })

      setFile(null)
    } catch (submitError) {
      setError(submitError?.message || 'Failed to submit assignment.')
    } finally {
      setSubmitting(false)
    }
  }

  const allowedDisplay =
    normalizeAllowedTypes(activeAssignment?.allowedFileTypes).length > 0
      ? normalizeAllowedTypes(activeAssignment?.allowedFileTypes)
      : normalizeAllowedTypes(activeAssignment?.fileType?.split(',')).length > 0
      ? normalizeAllowedTypes(activeAssignment?.fileType?.split(','))
      : ['.pdf', '.jpg', '.jpeg', '.png', '.docx']

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase text-slate-500">Select Assignment</span>

        {/* ✅ FIXED: convert to number */}
        <select
          value={assignmentId ?? ''}
          onChange={(e) => setAssignmentId(Number(e.target.value))}
          className="border px-3 py-2 rounded"
        >
          {assignments.map((assignment) => (
            <option key={assignment.id} value={assignment.id}>
              {assignment.title}
            </option>
          ))}
        </select>
      </label>

      <div
        className={`border-2 border-dashed p-5 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-blue-300'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <UploadCloud size={22} />
        <p>Drag & drop your file here</p>

        <p className="text-sm">
          Allowed: {allowedDisplay.join(', ')}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          accept={allowedDisplay.join(',')}
        />

        <Button onClick={() => fileInputRef.current?.click()}>
          Browse File
        </Button>

        {file && <p>Selected: {file.name}</p>}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Button type="submit" loading={submitting}>
        Submit Assignment
      </Button>
    </form>
  )
}

export default UploadDropzone