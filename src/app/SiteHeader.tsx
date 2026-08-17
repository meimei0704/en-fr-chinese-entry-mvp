import { NavLink } from 'react-router-dom'

import { getUiCopy } from '../content/copy'
import { loadProgress } from '../lib/progress'

export function SiteHeader() {
  const copy = getUiCopy(loadProgress().selectedExplanationLanguage)

  return (
    <header className="site-header">
      <nav className="site-header__nav" aria-label={copy.nav.siteNavLabel}>
        <NavLink
          className={({ isActive }) =>
            `site-header__link${isActive ? ' site-header__link--active' : ''}`
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
        <NavLink
          className={({ isActive }) =>
            `site-header__link${isActive ? ' site-header__link--active' : ''}`
          }
          to="/culture"
        >
          {copy.nav.culture}
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `site-header__link${isActive ? ' site-header__link--active' : ''}`
          }
          to="/review"
        >
          {copy.nav.review}
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `site-header__link${isActive ? ' site-header__link--active' : ''}`
          }
          to="/progress"
        >
          {copy.nav.progress}
        </NavLink>
      </nav>
    </header>
  )
}
