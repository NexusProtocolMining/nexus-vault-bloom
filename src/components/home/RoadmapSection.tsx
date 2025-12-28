import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Flag, CheckCircle } from 'lucide-react';
import nexusRoadmap from '@/assets/nexus-roadmap.jpeg';

const phases = [
  {
    phase: 'Phase 1',
    title: 'Foundation',
    quarter: 'Q1',
    items: [
      'NFT Launch',
      'Smart Contracts',
      'Wallet Integration',
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
      'Mining & Rewards',
      'DEX/CEX Liquidity',
      'NFT Reward Distribution',
    ],
    active: false,
  },
  {
    phase: 'Phase 3',
    title: 'RWA Integration',
    quarter: 'Q3',
    items: [
      'Carbon Credit Integration',
      'NFT RWA Launch',
      'Carbon Credit Tokenization',
      'Revenue Generation (USD)',
      'Treasury RWA Active',
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
      'Global Partnerships',
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
    <section ref={ref} className="py-28 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={nexusRoadmap}
          alt="Nexus Roadmap"
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>
      
      <div className="absolute inset-0 matrix-grid-bg opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="badge-tech mb-6">
            <Flag className="w-4 h-4" />
            <span>PROJECT MILESTONES</span>
          </div>
          <h2 className="neon-headline text-4xl sm:text-5xl md:text-6xl mb-6">
            ROADMAP
          </h2>
          <p className="neon-body max-w-2xl mx-auto text-lg">
            Our journey to build a sustainable green blockchain ecosystem
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute top-28 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className={`relative ${phase.active ? '' : 'opacity-75'}`}
              >
                {/* Timeline dot */}
                <div className="hidden lg:flex absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-3 items-center justify-center z-10"
                  style={{
                    borderColor: phase.active ? 'hsl(120 100% 50%)' : 'hsl(120 50% 25%)',
                    backgroundColor: phase.active ? 'hsl(120 100% 50%)' : 'transparent',
                    boxShadow: phase.active ? '0 0 30px hsl(120 100% 50% / 0.7)' : 'none',
                  }}
                >
                  {phase.active && (
                    <motion.div
                      className="w-4 h-4 rounded-full bg-primary-foreground"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                <motion.div 
                  className={`glass-card p-6 mt-10 lg:mt-14 h-full transition-all ${
                    phase.active ? 'border-primary/60 neon-glow' : 'hover:border-primary/40'
                  }`}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full border bg-primary/15 text-primary border-primary/40">
                      {phase.quarter}
                    </span>
                    {phase.active && (
                      <span className="text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground font-bold">
                        CURRENT
                      </span>
                    )}
                  </div>
                  
                  <h3 className="neon-card-title text-lg mb-1">{phase.phase}</h3>
                  <h4 className="text-primary font-semibold mb-5">{phase.title}</h4>

                  <ul className="space-y-3">
                    {phase.items.map((item, j) => (
                      <li key={j} className="neon-muted text-xs flex items-start gap-2">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${phase.active ? 'text-primary' : 'text-primary/40'}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
