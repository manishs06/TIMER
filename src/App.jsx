import { useState, useEffect } from 'react'
import Timer from './components/Timer'
import TaskManager from './components/TaskManager'
import './index.css'

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage or default to 'dark'
    const savedTheme = localStorage.getItem('timer-theme')
    const initialTheme = savedTheme || 'dark'
    // Apply theme immediately to prevent flash
    document.documentElement.setAttribute('data-theme', initialTheme)
    return initialTheme
  })

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => {
    // Apply theme to document and save to localStorage
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('timer-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      <button 
        className="theme-toggle-btn"
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      <div className={`container ${isFullscreen ? 'fullscreen' : ''}`}>
        <div className="timer-layout">
          <Timer onFullscreenChange={setIsFullscreen} onProgressChange={setProgress} />
        </div>
        <div className="task-layout">
          <TaskManager />
        </div>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
    </>
  )
}

export default App

