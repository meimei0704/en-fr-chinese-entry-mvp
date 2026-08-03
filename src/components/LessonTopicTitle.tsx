import type { LocalizedField } from '../content/types'
import { getLocalizedText } from '../content/copy'
import type { ExplanationLanguage } from '../content/types'

type HeadingTag = 'h1' | 'h2' | 'h3'

interface LessonTopicTitleProps {
  as: HeadingTag
  title: LocalizedField
  language: ExplanationLanguage
  className?: string
}

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

export function LessonTopicTitle({ as: Tag, title, language, className }: LessonTopicTitleProps) {
  const localizedTitle = getLocalizedText(title, language)
  const { primary, secondary } = splitLocalizedTopicTitle(localizedTitle)
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
