import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Square, CheckCircle, Plus } from 'lucide-react';
import { formatTime, getElapsedTime } from '../utils/timeUtils';
import './FullScreenTimer.css';

const FullScreenTimer = ({
    task,
    onPause,
    onResume,
    onStop,
    onComplete,
    onClose,
    onAddTask
}) => {
    const [displayTime, setDisplayTime] = useState(0);
    const [showAddTask, setShowAddTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    // Update display time
    useEffect(() => {
        let time = task.totalTime || 0;
        if (task.isTimerRunning && task.currentSessionStart) {
            time += getElapsedTime(task.currentSessionStart);
        }
        setDisplayTime(time);

        // Update every second if running
        if (task.isTimerRunning) {
            const interval = setInterval(() => {
                const elapsed = getElapsedTime(task.currentSessionStart);
                setDisplayTime(task.totalTime + elapsed);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [task.isTimerRunning, task.currentSessionStart, task.totalTime]);

    const handlePlayPause = () => {
        if (task.isTimerRunning) {
            onPause();
        } else {
            onResume();
        }
    };

    const handleQuickAdd = (e) => {
        if (e.key === 'Enter' && newTaskTitle.trim()) {
            onAddTask(newTaskTitle.trim());
            setNewTaskTitle('');
        }
    };

    const handleCompleteClick = () => {
        onComplete();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fullscreen-timer-overlay"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fullscreen-timer-container"
                >
                    {/* Header */}
                    <div className="fullscreen-timer-header">
                        <h2 className="fullscreen-timer-task-title">{task.title}</h2>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="fullscreen-timer-close"
                            aria-label="Close timer"
                        >
                            <X size={28} />
                        </motion.button>
                    </div>

                    {/* Timer Display */}
                    <div className="fullscreen-timer-display-section">
                        <motion.div
                            animate={task.isTimerRunning ? { scale: [1, 1.02, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="fullscreen-timer-display"
                        >
                            {formatTime(displayTime)}
                        </motion.div>

                        {task.description && (
                            <p className="fullscreen-timer-description">{task.description}</p>
                        )}
                    </div>

                    {/* Control Buttons */}
                    <div className="fullscreen-timer-controls">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handlePlayPause}
                            className={`fullscreen-timer-btn ${task.isTimerRunning ? 'btn-pause' : 'btn-play'}`}
                        >
                            {task.isTimerRunning ? (
                                <>
                                    <Pause size={24} />
                                    <span>Pause</span>
                                </>
                            ) : (
                                <>
                                    <Play size={24} />
                                    <span>Resume</span>
                                </>
                            )}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onStop}
                            className="fullscreen-timer-btn btn-stop"
                        >
                            <Square size={24} />
                            <span>Stop</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCompleteClick}
                            className="fullscreen-timer-btn btn-complete"
                        >
                            <CheckCircle size={24} />
                            <span>Complete</span>
                        </motion.button>
                    </div>

                    {/* Quick Add Task */}
                    <div className="fullscreen-timer-add-section">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowAddTask(!showAddTask)}
                            className="fullscreen-timer-add-toggle"
                        >
                            <Plus size={20} />
                            <span>Add New Task</span>
                        </motion.button>

                        <AnimatePresence>
                            {showAddTask && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="fullscreen-timer-add-input-wrapper"
                                >
                                    <input
                                        type="text"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        onKeyPress={handleQuickAdd}
                                        placeholder="Quick add task... (press Enter)"
                                        className="fullscreen-timer-add-input"
                                        autoFocus
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Subtle hint */}
                    <p className="fullscreen-timer-hint">
                        Timer continues running even when this view is closed
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FullScreenTimer;
