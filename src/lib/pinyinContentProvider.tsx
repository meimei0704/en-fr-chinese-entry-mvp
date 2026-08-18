import { useEffect, useState, type ReactNode } from 'react'

import type { PinyinCourseContent } from '../content/types'
import { fetchPinyinCourse } from './contentApi'
import { PinyinCourseContext } from './pinyinContentContext'

export function PinyinCourseProvider({ children }: { children: ReactNode }) {
  const [course, setCourse] = useState<PinyinCourseContent | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let active = true
    setError(null)
    fetchPinyinCourse()
      .then((nextCourse) => {
        if (active) {
          setCourse(nextCourse)
        }
      })
      .catch((nextError: unknown) => {
        if (active) {
          setError(nextError as Error)
        }
      })
    return () => {
      active = false
    }
  }, [tick])

  return (
    <PinyinCourseContext.Provider
      value={{ course, error, reload: () => setTick((t) => t + 1) }}
    >
      {children}
    </PinyinCourseContext.Provider>
  )
}
