import { Link, NavLink, useLocation } from 'react-router-dom'

import { getUiCopy } from '../content/copy'
import { loadProgress } from '../lib/progress'

const JOURNEY_HASH = '#home-basic-expressions-path'

export function SiteHeader() {
  const copy = getUiCopy(loadProgress().selectedExplanationLanguage)
  const location = useLocation()

  const journeyActive = location.pathname === '/' && location.hash === JOURNEY_HASH
  const homeActive = location.pathname === '/' && location.hash !== JOURNEY_HASH

  return (
    <header className="site-header site-header--sticky">
      <nav className="site-header__nav" aria-label={copy.nav.siteNavLabel}>
        <NavLink
          className={({ isActive }) =>
            `site-header__link${isActive && homeActive ? ' site-header__link--active' : ''}`
          }
          to="/"
          end
        >
          {copy.nav.home}
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `site-header__link${isActive ? ' site-header__link--active' : ''}`
          }
          to="/pinyin"
        >
          {copy.nav.pinyin}
        </NavLink>
        <Link
          className={`site-header__link${journeyActive ? ' site-header__link--active' : ''}`}
          to="/#home-basic-expressions-path"
        >
          {copy.nav.journey}
        </Link>
        <NavLink
          className={({ isActive }) =>
            `site-header__link${isActive ? ' site-header__link--active' : ''}`
          }
          to="/culture"
        >
          {copy.nav.culture}
        </NavLink>
      </nav>
    </header>
  )
}
