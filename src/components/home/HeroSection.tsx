import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Leaf, Shield } from 'lucide-react';
import backgroundHero from '@/assets/background-hero.jpeg';
import logoNexus from '@/assets/logo-nexus.jpeg';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Ultra Dark with Green Tint */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundHero}
          alt="Nexus Protocol Background"
          className="w-full h-full object-cover"
          style={{ opacity: 0.35, filter: 'brightness(0.7) saturate(1.2)' }}
        />
        {/* Dark overlay with green edge glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        {/* Green radial glow from center */}
        <div 
          className="absolute inset-0" 
          style={{ 
            background: 'radial-gradient(ellipse at 50% 40%, hsl(135 100% 50% / 0.08) 0%, transparent 50%)'
          }} 
        />
      </div>

      {/* Subtle particles */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: 'hsl(135 100% 50%)',
              boxShadow: '0 0 6px hsl(135 100% 50%)',
            }}
            animate={{
              y: [-20, -120],
              opacity: [0, 0.8, 0],
              scale: [0, 1.2, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Floating Logo */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <motion.div
              className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img 
                src={logoNexus} 
                alt="Nexus Logo" 
                className="w-full h-full object-cover rounded-2xl"
                style={{
                  boxShadow: '0 0 40px hsl(135 100% 50% / 0.4), 0 0 80px hsl(135 100% 50% / 0.2)'
                }}
              />
              {/* Glow ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-primary/50"
                animate={{ 
                  boxShadow: [
                    '0 0 20px hsl(135 100% 50% / 0.3)',
                    '0 0 40px hsl(135 100% 50% / 0.5)',
                    '0 0 20px hsl(135 100% 50% / 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          {/* Tagline - Above main headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="nexus-subtitle text-lg sm:text-xl mb-6"
            style={{ letterSpacing: '0.25em' }}
          >
            ONE NEXUS. ONE TREE. ONE FUTURE.
          </motion.p>

          {/* Hero Headline - NEON MATRIX Style */}
          <motion.h1
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }}
            className="mb-8"
          >
            <span className="neon-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl block leading-tight">
              NEXUS
            </span>
            <span className="neon-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl block leading-tight">
              PROTOCOL
            </span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="nexus-body text-lg sm:text-xl mb-14 max-w-3xl mx-auto leading-relaxed"
          >
            Stake NFT. Earn Rewards. Build the Future of Decentralized Finance.
          </motion.p>

          {/* CTAs with Neon Glow */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Link to="/buy">
              <motion.button
                className="btn-primary-glow nexus-cta flex items-center gap-3 text-sm px-12 py-4"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="w-5 h-5" />
                BUY NFT
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>

            <Link to="/staking">
              <motion.button
                className="btn-outline-glow nexus-cta flex items-center gap-3 text-sm px-12 py-4"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap className="w-5 h-5" />
                STAKING
              </motion.button>
            </Link>

            <Link to="/dashboard">
              <motion.button
                className="nexus-cta px-10 py-4 text-white/50 hover:text-primary transition-all duration-300 text-sm flex items-center gap-2 hover:bg-primary/5 rounded-xl border border-primary/20 hover:border-primary/40"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Shield className="w-5 h-5" />
                DASHBOARD
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
            className="mt-24"
          >
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
              {[
                { label: 'TOTAL SUPPLY', value: '210M', icon: Zap },
                { label: 'NFT TIERS', value: '3', icon: Shield },
                { label: 'NETWORK', value: 'BSC', icon: Leaf },
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  className="card-3d p-5 sm:p-7 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1, duration: 0.7 }}
                  whileHover={{ y: -8 }}
                >
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                  <p className="nexus-metric text-2xl sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="nexus-label mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-8 h-14 rounded-full border-2 border-primary/40 flex items-start justify-center p-2"
          style={{ boxShadow: '0 0 15px hsl(135 100% 50% / 0.2)' }}
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1], y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-3 bg-primary rounded-full"
            style={{ boxShadow: '0 0 10px hsl(135 100% 50% / 0.5)' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
