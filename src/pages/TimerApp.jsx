import { useState, useEffect } from 'react'
import Timer from '../components/Timer'
import TaskManager from '../components/TaskManager'
import '../index.css'

function TimerApp() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <>
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

export default TimerApp

