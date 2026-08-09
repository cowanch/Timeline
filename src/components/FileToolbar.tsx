import { useDocumentContext } from '../context/DocumentContext'

function fileLabel(filePath: string | null, isDirty: boolean): string {
  const name = filePath?.split(/[/\\]/).pop() ?? 'Untitled'
  return isDirty ? `${name} *` : name
}

export function FileToolbar() {
  const {
    filePath,
    isDirty,
    isDesktop,
    newDocument,
    openDocument,
    saveDocument,
    saveDocumentAs,
  } = useDocumentContext()

  if (!isDesktop) {
    return null
  }

  return (
    <div className="file-toolbar">
      <div className="file-actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={newDocument}>
          New
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            void openDocument()
          }}
        >
          Open
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            void saveDocument()
          }}
        >
          Save
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            void saveDocumentAs()
          }}
        >
          Save As
        </button>
      </div>
      <span className="file-label">{fileLabel(filePath, isDirty)}</span>
    </div>
  )
}
