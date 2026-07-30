# Story Timeline

A visual timeline editor for writers to map out the events of their story in chronological order. Runs as a **desktop app** (via Tauri) or in the browser for development.

## Features

- **Add events** — Start with your first event or append to the end of the timeline
- **Edit title & description** — Click Edit on any event to update its details
- **Insert before / after** — Add new events at any position in the sequence
- **Save & open files** — Desktop app saves `.timeline` documents to disk (like Word)
- **Native File menu** — New, Open, Save, Save As from the menu bar

## Desktop app (recommended)

Requires [Rust](https://rustup.rs/) installed on your machine.

```bash
npm install
npm run tauri:dev
```

This opens Story Timeline in its own window with file save/open support.

### Build a Windows installer

```bash
npm run tauri:build
```

The installer and `.exe` will be in `src-tauri/target/release/bundle/`.

## Web dev mode

For quick UI development without the desktop shell:

```bash
npm run dev
```

In browser mode, timelines auto-save to localStorage instead of files.

## File format

Timelines are saved as JSON with a `.timeline` extension:

```json
{
  "version": 1,
  "events": [
    {
      "id": "...",
      "title": "The Discovery",
      "description": "Maya finds the ancient map..."
    }
  ]
}
```
