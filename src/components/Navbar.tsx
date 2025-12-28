import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { ConnectWallet } from './ConnectWallet';
import logoNexus from '@/assets/logo-nexus.jpeg';

const navLinks = [
  { name: 'HOME', path: '/' },
  { name: 'BUY NFT', path: '/buy' },
  { name: 'MINING', path: '/staking' },
  { name: 'DASHBOARD', path: '/dashboard' },
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
          ? 'bg-background/90 backdrop-blur-2xl border-b border-primary/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative w-11 h-11 rounded-xl overflow-hidden"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
              style={{ 
                boxShadow: '0 0 25px hsl(120 100% 50% / 0.4)'
              }}
            >
              <img src={logoNexus} alt="NEXUS PROTOCOL" className="w-full h-full object-cover" />
              <motion.div 
                className="absolute inset-0 border-2 border-primary/70 rounded-xl"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <span className="hidden sm:block neon-title text-xl">
              NEXUS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link-neon ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Connect Wallet */}
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
              className="lg:hidden p-2.5 rounded-xl bg-card/50 border border-primary/30 hover:border-primary/60 transition-colors"
              whileTap={{ scale: 0.95 }}
              style={{ boxShadow: '0 0 15px hsl(120 100% 50% / 0.15)' }}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-primary" />
              ) : (
                <Menu className="w-6 h-6 text-primary" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background/95 backdrop-blur-2xl border-b border-primary/25"
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
                      className={`flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold tracking-[0.2em] transition-all duration-300 ${
                        location.pathname === link.path
                          ? 'bg-primary text-primary-foreground'
                          : 'text-white/60 hover:text-primary hover:bg-primary/10'
                      }`}
                      style={{ 
                        fontFamily: 'Orbitron, monospace',
                        boxShadow: location.pathname === link.path 
                          ? '0 0 25px hsl(120 100% 50% / 0.5)' 
                          : 'none'
                      }}
                    >
                      <Zap className={`w-4 h-4 ${location.pathname === link.path ? 'text-primary-foreground' : 'text-primary'}`} />
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <motion.div 
                className="mt-6 pt-6 border-t border-primary/25 sm:hidden"
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
