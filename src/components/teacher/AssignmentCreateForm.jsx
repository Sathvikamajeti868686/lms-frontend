import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import Button from '../Button'
import InputField from '../InputField'

const fileTypeOptions = ['pdf', 'jpg', 'jpeg', 'png', 'docx']

function AssignmentCreateForm({ onCreate }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    allowedFileTypes: []
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function updateField(event) {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleFileTypeChange(fileType, checked) {
    setFormData((current) => ({
      ...current,
      allowedFileTypes: checked
        ? [...current.allowedFileTypes, fileType]
        : current.allowedFileTypes.filter(type => type !== fileType)
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!formData.title.trim() || !formData.description.trim() || !formData.deadline || !formData.allowedFileTypes.length) {
      setError('Please fill all required fields and select at least one file type.')
      return
    }

    try {
      setSubmitting(true)
      const dataToSend = { ...formData, teacherId: 1 }
      console.log(dataToSend)
      await Promise.resolve(onCreate(dataToSend))
    } catch (submitError) {
      setError(submitError?.message || 'Failed to create assignment.')
      return
    } finally {
      setSubmitting(false)
    }

    setFormData({
      title: '',
      description: '',
      deadline: '',
      allowedFileTypes: []
    })
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-3 md:grid-cols-2">
        <InputField
          id="assignment-title"
          label="Assignment Title"
          name="title"
          value={formData.title}
          onChange={updateField}
          placeholder="Frontend Module Assignment"
          required
        />
        <InputField
          id="assignment-deadline"
          label="Deadline"
          name="deadline"
          type="datetime-local"
          value={formData.deadline}
          onChange={updateField}
          required
        />
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Description</span>
        <textarea
          name="description"
          value={formData.description}
          onChange={updateField}
          rows={4}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          placeholder="Define instructions and rubric for this assignment."
          required
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Allowed File Types</span>
        <div className="grid gap-2 sm:grid-cols-2">
          {fileTypeOptions.map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.allowedFileTypes.includes(type)}
                onChange={(e) => handleFileTypeChange(type, e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-800">.{type}</span>
            </label>
          ))}
        </div>
        {formData.allowedFileTypes.length > 0 && (
          <p className="text-xs text-slate-600">
            Selected: {formData.allowedFileTypes.map(type => `.${type}`).join(', ')}
          </p>
        )}
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button
        type="submit"
        loading={submitting}
        disabled={submitting || !formData.title.trim() || !formData.description.trim() || !formData.deadline || !formData.allowedFileTypes.length}
        icon={<PlusCircle size={16} />}
        className="w-fit"
      >
        Create Assignment
      </Button>
    </form>
  )
}

export default AssignmentCreateForm
