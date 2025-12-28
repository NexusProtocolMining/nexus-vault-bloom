import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Leaf, Shield, Coins, Globe, Target, Zap } from 'lucide-react';
import nftnomicNexus from '@/assets/nftnomic.jpeg';

const features = [
  {
    icon: Leaf,
    title: 'GREEN MINING',
    description: 'NFT-BASED MINING BACKED BY REAL ENVIRONMENTAL ACTIVITIES INCLUDING TREE PLANTING AND CARBON CREDITS.',
  },
  {
    icon: Shield,
    title: 'TRANSPARENT',
    description: 'ALL ENVIRONMENTAL DATA RECORDED ON-CHAIN, ENSURING TRUST AND VERIFIABILITY FOR EVERY CONTRIBUTION.',
  },
  {
    icon: Coins,
    title: 'TOKEN REWARDS',
    description: 'EARN NXP TOKENS FROM YOUR NFTS WITH REWARD MECHANISMS BACKED BY REAL ENVIRONMENTAL ACTIVITY.',
  },
  {
    icon: Globe,
    title: 'REAL IMPACT',
    description: 'CONNECT BLOCKCHAIN INNOVATION WITH TANGIBLE ENVIRONMENTAL PROJECTS INCLUDING REFORESTATION.',
  },
];

const aboutContent = [
  {
    title: 'THE VISION',
    text: 'TO POSITION BLOCKCHAIN AS A TOOL FOR GLOBAL ENVIRONMENTAL RESTORATION, NOT MERELY FINANCIAL SPECULATION.',
    icon: Target,
  },
  {
    title: 'THE PROBLEM',
    text: 'TRADITIONAL ENVIRONMENTAL SYSTEMS LACK TRANSPARENCY. MANY BLOCKCHAIN PROJECTS REMAIN SPECULATIVE WITH NO REAL-WORLD IMPACT.',
    icon: Zap,
  },
  {
    title: 'THE SOLUTION',
    text: 'NEXUS PROTOCOL RECORDS ENVIRONMENTAL DATA IMMUTABLY ON-CHAIN AND CREATES A CIRCULAR GREEN ECONOMY.',
    icon: Leaf,
  },
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 particle-bg" />
      <div className="absolute inset-0 matrix-grid-bg opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <div className="badge-tech mb-6">
            <Leaf className="w-4 h-4" />
            <span>GREEN ECOSYSTEM</span>
          </div>
          <h2 className="neon-headline text-4xl sm:text-5xl md:text-6xl mb-6">
            ABOUT NEXUS
          </h2>
          <p className="neon-body max-w-2xl mx-auto text-lg">
            A GREEN BLOCKCHAIN ECOSYSTEM CONNECTING REAL-WORLD ENVIRONMENTAL ASSETS INTO VERIFIABLE ON-CHAIN DIGITAL ASSETS
          </p>
        </motion.div>

        {/* NFT Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-24"
        >
          <div className="hero-card p-5 rounded-3xl overflow-hidden">
            <img
              src={nftnomicNexus}
              alt="Nexus NFT Collection"
              className="w-full h-auto rounded-2xl"
            />
          </div>
        </motion.div>

        {/* About Content - 3D Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {aboutContent.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
              className="card-3d p-8 text-center"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 15 }}
                className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/15 border border-primary/40 flex items-center justify-center"
                style={{ boxShadow: '0 0 30px hsl(120 100% 50% / 0.3)' }}
              >
                <item.icon className="w-8 h-8 text-primary" />
              </motion.div>
              <h3 className="neon-card-title text-xl mb-4">{item.title}</h3>
              <p className="neon-body text-sm">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.1, ease: "easeOut" }}
              className="stats-card p-6 group"
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300 border border-primary/30 bg-primary/10"
                style={{ boxShadow: '0 0 20px hsl(120 100% 50% / 0.2)' }}
              >
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h4 className="neon-card-title text-lg mb-3">{feature.title}</h4>
              <p className="neon-muted text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
