import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Leaf, Shield } from 'lucide-react';
import backgroundHero from '@/assets/background-hero.jpeg';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Asset First Approach */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundHero}
          alt="Nexus Protocol Background"
          className="w-full h-full object-cover"
          style={{ opacity: 0.4 }}
        />
        {/* Gradient overlays matching asset colors */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-accent/3" />
      </div>

      {/* Subtle Tech Grid - Low opacity to support asset */}
      <div className="absolute inset-0 z-5 tech-grid-bg opacity-30" />

      {/* Ambient 3D Floating Orbs - Matching asset glow */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ 
            left: '5%', 
            top: '15%',
            background: 'radial-gradient(circle, hsl(160 84% 45% / 0.12) 0%, transparent 70%)'
          }}
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ 
            right: '10%', 
            bottom: '25%',
            background: 'radial-gradient(circle, hsl(175 80% 50% / 0.1) 0%, transparent 70%)'
          }}
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[350px] h-[350px] rounded-full blur-[80px]"
          style={{ 
            left: '45%', 
            top: '5%',
            background: 'radial-gradient(circle, hsl(270 60% 55% / 0.06) 0%, transparent 70%)'
          }}
          animate={{
            x: [0, 35, -35, 0],
            y: [0, -25, 25, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Subtle floating particles */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-30, -150],
              x: [0, (Math.random() - 0.5) * 40],
              opacity: [0, 0.7, 0],
              scale: [0, 1.2, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="inline-flex items-center gap-3 badge-tech mb-10"
          >
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-foreground/80">GREEN BLOCKCHAIN • SOCIALFI • WEB3</span>
            <Zap className="w-4 h-4 text-accent" />
          </motion.div>

          {/* Headline - Institutional, geometric, wide tracking */}
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-10"
            style={{ letterSpacing: '0.08em' }}
          >
            <span className="text-foreground/95 block">ONE NEXUS,</span>
            <motion.span 
              className="gradient-text-tech block neon-glow-text"
              animate={{ 
                textShadow: [
                  '0 0 25px hsl(160 84% 45% / 0.5)',
                  '0 0 45px hsl(175 80% 50% / 0.7)',
                  '0 0 25px hsl(160 84% 45% / 0.5)',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              ONE TREE
            </motion.span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="font-display text-lg sm:text-xl text-muted-foreground mb-6"
            style={{ letterSpacing: '0.15em' }}
          >
            ONE FUTURE
          </motion.p>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
            className="text-lg sm:text-xl text-muted-foreground mb-14 max-w-3xl mx-auto leading-relaxed"
          >
            A <span className="text-primary font-semibold">Green Blockchain</span> for a Sustainable Future. 
            Stake NFTs, earn rewards, and grow the forest with{' '}
            <span className="text-accent font-semibold">Nexus Protocol</span> on BSC.
          </motion.p>

          {/* CTAs with 3D depth */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Link to="/buy">
              <motion.button
                className="btn-primary-glow flex items-center gap-3 text-base px-12 py-4"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Sparkles className="w-5 h-5" />
                BUY NFT
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>

            <Link to="/staking">
              <motion.button
                className="btn-outline-glow flex items-center gap-3 text-base px-12 py-4"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Zap className="w-5 h-5" />
                STAKE NFT
              </motion.button>
            </Link>

            <Link to="/dashboard">
              <motion.button
                className="px-10 py-4 text-muted-foreground hover:text-foreground transition-all duration-400 text-base flex items-center gap-2 hover:bg-muted/15 rounded-xl border border-transparent hover:border-primary/20"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{ letterSpacing: '0.05em' }}
              >
                <Shield className="w-5 h-5" />
                DASHBOARD
              </motion.button>
            </Link>
          </motion.div>

          {/* 3D Stats preview */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.1, delay: 0.6, ease: "easeOut" }}
            className="mt-24"
            style={{ perspective: '1200px' }}
          >
            <div className="grid grid-cols-3 gap-5 sm:gap-8 max-w-2xl mx-auto">
              {[
                { label: 'TOTAL SUPPLY', value: '210M', unit: 'NXP', icon: Zap },
                { label: 'NFT TIERS', value: '3', unit: 'LEVELS', icon: Shield },
                { label: 'NETWORK', value: 'BSC', unit: 'CHAIN', icon: Leaf },
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  className="card-3d p-5 sm:p-7 text-center"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.12, ease: "easeOut" }}
                  whileHover={{ y: -8 }}
                >
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                  <p className="font-display text-2xl sm:text-3xl font-bold gradient-text-tech" style={{ letterSpacing: '0.05em' }}>
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1" style={{ letterSpacing: '0.1em' }}>{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-8 h-14 rounded-full border-2 border-primary/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [1, 0.25, 1], y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-3 bg-primary rounded-full"
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/20"
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}