import { motion } from 'framer-motion';
import { Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { formatTime } from '../utils/timeUtils';
import './StatsPanel.css';

const StatsPanel = ({ stats }) => {
    if (!stats) {
        return (
            <div className="stats-panel">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="stats-empty"
                >
                    <p className="text-muted">No activity today yet. Start a task to see your stats!</p>
                </motion.div>
            </div>
        );
    }

    const statCards = [
        {
            icon: Clock,
            label: 'Total Focus Time',
            value: formatTime(stats.totalFocusTime),
            color: 'var(--color-accent-primary)',
        },
        {
            icon: CheckCircle,
            label: 'Tasks Completed',
            value: stats.completedTasks,
            color: 'var(--color-success)',
        },
        {
            icon: TrendingUp,
            label: 'Tasks Worked On',
            value: stats.taskBreakdown.length,
            color: 'var(--color-warning)',
        },
    ];

    return (
        <div className="stats-panel">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="stats-header"
            >
                <h2>Today's Statistics</h2>
                <p className="text-muted">{new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                })}</p>
            </motion.div>

            <div className="stats-cards">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="stat-card"
                        >
                            <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                                <Icon size={24} />
                            </div>
                            <div className="stat-content">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {stats.taskBreakdown.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="task-breakdown"
                >
                    <h3>Task Breakdown</h3>
                    <div className="breakdown-list">
                        {stats.taskBreakdown.map((task, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.05 }}
                                className="breakdown-item"
                            >
                                <div className="breakdown-header">
                                    <span className="breakdown-title">{task.title}</span>
                                    {task.completed && <span className="breakdown-badge">✓</span>}
                                </div>
                                <div className="breakdown-time">{formatTime(task.time)}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default StatsPanel;
