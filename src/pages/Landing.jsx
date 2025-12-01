import { Link } from 'react-router-dom'
import './Landing.css'

function Landing() {
  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">⏱️ Timer</div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <Link to="/app" className="btn btn-nav">Use Timer</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Fullscreen Timer with Task Manager</h1>
          <p className="hero-subtitle">
            A simple, beautiful timer app with integrated task manager. Perfect for studying, productivity, and time tracking. Countdown timer, stopwatch, and task management in one place.
          </p>
          <div className="hero-buttons">
            <Link to="/app" className="btn btn-primary btn-large">Use Timer</Link>
            <a href="#features" className="btn btn-secondary btn-large">Learn More</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Everything You Need to Stay Focused</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Smart Timer</h3>
            <p>Countdown timer and stopwatch modes for any workflow</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Study Timer</h3>
            <p>Perfect study timer for students. Track study sessions, take breaks, and maintain focus with our dedicated study timer</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Task Manager</h3>
            <p>Integrated task manager to keep track of tasks alongside your timer sessions. Perfect study timer with task tracking</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🖥️</div>
            <h3>Fullscreen Timer Mode</h3>
            <p>Perfect fullscreen timer for presentations, meetings, and distraction-free focus sessions</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⌨️</div>
            <h3>Keyboard Shortcuts</h3>
            <p>Control everything quickly without touching the mouse</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Fullscreen Timer</h3>
            <p>Fullscreen timer mode for maximum focus. Ideal for study sessions, presentations, and productivity work</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Start Using the Timer</h2>
        <p>Simple, free, and ready to use. No signup required.</p>
        <Link to="/app" className="btn btn-primary btn-large">Use Timer Now</Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <Link to="/app">Use Timer</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Timer App. Free to use.</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing

