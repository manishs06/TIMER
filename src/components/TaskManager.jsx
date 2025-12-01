import { useState, useEffect } from 'react'

function TaskManager() {
  const [tasks, setTasks] = useState([])
  const [taskInput, setTaskInput] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    loadTasksFromStorage()
  }, [])

  const loadTasksFromStorage = () => {
    try {
      const raw = localStorage.getItem('fullscreen-timer-tasks')
      if (raw) {
        setTasks(JSON.parse(raw))
      }
    } catch (e) {
      setTasks([])
    }
  }

  const saveTasksToStorage = (newTasks) => {
    try {
      localStorage.setItem('fullscreen-timer-tasks', JSON.stringify(newTasks))
    } catch (e) {
      console.warn('Unable to save tasks', e)
    }
  }

  const handleAddTask = () => {
    const text = taskInput.trim()
    if (!text) return

    const newTask = {
      id: Date.now().toString(),
      text,
      completed: false
    }
    
    const updatedTasks = [newTask, ...tasks]
    setTasks(updatedTasks)
    saveTasksToStorage(updatedTasks)
    setTaskInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTask()
    }
  }

  const toggleTaskCompleted = (id) => {
    const updatedTasks = tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    )
    setTasks(updatedTasks)
    saveTasksToStorage(updatedTasks)
  }

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(t => t.id !== id)
    setTasks(updatedTasks)
    saveTasksToStorage(updatedTasks)
  }

  const clearCompletedTasks = () => {
    const updatedTasks = tasks.filter(t => !t.completed)
    setTasks(updatedTasks)
    saveTasksToStorage(updatedTasks)
  }

  const visibleTasks = tasks.filter(t => {
    if (activeFilter === 'active') return !t.completed
    if (activeFilter === 'completed') return t.completed
    return true
  })

  const total = tasks.length
  const completed = tasks.filter(t => t.completed).length
  const taskSummary = total === 0
    ? 'No tasks'
    : `${completed}/${total} completed`

  return (
    <div className="task-layout">
      <div className="task-header">
        <h2>Tasks</h2>
        <span className="task-summary">{taskSummary}</span>
      </div>
      
      <div className="task-input-row">
        <input
          type="text"
          className="task-input"
          placeholder="Add a task and press Enter"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-task" onClick={handleAddTask}>Add</button>
      </div>
      
      <div className="task-filters">
        <button
          className={`task-filter ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button
          className={`task-filter ${activeFilter === 'active' ? 'active' : ''}`}
          onClick={() => setActiveFilter('active')}
        >
          Active
        </button>
        <button
          className={`task-filter ${activeFilter === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveFilter('completed')}
        >
          Completed
        </button>
        <button
          className="task-filter task-clear"
          onClick={clearCompletedTasks}
        >
          Clear Completed
        </button>
      </div>
      
      <ul className="task-list">
        {visibleTasks.length === 0 ? (
          <li style={{ padding: '20px', textAlign: 'center', opacity: 0.6 }}>
            No tasks
          </li>
        ) : (
          visibleTasks.map(task => (
            <li key={task.id} className="task-item">
              <div className="task-main">
                <input
                  type="checkbox"
                  className="task-checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompleted(task.id)}
                />
                <div className={`task-text ${task.completed ? 'completed' : ''}`}>
                  {task.text}
                </div>
              </div>
              <button
                className="task-delete"
                onClick={() => deleteTask(task.id)}
                title="Delete task"
              >
                ✕
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default TaskManager

