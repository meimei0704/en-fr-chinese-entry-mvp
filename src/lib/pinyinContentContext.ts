import { createContext, useContext } from 'react'

import type { PinyinCourseContent } from '../content/types'

export interface PinyinCourseContextValue {
  course: PinyinCourseContent | null
  error: Error | null
  reload: () => void
}

export const PinyinCourseContext = createContext<PinyinCourseContextValue>({
  course: null,
  error: null,
  reload: () => {},
})

export function usePinyinCourse() {
  return useContext(PinyinCourseContext)
}
