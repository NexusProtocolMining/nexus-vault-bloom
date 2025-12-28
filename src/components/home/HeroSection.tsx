import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Leaf, Shield } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import backgroundHero from '@/assets/background-hero.jpeg';
import logoNexus from '@/assets/logo-nexus.jpeg';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  
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
          style={{ opacity: 0.4, filter: 'brightness(0.4) saturate(1.5) hue-rotate(-10deg)' }}
        />
      </motion.div>

      {/* Dynamic gradient overlay */}
      <motion.div 
        className="absolute inset-0 z-1 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, hsl(120 100% 50% / 0.12) 0%, transparent 40%),
            linear-gradient(to bottom, hsl(140 50% 2% / 0.5) 0%, hsl(140 50% 2% / 0.8) 50%, hsl(140 50% 2%) 100%)
          `
        }}
      />

      {/* Matrix Grid */}
      <div className="absolute inset-0 z-2 matrix-grid-bg opacity-50" />

      {/* 3D Floating Orbs */}
      <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full"
            style={{
              width: 80 + i * 40,
              height: 80 + i * 40,
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 3) * 30}%`,
              background: `radial-gradient(circle, hsl(120 100% 50% / ${0.1 - i * 0.01}) 0%, transparent 70%)`,
              filter: 'blur(30px)',
            }}
            animate={{
              x: [0, 40 * (i % 2 === 0 ? 1 : -1), 0],
              y: [0, 30 * (i % 2 === 0 ? -1 : 1), 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 8 + i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 5 + 2,
              height: Math.random() * 5 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: 'hsl(120 100% 50%)',
              boxShadow: `0 0 ${10 + Math.random() * 10}px hsl(120 100% 50%)`,
            }}
            animate={{
              y: [-30, -250],
              x: [0, (Math.random() - 0.5) * 120],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 6,
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
          
          {/* 3D Logo */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotateX: -30 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-10"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              className="relative w-40 h-40 sm:w-52 sm:h-52 mx-auto"
              animate={{ 
                y: [0, -20, 0],
                rotateY: [0, 8, 0, -8, 0],
              }}
              transition={{ 
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                rotateY: { duration: 10, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ 
                scale: 1.2, 
                rotateY: 20,
                z: 80,
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <img 
                src={logoNexus} 
                alt="Nexus Logo" 
                className="w-full h-full object-cover rounded-2xl"
                style={{
                  boxShadow: '0 0 80px hsl(120 100% 50% / 0.7), 0 0 150px hsl(120 100% 50% / 0.4), 0 30px 60px rgba(0,0,0,0.6)'
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-2xl border-3 border-primary/80"
                animate={{ 
                  boxShadow: [
                    '0 0 40px hsl(120 100% 50% / 0.6), inset 0 0 30px hsl(120 100% 50% / 0.3)',
                    '0 0 80px hsl(120 100% 50% / 0.9), inset 0 0 50px hsl(120 100% 50% / 0.4)',
                    '0 0 40px hsl(120 100% 50% / 0.6), inset 0 0 30px hsl(120 100% 50% / 0.3)'
                  ]
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute -inset-5 rounded-3xl border border-primary/50"
                animate={{ 
                  rotate: 360,
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{ 
                  rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                  opacity: { duration: 3, repeat: Infinity }
                }}
              />
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-2xl border-2 border-primary/40"
                  animate={{ 
                    scale: [1, 1.6 + i * 0.25],
                    opacity: [0.7, 0],
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.7,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="neon-subtitle text-xl sm:text-2xl mb-8"
          >
            ONE NEXUS · ONE TREE
          </motion.p>

          {/* Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            className="mb-10"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.span 
              className="neon-title text-6xl sm:text-7xl md:text-8xl lg:text-9xl block leading-tight"
              whileHover={{ 
                scale: 1.03,
                textShadow: "0 0 100px hsl(120 100% 50% / 1)"
              }}
              style={{ transform: "translateZ(40px)" }}
            >
              NEXUS
            </motion.span>
            <motion.span 
              className="neon-title text-6xl sm:text-7xl md:text-8xl lg:text-9xl block leading-tight"
              whileHover={{ 
                scale: 1.03,
                textShadow: "0 0 100px hsl(120 100% 50% / 1)"
              }}
              style={{ transform: "translateZ(30px)" }}
            >
              PROTOCOL
            </motion.span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="neon-body text-xl sm:text-2xl mb-16 max-w-3xl mx-auto leading-relaxed"
          >
            NFT MINING ECOSYSTEM FOR REAL-WORLD IMPACT
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8"
            style={{ transform: "translateZ(50px)" }}
          >
            <Link to="/buy">
              <motion.button
                className="btn-neon-primary flex items-center gap-3 text-sm group"
                whileHover={{ 
                  scale: 1.08, 
                  y: -8,
                  boxShadow: "0 0 80px hsl(120 100% 50% / 0.9), 0 25px 50px rgba(0,0,0,0.5)"
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
                  scale: 1.08, 
                  y: -8,
                  boxShadow: "0 0 60px hsl(120 100% 50% / 0.6), 0 25px 50px rgba(0,0,0,0.4)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-5 h-5" />
                </motion.div>
                START MINING
              </motion.button>
            </Link>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
            className="mt-28"
            style={{ transform: "translateZ(60px)" }}
          >
            <div className="grid grid-cols-3 gap-5 sm:gap-10 max-w-3xl mx-auto">
              {[
                { label: 'NFT MINING NODES', value: '∞', icon: Zap },
                { label: 'CARBON CREDIT', value: 'RWA', icon: Leaf },
                { label: 'RWA ECOSYSTEM', value: 'BSC', icon: Shield },
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  className="card-3d p-6 sm:p-8 text-center group cursor-pointer"
                  initial={{ opacity: 0, y: 50, rotateX: -25 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 1.1 + i * 0.15, duration: 0.8 }}
                  whileHover={{ 
                    y: -20,
                    rotateX: 12,
                    rotateY: -8,
                    scale: 1.08,
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.div
                    whileHover={{ scale: 1.3, rotate: 20 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="mb-4"
                  >
                    <stat.icon className="w-8 h-8 mx-auto text-primary" />
                  </motion.div>
                  <p className="font-display neon-metric text-3xl sm:text-4xl group-hover:scale-110 transition-transform mb-3">
                    {stat.value}
                  </p>
                  <p className="neon-label text-[10px] sm:text-xs">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 18, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-9 h-16 rounded-full border-2 border-primary/60 flex items-start justify-center p-2.5"
          style={{ boxShadow: '0 0 30px hsl(120 100% 50% / 0.5)' }}
          whileHover={{ scale: 1.15, borderColor: "hsl(120 100% 50%)" }}
        >
          <motion.div
            animate={{ opacity: [1, 0.2, 1], y: [0, 12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-3 h-5 bg-primary rounded-full"
            style={{ boxShadow: '0 0 20px hsl(120 100% 50% / 0.9)' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
