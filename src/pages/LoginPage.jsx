import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../components/Button'
import InputField from '../components/InputField'
import AuthSwitch from '../components/auth/AuthSwitch'
import CaptchaBox from '../components/auth/CaptchaBox'
import OtpInput from '../components/auth/OtpInput'
import {
  forgotPassword,
  getCurrentUser,
  getDashboardPath,
  loginUser,
  resetPassword,
} from '../services/authService'

function makeCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function LoginPage() {
  const currentUser = getCurrentUser()
  const navigate = useNavigate()
  const location = useLocation()
  const flashMessage = location.state?.message || ''

  const [errorMessage, setErrorMessage] = useState('')
  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  const [captchaText, setCaptchaText] = useState(makeCaptcha)
  const [submitting, setSubmitting] = useState(false)
  const [resetSubmitting, setResetSubmitting] = useState(false)
  const [resetStep, setResetStep] = useState('request')
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const [resetErrorMessage, setResetErrorMessage] = useState('')
  const [role, setRole] = useState('student')
  const [form, setForm] = useState({
    email: '',
    password: '',
    captcha: '',
    mfaCode: '',
  })
  const [resetForm, setResetForm] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  })
  const isTeacherLogin = role === 'teacher'

  const captchaError = useMemo(() => {
    if (!form.captcha) {
      return ''
    }
    return form.captcha.trim().toUpperCase() === captchaText ? '' : 'Captcha text does not match.'
  }, [form.captcha, captchaText])

  useEffect(() => {
    if (!flashMessage) {
      return
    }
    toast.success(flashMessage)
  }, [flashMessage])

  if (currentUser) {
    return <Navigate to={getDashboardPath(currentUser.role)} replace />
  }

  function handleFieldChange(event) {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleRoleChange(event) {
    const nextRole = event.target.value
    setRole(nextRole)

    if (nextRole === 'student') {
      setForm((current) => ({
        ...current,
        mfaCode: '',
      }))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')

    if (!form.email.trim() || !form.password.trim()) {
      setErrorMessage('Email and password are required.')
      return
    }

    if (form.captcha.trim().toUpperCase() !== captchaText) {
      setErrorMessage('Captcha verification failed. Please retry.')
      return
    }

    if (isTeacherLogin && !form.mfaCode.trim()) {
      setErrorMessage('MFA is required for admin login.')
      return
    }

    if (isTeacherLogin && form.mfaCode.trim().length !== 6) {
      setErrorMessage('Please enter a valid 6 digit MFA code.')
      return
    }

    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 350))

    try {
      const result = await loginUser({ ...form, role })
      toast.success(result.message)
      navigate(getDashboardPath(result.user.role))
    } catch (error) {
      console.error('Login error:', error)
      if (error.response) {
        console.error('Login error.response:', error.response)
      }
      const message = error.message || 'Login failed. Please try again.'
      setErrorMessage(message)
      toast.error(message)
      setCaptchaText(makeCaptcha())
      setForm((current) => ({
        ...current,
        captcha: '',
      }))
    } finally {
      setSubmitting(false)
    }
  }

  function openForgotPassword() {
    setResetStep('request')
    setResetErrorMessage('')
    setResetForm({
      email: form.email,
      otp: '',
      newPassword: '',
      confirmPassword: '',
    })
    setIsForgotPasswordOpen(true)
  }

  function closeForgotPassword() {
    if (resetSubmitting) {
      return
    }

    setIsForgotPasswordOpen(false)
    setResetErrorMessage('')
  }

  function handleResetFieldChange(event) {
    const { name, value } = event.target
    setResetForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleForgotPasswordSubmit(event) {
    event.preventDefault()
    setResetErrorMessage('')

    if (!resetForm.email.trim()) {
      setResetErrorMessage('Email is required.')
      return
    }

    setResetSubmitting(true)

    try {
      const message = await forgotPassword(resetForm.email)
      toast.success(message)
      setResetStep('reset')
    } catch (error) {
      console.error('Forgot password error:', error)
      if (error.response) {
        console.error('Forgot password error.response:', error.response)
      }
      const message = error.message || 'Password reset request failed.'
      setResetErrorMessage(message)
      toast.error(message)
    } finally {
      setResetSubmitting(false)
    }
  }

  async function handleResetPasswordSubmit(event) {
    event.preventDefault()
    setResetErrorMessage('')

    if (!resetForm.email.trim() || !resetForm.otp.trim() || !resetForm.newPassword.trim()) {
      setResetErrorMessage('Email, OTP, and new password are required.')
      return
    }

    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setResetErrorMessage('New password and confirm password must match.')
      return
    }

    setResetSubmitting(true)

    try {
      const message = await resetPassword(resetForm)
      toast.success(message)
      setIsForgotPasswordOpen(false)
      setResetStep('request')
      setResetForm((current) => ({
        ...current,
        otp: '',
        newPassword: '',
        confirmPassword: '',
      }))
    } catch (error) {
      console.error('Reset password error:', error)
      if (error.response) {
        console.error('Reset password error.response:', error.response)
      }
      const message = error.message || 'Password reset failed.'
      setResetErrorMessage(message)
      toast.error(message)
    } finally {
      setResetSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen px-4 py-8 animate-lift-in">
      <div className="mx-auto grid w-full max-w-6xl gap-6 rounded-[30px] border border-blue-100 bg-white/90 p-5 shadow-2xl shadow-blue-200/50 md:grid-cols-[1.05fr,0.95fr] md:p-8">
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-6 text-white">
          <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-cyan-200/20 blur-3xl" />

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">LMS Access Portal</p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-4xl">
            Professional login experience for teachers and students
          </h1>
          <p className="mt-3 text-sm text-blue-50">
            Includes captcha verification, OTP-style MFA input, and role-based dashboard routing.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex justify-center">
            <AuthSwitch activeTab="login" />
          </div>

          <form
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            onSubmit={handleSubmit}
          >
            <InputField
              id="login-email"
              label="Email"
              name="email"
              value={form.email}
              onChange={handleFieldChange}
              type="email"
              icon={<Mail size={16} />}
              placeholder="you@example.com"
              required
            />

            <InputField
              id="login-password"
              label="Password"
              name="password"
              value={form.password}
              onChange={handleFieldChange}
              type={isPasswordHidden ? 'password' : 'text'}
              icon={<Lock size={16} />}
              rightElement={
                <button
                  type="button"
                  className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-blue-700"
                  onClick={() => setIsPasswordHidden((current) => !current)}
                  aria-label={isPasswordHidden ? 'Show password' : 'Hide password'}
                >
                  {isPasswordHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              }
              placeholder="Enter your password"
              required
            />

            <div className="-mt-2 flex justify-end">
              <button
                type="button"
                className="text-sm font-semibold text-blue-700 underline underline-offset-4"
                onClick={openForgotPassword}
              >
                Forgot Password?
              </button>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3">
              <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                <Users size={16} />
                Select Role
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300">
                  <input
                    type="radio"
                    name="role"
                    value="teacher"
                    checked={role === 'teacher'}
                    onChange={handleRoleChange}
                  />
                  Teacher (Admin)
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === 'student'}
                    onChange={handleRoleChange}
                  />
                  Student
                </label>
              </div>
            </div>

            <CaptchaBox
              captchaValue={captchaText}
              enteredCaptcha={form.captcha}
              onChange={handleFieldChange}
              onRefresh={() => {
                setCaptchaText(makeCaptcha())
                setForm((current) => ({
                  ...current,
                  captcha: '',
                }))
              }}
              error={captchaError}
            />

            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                isTeacherLogin ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0'
              }`}
              aria-hidden={!isTeacherLogin}
            >
              {isTeacherLogin ? (
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3">
                  <p className="mb-1 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                    <ShieldCheck size={16} />
                    Multi-Factor Authentication
                  </p>
                  <p className="mb-2 text-xs font-medium text-slate-600">
                    MFA required for admin login
                  </p>
                  <OtpInput
                    value={form.mfaCode}
                    onChange={(nextCode) =>
                      setForm((current) => ({
                        ...current,
                        mfaCode: nextCode,
                      }))
                    }
                    error={form.mfaCode.length > 0 && form.mfaCode.length < 6 ? 'OTP must be 6 digits.' : ''}
                  />
                </div>
              ) : null}
            </div>

            {errorMessage ? <p className="text-sm font-medium text-red-600">{errorMessage}</p> : null}

            <Button type="submit" loading={submitting} className="w-full">
              {submitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600">
            Do not have an account?{' '}
            <Link to="/signup" className="font-semibold text-blue-700 underline underline-offset-4">
              Create one
            </Link>
          </p>
        </section>
      </div>

      {isForgotPasswordOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Reset Password
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-slate-900">
                {resetStep === 'request' ? 'Request OTP' : 'Create new password'}
              </h2>
            </div>

            {resetStep === 'request' ? (
              <form className="space-y-4" onSubmit={handleForgotPasswordSubmit}>
                <InputField
                  id="forgot-password-email"
                  label="Email"
                  name="email"
                  value={resetForm.email}
                  onChange={handleResetFieldChange}
                  type="email"
                  icon={<Mail size={16} />}
                  placeholder="you@example.com"
                  disabled={resetSubmitting}
                  required
                />

                {resetErrorMessage ? (
                  <p className="text-sm font-medium text-red-600">{resetErrorMessage}</p>
                ) : null}

                <div className="flex gap-2">
                  <Button type="button" variant="secondary" className="flex-1" onClick={closeForgotPassword}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={resetSubmitting} className="flex-1">
                    {resetSubmitting ? 'Sending...' : 'Send OTP'}
                  </Button>
                </div>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handleResetPasswordSubmit}>
                <InputField
                  id="reset-password-email"
                  label="Email"
                  name="email"
                  value={resetForm.email}
                  onChange={handleResetFieldChange}
                  type="email"
                  icon={<Mail size={16} />}
                  placeholder="you@example.com"
                  disabled={resetSubmitting}
                  required
                />
                <InputField
                  id="reset-password-otp"
                  label="OTP"
                  name="otp"
                  value={resetForm.otp}
                  onChange={handleResetFieldChange}
                  inputMode="numeric"
                  placeholder="Enter OTP"
                  disabled={resetSubmitting}
                  required
                />
                <InputField
                  id="reset-password-new"
                  label="New Password"
                  name="newPassword"
                  value={resetForm.newPassword}
                  onChange={handleResetFieldChange}
                  type="password"
                  icon={<Lock size={16} />}
                  placeholder="Create new password"
                  disabled={resetSubmitting}
                  required
                />
                <InputField
                  id="reset-password-confirm"
                  label="Confirm Password"
                  name="confirmPassword"
                  value={resetForm.confirmPassword}
                  onChange={handleResetFieldChange}
                  type="password"
                  icon={<Lock size={16} />}
                  placeholder="Repeat new password"
                  disabled={resetSubmitting}
                  required
                />

                {resetErrorMessage ? (
                  <p className="text-sm font-medium text-red-600">{resetErrorMessage}</p>
                ) : null}

                <div className="flex gap-2">
                  <Button type="button" variant="secondary" className="flex-1" onClick={closeForgotPassword}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={resetSubmitting} className="flex-1">
                    {resetSubmitting ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default LoginPage
