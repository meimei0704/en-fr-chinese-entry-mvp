import { createBrowserRouter, type RouteObject } from 'react-router-dom'

import { HomePage } from '../pages/HomePage'
import { LanguageSelectionPage } from '../pages/LanguageSelectionPage'
import { LessonPage } from '../pages/LessonPage'
import { PracticePage } from '../pages/PracticePage'
import { ProgressPage } from '../pages/ProgressPage'
import { ReviewPage } from '../pages/ReviewPage'
import { ShortInputPage } from '../pages/ShortInputPage'

export const appRoutes: RouteObject[] = [
  { path: '/', element: <LanguageSelectionPage /> },
  { path: '/home', element: <HomePage /> },
  { path: '/lesson/:lessonId', element: <LessonPage /> },
  { path: '/lesson/:lessonId/practice', element: <PracticePage /> },
  { path: '/lesson/:lessonId/short-input', element: <ShortInputPage /> },
  { path: '/review', element: <ReviewPage /> },
  { path: '/progress', element: <ProgressPage /> },
]

export const router = createBrowserRouter(appRoutes)
