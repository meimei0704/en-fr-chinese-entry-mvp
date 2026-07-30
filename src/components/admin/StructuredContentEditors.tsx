import { useEffect, useMemo, useState } from 'react'

import { toEditableLocalizedText } from '../../admin/localized.js'
import type {
  LocalizedField,
  LocalizedText,
  PracticePrompt,
  ShortInputPrompt,
} from '../../content/types.js'
import {
  practiceFields,
  shortInputFields,
  type StructuredFieldConfig,
} from './structuredEditorConfigs.js'

type EditableLocalizedText = LocalizedText

type EditableItem<T extends { id: string }> = {
  source: T
  values: Record<string, string | EditableLocalizedText>
}

function toEditableItem<T extends { id: string }>(
  item: T,
  fields: readonly StructuredFieldConfig<T>[],
): EditableItem<T> {
  const source = item as Record<string, unknown>

  return {
    source: item,
    values: Object.fromEntries(
      fields.map((field) => [
        field.key,
        field.kind === 'localized'
          ? toEditableLocalizedText(source[field.key] as LocalizedField)
          : String(source[field.key] ?? ''),
      ]),
    ),
  }
}

function buildSavedItem<T extends { id: string }>(
  editableItem: EditableItem<T>,
  fields: readonly StructuredFieldConfig<T>[],
): T {
  const nextItem = { ...editableItem.source } as Record<string, unknown>

  fields.forEach((field) => {
    nextItem[field.key] = editableItem.values[field.key]
  })

  return nextItem as T
}

function updateEditableTextValue<T extends { id: string }>(
  items: EditableItem<T>[],
  index: number,
  key: string,
  value: string,
) {
  return items.map((item, itemIndex) =>
    itemIndex === index
      ? {
          ...item,
          values: {
            ...item.values,
            [key]: value,
          },
        }
      : item,
  )
}

function updateEditableLocalizedValue<T extends { id: string }>(
  items: EditableItem<T>[],
  index: number,
  key: string,
  locale: keyof EditableLocalizedText,
  value: string,
) {
  return items.map((item, itemIndex) => {
    if (itemIndex !== index) {
      return item
    }

    const currentValue = item.values[key] as EditableLocalizedText
    return {
      ...item,
      values: {
        ...item.values,
        [key]: {
          ...currentValue,
          [locale]: value,
        },
      },
    }
  })
}

function StructuredField<T extends { id: string }>({
  field,
  item,
  fieldLabelPrefix,
  itemIndex,
  onTextChange,
  onLocalizedChange,
}: {
  field: StructuredFieldConfig<T>
  item: EditableItem<T>
  fieldLabelPrefix?: string
  itemIndex: number
  onTextChange(index: number, key: string, value: string): void
  onLocalizedChange(index: number, key: string, locale: keyof EditableLocalizedText, value: string): void
}) {
  const labelPrefix = fieldLabelPrefix ? `${fieldLabelPrefix} ` : ''

  if (field.kind === 'localized') {
    const value = item.values[field.key] as EditableLocalizedText

    return (
      <>
        <label className="admin-field">
          <span>{labelPrefix}{field.label} (en)</span>
          {field.multiline ? (
            <textarea
              value={value.en}
              onChange={(event) => onLocalizedChange(itemIndex, field.key, 'en', event.target.value)}
            />
          ) : (
            <input
              value={value.en}
              onChange={(event) => onLocalizedChange(itemIndex, field.key, 'en', event.target.value)}
            />
          )}
        </label>
        <label className="admin-field">
          <span>{labelPrefix}{field.label} (fr)</span>
          {field.multiline ? (
            <textarea
              value={value.fr}
              onChange={(event) => onLocalizedChange(itemIndex, field.key, 'fr', event.target.value)}
            />
          ) : (
            <input
              value={value.fr}
              onChange={(event) => onLocalizedChange(itemIndex, field.key, 'fr', event.target.value)}
            />
          )}
        </label>
      </>
    )
  }

  const value = item.values[field.key] as string
  return (
    <label className={`admin-field ${field.multiline ? 'admin-field--full' : ''}`}>
      <span>{labelPrefix}{field.label}</span>
      {field.multiline ? (
        <textarea value={value} onChange={(event) => onTextChange(itemIndex, field.key, event.target.value)} />
      ) : (
        <input value={value} onChange={(event) => onTextChange(itemIndex, field.key, event.target.value)} />
      )}
    </label>
  )
}

interface StructuredListModuleEditorProps<T extends { id: string }> {
  moduleKey: string
  label: string
  description: string
  itemLabel: string
  badgeLabel: string
  saveLabel: string
  items: T[]
  fields: readonly StructuredFieldConfig<T>[]
  onSave(payload: T[]): Promise<void>
  onDirtyChange?(dirty: boolean): void
}

