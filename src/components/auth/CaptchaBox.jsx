import { RefreshCw, ShieldCheck } from 'lucide-react'
import Button from '../Button'
import InputField from '../InputField'

function CaptchaBox({ captchaValue, enteredCaptcha, onChange, onRefresh, error }) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
          <ShieldCheck size={16} />
          <span>Captcha Verification</span>
        </div>
        <Button
          variant="secondary"
          className="px-2.5 py-1.5 text-xs"
          icon={<RefreshCw size={14} />}
          onClick={onRefresh}
        >
          Refresh
        </Button>
      </div>

      <div className="mb-3 rounded-xl border border-blue-200 bg-white px-3 py-2">
        <p className="font-display text-lg font-semibold tracking-[0.28em] text-slate-800 select-none">
          {captchaValue}
        </p>
      </div>

      <InputField
        id="captcha"
        label="Enter Captcha"
        name="captcha"
        value={enteredCaptcha}
        onChange={onChange}
        placeholder="Type captcha text"
        autoComplete="off"
        error={error}
        required
      />
    </div>
  )
}

export default CaptchaBox
