import { openDB } from 'idb';

const DB_NAME = 'TodoPWA';
const DB_VERSION = 1;

// Initialize the database
export const initDB = async () => {
    const db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Tasks store
            if (!db.objectStoreNames.contains('tasks')) {
                const taskStore = db.createObjectStore('tasks', {
                    keyPath: 'id',
                    autoIncrement: true,
                });
                taskStore.createIndex('createdAt', 'createdAt');
                taskStore.createIndex('completed', 'completed');
            }

            // Daily stats store
            if (!db.objectStoreNames.contains('dailyStats')) {
                const statsStore = db.createObjectStore('dailyStats', {
                    keyPath: 'date',
                });
                statsStore.createIndex('date', 'date');
            }
        },
    });
    return db;
};

// Get database instance
export const getDB = async () => {
    return await openDB(DB_NAME, DB_VERSION);
};

// ========== TASK OPERATIONS ==========

// Add a new task
export const addTask = async (task) => {
    const db = await getDB();
    const newTask = {
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate || null,
        pinned: task.pinned || false,
        completed: false,
        totalTime: 0, // in seconds
        currentSessionStart: null,
        isTimerRunning: false,
        createdAt: new Date().toISOString(),
    };
    const id = await db.add('tasks', newTask);
    return { ...newTask, id };
};

// Get all tasks
export const getAllTasks = async () => {
    const db = await getDB();
    return await db.getAll('tasks');
};

// Get a single task by ID
export const getTask = async (id) => {
    const db = await getDB();
    return await db.get('tasks', id);
};

// Update a task
export const updateTask = async (id, updates) => {
    const db = await getDB();
    const task = await db.get('tasks', id);
    if (!task) return null;

    const updatedTask = { ...task, ...updates };
    await db.put('tasks', updatedTask);
    return updatedTask;
};

// Delete a task
export const deleteTask = async (id) => {
    const db = await getDB();
    await db.delete('tasks', id);
};

// Start timer for a task
export const startTimer = async (id) => {
    const db = await getDB();
    const task = await db.get('tasks', id);
    if (!task) return null;

    task.isTimerRunning = true;
    task.currentSessionStart = Date.now();
    await db.put('tasks', task);
    return task;
};

// Pause timer for a task
export const pauseTimer = async (id) => {
    const db = await getDB();
    const task = await db.get('tasks', id);
    if (!task || !task.isTimerRunning) return task;

    const elapsed = Math.floor((Date.now() - task.currentSessionStart) / 1000);
    task.totalTime += elapsed;
    task.isTimerRunning = false;
    task.currentSessionStart = null;
    await db.put('tasks', task);
    return task;
};

// Stop timer and mark task as complete
export const stopTimer = async (id) => {
    const db = await getDB();
    const task = await db.get('tasks', id);
    if (!task) return null;

    if (task.isTimerRunning) {
        const elapsed = Math.floor((Date.now() - task.currentSessionStart) / 1000);
        task.totalTime += elapsed;
        task.isTimerRunning = false;
        task.currentSessionStart = null;
    }

    await db.put('tasks', task);
    return task;
};

// Toggle task completion
export const toggleTaskComplete = async (id) => {
    const db = await getDB();
    const task = await db.get('tasks', id);
    if (!task) return null;

    // If timer is running, pause it first
    if (task.isTimerRunning) {
        const elapsed = Math.floor((Date.now() - task.currentSessionStart) / 1000);
        task.totalTime += elapsed;
        task.isTimerRunning = false;
        task.currentSessionStart = null;
    }

    task.completed = !task.completed;
    await db.put('tasks', task);
    return task;
};

// ========== STATS OPERATIONS ==========

// Get today's date in YYYY-MM-DD format
export const getTodayDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
};

// Calculate stats for today
export const calculateDailyStats = async () => {
    const tasks = await getAllTasks();
    const today = getTodayDate();

    let totalFocusTime = 0;
    let completedTasks = 0;
    const taskBreakdown = [];

    tasks.forEach((task) => {
        const taskDate = task.createdAt.split('T')[0];

        // Only count tasks created today
        if (taskDate === today) {
            let taskTime = task.totalTime;

            // Add current session time if timer is running
            if (task.isTimerRunning && task.currentSessionStart) {
                const currentElapsed = Math.floor((Date.now() - task.currentSessionStart) / 1000);
                taskTime += currentElapsed;
            }

            totalFocusTime += taskTime;

            if (task.completed) {
                completedTasks++;
            }

            if (taskTime > 0) {
                taskBreakdown.push({
                    title: task.title,
                    time: taskTime,
                    completed: task.completed,
                });
            }
        }
    });

    return {
        date: today,
        totalFocusTime,
        completedTasks,
        taskBreakdown,
    };
};

// Save daily stats (called at midnight or when needed)
export const saveDailyStats = async (stats) => {
    const db = await getDB();
    await db.put('dailyStats', stats);
};

// Get stats for a specific date
export const getStatsForDate = async (date) => {
    const db = await getDB();
    return await db.get('dailyStats', date);
};

// Get all historical stats
export const getAllStats = async () => {
    const db = await getDB();
    const allStats = await db.getAll('dailyStats');
    // Sort by date descending (newest first)
    return allStats.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Archive today's stats and clear tasks (called at midnight)
export const archiveTodayAndReset = async () => {
    // Calculate and save today's stats
    const todayStats = await calculateDailyStats();
    await saveDailyStats(todayStats);

    // Delete all tasks from today
    const db = await getDB();
    const tasks = await getAllTasks();
    const today = getTodayDate();

    for (const task of tasks) {
        const taskDate = task.createdAt.split('T')[0];
        if (taskDate === today) {
            await db.delete('tasks', task.id);
        }
    }
};

// Clear all history
export const clearHistory = async () => {
    const db = await getDB();
    await db.clear('dailyStats');
};

