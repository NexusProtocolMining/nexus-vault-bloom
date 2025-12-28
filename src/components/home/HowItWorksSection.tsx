import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { ShoppingCart, Cpu, TreePine, Coins, ArrowRight, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: ShoppingCart,
    number: '01',
    title: 'ACQUIRE NFT',
    description: 'Purchase Nexus NFTs (Tree, Diamond, or Carbon) to join the green ecosystem.',
    status: 'MINT NOW',
  },
  {
    icon: Cpu,
    number: '02',
    title: 'ACTIVATE MINING',
    description: 'Your NFTs automatically activate NXP mining mechanisms on-chain.',
    status: 'START MINING',
  },
  {
    icon: TreePine,
    number: '03',
    title: 'GENERATE CREDITS',
    description: 'Environmental activities generate carbon credits and ecosystem revenue.',
    status: 'REAL IMPACT',
  },
  {
    icon: Coins,
    number: '04',
    title: 'VALUE DISTRIBUTED',
    description: 'Rewards are distributed transparently to NFT and token holders.',
    status: 'CLAIM REWARDS',
  },
];

export const HowItWorksSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-28 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 tech-grid-bg opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="badge-tech mb-6">
            <Cpu className="w-4 h-4" />
            <span>ECOSYSTEM FLOW</span>
          </div>
          <h2 className="neon-headline text-4xl sm:text-5xl md:text-6xl mb-6">
            HOW DOES NFT MINING WORK?
          </h2>
          <p className="neon-body max-w-2xl mx-auto text-lg">
            From NFT ownership to real environmental impact—every step is recorded transparently on-chain.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/3 -right-4 transform z-10">
                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-8 h-8 text-primary/60" />
                  </motion.div>
                </div>
              )}

              <motion.div 
                className="nft-card p-7 h-full text-center group"
                whileHover={{ y: -15, scale: 1.02 }}
              >
                {/* Number Badge */}
                <motion.div 
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/15 border-2 border-primary/50 mb-6 group-hover:bg-primary/25 transition-all"
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  style={{ boxShadow: '0 0 30px hsl(120 100% 50% / 0.3)' }}
                >
                  <span className="neon-metric text-2xl">{step.number}</span>
                </motion.div>

                {/* Icon */}
                <div className="flex justify-center mb-5">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center"
                  >
                    <step.icon className="w-8 h-8 text-primary" />
                  </motion.div>
                </div>

                {/* Content */}
                <h3 className="neon-card-title text-lg mb-3">{step.title}</h3>
                <p className="neon-muted text-sm mb-5 leading-relaxed">{step.description}</p>
                
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-primary text-xs font-display font-bold tracking-wider">{step.status}</span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="glass-card inline-block px-10 py-6 rounded-2xl">
            <p className="neon-body text-lg">
              <span className="text-primary font-bold glow-text-neon">Greater participation</span> leads to{' '}
              <span className="text-primary font-bold glow-text-neon">greater impact</span> and{' '}
              <span className="text-primary font-bold glow-text-neon">value</span>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
