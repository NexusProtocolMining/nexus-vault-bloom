import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import nexusRoadmap from '@/assets/nexus-roadmap.jpeg';

const phases = [
  {
    phase: 'Phase 1',
    title: 'Foundation',
    quarter: 'Q1',
    items: [
      'Final Tokenomic & NFTnomic',
      'Smart Contract NFT Mining',
      'Wallet Basic',
      'NFT Tree Release',
      'NFT Diamond Release',
      'NFT Carbon Release',
    ],
    active: true,
  },
  {
    phase: 'Phase 2',
    title: 'Token Launch',
    quarter: 'Q2',
    items: [
      'NXP Token Launch',
      'White Paper Release',
      'Dapps Liquidity',
      'DEX Liquidity',
      'NFT Reward Distribution',
    ],
    active: false,
  },
  {
    phase: 'Phase 3',
    title: 'RWA Activation',
    quarter: 'Q3',
    items: [
      'Carbon Project Onboarding',
      'NFT RWA Launch',
      'Carbon Credit Tokenization',
      'Revenue Pertama (USD)',
      'Treasury RWA Aktif',
    ],
    active: false,
  },
  {
    phase: 'Phase 4',
    title: 'Ecosystem Expansion',
    quarter: 'Year 2',
    items: [
      'Carbon Marketplace',
      'Enterprise Partnerships',
      'Governance System',
      'CEX Listing',
    ],
    active: false,
  },
  {
    phase: 'Phase 5',
    title: 'Nexus Chain',
    quarter: 'Year 3',
    items: [
      'Nexus Blockchain',
      'Validator Network',
      'RWA Multisector',
      'Institutional Onboarding',
    ],
    active: false,
  },
];

export function RoadmapSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={nexusRoadmap}
          alt="Nexus Roadmap"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="neon-headline text-3xl sm:text-4xl md:text-5xl mb-4">
            ROADMAP
          </h2>
          <p className="nexus-body max-w-2xl mx-auto">
            Our journey to build a sustainable blockchain ecosystem
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative ${phase.active ? '' : 'opacity-70'}`}
              >
                {/* Timeline dot */}
                <div className="hidden lg:flex absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 items-center justify-center z-10"
                  style={{
                    borderColor: phase.active ? 'hsl(135 100% 50%)' : 'hsl(135 50% 25%)',
                    backgroundColor: phase.active ? 'hsl(135 100% 50%)' : 'transparent',
                    boxShadow: phase.active ? '0 0 20px hsl(135 100% 50% / 0.6)' : 'none',
                  }}
                >
                  {phase.active && (
                    <motion.div
                      className="w-3 h-3 rounded-full bg-primary"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                <div className={`glass-card p-6 mt-8 lg:mt-12 h-full transition-all ${
                  phase.active ? 'border-primary/50 neon-glow' : 'hover:border-primary/30'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                      {phase.quarter}
                    </span>
                    {phase.active && (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary text-primary-foreground">
                        Current
                      </span>
                    )}
                  </div>
                  
                  <h3 className="nexus-card-title text-lg text-primary mb-1">
                    {phase.phase}
                  </h3>
                  <h4 className="text-primary font-semibold mb-4">
                    {phase.title}
                  </h4>

                  <ul className="space-y-2">
                    {phase.items.map((item, j) => (
                      <li key={j} className="nexus-muted text-xs flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
