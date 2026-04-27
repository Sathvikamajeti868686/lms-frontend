import { useRef } from 'react'

function OtpInput({ value, onChange, length = 6, error }) {
  const inputRefs = useRef([])
  const digits = Array.from({ length }, (_, index) => value[index] || '')

  function updateAt(index, nextChar) {
    const next = digits.slice()
    next[index] = nextChar
    onChange(next.join(''))
  }

  function handleInput(index, rawValue) {
    const lastChar = rawValue.replace(/\D/g, '').slice(-1)
    updateAt(index, lastChar)

    if (lastChar && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(event, index) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(event) {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) {
      return
    }

    const next = Array.from({ length }, (_, index) => pasted[index] || '')
    onChange(next.join(''))
    const focusIndex = Math.min(pasted.length, length - 1)
    inputRefs.current[focusIndex]?.focus()
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">MFA Code</p>
      <div className="flex gap-2" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(event) => handleInput(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`h-11 w-11 rounded-xl border text-center text-base font-semibold outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
              error ? 'border-red-300' : 'border-slate-300'
            }`}
            aria-label={`MFA digit ${index + 1}`}
          />
        ))}
      </div>
      {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
    </div>
  )
}

export default OtpInput
