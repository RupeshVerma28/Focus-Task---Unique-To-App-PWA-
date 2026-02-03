import { useState, useEffect } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatTime, getElapsedTime } from '../utils/timeUtils';
import './Timer.css';

const Timer = ({ task, onStart, onPause, onStop }) => {
    const [displayTime, setDisplayTime] = useState(0);

    useEffect(() => {
        // Calculate initial display time
        let time = task.totalTime || 0;
        if (task.isTimerRunning && task.currentSessionStart) {
            time += getElapsedTime(task.currentSessionStart);
        }
        setDisplayTime(time);

        // Update display every second if timer is running
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
            onStart();
        }
    };

    return (
        <div className="timer-container">
            <motion.div
                className={`timer-display ${task.isTimerRunning ? 'running' : ''}`}
                animate={task.isTimerRunning ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
            >
                {formatTime(displayTime)}
            </motion.div>

            <div className="timer-controls">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlayPause}
                    className={`btn-icon timer-btn ${task.isTimerRunning ? 'pause-btn' : 'play-btn'}`}
                    title={task.isTimerRunning ? 'Pause' : 'Start'}
                >
                    {task.isTimerRunning ? (
                        <Pause size={20} />
                    ) : (
                        <Play size={20} />
                    )}
                </motion.button>

                {(task.totalTime > 0 || task.isTimerRunning) && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onStop}
                        className="btn-icon timer-btn stop-btn"
                        title="Stop"
                    >
                        <Square size={20} />
                    </motion.button>
                )}
            </div>
        </div>
    );
};

export default Timer;
