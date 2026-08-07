type CourseSeriesTitleProps = {
  id: string
  title: string
}

export function CourseSeriesTitle({ id, title }: CourseSeriesTitleProps) {
  return (
    <h2 id={id} className="course-series__title">
      {title.split(/(\s+)/u).map((segment, index) =>
        /^\s+$/u.test(segment) ? (
          segment
        ) : (
          <span className="course-series__title-token" key={`${index}-${segment}`}>
            {segment}
          </span>
        ),
      )}
    </h2>
  )
}
