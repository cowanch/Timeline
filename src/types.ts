export interface TimelineEvent {
  id: string
  title: string
  description: string
}

export interface EventDraft {
  title: string
  description: string
}

export interface TimelineDocument {
  version: 1
  events: TimelineEvent[]
}
