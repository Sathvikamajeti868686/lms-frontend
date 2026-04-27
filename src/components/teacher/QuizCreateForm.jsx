import { useState } from 'react'
import { PlusCircle, Trash2, CheckCircle2, Circle } from 'lucide-react'
import Button from '../Button'
import InputField from '../InputField'

function QuizCreateForm({ onCreate }) {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', '']) // Start with 2 empty options
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleOptionChange(index, value) {
    const nextOptions = [...options]
    nextOptions[index] = value
    setOptions(nextOptions)
  }

  function addOption() {
    setOptions([...options, ''])
  }

  function removeOption(index) {
    if (options.length <= 2) return // Require at least 2 options
    
    // adjust correct answer index if the removed option was before it or it was the correct answer
    if (correctAnswerIndex === index) {
      setCorrectAnswerIndex(0)
    } else if (correctAnswerIndex > index) {
      setCorrectAnswerIndex(correctAnswerIndex - 1)
    }
    
    setOptions(options.filter((_, i) => i !== index))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const cleanQuestion = question.trim()
    const cleanOptions = options.map(o => o.trim()).filter(o => o.length > 0)

    if (!cleanQuestion) {
      setError('Please enter a question.')
      return
    }

    if (cleanOptions.length < 2) {
      setError('Please provide at least 2 valid options.')
      return
    }

    const correctAnswer = options[correctAnswerIndex].trim()
    if (!correctAnswer) {
      setError('The specifically selected correct answer cannot be empty.')
      return
    }

    try {
      setSubmitting(true)
      const dataToSend = { 
        question: cleanQuestion, 
        options: cleanOptions, 
        correctAnswer: correctAnswer,
        teacherId: 1
      }
      console.log(dataToSend)
      await Promise.resolve(onCreate(dataToSend))
      
      setQuestion('')
      setOptions(['', ''])
      setCorrectAnswerIndex(0)
    } catch (submitError) {
      setError(submitError?.message || 'Failed to create quiz.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Quiz Question</span>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          placeholder="E.g., What is the capital of France?"
          required
        />
      </label>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Options & Correct Answer</span>
        {options.map((opt, index) => (
          <div key={index} className="flex items-center gap-3">
            <button
              type="button"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition ${correctAnswerIndex === index ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'}`}
              onClick={() => setCorrectAnswerIndex(index)}
              title="Mark as correct answer"
            >
              {correctAnswerIndex === index ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </button>
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 ${correctAnswerIndex === index ? 'border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50/30' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200 bg-white'}`}
              required
            />
            {options.length > 2 && (
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                onClick={() => removeOption(index)}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        
        <button
          type="button"
          onClick={addOption}
          className="mt-1 flex w-fit items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
        >
          <PlusCircle size={14} /> Add Option
        </button>
      </div>

      {error ? <p className="text-sm text-red-600 border border-red-200 bg-red-50 p-2 rounded-lg">{error}</p> : null}

      <div className="pt-2">
        <Button
          type="submit"
          loading={submitting}
          disabled={submitting || !question.trim()}
          icon={<PlusCircle size={16} />}
        >
          Publish Quiz Question
        </Button>
      </div>
    </form>
  )
}

export default QuizCreateForm
