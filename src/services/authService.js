import { apiRequest } from '../lib/lib'

const SESSION_KEY = 'lms_current_user_v1'
const AUTH_TOKEN_KEY = 'lms_auth_token_v1'

// ✅ Normalize role
export function normalizeRole(role) {
  if (!role) return ''

  const normalizedRole = String(role).trim().toUpperCase()

  if (normalizedRole === 'ADMIN_TEACHER' || normalizedRole === 'TEACHER') {
    return 'teacher'
  }

  if (normalizedRole === 'STUDENT') {
    return 'student'
  }

  return String(role).trim().toLowerCase()
}

// ✅ Convert frontend → backend role
function toBackendRole(role) {
  return normalizeRole(role) === 'teacher' ? 'ADMIN_TEACHER' : 'STUDENT'
}

// ✅ Safe user object
function toSafeUser(user = {}) {
  return {
    id: user.id ?? user._id ?? user.userId ?? user.email,
    name: user.name ?? user.fullName ?? '',
    email: user.email ?? '',
    role: normalizeRole(user.role),
  }
}

// ✅ Save user + token
function saveSession(user, token) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))

  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  }
}

// ✅ Extract user
function extractUserPayload(payload) {
  const data = payload?.data ?? payload
  return data?.user ?? data
}

// ✅ Extract token (VERY IMPORTANT)
function extractTokenPayload(payload) {
  return (
    payload?.token ||
    payload?.data?.token ||
    payload?.data?.accessToken ||
    payload?.accessToken ||
    null
  )
}

// ================= REGISTER =================
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

// ================= LOGIN =================
export async function loginUser({ email, password, mfaCode, role = 'student' }) {
  const backendRole = toBackendRole(role)

  const body = {
    email: email.trim().toLowerCase(),
    password,
    role: backendRole,
  }

  // ✅ Safe MFA handling
  if (backendRole === 'ADMIN_TEACHER' && mfaCode) {
    body.otp = mfaCode.trim()
  }

  const payload = await apiRequest('/login', {
    method: 'POST',
    body,
  })

  // ✅ Extract token
  const token = extractTokenPayload(payload)

  // 🔥 DEBUG: SEE TOKEN IN CONSOLE
  console.log("🔥 JWT TOKEN FROM BACKEND:", token)

  // ✅ Build user
  const user = toSafeUser({
    email: body.email,
    role: backendRole,
    ...extractUserPayload(payload),
  })

  // ✅ Save session
  saveSession(user, token)

  return {
    message: payload?.message || 'Login successful.',
    user,
    token, // 🔥 RETURN TOKEN (IMPORTANT)
  }
}

// ================= FORGOT PASSWORD =================
export async function forgotPassword(email) {
  const payload = await apiRequest('/forgot-password', {
    method: 'POST',
    body: {
      email: email.trim().toLowerCase(),
    },
  })

  return payload?.message || 'OTP sent to your email.'
}

// ================= RESET PASSWORD =================
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

// ================= GET CURRENT USER =================
export function getCurrentUser() {
  const raw = localStorage.getItem(SESSION_KEY)

  if (!raw) return null

  try {
    const user = JSON.parse(raw)
    return toSafeUser(user)
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

// ================= LOGOUT =================
export function logoutUser() {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

// ================= DASHBOARD ROUTE =================
export function getDashboardPath(role) {
  return normalizeRole(role) === 'teacher'
    ? '/dashboard/teacher'
    : '/dashboard/student'
}