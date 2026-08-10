import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './app/App'
import { CourseProvider } from './lib/contentProvider'
import { PinyinCourseProvider } from './lib/pinyinContentProvider'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CourseProvider>
      <PinyinCourseProvider>
        <App />
      </PinyinCourseProvider>
    </CourseProvider>
  </StrictMode>,
)
