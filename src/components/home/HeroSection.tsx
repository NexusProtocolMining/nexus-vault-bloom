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
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-primary/3" />
      </div>

      {/* Subtle Tech Grid */}
      <div className="absolute inset-0 z-5 tech-grid-bg opacity-25" />

      {/* Ambient Floating Orbs - Matching asset glow */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ 
            left: '5%', 
            top: '15%',
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)'
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
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 70%)'
          }}
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Subtle floating particles */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: 'rgba(34, 197, 94, 0.4)',
            }}
            animate={{
              y: [-30, -150],
              x: [0, (Math.random() - 0.5) * 40],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
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
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-3 badge-tech mb-10"
          >
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span className="nexus-label text-white/75">GREEN BLOCKCHAIN • SOCIALFI • WEB3</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </motion.div>

          {/* Hero Headline - Cinematic fade + rise + scale */}
          <motion.h1
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="nexus-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6"
            style={{ letterSpacing: '0.06em' }}
          >
            <span className="text-white block">One Nexus,</span>
            <motion.span 
              className="nexus-highlight block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              style={{
                textShadow: '0 0 30px rgba(34, 197, 94, 0.5), 0 0 60px rgba(34, 197, 94, 0.25)'
              }}
            >
              One Tree
            </motion.span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
            className="nexus-subtitle text-xl sm:text-2xl mb-6"
            style={{ letterSpacing: '0.15em' }}
          >
            ONE FUTURE
          </motion.p>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="nexus-body text-lg sm:text-xl mb-14 max-w-3xl mx-auto leading-relaxed"
          >
            A <span className="nexus-highlight font-semibold">Green Blockchain</span> for a Sustainable Future. 
            Stake NFTs, earn rewards, and grow the forest with{' '}
            <span className="nexus-highlight font-semibold">Nexus Protocol</span> on BSC.
          </motion.p>

          {/* CTAs with 3D depth */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Link to="/buy">
              <motion.button
                className="btn-primary-glow nexus-cta flex items-center gap-3 text-sm px-12 py-4"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
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
                transition={{ duration: 0.3 }}
              >
                <Zap className="w-5 h-5" />
                STAKE NFT
              </motion.button>
            </Link>

            <Link to="/dashboard">
              <motion.button
                className="nexus-cta px-10 py-4 text-white/60 hover:text-white transition-all duration-300 text-sm flex items-center gap-2 hover:bg-white/5 rounded-xl border border-transparent hover:border-emerald-500/20"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Shield className="w-5 h-5" />
                DASHBOARD
              </motion.button>
            </Link>
          </motion.div>

          {/* 3D Stats preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="mt-24"
            style={{ perspective: '1200px' }}
          >
            <div className="grid grid-cols-3 gap-5 sm:gap-8 max-w-2xl mx-auto">
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
                  transition={{ delay: 0.9 + i * 0.1, duration: 0.7, ease: "easeOut" }}
                  whileHover={{ y: -8 }}
                >
                  <stat.icon className="w-6 h-6 text-emerald-400 mx-auto mb-3" />
                  <p className="nexus-metric text-2xl sm:text-3xl nexus-highlight" style={{ letterSpacing: '0.04em' }}>
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
          className="relative w-8 h-14 rounded-full border-2 border-emerald-500/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1], y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-3 bg-emerald-400 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}