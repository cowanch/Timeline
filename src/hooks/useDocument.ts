import { useCallback, useEffect, useRef, useState } from 'react'
import { listen } from '@tauri-apps/api/event'
import type { EventDraft, TimelineEvent } from '../types'
import {
  loadEventsFromBrowserStorage,
  openTimelineFile,
  saveEventsToBrowserStorage,
  saveTimelineFile,
  saveTimelineFileAs,
  updateWindowTitle,
} from '../lib/documentFile'
import { isTauri } from '../lib/platform'

function createId(): string {
  return crypto.randomUUID()
}

function createEvent(draft: EventDraft = { title: '', description: '' }): TimelineEvent {
  return { id: createId(), ...draft }
}

export function useDocument() {
  const [events, setEvents] = useState<TimelineEvent[]>(() =>
    isTauri() ? [] : loadEventsFromBrowserStorage(),
  )
  const [filePath, setFilePath] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const eventsRef = useRef(events)
  const filePathRef = useRef(filePath)
  const isDirtyRef = useRef(isDirty)

  eventsRef.current = events
  filePathRef.current = filePath
  isDirtyRef.current = isDirty

  const markDirty = useCallback(() => {
    setIsDirty(true)
  }, [])

  useEffect(() => {
    if (!isTauri()) {
      saveEventsToBrowserStorage(events)
    }
  }, [events])

  useEffect(() => {
    void updateWindowTitle(filePath, isDirty)
  }, [filePath, isDirty])

  const newDocument = useCallback(() => {
    setEvents([])
    setFilePath(null)
    setIsDirty(false)
  }, [])

  const openDocument = useCallback(async () => {
    if (!isTauri()) return false

    const opened = await openTimelineFile()
    if (!opened) return false

    setEvents(opened.events)
    setFilePath(opened.path)
    setIsDirty(false)
    return true
  }, [])

  const saveDocument = useCallback(async () => {
    if (!isTauri()) return false

    if (filePathRef.current) {
      await saveTimelineFile(filePathRef.current, eventsRef.current)
      setIsDirty(false)
      return true
    }

    const savedPath = await saveTimelineFileAs(eventsRef.current)
    if (!savedPath) return false

    setFilePath(savedPath)
    setIsDirty(false)
    return true
  }, [])

  const saveDocumentAs = useCallback(async () => {
    if (!isTauri()) return false

    const savedPath = await saveTimelineFileAs(
      eventsRef.current,
      filePathRef.current,
    )
    if (!savedPath) return false

    setFilePath(savedPath)
    setIsDirty(false)
    return true
  }, [])

  useEffect(() => {
    if (!isTauri()) return

    const unlisten = Promise.all([
      listen('document-new', () => newDocument()),
      listen('document-open', () => {
        void openDocument()
      }),
      listen('document-save', () => {
        void saveDocument()
      }),
      listen('document-save-as', () => {
        void saveDocumentAs()
      }),
    ])

    return () => {
      void unlisten.then((handlers) => {
        handlers.forEach((unlistenHandler) => unlistenHandler())
      })
    }
  }, [newDocument, openDocument, saveDocument, saveDocumentAs])

  const addEvent = useCallback(
    (draft?: EventDraft) => {
      const event = createEvent(draft)
      setEvents((prev) => [...prev, event])
      markDirty()
      return event.id
    },
    [markDirty],
  )

  const insertBefore = useCallback(
    (targetId: string, draft?: EventDraft) => {
      const event = createEvent(draft)
      setEvents((prev) => {
        const index = prev.findIndex((e) => e.id === targetId)
        if (index === -1) return prev
        const next = [...prev]
        next.splice(index, 0, event)
        return next
      })
      markDirty()
      return event.id
    },
    [markDirty],
  )

  const insertAfter = useCallback(
    (targetId: string, draft?: EventDraft) => {
      const event = createEvent(draft)
      setEvents((prev) => {
        const index = prev.findIndex((e) => e.id === targetId)
        if (index === -1) return prev
        const next = [...prev]
        next.splice(index + 1, 0, event)
        return next
      })
      markDirty()
      return event.id
    },
    [markDirty],
  )

  const updateEvent = useCallback(
    (id: string, draft: EventDraft) => {
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...draft } : e)),
      )
      markDirty()
    },
    [markDirty],
  )

  const deleteEvent = useCallback(
    (id: string) => {
      setEvents((prev) => prev.filter((e) => e.id !== id))
      markDirty()
    },
    [markDirty],
  )

  const moveEvents = useCallback(
    (fromIndex: number, toIndex: number) => {
      setEvents((prev) => {
        const next = [...prev]
        const [moved] = next.splice(fromIndex, 1)
        next.splice(toIndex, 0, moved)
        return next
      });
      markDirty()
    },
    [markDirty],
  )

  return {
    events,
    filePath,
    isDirty,
    isDesktop: isTauri(),
    newDocument,
    openDocument,
    saveDocument,
    saveDocumentAs,
    addEvent,
    insertBefore,
    insertAfter,
    updateEvent,
    deleteEvent,
    moveEvents,
  }
}
