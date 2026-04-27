import { useMemo, useState } from 'react'
import { CheckCircle2, XCircle, RefreshCcw } from 'lucide-react'
import Button from '../Button'

function QuizCards({ questions }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const score = useMemo(() => {
    const correctCount = questions.reduce(
      (count, question, index) => {
          const qId = question.id || `q-${index}`;
          return count + (answers[qId] === question.correctAnswer ? 1 : 0);
      },
      0,
    )

    return { correctCount, total: questions.length }
  }, [answers, questions])

  const percentage = (score.correctCount / score.total) * 100 || 0;

  function resetQuiz() {
    setAnswers({})
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm shadow-blue-200">
             <span className="text-2xl font-bold">{score.correctCount}/{score.total}</span>
          </div>
          <h3 className="font-display text-xl font-bold text-slate-900">Quiz Completed!</h3>
          <p className="mt-2 text-slate-600">You scored {percentage.toFixed(0)}% in this assessment.</p>
          <Button variant="secondary" className="mt-6" icon={<RefreshCcw size={16} />} onClick={resetQuiz}>
            Retake Quiz
          </Button>
        </div>

        <div className="space-y-4">
          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
            Review Answers
          </h4>
          {questions.map((question, index) => {
            const qId = question.id || `q-${index}`;
            const studentAnswer = answers[qId];
            const isCorrect = studentAnswer === question.correctAnswer;

            return (
              <article key={qId} className={`rounded-xl border p-4 ${isCorrect ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">
                    Q{index + 1}. {question.question}
                  </p>
                  {isCorrect ? <CheckCircle2 className="shrink-0 text-green-600" size={18} /> : <XCircle className="shrink-0 text-red-600" size={18} />}
                </div>
                
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {question.options.map((option) => {
                    const isOptionCorrect = option === question.correctAnswer;
                    const isOptionSelected = option === studentAnswer;
                    
                    let colorClass = 'border-slate-200 bg-white text-slate-500 opacity-60';
                    if (isOptionCorrect) colorClass = 'border-green-500 bg-green-100/50 text-green-700 font-medium ring-2 ring-green-100';
                    if (isOptionSelected && !isCorrect) colorClass = 'border-red-500 bg-red-100/50 text-red-700 font-medium ring-2 ring-red-100';

                    return (
                      <div key={option} className={`rounded-lg border px-3 py-2 text-sm ${colorClass}`}>
                        {option}
                        {isOptionCorrect && <span className="ml-2 text-[10px] font-bold uppercase">(Correct)</span>}
                        {isOptionSelected && !isCorrect && <span className="ml-2 text-[10px] font-bold uppercase">(Your choice)</span>}
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question, index) => {
        const qId = question.id || `q-${index}`;
        return (
        <article key={qId} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900 leading-relaxed">
            Q{index + 1}. {question.question}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {question.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() =>
                  setAnswers((current) => ({
                    ...current,
                    [qId]: option,
                  }))
                }
                className={`group relative flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200 ${
                  answers[qId] === option
                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100'
                    : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:border-blue-300 hover:bg-white'
                }`}
              >
                <span>{option}</span>
                {answers[qId] === option && (
                  <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </article>
      )})}

      <div className="flex justify-end pt-2">
        <Button 
          onClick={() => setSubmitted(true)} 
          disabled={Object.keys(answers).length < questions.length}
          className="px-8 shadow-md shadow-blue-200"
        >
          Submit Answers
        </Button>
      </div>
    </div>
  )
}

export default QuizCards
