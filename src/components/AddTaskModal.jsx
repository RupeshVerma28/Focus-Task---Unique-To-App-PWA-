import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './AddTaskModal.css';

const AddTaskModal = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
            onSave({
                title: title.trim(),
                description: description.trim(),
            });
            setTitle('');
            setDescription('');
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay">
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="modal-container"
                    >
                        <div className="modal-header">
                            <h2>New Task</h2>
                            <button onClick={onClose} className="close-btn"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="task-form">
                            <div className="form-group">
                                <label>What needs to be done?</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Task Title"
                                    autoFocus
                                    required
                                    className="modal-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add details..."
                                    className="modal-textarea"
                                    rows={3}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary submit-btn">
                                Create Task
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddTaskModal;
