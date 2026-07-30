import { DocumentProvider } from './context/DocumentContext'
import { FileToolbar } from './components/FileToolbar'
import { Timeline } from './components/Timeline'
import './App.css'

function App() {
  return (
    <DocumentProvider>
      <div className="app">
        <header className="app-header">
          <h1>Story Timeline</h1>
          <p className="app-subtitle">
            Map the events of your narrative in order
          </p>
          <FileToolbar />
        </header>
        <main>
          <Timeline />
        </main>
      </div>
    </DocumentProvider>
  )
}

export default App
