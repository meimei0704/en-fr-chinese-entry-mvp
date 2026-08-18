import { useEffect, useState, type ReactNode } from 'react'

import type { CourseContent } from '../content/types'
import { fetchCourse } from './contentApi'
import { CourseContext } from './contentContext'

export function CourseProvider({ children }: { children: ReactNode }) {
  const [course, setCourse] = useState<CourseContent | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let active = true
    setError(null)
    fetchCourse()
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
    <CourseContext.Provider value={{ course, error, reload: () => setTick((t) => t + 1) }}>
      {children}
    </CourseContext.Provider>
  )
}
