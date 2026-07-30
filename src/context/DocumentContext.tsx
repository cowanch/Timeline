import { createContext, useContext, type ReactNode } from 'react'
import { useDocument } from '../hooks/useDocument'

type DocumentContextValue = ReturnType<typeof useDocument>

const DocumentContext = createContext<DocumentContextValue | null>(null)

export function DocumentProvider({ children }: { children: ReactNode }) {
  const document = useDocument()
  return (
    <DocumentContext.Provider value={document}>{children}</DocumentContext.Provider>
  )
}

export function useDocumentContext(): DocumentContextValue {
  const context = useContext(DocumentContext)
  if (!context) {
    throw new Error('useDocumentContext must be used within DocumentProvider')
  }
  return context
}
