import { Timeline } from './components/Timeline'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Story Timeline</h1>
        <p className="app-subtitle">
          Map the events of your narrative in order
        </p>
      </header>
      <main>
        <Timeline />
      </main>
    </div>
  )
}

export default App
