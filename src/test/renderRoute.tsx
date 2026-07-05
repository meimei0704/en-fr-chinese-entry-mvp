import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import { appRoutes } from '../app/router'

export function renderRoute(route: string) {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [route],
  })

  return render(<RouterProvider router={router} />)
}
