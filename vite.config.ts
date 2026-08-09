import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function staticContentApiMock(): Plugin {
  return {
    name: 'static-content-api-mock',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const url = new URL(request.url ?? '/', 'http://localhost')

        if (url.pathname === '/api/content/course') {
          void import('./src/content/course.js').then(({ course }) => {
            response.setHeader('Content-Type', 'application/json')
            response.end(JSON.stringify(course))
          })
          return
        }

        if (url.pathname === '/api/content/lessons') {
          const lessonId = url.searchParams.get('lessonId')
          void import('./src/content/course.js').then(({ course }) => {
            const lesson = course.lessons.find((entry) => entry.id === lessonId)
            if (!lesson) {
              response.statusCode = 404
              response.setHeader('Content-Type', 'application/json')
              response.end(JSON.stringify({ error: 'Lesson not found' }))
              return
            }
            response.setHeader('Content-Type', 'application/json')
            response.end(JSON.stringify(lesson))
          })
          return
        }

        if (url.pathname === '/api/content/pinyin/course') {
          void import('./src/content/pinyin/course.js').then(({ pinyinCourse }) => {
            response.setHeader('Content-Type', 'application/json')
            response.end(JSON.stringify(pinyinCourse))
          })
          return
        }

        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), staticContentApiMock()],
  preview: {
    allowedHosts: true,
  },
})
