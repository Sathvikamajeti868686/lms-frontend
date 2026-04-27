import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, User, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../components/Button'
import InputField from '../components/InputField'
import AuthSwitch from '../components/auth/AuthSwitch'
import { getCurrentUser, getDashboardPath, registerUser } from '../services/authService'

function SignupPage() {
  const navigate = useNavigate()
  const user = getCurrentUser()

  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'teacher',
  })

  if (user) {
    return <Navigate to={getDashboardPath(user.role)} replace />
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')

    if (!form.name.trim() || !form.email.trim() || !form.password.trim() || !form.confirmPassword.trim()) {
      setErrorMessage('Please fill all required fields.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage('Password and confirm password must match.')
      return
    }

    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 350))

    try {
      const result = await registerUser(form)
      toast.success(result.message)
      navigate('/login')
    } catch (error) {
      console.error('Signup error:', error)
      if (error.response) {
        console.error('Signup error.response:', error.response)
      }
      const message = error.message || 'Signup failed. Please try again.'
      setErrorMessage(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen px-4 py-8 animate-lift-in">
      <div className="mx-auto grid w-full max-w-6xl gap-6 rounded-[30px] border border-blue-100 bg-white/90 p-5 shadow-2xl shadow-blue-200/50 md:grid-cols-[1.05fr,0.95fr] md:p-8">
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-blue-700 p-6 text-white">
          <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -bottom-10 -left-12 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl" />

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">Create Account</p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-4xl">
            Register as Teacher Admin or Student
          </h1>
          <p className="mt-3 text-sm text-blue-50">
            Build your profile once and continue with secure login to access role-specific assignment workflow.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex justify-center">
            <AuthSwitch activeTab="signup" />
          </div>

          <form
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            onSubmit={handleSubmit}
          >
            <InputField
              id="signup-name"
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              icon={<User size={16} />}
              placeholder="Enter full name"
              required
            />
            <InputField
              id="signup-email"
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              icon={<Mail size={16} />}
              placeholder="you@example.com"
              required
            />
            <InputField
              id="signup-password"
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
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
              placeholder="Create password"
              required
            />
            <InputField
              id="signup-confirm-password"
              label="Confirm Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              type={isConfirmPasswordHidden ? 'password' : 'text'}
              icon={<Lock size={16} />}
              rightElement={
                <button
                  type="button"
                  className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-blue-700"
                  onClick={() => setIsConfirmPasswordHidden((current) => !current)}
                  aria-label={isConfirmPasswordHidden ? 'Show confirm password' : 'Hide confirm password'}
                >
                  {isConfirmPasswordHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              }
              placeholder="Repeat password"
              required
            />

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
                    checked={form.role === 'teacher'}
                    onChange={handleChange}
                  />
                  Teacher (Admin)
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={form.role === 'student'}
                    onChange={handleChange}
                  />
                  Student
                </label>
              </div>
            </div>

            {errorMessage ? <p className="text-sm font-medium text-red-600">{errorMessage}</p> : null}

            <Button type="submit" loading={submitting} className="w-full">
              {submitting ? 'Registering...' : 'Register'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-700 underline underline-offset-4">
              Login
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}

export default SignupPage
