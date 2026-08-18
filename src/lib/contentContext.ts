import { createContext, useContext } from 'react'

import type { CourseContent } from '../content/types'

export interface CourseContextValue {
  course: CourseContent | null
  error: Error | null
  reload: () => void
}

export const CourseContext = createContext<CourseContextValue>({
  course: null,
  error: null,
  reload: () => {},
})

export function useCourse() {
  return useContext(CourseContext)
}
