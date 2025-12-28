import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TreePine, Zap, Sparkles } from 'lucide-react';
import nexusStaking from '@/assets/nexus-staking.jpeg';

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-28 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={nexusStaking}
          alt="Mining Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>
      
      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border-2 border-primary/15 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-2 border-primary/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border-2 border-primary/25 rounded-full"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.7, type: 'spring' }}
            className="w-24 h-24 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-10 border-2 border-primary/50"
            style={{ boxShadow: '0 0 50px hsl(120 100% 50% / 0.4)' }}
          >
            <TreePine className="w-12 h-12 text-primary" />
          </motion.div>

          <h2 className="neon-headline text-4xl sm:text-5xl md:text-6xl mb-6">
            GROW THE FOREST
          </h2>
          <h3 className="neon-subtitle text-2xl sm:text-3xl mb-8">
            Secure the <span className="text-primary glow-text-neon">Future</span>
          </h3>

          <p className="neon-body text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            Join the green blockchain ecosystem where every transaction creates positive environmental impact. 
            Technology and nature growing together.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to="/buy">
              <motion.button
                className="btn-neon-primary flex items-center gap-3 text-base group"
                whileHover={{ scale: 1.08, y: -6 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="w-5 h-5" />
                BUY NFT
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link to="/staking">
              <motion.button
                className="btn-neon-outline flex items-center gap-3 text-base group"
                whileHover={{ scale: 1.08, y: -6 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap className="w-5 h-5" />
                START MINING
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
