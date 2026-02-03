import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ onMenuToggle, isMenuOpen }) => {
    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <motion.div
                        className="navbar-brand"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="brand-icon">✓</div>
                        <h1 className="brand-title">Focus Tasks</h1>
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onMenuToggle}
                        className="btn-icon menu-btn"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </motion.button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
