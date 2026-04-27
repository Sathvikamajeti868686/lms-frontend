import { apiRequest } from '../lib/lib'

const API_BASE = 'http://localhost:8080/api'

// ================== DASHBOARD ==================

export async function getTeacherDashboardData() {
  const payload = await apiRequest('/dashboard/teacher')
  return {
    assignments: payload?.assignments ?? [],
    submissions: payload?.submissions ?? [],
    notifications: payload?.notifications ?? [],
    quizQuestions: payload?.quizQuestions ?? [],
  }
}

export async function getStudentDashboardData(studentEmail) {
  const query = studentEmail ? `?email=${encodeURIComponent(studentEmail)}` : ''
  const payload = await apiRequest(`/dashboard/student${query}`)

  return {
    assignments: payload?.assignments ?? [],
    submissions: payload?.submissions ?? [],
    grades: payload?.grades ?? [],
    notifications: payload?.notifications ?? [],
    quizQuestions: payload?.quizQuestions ?? [],
  }
}

// ================== ASSIGNMENTS ==================

export async function getAssignments() {
  const payload = await apiRequest('/assignments')
  return payload?.assignments ?? payload?.data ?? payload ?? []
}

export async function createAssignment({ title, description, deadline, allowedFileTypes, teacherId }) {
  const payload = await apiRequest('/assignments', {
    method: 'POST',
    body: { title, description, deadline, allowedFileTypes, teacherId },
  })
  return payload?.assignment ?? payload?.data ?? payload
}

// ================== SUBMISSION ==================

export async function submitAssignment({ file, studentId, assignmentId }) {

  console.log("🚀 Submitting assignment...");
  console.log("assignmentId:", assignmentId);
  console.log("studentId:", studentId);
  console.log("file:", file?.name);

  const formData = new FormData();

  formData.append("file", file);
  formData.append("studentId", studentId || 1);
  formData.append("assignmentId", assignmentId);

  const response = await fetch(`${API_BASE}/submissions`, {
    method: "POST",
    body: formData,
  });

  const text = await response.text();
  console.log("Response:", text);

  if (!response.ok) {
    throw new Error("Submission failed: " + text);
  }

  return JSON.parse(text);
}

// ================== GRADING ==================

export async function gradeSubmission({ submissionId, marks, feedback }) {
  const payload = await apiRequest(`/submissions/${submissionId}/grade`, {
    method: 'PATCH',
    body: { marks, feedback },
  })
  return payload?.submission ?? payload?.data ?? payload
}

// ================== QUIZ ==================

export async function createQuiz({ question, options, correctAnswer, teacherId }) {
  const payload = await apiRequest('/quizzes', {
    method: 'POST',
    body: { question, options, correctAnswer, teacherId },
  })
  return payload?.quiz ?? payload?.data ?? payload
}

export async function getQuizzes() {
  const response = await fetch(`${API_BASE}/quizzes`)
  if (!response.ok) {
    throw new Error("Failed to fetch quizzes")
  }
  return await response.json()
}

// ================== NOTIFICATIONS ==================

export async function getNotifications(userType) {
  const payload = await apiRequest(`/notifications?userType=${userType}`)
  return payload?.notifications ?? payload?.data ?? payload ?? []
}