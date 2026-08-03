import { Navigate, createBrowserRouter, type RouteObject } from 'react-router-dom'

import { AdminLessonEditorPage } from '../pages/AdminLessonEditorPage'
import { AdminLessonsPage } from '../pages/AdminLessonsPage'
import { AdminVoiceGenerationPage } from '../pages/AdminVoiceGenerationPage'
import { HomePage } from '../pages/HomePage'
import { LessonPage } from '../pages/LessonPage'
import { PinyinPage } from '../pages/PinyinPage'
import { PracticePage } from '../pages/PracticePage'
import { ProgressPage } from '../pages/ProgressPage'
import { ReviewPage } from '../pages/ReviewPage'
import { ShortInputPage } from '../pages/ShortInputPage'

export const appRoutes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/admin', element: <AdminLessonsPage /> },
  { path: '/admin/voice', element: <AdminVoiceGenerationPage /> },
  { path: '/admin/lesson/:lessonId', element: <AdminLessonEditorPage /> },
  { path: '/home', element: <Navigate to="/" replace /> },
  { path: '/lesson/:lessonId', element: <LessonPage /> },
  { path: '/lesson/:lessonId/practice', element: <PracticePage /> },
  { path: '/lesson/:lessonId/short-input', element: <ShortInputPage /> },
  { path: '/pinyin', element: <PinyinPage /> },
  { path: '/review', element: <ReviewPage /> },
  { path: '/progress', element: <ProgressPage /> },
]

export const router = createBrowserRouter(appRoutes)
