# Fullscreen Timer & Task Manager

A beautiful, modern fullscreen timer application with integrated task manager. Perfect for presentations, meetings, workshops, and productivity tracking.

## Features

- ⏱️ **Countdown & Count Up Modes** - Switch between countdown timer and stopwatch
- ✅ **Integrated Task Manager** - Track your tasks while timing
- 🖥️ **Fullscreen Mode** - Perfect for presentations and displays
- ⌨️ **Keyboard Shortcuts** - Quick controls without using mouse
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Beautiful gradient backgrounds with smooth animations
- 📊 **Progress Bar** - Visual indicator for countdown progress
- 🔔 **Audio Alert** - Sound notification when countdown completes
- 💾 **Local Storage** - Tasks are saved automatically

## Keyboard Shortcuts

- **Space** - Start/Pause timer
- **R** - Reset timer
- **F** or **F11** - Toggle Fullscreen
- **Esc** - Exit Fullscreen
- **C** - Switch between Countdown/Count Up mode
- **?** or **H** - Show/Hide keyboard shortcuts help

## Deployment

This is a static website that can be deployed to any static hosting service.

### Option 1: GitHub Pages (Free)

1. Create a new repository on GitHub
2. Upload all files to the repository
3. Go to Settings → Pages
4. Select source branch (usually `main` or `master`)
5. Your site will be live at `https://yourusername.github.io/repository-name`

### Option 2: Netlify (Free)

1. Go to [netlify.com](https://www.netlify.com)
2. Sign up/login
3. Drag and drop your project folder or connect to Git
4. Your site will be live instantly at a `.netlify.app` URL

### Option 3: Vercel (Recommended - Fastest)

**Method 1: Deploy with Vercel CLI**
```bash
npm i -g vercel
vercel
```

**Method 2: Deploy via GitHub**
1. Push your code to GitHub
2. Go to [vercel.com](https://www.vercel.com)
3. Click "Import Project"
4. Select your repository
5. Click "Deploy" (no configuration needed!)

**Method 3: Drag & Drop**
1. Go to [vercel.com](https://www.vercel.com)
2. Sign up/login
3. Drag and drop your project folder
4. Deploy instantly

The app is already configured with `vercel.json` for optimal deployment!

### Option 4: Any Static Hosting

Upload all files to any web server. No build process required!

## Files Structure

```
TIMER/
├── index.html      # Main HTML file
├── style.css       # Styles and layout
├── script.js       # Timer and task manager functionality
├── favicon.svg     # App icon
├── vercel.json     # Vercel deployment configuration
├── package.json    # Project metadata
└── README.md       # This file
```

## Usage

1. Set the time using the hour, minute, and second inputs
2. Choose Countdown or Count Up mode
3. Click Start or press Space to begin
4. Press F or F11 for fullscreen mode
5. Use keyboard shortcuts for quick control

## Browser Support

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge
- Opera

## License

Free to use and modify for personal and commercial projects.

