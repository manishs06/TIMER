import { useState, useEffect, useRef } from 'react'

function Timer({ onFullscreenChange, onProgressChange }) {
  const [mode, setMode] = useState('countdown')
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  
  const intervalRef = useRef(null)


  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement
      setIsFullscreen(isFs)
      onFullscreenChange?.(isFs)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [onFullscreenChange])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (mode === 'countdown') {
            if (prev <= 1) {
              handleComplete()
              return 0
            }
            return prev - 1
          } else {
            return prev + 1
          }
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, mode])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInputFocused = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
      
      if (e.code === 'Escape' && document.fullscreenElement) {
        e.preventDefault()
        toggleFullscreen()
        return
      }

      if (isInputFocused && e.code !== 'Escape') return

      if (e.code === 'Space' && !isInputFocused) {
        e.preventDefault()
        if (isRunning) pause()
        else start()
      } else if (e.code === 'KeyR' && !isInputFocused) {
        e.preventDefault()
        reset()
      } else if ((e.code === 'KeyF' || e.code === 'F11') && !isInputFocused) {
        e.preventDefault()
        toggleFullscreen()
      } else if (e.code === 'KeyC' && !isInputFocused) {
        e.preventDefault()
        handleModeSwitch()
      } else if (((e.code === 'Slash' && e.shiftKey) || e.code === 'KeyH') && !isInputFocused) {
        e.preventDefault()
        setShowHelp(!showHelp)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isRunning, showHelp])

  const handleModeSwitch = () => {
    if (isRunning) return
    setMode(prev => prev === 'countdown' ? 'countup' : 'countdown')
    reset()
  }

  const start = () => {
    if (mode === 'countdown') {
      if (!isPaused) {
        const total = hours * 3600 + minutes * 60 + seconds
        if (total === 0) {
          alert('Please set a time first!')
          return
        }
        setTotalSeconds(total)
        setRemainingSeconds(total)
      }
    } else {
      if (!isPaused) {
        setRemainingSeconds(0)
        setTotalSeconds(0)
      }
    }
    setIsRunning(true)
    setIsPaused(false)
  }

  const pause = () => {
    setIsRunning(false)
    setIsPaused(true)
  }

  const reset = () => {
    setIsRunning(false)
    setIsPaused(false)
    if (mode === 'countdown') {
      const total = hours * 3600 + minutes * 60 + seconds
      setTotalSeconds(total)
      setRemainingSeconds(total)
    } else {
      setRemainingSeconds(0)
      setTotalSeconds(0)
    }
  }

  const handleComplete = () => {
    pause()
    document.body.style.animation = 'flash 0.5s ease 5'
    playSound()
    setTimeout(() => {
      document.body.style.animation = ''
    }, 2500)
  }

  const playSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen().catch(err => {
        console.log(`Error attempting to exit fullscreen: ${err.message}`)
      })
    }
  }

  const formatTime = (totalSecs) => {
    const h = Math.floor(Math.abs(totalSecs) / 3600)
    const m = Math.floor((Math.abs(totalSecs) % 3600) / 60)
    const s = Math.abs(totalSecs) % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const progress = mode === 'countdown' && totalSeconds > 0
    ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100
    : 0

  useEffect(() => {
    onProgressChange?.(progress)
  }, [progress, onProgressChange])

  return (
    <>
      <div className="timer-display">
        <div className="time">{formatTime(remainingSeconds)}</div>
      </div>
      
      <div className="controls">
        <div className="time-input">
          <input
            type="number"
            id="hours"
            min="0"
            max="23"
            value={hours}
            onChange={(e) => setHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
            placeholder="00"
            disabled={isRunning}
          />
          <span>:</span>
          <input
            type="number"
            id="minutes"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
            placeholder="00"
            disabled={isRunning}
          />
          <span>:</span>
          <input
            type="number"
            id="seconds"
            min="0"
            max="59"
            value={seconds}
            onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
            placeholder="00"
            disabled={isRunning}
          />
        </div>
        
        <div className="buttons">
          {!isRunning ? (
            <button className="btn btn-start" onClick={start}>Start</button>
          ) : (
            <button className="btn btn-pause" onClick={pause}>Pause</button>
          )}
          <button className="btn btn-reset" onClick={reset}>Reset</button>
        </div>
        
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === 'countdown' ? 'active' : ''}`}
            onClick={() => handleModeSwitch()}
            disabled={isRunning}
          >
            Countdown
          </button>
          <button
            className={`mode-btn ${mode === 'countup' ? 'active' : ''}`}
            onClick={() => handleModeSwitch()}
            disabled={isRunning}
          >
            Count Up
          </button>
        </div>
        
        <button className="btn btn-fullscreen" onClick={toggleFullscreen}>
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
        
        <div className="shortcuts-help">
          <button
            className="btn-help"
            onClick={() => setShowHelp(!showHelp)}
            title="Keyboard Shortcuts"
          >
            ?
          </button>
          {showHelp && (
            <div className="shortcuts-list">
              <h3>Keyboard Shortcuts</h3>
              <div className="shortcut-item"><kbd>Space</kbd> Start/Pause</div>
              <div className="shortcut-item"><kbd>R</kbd> Reset</div>
              <div className="shortcut-item"><kbd>F</kbd> or <kbd>F11</kbd> Fullscreen</div>
              <div className="shortcut-item"><kbd>Esc</kbd> Exit Fullscreen</div>
              <div className="shortcut-item"><kbd>C</kbd> Switch Mode</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Timer

