import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import Navbar from './components/Navbar';
import Drawer from './components/Drawer';
import TaskCard from './components/TaskCard';
import StatsPanel from './components/StatsPanel';
import HistoryView from './components/HistoryView';
import FullScreenTimer from './components/FullScreenTimer';
import {
  initDB,
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
  startTimer,
  pauseTimer,
  stopTimer,
  toggleTaskComplete,
  calculateDailyStats,
  getAllStats,
  archiveTodayAndReset,
  getTodayDate,
  getTask,
} from './db/db';
import { isNewDay, getMillisecondsUntilMidnight } from './utils/timeUtils';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [currentView, setCurrentView] = useState('tasks');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [lastCheckDate, setLastCheckDate] = useState(getTodayDate());

  // Full-screen timer state
  const [activeTimerTaskId, setActiveTimerTaskId] = useState(null);
  const [showFullScreenTimer, setShowFullScreenTimer] = useState(false);
  const [activeTimerTask, setActiveTimerTask] = useState(null);

  // Initialize database
  useEffect(() => {
    const init = async () => {
      await initDB();
      await loadTasks();
      await loadStats();
      await loadHistory();
    };
    init();
  }, []);

  // Load tasks from database
  const loadTasks = async () => {
    const allTasks = await getAllTasks();
    setTasks(allTasks);

    // Update active timer task if it's open
    if (activeTimerTaskId) {
      const task = allTasks.find(t => t.id === activeTimerTaskId);
      if (task) {
        setActiveTimerTask(task);
      }
    }
  };

  // Load current stats
  const loadStats = async () => {
    const currentStats = await calculateDailyStats();
    setStats(currentStats);
  };

  // Load history
  const loadHistory = async () => {
    const allHistory = await getAllStats();
    setHistory(allHistory);
  };

  // Check for midnight reset
  useEffect(() => {
    const checkMidnight = async () => {
      if (isNewDay(lastCheckDate)) {
        await archiveTodayAndReset();
        await loadTasks();
        await loadStats();
        await loadHistory();
        setLastCheckDate(getTodayDate());
      }
    };

    checkMidnight();
    const interval = setInterval(checkMidnight, 60000);
    const msUntilMidnight = getMillisecondsUntilMidnight();
    const midnightTimeout = setTimeout(async () => {
      await checkMidnight();
      const dailyInterval = setInterval(checkMidnight, 86400000);
      return () => clearInterval(dailyInterval);
    }, msUntilMidnight);

    return () => {
      clearInterval(interval);
      clearTimeout(midnightTimeout);
    };
  }, [lastCheckDate]);

  // Refresh stats and tasks periodically when timers are running
  useEffect(() => {
    const hasRunningTimer = tasks.some(task => task.isTimerRunning);
    if (hasRunningTimer) {
      const interval = setInterval(async () => {
        await loadTasks();
        await loadStats();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [tasks, activeTimerTaskId]);

  // Add new task
  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      await addTask({ title: newTaskTitle.trim() });
      setNewTaskTitle('');
      await loadTasks();
    }
  };

  // Add task from full-screen timer
  const handleQuickAddTask = async (title) => {
    if (title.trim()) {
      await addTask({ title: title.trim() });
      await loadTasks();
    }
  };

  // Handle Enter key in input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  // Update task
  const handleUpdateTask = async (id, updates) => {
    await updateTask(id, updates);
    await loadTasks();
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    await loadTasks();
    await loadStats();
  };

  // Toggle task completion
  const handleToggleComplete = async (id) => {
    await toggleTaskComplete(id);
    await loadTasks();
    await loadStats();
  };

  // Open full-screen timer
  const handleOpenTimer = async (id) => {
    const task = await getTask(id);
    if (task) {
      // Start timer if not already running
      if (!task.isTimerRunning) {
        await startTimer(id);
        await loadTasks();
        const updatedTask = await getTask(id);
        setActiveTimerTask(updatedTask);
      } else {
        setActiveTimerTask(task);
      }
      setActiveTimerTaskId(id);
      setShowFullScreenTimer(true);
    }
  };

  // Close full-screen timer (timer keeps running)
  const handleCloseTimer = () => {
    setShowFullScreenTimer(false);
    setActiveTimerTask(null);
    setActiveTimerTaskId(null);
  };

  // Timer controls from full-screen view
  const handleTimerPause = async () => {
    if (activeTimerTaskId) {
      await pauseTimer(activeTimerTaskId);
      await loadTasks();
      const task = await getTask(activeTimerTaskId);
      setActiveTimerTask(task);
    }
  };

  const handleTimerResume = async () => {
    if (activeTimerTaskId) {
      await startTimer(activeTimerTaskId);
      await loadTasks();
      const task = await getTask(activeTimerTaskId);
      setActiveTimerTask(task);
    }
  };

  const handleTimerStop = async () => {
    if (activeTimerTaskId) {
      await stopTimer(activeTimerTaskId);
      await loadTasks();
      await loadStats();
      handleCloseTimer();
    }
  };

  const handleCompleteFromTimer = async () => {
    if (activeTimerTaskId) {
      await toggleTaskComplete(activeTimerTaskId);
      await loadTasks();
      await loadStats();
      handleCloseTimer();
    }
  };

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'stats':
        return <StatsPanel stats={stats} />;
      case 'history':
        return <HistoryView history={history} />;
      default:
        return (
          <div className="tasks-view">
            {/* Add Task Input */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="add-task-section"
            >
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What needs to be done?"
                className="add-task-input"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddTask}
                className="btn btn-primary add-task-btn"
                disabled={!newTaskTitle.trim()}
              >
                <Plus size={20} />
                Add Task
              </motion.button>
            </motion.div>

            {/* Task List */}
            <div className="tasks-list">
              <AnimatePresence mode="popLayout">
                {tasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="empty-state"
                  >
                    <h3>No tasks yet</h3>
                    <p className="text-muted">Add your first task to get started!</p>
                  </motion.div>
                ) : (
                  tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={handleUpdateTask}
                      onDelete={handleDeleteTask}
                      onToggleComplete={handleToggleComplete}
                      onOpenTimer={handleOpenTimer}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Navbar
        onMenuToggle={() => setIsDrawerOpen(!isDrawerOpen)}
        isMenuOpen={isDrawerOpen}
      />

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
      />

      <main className="main-content">
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Full-Screen Timer */}
      <AnimatePresence>
        {showFullScreenTimer && activeTimerTask && (
          <FullScreenTimer
            task={activeTimerTask}
            onPause={handleTimerPause}
            onResume={handleTimerResume}
            onStop={handleTimerStop}
            onComplete={handleCompleteFromTimer}
            onClose={handleCloseTimer}
            onAddTask={handleQuickAddTask}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
