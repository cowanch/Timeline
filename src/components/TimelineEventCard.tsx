import { useState } from 'react'
import type { EventDraft, TimelineEvent } from '../types'
import { EventEditor } from './EventEditor'

interface TimelineEventCardProps {
  event: TimelineEvent
  index: number
  isLast: boolean
  onUpdate: (id: string, draft: EventDraft) => void
  onDelete: (id: string) => void
  onInsertBefore: (id: string) => void
  onInsertAfter: (id: string) => void
  editingId: string | null
  onStartEdit: (id: string) => void
  onStopEdit: () => void
}

export function TimelineEventCard({
  event,
  index,
  isLast,
  onUpdate,
  onDelete,
  onInsertBefore,
  onInsertAfter,
  editingId,
  onStartEdit,
  onStopEdit,
}: TimelineEventCardProps) {
  const [draft, setDraft] = useState<EventDraft>({
    title: event.title,
    description: event.description,
  })

  const isEditing = editingId === event.id

  const handleSave = () => {
    onUpdate(event.id, draft)
    onStopEdit()
  }

  const handleCancel = () => {
    setDraft({ title: event.title, description: event.description })
    onStopEdit()
  }

  const handleDelete = () => {
    onDelete(event.id)
    onStopEdit()
  }

  return (
    <div className="timeline-item">
      <div className="timeline-marker">
        <span className="timeline-dot" />
        {!isLast && <span className="timeline-line" />}
      </div>

      <div className="timeline-content">
        <div className="timeline-meta">
          <span className="event-number">Event {index + 1}</span>
        </div>

        {isEditing ? (
          <EventEditor
            draft={draft}
            onChange={setDraft}
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={handleDelete}
          />
        ) : (
          <article className="event-card">
            <h3 className="event-title">
              {event.title || <span className="placeholder">Untitled event</span>}
            </h3>
            {event.description && (
              <p className="event-description">{event.description}</p>
            )}

            <div className="event-actions">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => onInsertBefore(event.id)}
              >
                + Before
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => onInsertAfter(event.id)}
              >
                + After
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setDraft({ title: event.title, description: event.description })
                  onStartEdit(event.id)
                }}
              >
                Edit
              </button>
            </div>
          </article>
        )}
      </div>
    </div>
  )
}
