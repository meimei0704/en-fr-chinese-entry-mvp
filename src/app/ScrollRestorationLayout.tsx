import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'

import { SiteHeader } from './SiteHeader'

export function ScrollRestorationLayout() {
  const { pathname } = useLocation()
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')

  return (
    <>
      <ScrollRestoration />
      {isAdminRoute ? null : <SiteHeader />}
      <Outlet />
    </>
  )
}
