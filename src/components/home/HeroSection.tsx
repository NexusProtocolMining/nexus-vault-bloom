import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Leaf, Shield } from 'lucide-react';
import backgroundHero from '@/assets/background-hero.jpeg';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Enhanced Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundHero}
          alt="Nexus Protocol Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/90 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
      </div>

      {/* Tech Grid Pattern */}
      <div className="absolute inset-0 z-5 tech-grid-bg opacity-60" />

      {/* 3D Floating Orbs */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          style={{ left: '10%', top: '20%' }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-accent/10 blur-3xl"
          style={{ right: '15%', bottom: '30%' }}
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-nexus-purple/10 blur-3xl"
          style={{ left: '50%', top: '10%' }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -20, 20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -120],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
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
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 badge-tech mb-8"
          >
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground/80">Green Blockchain • SocialFi • Web3</span>
            <Zap className="w-4 h-4 text-accent" />
          </motion.div>

          {/* Headline with 3D effect */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight"
          >
            <span className="text-foreground block">One Nexus,</span>
            <motion.span 
              className="gradient-text-tech block neon-glow-text"
              animate={{ 
                textShadow: [
                  '0 0 20px hsl(160 84% 45% / 0.6)',
                  '0 0 40px hsl(175 80% 50% / 0.8)',
                  '0 0 20px hsl(160 84% 45% / 0.6)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              One Tree
            </motion.span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            A <span className="text-primary font-semibold">Green Blockchain</span> for a Sustainable Future. 
            Stake NFTs, earn rewards, and grow the forest with{' '}
            <span className="text-accent font-semibold">Nexus Protocol</span> on BSC.
          </motion.p>

          {/* CTAs with 3D effect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Link to="/buy">
              <motion.button
                className="btn-primary-glow flex items-center gap-3 text-lg px-10 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="w-5 h-5" />
                Buy NFT
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>

            <Link to="/staking">
              <motion.button
                className="btn-outline-glow flex items-center gap-3 text-lg px-10 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap className="w-5 h-5" />
                Stake NFT
              </motion.button>
            </Link>

            <Link to="/dashboard">
              <motion.button
                className="px-8 py-4 text-muted-foreground hover:text-foreground transition-all duration-300 text-lg flex items-center gap-2 hover:bg-muted/20 rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Shield className="w-5 h-5" />
                Dashboard
              </motion.button>
            </Link>
          </motion.div>

          {/* 3D Stats preview */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-20 perspective-1000"
          >
            <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
              {[
                { label: 'Total Supply', value: '210M', unit: 'NXP', icon: Zap },
                { label: 'NFT Tiers', value: '3', unit: 'Levels', icon: Shield },
                { label: 'Network', value: 'BSC', unit: 'Chain', icon: Leaf },
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  className="card-3d p-4 sm:p-6 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="font-display text-2xl sm:text-3xl font-bold gradient-text-tech">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
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
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative w-8 h-14 rounded-full border-2 border-primary/40 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1], y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-3 bg-primary rounded-full"
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}