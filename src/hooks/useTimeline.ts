import { useCallback, useEffect, useState } from 'react'
import type { EventDraft, TimelineEvent } from '../types'

const STORAGE_KEY = 'story-timeline-events'

function createId(): string {
  return crypto.randomUUID()
}

function createEvent(draft: EventDraft = { title: '', description: '' }): TimelineEvent {
  return { id: createId(), ...draft }
}

function loadEvents(): TimelineEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as TimelineEvent[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>(loadEvents)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  }, [events])

  const addEvent = useCallback((draft?: EventDraft) => {
    const event = createEvent(draft)
    setEvents((prev) => [...prev, event])
    return event.id
  }, [])

  const insertBefore = useCallback((targetId: string, draft?: EventDraft) => {
    const event = createEvent(draft)
    setEvents((prev) => {
      const index = prev.findIndex((e) => e.id === targetId)
      if (index === -1) return prev
      const next = [...prev]
      next.splice(index, 0, event)
      return next
    })
    return event.id
  }, [])

  const insertAfter = useCallback((targetId: string, draft?: EventDraft) => {
    const event = createEvent(draft)
    setEvents((prev) => {
      const index = prev.findIndex((e) => e.id === targetId)
      if (index === -1) return prev
      const next = [...prev]
      next.splice(index + 1, 0, event)
      return next
    })
    return event.id
  }, [])

  const updateEvent = useCallback((id: string, draft: EventDraft) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...draft } : e)),
    )
  }, [])

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }, [])

  return { events, addEvent, insertBefore, insertAfter, updateEvent, deleteEvent }
}
