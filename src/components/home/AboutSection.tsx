import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Leaf, Shield, Coins, Globe } from 'lucide-react';
import nftnomicNexus from '@/assets/nftnomic.jpeg';

const features = [
  {
    icon: Leaf,
    title: 'Green Mining',
    description: 'NFT-based mining backed by real environmental activities including tree planting and carbon credits.',
    color: 'primary',
  },
  {
    icon: Shield,
    title: 'Transparent & Immutable',
    description: 'All environmental data recorded on-chain, ensuring trust and verifiability for every contribution.',
    color: 'secondary',
  },
  {
    icon: Coins,
    title: 'Token Rewards',
    description: 'Earn NXP tokens from your NFTs with reward mechanisms backed by real environmental activity.',
    color: 'accent',
  },
  {
    icon: Globe,
    title: 'Real-World Impact',
    description: 'Connect blockchain innovation with tangible environmental projects including reforestation and renewable energy.',
    color: 'primary',
  },
];

const aboutContent = [
  {
    title: 'The Vision',
    text: 'To position blockchain as a tool for global environmental restoration, not merely financial speculation. Nexus envisions a future where technology and nature grow together.',
    color: 'primary',
  },
  {
    title: 'The Problem',
    text: 'Traditional environmental and carbon credit systems face major challenges: lack of transparency, centralized inefficient processes, and limited value distribution. Many blockchain projects remain speculative with no real-world impact.',
    color: 'secondary',
  },
  {
    title: 'The Solution',
    text: 'Nexus Protocol introduces a blockchain-based framework that records environmental data immutably on-chain, tokenizes real-world green assets (RWA), and creates a circular green economy with sustainable incentives.',
    color: 'accent',
  },
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 particle-bg" />
      <div className="absolute inset-0 cyber-grid-bg opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="cyber-headline text-3xl sm:text-4xl md:text-5xl mb-4">
            ABOUT NEXUS
          </h2>
          <p className="cyber-body max-w-2xl mx-auto">
            A green blockchain ecosystem connecting real-world environmental assets into verifiable on-chain digital assets
          </p>
        </motion.div>

        {/* NFT Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="cyber-card p-4 rounded-2xl overflow-hidden">
            <img
              src={nftnomicNexus}
              alt="Nexus NFT Collection"
              className="w-full h-auto rounded-xl"
            />
          </div>
        </motion.div>

        {/* About Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {aboutContent.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
              className={`cyber-card p-8 hover:border-${item.color}/40 transition-colors ${
                item.color === 'primary' ? '' : 
                item.color === 'secondary' ? 'cyber-card-magenta' : 'cyber-card-gold'
              }`}
            >
              <h3 className={`cyber-card-title text-xl mb-4 ${
                item.color === 'primary' ? 'text-primary' : 
                item.color === 'secondary' ? 'text-secondary' : 'text-accent'
              }`}>
                {item.title}
              </h3>
              <p className="cyber-body">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: "easeOut" }}
              className="cyber-card p-6 group hover:border-primary/40 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border ${
                feature.color === 'primary' ? 'bg-primary/10 border-primary/20' : 
                feature.color === 'secondary' ? 'bg-secondary/10 border-secondary/20' : 'bg-accent/10 border-accent/20'
              }`}>
                <feature.icon className={`w-6 h-6 ${
                  feature.color === 'primary' ? 'text-primary' : 
                  feature.color === 'secondary' ? 'text-secondary' : 'text-accent'
                }`} />
              </div>
              <h4 className={`cyber-card-title text-lg mb-2 ${
                feature.color === 'primary' ? 'text-primary' : 
                feature.color === 'secondary' ? 'text-secondary' : 'text-accent'
              }`}>
                {feature.title}
              </h4>
              <p className="cyber-muted text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
