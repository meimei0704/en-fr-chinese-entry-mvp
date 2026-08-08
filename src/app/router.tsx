import { Navigate, createBrowserRouter, type RouteObject } from 'react-router-dom'

import { ScrollRestorationLayout } from './ScrollRestorationLayout'
import { AdminLessonEditorPage } from '../pages/AdminLessonEditorPage'
import { AdminLessonsPage } from '../pages/AdminLessonsPage'
import { AdminVoiceGenerationPage } from '../pages/AdminVoiceGenerationPage'
import { HomePage } from '../pages/HomePage'
import { LessonPage } from '../pages/LessonPage'
import { PinyinPage } from '../pages/PinyinPage'
import { PinyinPracticePage } from '../pages/PinyinPracticePage'
import { PracticePage } from '../pages/PracticePage'
import { ProgressPage } from '../pages/ProgressPage'
import { ReviewPage } from '../pages/ReviewPage'

export const appRoutes: RouteObject[] = [
  {
    element: <ScrollRestorationLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/admin', element: <AdminLessonsPage /> },
      { path: '/admin/voice', element: <AdminVoiceGenerationPage /> },
      { path: '/admin/lesson/:lessonId', element: <AdminLessonEditorPage /> },
      { path: '/home', element: <Navigate to="/" replace /> },
      { path: '/lesson/:lessonId', element: <LessonPage /> },
      { path: '/lesson/:lessonId/practice', element: <PracticePage /> },
      { path: '/pinyin', element: <PinyinPage /> },
      { path: '/pinyin/practice', element: <PinyinPracticePage /> },
      { path: '/review', element: <ReviewPage /> },
      { path: '/progress', element: <ProgressPage /> },
    ],
  },
]

export const router = createBrowserRouter(appRoutes)
