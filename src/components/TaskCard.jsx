import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, Edit2, MoreVertical, Pin, Play, Timer, X, Save } from 'lucide-react';
// ...
{/* Timer Button */ }
{
    !task.completed && (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onOpenTimer(task.id)}
            className={`timer-circle-btn ${task.isTimerRunning ? 'running' : ''}`}
            title={task.isTimerRunning ? "View Timer" : "Start Timer"}
        >
            <Timer size={20} />
        </motion.button>
    )
}
import { formatTime } from '../utils/timeUtils';
import './TaskCard.css';

const TaskCard = ({ task, onUpdate, onDelete, onToggleComplete, onOpenTimer, onPin }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDescription, setEditedDescription] = useState(task.description);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={`task-card ${task.completed ? 'completed' : ''} ${task.pinned ? 'pinned' : ''}`}
        >
            {/* Custom Checkbox (Left) */}
            <div
                className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
                onClick={() => onToggleComplete(task.id)}
            >
                {task.completed && <Check size={14} strokeWidth={3} />}
            </div>

            {/* Task Content (Middle) */}
            <div className="task-content">
                {isEditing ? (
                    <div className="edit-mode">
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="task-title-input"
                            placeholder="Task title"
                            autoFocus
                        />
                        <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            placeholder="Description (optional)"
                            className="task-desc-input"
                            rows={2}
                        />
                        <div className="edit-actions">
                            <button onClick={handleSave} className="btn btn-primary btn-sm"><Save size={14} /> Save</button>
                            <button onClick={handleCancel} className="btn btn-secondary btn-sm"><X size={14} /> Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="task-info">
                        <h3 className={`task-title ${task.completed ? 'line-through' : ''}`}>
                            {task.title}
                        </h3>
                        {task.description && <p className="task-description-preview">{task.description}</p>}
                        {task.dueDate && (
                            <span className="task-date">
                                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                        )}
                        {task.isTimerRunning && <span className="timer-badge">Running: {formatTime(task.totalTime)}</span>}
                    </div>
                )}
            </div>

            {/* Actions (Right) */}
            <div className="task-right-actions">
                {/* Timer Button */}
                {!task.completed && (
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onOpenTimer(task.id)}
                        className={`timer-circle-btn ${task.isTimerRunning ? 'running' : ''}`}
                        title={task.isTimerRunning ? "View Timer" : "Start Timer"}
                    >
                        <ChevronRight size={20} />
                    </motion.button>
                )}

                {/* 3-Dot Menu */}
                <div className="menu-container" ref={menuRef}>
                    <button className="menu-trigger" onClick={toggleMenu}>
                        <MoreVertical size={20} />
                    </button>

                    <AnimatePresence>
                        {showMenu && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="dropdown-menu"
                            >
                                <button onClick={() => { onPin(task.id); setShowMenu(false); }} className="menu-item">
                                    <Pin size={16} /> {task.pinned ? 'Unpin' : 'Pin'}
                                </button>
                                <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="menu-item">
                                    <Edit2 size={16} /> Edit
                                </button>
                                <button onClick={() => { onDelete(task.id); setShowMenu(false); }} className="menu-item delete">
                                    <Trash2 size={16} /> Delete
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default TaskCard;
