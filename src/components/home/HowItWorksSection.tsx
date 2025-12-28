import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { ShoppingCart, Cpu, TreePine, Coins, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: ShoppingCart,
    number: '01',
    title: 'Acquire NFT',
    description: 'Purchase Nexus NFTs (Tree, Diamond, or Carbon) to join the green ecosystem.',
  },
  {
    icon: Cpu,
    number: '02',
    title: 'Activate Mining',
    description: 'Your NFTs automatically activate NXP mining mechanisms on-chain.',
  },
  {
    icon: TreePine,
    number: '03',
    title: 'Generate Credits',
    description: 'Environmental activities generate carbon credits and ecosystem revenue.',
  },
  {
    icon: Coins,
    number: '04',
    title: 'Value Distributed',
    description: 'Rewards are distributed transparently to NFT and token holders.',
  },
];

export const HowItWorksSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 tech-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 badge-tech mb-6">
            <Cpu className="w-4 h-4 text-primary" />
            <span className="nexus-label">ECOSYSTEM FLOW</span>
          </div>
          <h2 className="neon-headline text-4xl sm:text-5xl md:text-6xl mb-6">
            HOW IT WORKS
          </h2>
          <p className="nexus-body max-w-2xl mx-auto text-lg">
            From NFT ownership to real environmental impact—every step is recorded transparently on-chain.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-primary/40" />
                </div>
              )}

              <div className="glass-card p-6 h-full group hover:border-primary/40 transition-all text-center">
                {/* Number Badge */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/30 mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="text-primary font-bold text-lg">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>

                {/* Content */}
                <h3 className="nexus-card-title text-lg mb-2">{step.title}</h3>
                <p className="nexus-muted text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="nexus-body text-lg">
            <span className="text-primary font-semibold">Greater participation</span> leads to{' '}
            <span className="text-primary font-semibold">greater impact</span> and{' '}
            <span className="text-primary font-semibold">value</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
