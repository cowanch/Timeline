import { useEffect, useRef } from 'react'
import type { EventDraft } from '../types'

interface EventEditorProps {
  draft: EventDraft
  onChange: (draft: EventDraft) => void
  onSave: () => void
  onCancel: () => void
  onDelete?: () => void
  isNew?: boolean
}

export function EventEditor({
  draft,
  onChange,
  onSave,
  onCancel,
  onDelete,
  isNew = false,
}: EventEditorProps) {
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave()
  }

  return (
    <form className="event-editor" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field-label">Title</span>
        <input
          ref={titleRef}
          type="text"
          value={draft.title}
          onChange={(e) => onChange({ ...draft, title: e.target.value })}
          placeholder="Event title"
        />
      </label>

      <label className="field">
        <span className="field-label">Description</span>
        <textarea
          value={draft.description}
          onChange={(e) => onChange({ ...draft, description: e.target.value })}
          placeholder="What happens in this moment?"
          rows={4}
        />
      </label>

      <div className="editor-actions">
        {onDelete && (
          <button type="button" className="btn btn-danger" onClick={onDelete}>
            Delete
          </button>
        )}
        <div className="editor-actions-right">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isNew ? 'Add Event' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  )
}
