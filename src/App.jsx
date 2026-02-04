import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import Navbar from './components/Navbar';
import Drawer from './components/Drawer';
import TaskCard from './components/TaskCard';
import StatsPanel from './components/StatsPanel';
import HistoryView from './components/HistoryView';
import FullScreenTimer from './components/FullScreenTimer';
import AddTaskModal from './components/AddTaskModal';
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
  clearHistory,
} from './db/db';
import { isNewDay, getMillisecondsUntilMidnight } from './utils/timeUtils';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [currentView, setCurrentView] = useState('tasks');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

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

      // Request notification permission
      if ('Notification' in window) {
        Notification.requestPermission();
      }
    };
    init();
  }, []);

  // Load tasks from database
  const loadTasks = async () => {
    const allTasks = await getAllTasks();
    // Sort: Pinned first, then by creation date (newest first)
    const sortedTasks = allTasks.sort((a, b) => {
      if (a.pinned === b.pinned) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return a.pinned ? -1 : 1;
    });
    setTasks(sortedTasks);

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

  // Schedule notifications for tasks with due dates
  useEffect(() => {
    tasks.forEach(task => {
      if (task.dueDate && !task.completed) {
        const dueTime = new Date(task.dueDate).getTime();
        const now = Date.now();
        const timeUntilDue = dueTime - now;

        // If due in future (within 24 hours to avoid massive timeouts)
        if (timeUntilDue > 0 && timeUntilDue < 86400000) {
          const timerId = setTimeout(() => {
            if (Notification.permission === 'granted') {
              new Notification(`Task Due: ${task.title}`, {
                body: task.description || 'It is time to work on this task!',
                icon: '/icon.png' // Ensure this exists or remove
              });
            } else {
              // Fallback to alert if no notification permission
              alert(`Task Due: ${task.title}`);
            }
          }, timeUntilDue);
          return () => clearTimeout(timerId);
        }
      }
    });
  }, [tasks]);


  // Add new task
  const handleAddTask = async (taskData) => {
    await addTask(taskData);
    await loadTasks();
  };

  // Add task from full-screen timer
  const handleQuickAddTask = async (title) => {
    if (title.trim()) {
      await addTask({ title: title.trim() });
      await loadTasks();
    }
  };

  // Toggle Pin
  const handlePinTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await updateTask(id, { pinned: !task.pinned });
      await loadTasks();
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
    // Use timeout to allow UI update before loadHistory captures changed stats if needed, 
    // though loadStats() handles today's stats.
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

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      await clearHistory();
      setHistory([]); // Immediate state update
      await loadHistory(); // Verify from DB
      await loadStats(); // Reset today's stats view if necessary
    }
  };

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'stats':
        return <StatsPanel stats={stats} />;
      case 'history':
        // Combine today's stats with historical stats for a complete view
        // Note: stats is "Today's" stats object. history is array of past stats.
        // Check if today is already in history to avoid duplication (it shouldn't be if archiveTodayAndReset works correctly)
        const todayDate = getTodayDate();
        const historyHasToday = history.some(h => h.date === todayDate);

        let fullHistory = [...history];
        if (stats && !historyHasToday && (stats.completedTasks > 0 || stats.totalFocusTime > 0)) {
          fullHistory = [stats, ...history];
        }

        return <HistoryView history={fullHistory} onClearHistory={handleClearHistory} />;
      default:
        // Tasks View
        const activeTasks = tasks.filter(t => !t.completed);

        return (
          <div className="tasks-view">
            {/* Task List */}
            <motion.div
              className="tasks-list"
              layout
            >
              <AnimatePresence mode="popLayout">
                {activeTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="empty-state"
                  >
                    <h3>No tasks yet</h3>
                    <p className="text-muted">Tap + to add a task</p>
                  </motion.div>
                ) : (
                  activeTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={handleUpdateTask}
                      onDelete={handleDeleteTask}
                      onToggleComplete={handleToggleComplete}
                      onOpenTimer={handleOpenTimer}
                      onPin={handlePinTask}
                    />
                  ))
                )}
              </AnimatePresence>
          </div>

            {/* Completed Tasks Section */ }
        {
          tasks.some(t => t.completed) && (
            <div className="completed-section">
              <h3 className="section-title">Completed</h3>
              <div className="tasks-list completed-list">
                {tasks.filter(t => t.completed).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    onToggleComplete={handleToggleComplete}
                    onOpenTimer={handleOpenTimer}
                    onPin={handlePinTask}
                  />
                ))}
              </div>
            </div>
          )
        }

        {/* FAB */ }
        <motion.div
          className="fab-container"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <button className="fab-btn" onClick={() => setIsAddTaskModalOpen(true)}>
            <Plus size={28} />
          </button>
        </motion.div>
          </div >
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

    {/* Modals & Overlays */}
    <AddTaskModal
      isOpen={isAddTaskModalOpen}
      onClose={() => setIsAddTaskModalOpen(false)}
      onSave={handleAddTask}
    />

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
