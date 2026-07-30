import { open, save } from '@tauri-apps/plugin-dialog'
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'
import type { TimelineDocument, TimelineEvent } from '../types'
import { isTauri } from './platform'

const FILE_VERSION = 1 as const
const STORAGE_KEY = 'story-timeline-events'

const FILE_FILTERS = [
  { name: 'Story Timeline', extensions: ['timeline'] },
  { name: 'JSON', extensions: ['json'] },
]

function parseDocument(raw: string): TimelineEvent[] {
  const parsed = JSON.parse(raw) as TimelineDocument | TimelineEvent[]

  if (Array.isArray(parsed)) {
    return parsed
  }

  if (parsed && Array.isArray(parsed.events)) {
    return parsed.events
  }

  throw new Error('Invalid timeline file format.')
}

function serializeDocument(events: TimelineEvent[]): string {
  const document: TimelineDocument = {
    version: FILE_VERSION,
    events,
  }
  return JSON.stringify(document, null, 2)
}

export function loadEventsFromBrowserStorage(): TimelineEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return parseDocument(raw)
  } catch {
    return []
  }
}

export function saveEventsToBrowserStorage(events: TimelineEvent[]): void {
  localStorage.setItem(STORAGE_KEY, serializeDocument(events))
}

export async function openTimelineFile(): Promise<{
  path: string
  events: TimelineEvent[]
} | null> {
  const selected = await open({
    multiple: false,
    filters: FILE_FILTERS,
  })

  if (!selected || typeof selected !== 'string') {
    return null
  }

  const raw = await readTextFile(selected)
  return {
    path: selected,
    events: parseDocument(raw),
  }
}

export async function saveTimelineFile(
  path: string,
  events: TimelineEvent[],
): Promise<string> {
  await writeTextFile(path, serializeDocument(events))
  return path
}

export async function saveTimelineFileAs(
  events: TimelineEvent[],
  defaultPath?: string | null,
): Promise<string | null> {
  const path = await save({
    filters: FILE_FILTERS,
    defaultPath: defaultPath ?? undefined,
  })

  if (!path) {
    return null
  }

  return saveTimelineFile(path, events)
}

export async function updateWindowTitle(
  filePath: string | null,
  isDirty: boolean,
): Promise<void> {
  if (!isTauri()) return

  const { getCurrentWindow } = await import('@tauri-apps/api/window')
  const fileName = filePath ? filePath.split(/[/\\]/).pop() : 'Untitled'
  const prefix = isDirty ? '* ' : ''
  await getCurrentWindow().setTitle(`${prefix}${fileName} — Story Timeline`)
}
