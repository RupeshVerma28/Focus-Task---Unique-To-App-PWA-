import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, ArrowRight, Trash2 } from 'lucide-react';
import { formatTime, formatDate } from '../utils/timeUtils';
import './HistoryView.css';

const HistoryView = ({ history, onClearHistory }) => {
    if (!history || history.length === 0) {
        return (
            <div className="history-view">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="history-empty"
                >
                    <Calendar size={48} className="empty-icon" />
                    <h3>No Turn Back</h3>
                    <p className="text-muted">History is empty.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="history-view">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="history-header"
            >
                <div>
                    <h2>History</h2>
                    <p className="text-muted">Your past productivity.</p>
                </div>
                <button onClick={onClearHistory} className="btn btn-danger btn-sm">
                    <Trash2 size={16} /> Clear History
                </button>
            </motion.div>

            <div className="history-list">
                {history.map((day, index) => (
                    <motion.div
                        key={day.date}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="history-card"
                    >
                        <div className="history-card-header">
                            <div className="history-date">
                                <Calendar size={20} />
                                <span>{formatDate(day.date)}</span>
                            </div>
                        </div>

                        <div className="history-stats">
                            <div className="history-stat">
                                <Clock size={18} />
                                <div>
                                    <div className="history-stat-value">{formatTime(day.totalFocusTime)}</div>
                                    <div className="history-stat-label">Focus Time</div>
                                </div>
                            </div>

                            <div className="history-stat">
                                <CheckCircle size={18} />
                                <div>
                                    <div className="history-stat-value">{day.completedTasks}</div>
                                    <div className="history-stat-label">Completed</div>
                                </div>
                            </div>
                        </div>

                        {day.taskBreakdown && day.taskBreakdown.length > 0 && (
                            <details className="history-details">
                                <summary className="history-details-summary">
                                    <span>View {day.taskBreakdown.length} task{day.taskBreakdown.length !== 1 ? 's' : ''}</span>
                                    <ArrowRight size={16} className="arrow-icon" />
                                </summary>
                                <div className="history-tasks">
                                    {day.taskBreakdown.map((task, taskIndex) => (
                                        <div key={taskIndex} className="history-task-item">
                                            <div className="history-task-info">
                                                <span className="history-task-title">{task.title}</span>
                                                {task.completed && <span className="task-completed-badge">✓</span>}
                                            </div>
                                            <span className="history-task-time">{formatTime(task.time)}</span>
                                        </div>
                                    ))}
                                </div>
                            </details>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default HistoryView;