export function StructuredListModuleEditor<T extends { id: string }>({
  moduleKey,
  label,
  description,
  itemLabel,
  badgeLabel,
  saveLabel,
  items,
  fields,
  onSave,
  onDirtyChange,
}: StructuredListModuleEditorProps<T>) {
  const [draftItems, setDraftItems] = useState(() => items.map((item) => toEditableItem(item, fields)))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraftItems(items.map((item) => toEditableItem(item, fields)))
  }, [items, fields])

  const draftPayload = useMemo(
    () => draftItems.map((item) => buildSavedItem(item, fields)),
    [draftItems, fields],
  )

  useEffect(() => {
    onDirtyChange?.(JSON.stringify(draftPayload) !== JSON.stringify(items))
  }, [draftPayload, items, onDirtyChange])

  async function handleSave() {
    setSaving(true)
    try {
      await onSave(draftPayload)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="surface-card lesson-section-card admin-module-card" aria-label={label}>
      <div className="admin-section-heading">
        <div>
          <p className="eyebrow">Content editor</p>
          <h2>{label}</h2>
          <p className="muted-text">{description}</p>
        </div>
        <span className="badge badge--sky">{badgeLabel}</span>
      </div>
      <div className="admin-structured-list">
        {draftItems.map((item, index) => (
          <article
            key={item.source.id}
            className="admin-structured-item-card"
            data-testid={`admin-module-item-${moduleKey}-${index}`}
          >
            <div className="admin-structured-item-card__header">
              <div>
                <h3>{itemLabel} {index + 1}</h3>
                <p className="muted-text">Stable id: {item.source.id}</p>
              </div>
              <span className="badge badge--jade">Editable content</span>
            </div>
            <div className="admin-field-grid admin-field-grid--two-column">
              {fields.map((field) => (
                <StructuredField
                  key={field.key}
                  field={field}
                  item={item}
                  itemIndex={index}
                  onTextChange={(itemIndex, key, value) =>
                    setDraftItems((current) => updateEditableTextValue(current, itemIndex, key, value))
                  }
                  onLocalizedChange={(itemIndex, key, locale, value) =>
                    setDraftItems((current) => updateEditableLocalizedValue(current, itemIndex, key, locale, value))
                  }
                />
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="admin-card-actions">
        <span className="muted-text">Keep the content readable here; publish still happens from the side rail.</span>
        <button type="button" className="primary-button" onClick={handleSave} disabled={saving}>
          {saving ? `${saveLabel.replace('Save', 'Saving')}…` : saveLabel}
        </button>
      </div>
    </section>
  )
}

interface PracticeModuleEditorProps {
  practice: { listening: PracticePrompt[]; speaking: PracticePrompt[]; reading: PracticePrompt[] }
  onSave(payload: { listening: PracticePrompt[]; speaking: PracticePrompt[]; reading: PracticePrompt[] }): Promise<void>
  onDirtyChange?(dirty: boolean): void
}

const practiceSections = [
  ['listening', 'Listening'],
  ['speaking', 'Speaking'],
  ['reading', 'Reading'],
] as const

export function PracticeModuleEditor({ practice, onSave, onDirtyChange }: PracticeModuleEditorProps) {
  const [draftPractice, setDraftPractice] = useState(() => ({
    listening: practice.listening.map((item) => toEditableItem(item, practiceFields)),
    speaking: practice.speaking.map((item) => toEditableItem(item, practiceFields)),
    reading: practice.reading.map((item) => toEditableItem(item, practiceFields)),
  }))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraftPractice({
      listening: practice.listening.map((item) => toEditableItem(item, practiceFields)),
      speaking: practice.speaking.map((item) => toEditableItem(item, practiceFields)),
      reading: practice.reading.map((item) => toEditableItem(item, practiceFields)),
    })
  }, [practice])

  const draftPayload = useMemo(
    () => ({
      listening: draftPractice.listening.map((item) => buildSavedItem(item, practiceFields)),
      speaking: draftPractice.speaking.map((item) => buildSavedItem(item, practiceFields)),
      reading: draftPractice.reading.map((item) => buildSavedItem(item, practiceFields)),
    }),
    [draftPractice],
  )

  useEffect(() => {
    onDirtyChange?.(JSON.stringify(draftPayload) !== JSON.stringify(practice))
  }, [draftPayload, onDirtyChange, practice])

  async function handleSave() {
    setSaving(true)
    try {
      await onSave(draftPayload)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="surface-card lesson-section-card admin-module-card" aria-label="Practice">
      <div className="admin-section-heading">
        <div>
          <p className="eyebrow">Content editor</p>
          <h2>Practice</h2>
          <p className="muted-text">Edit listening, speaking, and reading prompts as grouped content blocks instead of raw JSON.</p>
        </div>
        <span className="badge badge--sky">Grouped practice</span>
      </div>
      <div className="admin-practice-groups">
        {practiceSections.map(([sectionKey, sectionLabel]) => (
          <article key={sectionKey} className="admin-practice-group-card">
            <div className="admin-structured-item-card__header">
              <div>
                <h3>{sectionLabel}</h3>
                <p className="muted-text">Prompts stay grouped by learner activity.</p>
              </div>
              <span className="badge badge--jade">{draftPractice[sectionKey].length} item(s)</span>
            </div>
            <div className="admin-structured-list">
              {draftPractice[sectionKey].map((item, index) => (
                <article key={item.source.id} className="admin-structured-item-card">
                  <div className="admin-structured-item-card__header">
                    <div>
                      <h4>{sectionLabel} prompt {index + 1}</h4>
                      <p className="muted-text">Stable id: {item.source.id}</p>
                    </div>
                    <span className="badge badge--sky">Prompt card</span>
                  </div>
                  <div className="admin-field-grid admin-field-grid--two-column">
                    {practiceFields.map((field) => (
                      <StructuredField
                        key={`${sectionKey}-${field.key}`}
                        field={field}
                        item={item}
                        itemIndex={index}
                        fieldLabelPrefix={sectionLabel}
                        onTextChange={(itemIndex, key, value) =>
                          setDraftPractice((current) => ({
                            ...current,
                            [sectionKey]: updateEditableTextValue(current[sectionKey], itemIndex, key, value),
                          }))
                        }
                        onLocalizedChange={(itemIndex, key, locale, value) =>
                          setDraftPractice((current) => ({
                            ...current,
                            [sectionKey]: updateEditableLocalizedValue(current[sectionKey], itemIndex, key, locale, value),
                          }))
                        }
                      />
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="admin-card-actions">
        <span className="muted-text">Practice stays split by mode, but saves as the existing module payload.</span>
        <button type="button" className="primary-button" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving practice draft…' : 'Save practice draft'}
        </button>
      </div>
    </section>
  )
}

interface ShortInputModuleEditorProps {
  prompt: ShortInputPrompt
  onSave(payload: ShortInputPrompt): Promise<void>
  onDirtyChange?(dirty: boolean): void
}

export function ShortInputModuleEditor({ prompt, onSave, onDirtyChange }: ShortInputModuleEditorProps) {
  const [draftPrompt, setDraftPrompt] = useState(() => toEditableItem(prompt, shortInputFields))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraftPrompt(toEditableItem(prompt, shortInputFields))
  }, [prompt])

  const draftPayload = useMemo(
    () => buildSavedItem(draftPrompt, shortInputFields),
    [draftPrompt],
  )

  useEffect(() => {
    onDirtyChange?.(JSON.stringify(draftPayload) !== JSON.stringify(prompt))
  }, [draftPayload, onDirtyChange, prompt])

  async function handleSave() {
    setSaving(true)
    try {
      await onSave(draftPayload)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="surface-card lesson-section-card admin-module-card" aria-label="Short Input">
      <div className="admin-section-heading">
        <div>
          <p className="eyebrow">Content editor</p>
          <h2>Short Input</h2>
          <p className="muted-text">Edit the short-answer prompt as structured content instead of a JSON object.</p>
        </div>
        <span className="badge badge--sky">Single prompt</span>
      </div>
      <div className="admin-field-grid admin-field-grid--two-column">
        {shortInputFields.map((field) => (
          <StructuredField
            key={field.key}
            field={field}
            item={draftPrompt}
            itemIndex={0}
            onTextChange={(_, key, value) =>
              setDraftPrompt((current) => ({
                ...current,
                values: {
                  ...current.values,
                  [key]: value,
                },
              }))
            }
            onLocalizedChange={(_, key, locale, value) =>
              setDraftPrompt((current) => ({
                ...current,
                values: {
                  ...current.values,
                  [key]: {
                    ...(current.values[key] as EditableLocalizedText),
                    [locale]: value,
                  },
                },
              }))
            }
          />
        ))}
      </div>
      <div className="admin-card-actions">
        <span className="muted-text">Keep the prompt human-readable while preserving the existing module payload.</span>
        <button type="button" className="primary-button" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving short input draft…' : 'Save short input draft'}
        </button>
      </div>
    </section>
  )
}
