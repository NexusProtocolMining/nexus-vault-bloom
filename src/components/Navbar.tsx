import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { ConnectWallet } from './ConnectWallet';
import logoNexus from '@/assets/logo-nexus.jpeg';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Buy NFT', path: '/buy' },
  { name: 'Staking', path: '/staking' },
  { name: 'Sell NXP', path: '/pool' },
  { name: 'Dashboard', path: '/dashboard' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-background/70 backdrop-blur-2xl border-b border-primary/10 shadow-lg shadow-primary/5' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative w-11 h-11 rounded-xl overflow-hidden"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <img src={logoNexus} alt="Nexus Protocol" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20 group-hover:opacity-0 transition-opacity duration-300" />
              <motion.div 
                className="absolute inset-0 border-2 border-primary/50 rounded-xl"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div className="hidden sm:flex flex-col">
              <span className="nexus-card-title text-lg leading-tight">
                NEXUS<span className="nexus-highlight">PROTOCOL</span>
              </span>
              <span className="nexus-label">Green • Social • Fi</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-card/30 backdrop-blur-xl rounded-2xl p-1.5 border border-primary/10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-5 py-2.5 text-sm font-medium transition-all duration-300 rounded-xl"
              >
                <span className={`relative z-10 ${location.pathname === link.path ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                  {link.name}
                </span>
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-primary rounded-xl"
                    style={{ boxShadow: '0 0 20px hsl(160 84% 45% / 0.4)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Connect Wallet & Mobile Menu */}
          <div className="flex items-center gap-4">
            <motion.div 
              className="hidden sm:block"
              whileHover={{ scale: 1.02 }}
            >
              <ConnectWallet />
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-card/50 border border-primary/20 hover:border-primary/40 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-background/95 backdrop-blur-2xl border-b border-primary/10"
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                        location.pathname === link.path
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                      }`}
                    >
                      <Zap className={`w-4 h-4 ${location.pathname === link.path ? 'text-primary-foreground' : 'text-primary'}`} />
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <motion.div 
                className="mt-6 pt-6 border-t border-primary/10 sm:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <ConnectWallet />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}