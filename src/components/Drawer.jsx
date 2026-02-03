import { motion, AnimatePresence } from 'framer-motion';
import { Home, BarChart3, History, X } from 'lucide-react';
import './Drawer.css';

const Drawer = ({ isOpen, onClose, currentView, onNavigate }) => {
    const menuItems = [
        { id: 'tasks', label: 'Tasks', icon: Home },
        { id: 'stats', label: 'Statistics', icon: BarChart3 },
        { id: 'history', label: 'History', icon: History },
    ];

    const handleNavigate = (view) => {
        onNavigate(view);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="drawer-backdrop"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="drawer"
                    >
                        <div className="drawer-header">
                            <h2 className="drawer-title">Menu</h2>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="btn-icon"
                            >
                                <X size={24} />
                            </motion.button>
                        </div>

                        <nav className="drawer-nav">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentView === item.id;

                                return (
                                    <motion.button
                                        key={item.id}
                                        whileHover={{ x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleNavigate(item.id)}
                                        className={`drawer-nav-item ${isActive ? 'active' : ''}`}
                                    >
                                        <Icon size={20} />
                                        <span>{item.label}</span>
                                    </motion.button>
                                );
                            })}
                        </nav>

                        <div className="drawer-footer">
                            <p className="text-muted">Focus Tasks v1.0</p>
                            <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>
                                Offline PWA
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Drawer;
