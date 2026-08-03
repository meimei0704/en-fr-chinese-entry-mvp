import { getLocalizedText } from '../content/copy'
import { getLessonTopicDisplay } from '../content/lessonTopics'
import type { ExplanationLanguage, LessonId, LocalizedField } from '../content/types'

type TopicTitleTag = 'h1' | 'h2' | 'h3' | 'p'

type LessonTopicTitleProps = {
  as: TopicTitleTag
  language: ExplanationLanguage
  className?: string
} & (
  | {
      lessonId: LessonId
      title?: LocalizedField
    }
  | {
      lessonId?: undefined
      title: LocalizedField
    }
)

function containsChinese(text: string) {
  return /[\u3400-\u9fff]/.test(text)
}

function splitLocalizedTopicTitle(title: string) {
  const parts = title.split(/\s+\/\s+/)

  if (parts.length < 2 || !containsChinese(parts[0])) {
    return { primary: title, secondary: null }
  }

  return {
    primary: parts[0],
    secondary: parts.slice(1).join(' / '),
  }
}

export function LessonTopicTitle({
  as: Tag,
  title,
  lessonId,
  language,
  className,
}: LessonTopicTitleProps) {
  const { primary, secondary } = lessonId
    ? getLessonTopicDisplay(lessonId, language)
    : splitLocalizedTopicTitle(getLocalizedText(title, language))
  const classes = ['lesson-topic-title', className].filter(Boolean).join(' ')

  if (!secondary) {
    return <Tag className={className}>{primary}</Tag>
  }

  return (
    <Tag className={classes}>
      <span className="lesson-topic-title__primary">{primary}</span>{' '}
      <span className="lesson-topic-title__secondary">{secondary}</span>
    </Tag>
  )
}
