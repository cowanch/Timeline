import { useState } from 'react';
import type { EventDraft, TimelineEvent } from '../types';
import { EventEditor } from './EventEditor';
import { useSortable } from '@dnd-kit/react/sortable';
import { TimelineEventCard } from './TimelineEventCard';

interface TimelineItemProps {
  event: TimelineEvent
  index: number
  onUpdate: (id: string, draft: EventDraft) => void
  onDelete: (id: string) => void
  onInsertBefore: (id: string) => void
  onInsertAfter: (id: string) => void
  editingId: string | null
  onStartEdit: (id: string) => void
  onStopEdit: () => void
}

export function TimelineItem({
  event,
  index,
  onUpdate,
  onDelete,
  onInsertBefore,
  onInsertAfter,
  editingId,
  onStartEdit,
  onStopEdit,
}: TimelineItemProps) {
  const [draft, setDraft] = useState<EventDraft>({
    title: event.title,
    description: event.description,
  });

  const { ref, handleRef, isDragging } = useSortable({id: event.id, index});

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
    <div className="timeline-item" ref={ref}>
      <div className="timeline-marker">
        <span className="timeline-dot" />
        <span className="timeline-line" />
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
          <TimelineEventCard
            event={event}
            handleRef={handleRef}
            isDragging={isDragging}
            onBeforeClicked={() => onInsertBefore(event.id)}
            onAfterClicked={() => onInsertAfter(event.id)}
            onEditClicked={() => {
              setDraft({ title: event.title, description: event.description })
              onStartEdit(event.id)
            }}
          />
        )}
      </div>
    </div>
  )
}
