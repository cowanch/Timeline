import type { TimelineEvent } from '../types'

interface TimelineEventCardProps {
  event: TimelineEvent,
  handleRef: (node: HTMLElement | null) => void,
  isDragging?: boolean,
  onBeforeClicked: () => void,
  onAfterClicked: () => void,
  onEditClicked: () => void,
}

export function TimelineEventCard({
  event,
  handleRef,
  isDragging = false,
  onBeforeClicked,
  onAfterClicked,
  onEditClicked,
}: TimelineEventCardProps) {
  return (
    <article className="event-card" style={{ opacity: isDragging ? 0.25 : 1 }}>
      <div className="event-header">
        <h3 className="event-title">
          {event.title || <span className="placeholder">Untitled event</span>}
        </h3>
        <button ref={handleRef} className="btn btn-ghost btn-sm drag-handle"/>
      </div>
      {event.description && (
        <p className="event-description">{event.description}</p>
      )}

      <div className="event-actions">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onBeforeClicked}
        >
          + Before
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onAfterClicked}
        >
          + After
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onEditClicked}
        >
          Edit
        </button>
      </div>
    </article>
  )
}
