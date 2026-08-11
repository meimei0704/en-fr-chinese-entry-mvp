import { useState } from 'react'

interface JourneyNodeCourseImageProps {
  src: string
  fallback: string
}

export function JourneyNodeCourseImage({ src, fallback }: JourneyNodeCourseImageProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return <span className="journey-node__doodle--fallback">{fallback}</span>
  }

  return (
    <img
      className="journey-node__course-image"
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setHasError(true)}
    />
  )
}
