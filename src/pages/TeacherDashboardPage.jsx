import { useCallback, useEffect, useMemo, useState } from 'react'
import { Bell, ClipboardCheck, FilePlus2, FolderOpen, BookOpenCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/Card'
import DashboardLayout from '../components/DashboardLayout'
import LoadingSpinner from '../components/LoadingSpinner'
import NotificationList from '../components/NotificationList'
import AssignmentCreateForm from '../components/teacher/AssignmentCreateForm'
import QuizCreateForm from '../components/teacher/QuizCreateForm'
import GradingPanel from '../components/teacher/GradingPanel'
import SubmissionsTable from '../components/teacher/SubmissionsTable'
import { getCurrentUser } from '../services/authService'
import { createAssignment, createQuiz, getTeacherDashboardData, gradeSubmission } from '../services/lmsService'

const EMPTY_TEACHER_DATA = {
  assignments: [],
  submissions: [],
  notifications: [],
  quizQuestions: [],
}

function TeacherDashboardPage() {
  const user = getCurrentUser()
  const [activeSection, setActiveSection] = useState('create')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(EMPTY_TEACHER_DATA)
  const [selectedSubmissionId, setSelectedSubmissionId] = useState('')
  const [seenNotificationIds, setSeenNotificationIds] = useState(() => new Set())
  const [seenSubmissionIds, setSeenSubmissionIds] = useState(() => new Set())
  const [newSubmissionCount, setNewSubmissionCount] = useState(0)

  const refreshData = useCallback(async () => {
  try {
    // 🔥 FETCH SUBMISSIONS DIRECTLY FROM BACKEND
    const res = await fetch("http://localhost:8080/api/submissions");
    const json = await res.json();

    console.log("Submissions API:", json);

    setData((prev) => ({
      ...prev,
      submissions: json.data || [],
    }));

  } catch (error) {
    console.error("Error fetching submissions:", error);
  }
}, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await refreshData()
      } catch (error) {
        toast.error(error.message || 'Failed to load teacher dashboard.')
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [refreshData])

  const selectedSubmission = useMemo(
    () => data.submissions.find((submission) => submission.id === selectedSubmissionId),
    [data.submissions, selectedSubmissionId],
  )

  const unreadNotifications = useMemo(
    () =>
      data.notifications.reduce(
        (count, notification) => count + (seenNotificationIds.has(notification.id) ? 0 : 1),
        0,
      ),
    [data.notifications, seenNotificationIds],
  )

  useEffect(() => {
    const unseenSubmissions = data.submissions.reduce(
      (count, submission) => count + (seenSubmissionIds.has(submission.id) ? 0 : 1),
      0,
    )
    setNewSubmissionCount(unseenSubmissions)
  }, [data.submissions, seenSubmissionIds])

  const menuItems = useMemo(
    () => [
      { key: 'create', label: 'Create Assignment', icon: <FilePlus2 size={16} /> },
      { key: 'quiz', label: 'Create Quiz', icon: <BookOpenCheck size={16} /> },
      {
        key: 'submissions',
        label: 'View Submissions',
        icon: <FolderOpen size={16} />,
        badge: newSubmissionCount > 0 ? newSubmissionCount : null,
      },
      { key: 'grading', label: 'Grade Assignments', icon: <ClipboardCheck size={16} /> },
      { key: 'notifications', label: 'Notifications', icon: <Bell size={16} />, badge: unreadNotifications },
    ],
    [newSubmissionCount, unreadNotifications],
  )

  const markNotificationsAsRead = useCallback(() => {
    setSeenNotificationIds((current) => {
      if (!data.notifications.length) {
        return current
      }

      const next = new Set(current)
      data.notifications.forEach((notification) => next.add(notification.id))
      return next
    })
  }, [data.notifications])

  const markSubmissionsAsViewed = useCallback(() => {
    setNewSubmissionCount(0)
    setSeenSubmissionIds((current) => {
      if (!data.submissions.length) {
        return current
      }

      const next = new Set(current)
      let hasNewSubmission = false

      data.submissions.forEach((submission) => {
        if (!next.has(submission.id)) {
          next.add(submission.id)
          hasNewSubmission = true
        }
      })

      return hasNewSubmission ? next : current
    })
  }, [data.submissions])

  useEffect(() => {
    if (activeSection === 'notifications' || activeSection === 'submissions') {
      markNotificationsAsRead()
    }

    if (activeSection === 'submissions') {
      markSubmissionsAsViewed()
    }
  }, [activeSection, data.notifications, markNotificationsAsRead, markSubmissionsAsViewed])

  function handleSectionChange(nextSection) {
    setActiveSection(nextSection)
    if (nextSection === 'notifications' || nextSection === 'submissions') {
      markNotificationsAsRead()
    }
    if (nextSection === 'submissions') {
      markSubmissionsAsViewed()
    }
  }

  async function handleCreateAssignment(payload) {
    try {
      await createAssignment(payload)
      await refreshData()
      toast.success('Assignment created successfully.')
      handleSectionChange('submissions')
    } catch (error) {
      toast.error(error.message || 'Failed to create assignment.')
    }
  }

  async function handleCreateQuiz(payload) {
    try {
      await createQuiz(payload)
      await refreshData()
      toast.success('Quiz created successfully.')
    } catch (error) {
      toast.error(error.message || 'Failed to create quiz.')
    }
  }

  async function handleSaveGrade(payload) {
    try {
      await gradeSubmission(payload)
      await refreshData()
      toast.success('Grade and feedback saved successfully.')
    } catch (error) {
      toast.error(error.message || 'Failed to save grade.')
    }
  }

  return (
    <>
      <DashboardLayout
        user={user}
        sidebarTitle="Teacher Admin Menu"
        menuItems={menuItems}
        activeKey={activeSection}
        onSelect={handleSectionChange}
        notificationCount={unreadNotifications}
        onNotificationsClick={() => handleSectionChange('notifications')}
      >
        {loading ? (
          <div className="grid min-h-[50vh] place-items-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col items-center gap-3">
              <LoadingSpinner />
              <p className="text-sm text-slate-600">Loading teacher dashboard...</p>
            </div>
          </div>
        ) : null}

        {!loading && activeSection === 'create' ? (
          <Card
            title="Create Assignment"
            subtitle="Define assignment details and allowed file types"
          >
            <AssignmentCreateForm onCreate={handleCreateAssignment} />
          </Card>
        ) : null}

        {!loading && activeSection === 'quiz' ? (
          <Card
            title="Create Quiz"
            subtitle="Define multiple choice questions and answers"
          >
            <QuizCreateForm onCreate={handleCreateQuiz} />
          </Card>
        ) : null}

        {!loading && activeSection === 'submissions' ? (
          <Card title="Student Submissions" subtitle="Click a row to view and grade submission">
            <SubmissionsTable
              submissions={data.submissions}
              selectedId={selectedSubmissionId}
              onSelectSubmission={setSelectedSubmissionId}
            />
          </Card>
        ) : null}

        {!loading && activeSection === 'grading' ? (
          <div className="grid gap-4 xl:grid-cols-[1.15fr,0.85fr]">
            <Card title="Submission List" subtitle="Select submission for grading">
              <SubmissionsTable
                submissions={data.submissions}
                selectedId={selectedSubmissionId}
                onSelectSubmission={setSelectedSubmissionId}
              />
            </Card>
            <Card title="Grading Panel" subtitle="Enter marks and feedback to publish results">
              <GradingPanel
                key={selectedSubmission?.id ?? 'none'}
                selectedSubmission={selectedSubmission}
                onSaveGrade={handleSaveGrade}
              />
            </Card>
          </div>
        ) : null}

        {!loading && activeSection === 'notifications' ? (
          <Card
            title="Teacher Notifications"
            subtitle="Submission updates and platform events are listed below"
          >
            <NotificationList notifications={data.notifications} />
          </Card>
        ) : null}
      </DashboardLayout>
    </>
  )
}

export default TeacherDashboardPage
