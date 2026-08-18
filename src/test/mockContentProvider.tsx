import { type ReactNode } from 'react'

import { CourseContext, type CourseContextValue } from '../lib/contentContext'
import { PinyinCourseContext, type PinyinCourseContextValue } from '../lib/pinyinContentContext'

export function MockCourseProvider({
  course,
  error = null,
  children,
}: {
  course: CourseContextValue['course']
  error?: CourseContextValue['error']
  children: ReactNode
}) {
  return (
    <CourseContext.Provider value={{ course, error, reload: () => {} }}>
      {children}
    </CourseContext.Provider>
  )
}

export function MockPinyinCourseProvider({
  course,
  error = null,
  children,
}: {
  course: PinyinCourseContextValue['course']
  error?: PinyinCourseContextValue['error']
  children: ReactNode
}) {
  return (
    <PinyinCourseContext.Provider value={{ course, error, reload: () => {} }}>
      {children}
    </PinyinCourseContext.Provider>
  )
}
