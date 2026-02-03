import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, Edit2, X, Save, Timer as TimerIcon } from 'lucide-react';
import { formatTime } from '../utils/timeUtils';
import './TaskCard.css';

const TaskCard = ({ task, onUpdate, onDelete, onToggleComplete, onOpenTimer }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDescription, setEditedDescription] = useState(task.description);

    const handleSave = () => {
        if (editedTitle.trim()) {
            onUpdate(task.id, {
                title: editedTitle.trim(),
                description: editedDescription.trim(),
            });
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditedTitle(task.title);
        setEditedDescription(task.description);
        setIsEditing(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={`task-card ${task.completed ? 'completed' : ''} ${task.isTimerRunning ? 'timer-running' : ''}`}
        >
            {/* Running indicator */}
            <AnimatePresence>
                {task.isTimerRunning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="running-indicator"
                    />
                )}
            </AnimatePresence>

            <div className="task-card-header">
                {isEditing ? (
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="task-title-input"
                        placeholder="Task title"
                        autoFocus
                    />
                ) : (
                    <h3 className="task-title">{task.title}</h3>
                )}

                <div className="task-actions">
                    {!isEditing && !task.completed && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsEditing(true)}
                            className="btn-icon"
                            title="Edit task"
                        >
                            <Edit2 size={16} />
                        </motion.button>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onToggleComplete(task.id)}
                        className={`btn-icon ${task.completed ? 'complete-btn active' : 'complete-btn'}`}
                        title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                        <Check size={16} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(task.id)}
                        className="btn-icon delete-btn"
                        title="Delete task"
                    >
                        <Trash2 size={16} />
                    </motion.button>
                </div>
            </div>

            {isEditing && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="task-description-edit"
                >
                    <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        placeholder="Description (optional)"
                        rows={3}
                    />
                    <div className="edit-actions">
                        <button onClick={handleSave} className="btn btn-primary btn-sm">
                            <Save size={16} />
                            Save
                        </button>
                        <button onClick={handleCancel} className="btn btn-secondary btn-sm">
                            <X size={16} />
                            Cancel
                        </button>
                    </div>
                </motion.div>
            )}

            {!isEditing && task.description && (
                <p className="task-description">{task.description}</p>
            )}

            {/* Timer Section - Simplified with Start Timer button */}
            {!task.completed && (
                <div className="task-timer-section">
                    <div className="task-timer-info">
                        {task.totalTime > 0 && (
                            <span className="task-time-display">
                                {formatTime(task.totalTime)}
                                {task.isTimerRunning && <span className="timer-active-dot">●</span>}
                            </span>
                        )}
                        {task.isTimerRunning && (
                            <span className="timer-status-text">Timer running...</span>
                        )}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onOpenTimer(task.id)}
                        className="start-timer-btn"
                    >
                        <TimerIcon size={18} />
                        <span>{task.isTimerRunning ? 'Open Timer' : 'Start Timer'}</span>
                    </motion.button>
                </div>
            )}

            {task.completed && task.totalTime > 0 && (
                <div className="task-completed-info">
                    <span className="completed-badge">✓ Completed</span>
                    <span className="completed-time">{formatTime(task.totalTime)}</span>
                </div>
            )}
        </motion.div>
    );
};

export default TaskCard;
