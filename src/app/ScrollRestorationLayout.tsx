import { Outlet, ScrollRestoration } from 'react-router-dom'

export function ScrollRestorationLayout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  )
}
