import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { course } from '../../content/course'
import { contentModuleTypes } from './types'
import { createInitialContentSeed, lessonToModulePayloads, renderInitialContentSeedSql } from './seed'

describe('initial content admin seed', () => {
  it('splits every static lesson into provider-light lesson modules', () => {
    const modules = lessonToModulePayloads(course.lessons[0])

    expect(modules.map((module) => module.moduleType)).toEqual(contentModuleTypes)
    expect(modules.find((module) => module.moduleType === 'lessonMeta')?.payload).toEqual({
      id: course.lessons[0].id,
      title: course.lessons[0].title,
      scenario: course.lessons[0].scenario,
    })
    expect(modules.find((module) => module.moduleType === 'dialogue')?.payload).toEqual(course.lessons[0].dialogue)
    expect(modules.find((module) => module.moduleType === 'shortInput')?.payload).toEqual(course.lessons[0].shortInput)
  })

  it('creates initial published and draft revisions without changing audio refs or lesson structure', () => {
    const seed = createInitialContentSeed(course)
    const staticAudioRefs = course.lessons.flatMap((lesson) => [
      ...lesson.dialogue.lines.map((line) => line.audio),
      ...lesson.sentencePatterns.map((pattern) => pattern.audio),
      ...lesson.vocabulary.map((item) => item.audio),
      ...lesson.pronunciation.map((tip) => tip.audio),
      ...Object.values(lesson.practice).flatMap((prompts) => prompts.map((prompt) => prompt.audio)),
      lesson.shortInput.audio,
    ])
    const seededAudioRefs = JSON.stringify(seed.revisions)

    expect(seed.lessons.map((lesson) => lesson.lessonId)).toEqual(course.lessons.map((lesson) => lesson.id))
    expect(seed.lessonModules).toHaveLength(course.lessons.length * contentModuleTypes.length)
    expect(seed.revisions).toHaveLength(course.lessons.length * contentModuleTypes.length * 2)

    for (const lesson of course.lessons) {
      for (const moduleType of contentModuleTypes) {
        const module = seed.lessonModules.find(
          (candidate) => candidate.lessonId === lesson.id && candidate.moduleType === moduleType,
        )
        expect(module, `${lesson.id}/${moduleType} module should exist`).toBeDefined()
        expect(module?.currentPublishedRevisionId).toEqual(expect.any(Number))
        expect(module?.currentDraftRevisionId).toEqual(expect.any(Number))
        expect(module?.currentDraftRevisionId).not.toBe(module?.currentPublishedRevisionId)

        const draft = seed.revisions.find((revision) => revision.revisionId === module?.currentDraftRevisionId)
        expect(draft?.revisionKind).toBe('draft')
        expect(draft?.sourceRevisionId).toBe(module?.currentPublishedRevisionId)
      }
    }

    for (const audioRef of staticAudioRefs) {
      expect(seededAudioRefs).toContain(audioRef)
    }
  })

  it('keeps the checked-in SQL seed entrypoint in sync with the static course source', () => {
    const checkedInSeedSql = readFileSync('db/seeds/0001_initial_content_admin.sql', 'utf8')

    expect(checkedInSeedSql).toBe(renderInitialContentSeedSql(course))
  })
})
