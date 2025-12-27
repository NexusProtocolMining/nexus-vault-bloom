import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Leaf, Shield, Coins, Globe } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Sustainable Mining',
    description: 'NFT-based mining that supports environmental sustainability through carbon credit integration.',
  },
  {
    icon: Shield,
    title: 'Secure Staking',
    description: 'Lock your NFTs and earn NXP rewards with our audited smart contract system on BSC.',
  },
  {
    icon: Coins,
    title: 'Token Rewards',
    description: 'Earn NXP tokens monthly from your staked NFTs with transparent on-chain reward distribution.',
  },
  {
    icon: Globe,
    title: 'Global Ecosystem',
    description: 'Join a worldwide community building a greener future through blockchain technology.',
  },
];

const aboutContent = [
  {
    title: 'The Vision',
    text: 'Nexus Protocol emerges as a revolutionary bridge between blockchain technology and environmental sustainability. We believe that the future of finance must be green, transparent, and accessible to all.',
  },
  {
    title: 'The Mission',
    text: 'Our mission is to create a decentralized ecosystem where digital assets contribute to real-world environmental impact. Through NFT mining and carbon credit tokenization, we are pioneering a new era of sustainable blockchain solutions.',
  },
  {
    title: 'The Technology',
    text: 'Built on Binance Smart Chain, Nexus Protocol leverages smart contracts to ensure trustless, transparent, and efficient operations. Every transaction, every reward, every stake is recorded immutably on-chain.',
  },
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 particle-bg" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="neon-headline text-3xl sm:text-4xl md:text-5xl mb-4">
            ABOUT NEXUS
          </h2>
          <p className="nexus-body max-w-2xl mx-auto">
            Pioneering the intersection of blockchain technology and environmental sustainability
          </p>
        </motion.div>

        {/* About Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {aboutContent.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
              className="glass-card p-8 hover:border-primary/40 transition-colors"
            >
              <h3 className="nexus-card-title text-xl mb-4 text-primary">
                {item.title}
              </h3>
              <p className="nexus-body">
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
              className="glass-card p-6 group hover:border-primary/40 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors border border-primary/20">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="nexus-card-title text-lg mb-2 text-primary">
                {feature.title}
              </h4>
              <p className="nexus-muted text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
