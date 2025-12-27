import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Leaf, Shield } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import backgroundHero from '@/assets/background-hero.jpeg';
import logoNexus from '@/assets/logo-nexus.jpeg';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Mouse tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animations
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  
  // Parallax transforms
  const rotateX = useTransform(y, [-300, 300], [8, -8]);
  const rotateY = useTransform(x, [-300, 300], [-8, 8]);
  const bgX = useTransform(x, [-300, 300], [30, -30]);
  const bgY = useTransform(y, [-300, 300], [30, -30]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = clientX - innerWidth / 2;
      const y = clientY - innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x: clientX / innerWidth, y: clientY / innerHeight });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ x: bgX, y: bgY, scale: 1.1 }}
      >
        <img
          src={backgroundHero}
          alt="Nexus Protocol Background"
          className="w-full h-full object-cover"
          style={{ opacity: 0.5, filter: 'brightness(0.5) saturate(1.4) hue-rotate(-10deg)' }}
        />
      </motion.div>

      {/* Dynamic gradient overlay that follows mouse */}
      <motion.div 
        className="absolute inset-0 z-1 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, hsl(120 100% 50% / 0.15) 0%, transparent 40%),
            linear-gradient(to bottom, hsl(140 40% 3% / 0.6) 0%, hsl(140 40% 3% / 0.75) 50%, hsl(140 40% 3%) 100%)
          `
        }}
      />

      {/* Animated grid with depth */}
      <div className="absolute inset-0 z-2 matrix-grid-bg opacity-60" />

      {/* 3D Floating Orbs */}
      <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full"
            style={{
              width: 100 + i * 50,
              height: 100 + i * 50,
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              background: `radial-gradient(circle, hsl(120 100% 50% / ${0.08 - i * 0.01}) 0%, transparent 70%)`,
              filter: 'blur(40px)',
            }}
            animate={{
              x: [0, 30 * (i % 2 === 0 ? 1 : -1), 0],
              y: [0, 20 * (i % 2 === 0 ? -1 : 1), 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating particles - Neon Green */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? 'hsl(120 100% 50%)' : 'hsl(150 80% 55%)',
              boxShadow: `0 0 ${8 + Math.random() * 8}px ${i % 2 === 0 ? 'hsl(120 100% 50%)' : 'hsl(150 80% 55%)'}`,
            }}
            animate={{
              y: [-20, -200],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Content with 3D transform */}
      <motion.div 
        className="relative z-20 container mx-auto px-4 pt-20"
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1200,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Floating Logo with 3D effect */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: -30 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-8"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto"
              animate={{ 
                y: [0, -15, 0],
                rotateY: [0, 5, 0, -5, 0],
              }}
              transition={{ 
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ 
                scale: 1.15, 
                rotateY: 15,
                z: 50,
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <img 
                src={logoNexus} 
                alt="Nexus Logo" 
                className="w-full h-full object-cover rounded-2xl"
                style={{
                  boxShadow: '0 0 60px hsl(120 100% 50% / 0.6), 0 0 120px hsl(120 100% 50% / 0.3), 0 25px 50px rgba(0,0,0,0.5)'
                }}
              />
              {/* Inner glow ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-primary/70"
                animate={{ 
                  boxShadow: [
                    '0 0 30px hsl(120 100% 50% / 0.5), inset 0 0 20px hsl(120 100% 50% / 0.2)',
                    '0 0 60px hsl(120 100% 50% / 0.8), inset 0 0 40px hsl(120 100% 50% / 0.3)',
                    '0 0 30px hsl(120 100% 50% / 0.5), inset 0 0 20px hsl(120 100% 50% / 0.2)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Outer rotating ring */}
              <motion.div
                className="absolute -inset-4 rounded-3xl border border-primary/40"
                animate={{ 
                  rotate: 360,
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  opacity: { duration: 3, repeat: Infinity }
                }}
              />
              {/* Pulse rings */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-2xl border border-primary/30"
                  animate={{ 
                    scale: [1, 1.5 + i * 0.2],
                    opacity: [0.6, 0],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.6,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="neon-subtitle text-lg sm:text-xl mb-6"
          >
            ONE NEXUS. ONE TREE.
          </motion.p>

          {/* Hero Headline - NEON GREEN Style with 3D depth */}
          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            className="mb-8"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.span 
              className="neon-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl block leading-tight"
              whileHover={{ 
                scale: 1.02,
                textShadow: "0 0 80px hsl(120 100% 50% / 1)"
              }}
              style={{ transform: "translateZ(30px)" }}
            >
              NEXUS
            </motion.span>
            <motion.span 
              className="neon-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl block leading-tight"
              whileHover={{ 
                scale: 1.02,
                textShadow: "0 0 80px hsl(120 100% 50% / 1)"
              }}
              style={{ transform: "translateZ(20px)" }}
            >
              PROTOCOL
            </motion.span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="matrix-body text-lg sm:text-xl mb-14 max-w-3xl mx-auto leading-relaxed"
          >
            A Green Blockchain Ecosystem for Real-World Impact
          </motion.p>

          {/* CTAs with hover 3D effect */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
            style={{ transform: "translateZ(40px)" }}
          >
            <Link to="/buy">
              <motion.button
                className="btn-neon-primary flex items-center gap-3 text-sm group"
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  boxShadow: "0 0 60px hsl(120 100% 50% / 0.8), 0 20px 40px rgba(0,0,0,0.4)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="w-5 h-5 group-hover:animate-spin" />
                BUY NFT
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link to="/staking">
              <motion.button
                className="btn-neon-outline flex items-center gap-3 text-sm group"
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  boxShadow: "0 0 40px hsl(120 100% 50% / 0.5), 0 20px 40px rgba(0,0,0,0.3)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-5 h-5" />
                </motion.div>
                GREEN MINING
              </motion.button>
            </Link>

            <Link to="/dashboard">
              <motion.button
                className="neon-cta px-10 py-4 text-white/60 hover:text-primary transition-all duration-300 text-sm flex items-center gap-2 rounded-xl border border-primary/30 hover:border-primary/60 group"
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  backgroundColor: "hsl(120 100% 50% / 0.1)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                DASHBOARD
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats Cards with 3D hover */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
            className="mt-24"
            style={{ transform: "translateZ(50px)" }}
          >
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
              {[
                { label: 'FIXED SUPPLY', value: '210M', icon: Zap },
                { label: 'NFT TIERS', value: '3', icon: Shield },
                { label: 'NETWORK', value: 'BSC', icon: Leaf },
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  className="matrix-card-3d p-5 sm:p-7 text-center group cursor-pointer"
                  initial={{ opacity: 0, y: 40, rotateX: -20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 1.1 + i * 0.15, duration: 0.8 }}
                  whileHover={{ 
                    y: -15,
                    rotateX: 10,
                    rotateY: -5,
                    scale: 1.05,
                    boxShadow: "0 30px 60px -15px rgba(0,0,0,0.7), 0 0 80px hsl(120 100% 50% / 0.4)"
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <stat.icon className="w-7 h-7 mx-auto mb-3 text-primary" />
                  </motion.div>
                  <p className="font-display neon-metric text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
                    {stat.value}
                  </p>
                  <p className="neon-label mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator with 3D effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-8 h-14 rounded-full border-2 border-primary/60 flex items-start justify-center p-2"
          style={{ boxShadow: '0 0 25px hsl(120 100% 50% / 0.4)' }}
          whileHover={{ scale: 1.1, borderColor: "hsl(120 100% 50%)" }}
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1], y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-2.5 h-4 bg-primary rounded-full"
            style={{ boxShadow: '0 0 15px hsl(120 100% 50% / 0.8)' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
