import { useState } from 'react'
import type { EventDraft } from '../types'
import { useDocumentContext } from '../context/DocumentContext'
import { EventEditor } from './EventEditor'
import { TimelineEventCard } from './TimelineEventCard'

export function Timeline() {
  const {
    events,
    addEvent,
    insertBefore,
    insertAfter,
    updateEvent,
    deleteEvent,
  } = useDocumentContext()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newEventDraft, setNewEventDraft] = useState<EventDraft | null>(null)

  const startInsertBefore = (targetId: string) => {
    const id = insertBefore(targetId)
    setEditingId(id)
  }

  const startInsertAfter = (targetId: string) => {
    const id = insertAfter(targetId)
    setEditingId(id)
  }

  const handleAddFirst = () => {
    setNewEventDraft({ title: '', description: '' })
  }

  const handleAddEnd = () => {
    const id = addEvent()
    setEditingId(id)
  }

  const handleSaveNew = () => {
    if (newEventDraft) {
      addEvent(newEventDraft)
      setNewEventDraft(null)
    }
  }

  return (
    <div className="timeline">
      {events.length === 0 && !newEventDraft ? (
        <div className="empty-state">
          <p className="empty-state-text">
            Your story timeline is empty. Add your first event to begin mapping out
            your narrative.
          </p>
          <button type="button" className="btn btn-primary" onClick={handleAddFirst}>
            Add First Event
          </button>
        </div>
      ) : (
        <>
          <div className="timeline-list">
            {newEventDraft && (
              <div className="timeline-item timeline-item-new">
                <div className="timeline-marker">
                  <span className="timeline-dot timeline-dot-new" />
                  {events.length > 0 && <span className="timeline-line" />}
                </div>
                <div className="timeline-content">
                  <EventEditor
                    draft={newEventDraft}
                    onChange={setNewEventDraft}
                    onSave={handleSaveNew}
                    onCancel={() => setNewEventDraft(null)}
                    isNew
                  />
                </div>
              </div>
            )}

            {events.map((event, index) => (
              <TimelineEventCard
                key={event.id}
                event={event}
                index={index}
                isLast={index === events.length - 1}
                onUpdate={updateEvent}
                onDelete={deleteEvent}
                onInsertBefore={startInsertBefore}
                onInsertAfter={startInsertAfter}
                editingId={editingId}
                onStartEdit={setEditingId}
                onStopEdit={() => setEditingId(null)}
              />
            ))}
          </div>

          {events.length > 0 && (
            <div className="timeline-footer">
              <button type="button" className="btn btn-secondary" onClick={handleAddEnd}>
                Add Event at End
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
