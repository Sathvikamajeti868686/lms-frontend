import { apiRequest } from '../lib/lib'

const SESSION_KEY = 'lms_current_user_v1'
const AUTH_TOKEN_KEY = 'lms_auth_token_v1'

export function normalizeRole(role) {
  if (!role) {
    return ''
  }

  const normalizedRole = String(role).trim().toUpperCase()
  if (normalizedRole === 'ADMIN_TEACHER' || normalizedRole === 'TEACHER') {
    return 'teacher'
  }

  if (normalizedRole === 'STUDENT') {
    return 'student'
  }

  return String(role).trim().toLowerCase()
}

function toBackendRole(role) {
  return normalizeRole(role) === 'teacher' ? 'ADMIN_TEACHER' : 'STUDENT'
}

function toSafeUser(user = {}) {
  return {
    id: user.id ?? user._id ?? user.userId ?? user.email,
    name: user.name ?? user.fullName ?? '',
    email: user.email ?? '',
    role: normalizeRole(user.role),
  }
}

function saveSession(user, token) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  }
}

function extractUserPayload(payload) {
  const data = payload?.data ?? payload
  return data?.user ?? data
}

function extractTokenPayload(payload) {
  return payload?.token ?? payload?.data?.token ?? payload?.data?.accessToken ?? payload?.accessToken ?? null
}

export async function registerUser({ name, email, password, role }) {
  const payload = await apiRequest('/register', {
    method: 'POST',
    body: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: toBackendRole(role),
    },
  })

  return {
    message: payload?.message || 'Signup successful.',
    user: toSafeUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: toBackendRole(role),
      ...extractUserPayload(payload),
    }),
  }
}

export async function loginUser({ email, password, mfaCode, role = 'student' }) {
  const backendRole = toBackendRole(role)
  const body = {
    email: email.trim().toLowerCase(),
    password,
    role: backendRole,
  }

  if (backendRole === 'ADMIN_TEACHER') {
    body.otp = mfaCode.trim()
  }

  const payload = await apiRequest('/login', {
    method: 'POST',
    body,
  })

  const user = toSafeUser({
    email: body.email,
    role: backendRole,
    ...extractUserPayload(payload),
  })
  const token = extractTokenPayload(payload)

  saveSession(user, token)
  return {
    message: payload?.message || 'Login successful.',
    user,
  }
}

export async function forgotPassword(email) {
  const payload = await apiRequest('/forgot-password', {
    method: 'POST',
    body: {
      email: email.trim().toLowerCase(),
    },
  })

  return payload?.message || 'OTP sent to your email.'
}

export async function resetPassword({ email, otp, newPassword }) {
  const payload = await apiRequest('/reset-password', {
    method: 'POST',
    body: {
      email: email.trim().toLowerCase(),
      otp: otp.trim(),
      newPassword,
    },
  })

  return payload?.message || 'Password reset successful.'
}

export function getCurrentUser() {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) {
    return null
  }

  try {
    const user = JSON.parse(raw)
    return toSafeUser(user)
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function getDashboardPath(role) {
  return normalizeRole(role) === 'teacher' ? '/dashboard/teacher' : '/dashboard/student'
}
