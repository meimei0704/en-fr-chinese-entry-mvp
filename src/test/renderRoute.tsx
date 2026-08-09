import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import { appRoutes } from '../app/router'
import { course } from '../content/course'
import { pinyinCourse } from '../content/pinyin/course'
import { MockCourseProvider, MockPinyinCourseProvider } from './mockContentProvider'

export function renderRoute(route: string) {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [route],
  })

  return render(
    <MockCourseProvider course={course}>
      <MockPinyinCourseProvider course={pinyinCourse}>
        <RouterProvider router={router} />
      </MockPinyinCourseProvider>
    </MockCourseProvider>,
  )
}
