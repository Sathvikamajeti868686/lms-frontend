import { useCallback, useEffect, useMemo, useState } from 'react'
import { Bell, BookOpenCheck, ClipboardList, FileUp, ListChecks } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/Card'
import DashboardLayout from '../components/DashboardLayout'
import LoadingSpinner from '../components/LoadingSpinner'
import NotificationList from '../components/NotificationList'
import AssignmentsList from '../components/student/AssignmentsList'
import QuizCards from '../components/student/QuizCards'
import ResultsList from '../components/student/ResultsList'
import UploadDropzone from '../components/student/UploadDropzone'
import { getCurrentUser } from '../services/authService'
import { submitAssignment, getAssignments, getNotifications } from '../services/lmsService'

const EMPTY_STUDENT_DATA = {
  assignments: [],
  submissions: [],
  grades: [],
  notifications: [],
  quizQuestions: [],
}

function StudentDashboardPage() {
  const user = getCurrentUser()
  const [activeSection, setActiveSection] = useState('assignments')
  const [loading, setLoading] = useState(true)
  const [assignments, setAssignments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [seenNotificationIds, setSeenNotificationIds] = useState(() => new Set())

  const refreshData = useCallback(async () => {
    try {
      const [assignmentsRes, notificationsRes] = await Promise.all([
        getAssignments(),
        getNotifications('student')
      ])
      setAssignments(assignmentsRes || [])
      setNotifications(notificationsRes || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load data.')
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await refreshData()
      } catch (error) {
        toast.error(error.message || 'Failed to load student dashboard.')
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [refreshData])

  useEffect(() => {
    const handleStorageUpdate = (event) => {
      if (event.key === 'lms_frontend_state_v1') {
        refreshData().catch((error) => {
          console.error('Failed to refresh student dashboard after storage update:', error)
        })
      }
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshData().catch((error) => {
          console.error('Failed to refresh student dashboard on visibility change:', error)
        })
      }
    }

    window.addEventListener('storage', handleStorageUpdate)
    window.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('storage', handleStorageUpdate)
      window.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [refreshData])

  const unreadNotifications = useMemo(
    () =>
      notifications.reduce(
        (count, notification) => count + (seenNotificationIds.has(notification.id) ? 0 : 1),
        0,
      ),
    [notifications, seenNotificationIds],
  )

  const menuItems = useMemo(
    () => [
      { key: 'assignments', label: 'View Assignments', icon: <ClipboardList size={16} /> },
      { key: 'submit', label: 'Submit Assignment', icon: <FileUp size={16} /> },
      { key: 'quiz', label: 'Quiz Section', icon: <BookOpenCheck size={16} /> },
      { key: 'results', label: 'Results', icon: <ListChecks size={16} /> },
      { key: 'notifications', label: 'Notifications', icon: <Bell size={16} />, badge: unreadNotifications > 0 ? unreadNotifications : null },
    ],
    [unreadNotifications],
  )

  const markNotificationsAsRead = useCallback(() => {
    setSeenNotificationIds((current) => {
      if (!notifications.length) {
        return current
      }

      const next = new Set(current)
      notifications.forEach((notification) => next.add(notification.id))
      return next
    })
  }, [notifications])

  function handleSectionChange(nextSection) {
    setActiveSection(nextSection)
    if (nextSection === 'notifications') {
      markNotificationsAsRead()
    }
  }

  async function handleSubmitAssignment(payload) {
    try {
      await submitAssignment({
        file: payload.file,
        studentId: user?.id || 1,
        assignmentId: payload.assignmentId,
      })
      await refreshData()
      toast.success('Submission uploaded successfully.')
      handleSectionChange('results')
    } catch (error) {
      toast.error(error.message || 'Failed to upload submission.')
    }
  }

  return (
    <>
      <DashboardLayout
        user={user}
        sidebarTitle="Student Menu"
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
              <p className="text-sm text-slate-600">Loading student dashboard...</p>
            </div>
          </div>
        ) : null}

        {!loading && activeSection === 'assignments' ? (
          <Card
            title="Available Assignments"
            subtitle="Check due date, instructions, and required file types before submission"
          >
            <AssignmentsList assignments={assignments} />
          </Card>
        ) : null}

        {!loading && activeSection === 'submit' ? (
          <Card title="Submit Assignment" subtitle="Upload your files with drag and drop interface">
            <UploadDropzone assignments={assignments} onSubmit={handleSubmitAssignment} />
          </Card>
        ) : null}

        {!loading && activeSection === 'quiz' ? (
          <Card title="Quiz Section" subtitle="Practice with MCQ cards and submit to view your score">
            <QuizCards questions={[]} />
          </Card>
        ) : null}

        {!loading && activeSection === 'results' ? (
          <Card title="Results" subtitle="Track marks, grades, and feedback from teacher">
            <ResultsList grades={[]} />
          </Card>
        ) : null}

        {!loading && activeSection === 'notifications' ? (
          <Card title="Notifications" subtitle="Assignment alerts and submission email updates">
            <NotificationList notifications={notifications} />
          </Card>
        ) : null}
      </DashboardLayout>
    </>
  )
}

export default StudentDashboardPage
