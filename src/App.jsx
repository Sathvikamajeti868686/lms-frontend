import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import TeacherDashboardPage from './pages/TeacherDashboardPage'
import StudentDashboardPage from './pages/StudentDashboardPage'
import { getCurrentUser, getDashboardPath } from './services/authService'

function ProtectedRoute({ children }) {
  const user = getCurrentUser()
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function RoleRoute({ role, children }) {
  const user = getCurrentUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== role) {
    return <Navigate to={getDashboardPath(user.role)} replace />
  }

  return children
}

function App() {
  const user = getCurrentUser()

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? getDashboardPath(user.role) : '/login'} replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Navigate to={getDashboardPath(user?.role ?? 'student')} replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/teacher"
        element={
          <RoleRoute role="teacher">
            <TeacherDashboardPage />
          </RoleRoute>
        }
      />
      <Route
        path="/dashboard/student"
        element={
          <RoleRoute role="student">
            <StudentDashboardPage />
          </RoleRoute>
        }
      />
      <Route path="*" element={<Navigate to={user ? getDashboardPath(user.role) : '/login'} replace />} />
    </Routes>
  )
}

export default App
