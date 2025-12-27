import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import tokenomicNexus from '@/assets/tokenomic-nexus.jpeg';
import treeNft from '@/assets/tree-nft.png';
import diamondNft from '@/assets/diamond-nft.png';
import carbonNft from '@/assets/carbon-nft.png';

const tokenomicData = {
  totalSupply: '210,000,000 NXP',
  distribution: [
    { name: 'NFT Mining Pool', amount: '160,000,000', percentage: 76, color: 'primary' },
    { name: 'Liquidity Pool (DEX/CEX)', amount: '50,000,000', percentage: 24, color: 'secondary' },
  ],
};

const nftTiers = [
  { 
    name: 'TREE NFT', 
    supply: '2,070,000', 
    percentage: '98.57%', 
    price: '$10 USDT',
    image: treeNft,
    color: 'primary',
    reward: 'Mining Rewards',
    description: 'Represents real tree planting and long-term carbon offset.'
  },
  { 
    name: 'DIAMOND NFT', 
    supply: '20,000', 
    percentage: '0.95%', 
    price: '$100 USDT',
    image: diamondNft,
    color: 'secondary',
    reward: 'Enhanced Rewards',
    description: 'Premium tier with enhanced rewards and ecosystem privileges.'
  },
  { 
    name: 'CARBON NFT', 
    supply: '10,000', 
    percentage: '0.45%', 
    price: '$1,000 USDT',
    image: carbonNft,
    color: 'accent',
    reward: 'Premium Rewards',
    description: 'Directly linked to verified carbon credit mechanisms.'
  },
];

export function TokenomicsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 particle-bg" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Tokenomics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="cyber-headline text-3xl sm:text-4xl md:text-5xl mb-4">
            TOKENOMICS
          </h2>
          <p className="cyber-body max-w-2xl mx-auto">
            Fixed supply with sustainable distribution model - Token value supported by real environmental activities
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {/* Tokenomic Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="cyber-card p-4 rounded-2xl overflow-hidden">
              <img
                src={tokenomicNexus}
                alt="Nexus Tokenomics"
                className="w-full h-auto rounded-xl"
              />
            </div>
          </motion.div>

          {/* Tokenomic Details */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col justify-center"
          >
            <div className="cyber-card p-8">
              <h3 className="cyber-card-title text-2xl mb-2">
                NXP Token
              </h3>
              <p className="font-display text-4xl font-bold text-primary glow-text-cyan mb-6">
                {tokenomicData.totalSupply}
              </p>
              <p className="cyber-muted text-sm mb-4">
                Fixed Supply - No Inflation
              </p>
              <p className="cyber-body text-sm mb-8">
                Used for NFT mining rewards, ecosystem incentives, and DEX/CEX liquidity. Value supported by real environmental activities, revenue from green projects, and ecosystem growth.
              </p>

              <div className="space-y-6">
                {tokenomicData.distribution.map((item, i) => (
                  <div key={item.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">{item.name}</span>
                      <span className="cyber-muted text-sm">{item.percentage}%</span>
                    </div>
                    <div className="h-3 bg-background/50 rounded-full overflow-hidden border border-primary/20">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${item.percentage}%` } : {}}
                        transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                        className={`h-full rounded-full ${
                          item.color === 'primary' ? 'bg-primary' : 'bg-secondary'
                        }`}
                        style={{
                          boxShadow: item.color === 'primary' 
                            ? '0 0 10px hsl(185 100% 50% / 0.5)'
                            : '0 0 10px hsl(320 100% 55% / 0.5)',
                        }}
                      />
                    </div>
                    <p className="cyber-muted text-xs mt-1">
                      {item.amount} NXP
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* NFT Utility */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="cyber-headline text-3xl sm:text-4xl md:text-5xl mb-4">
            NFT UTILITY
          </h2>
          <p className="cyber-body max-w-2xl mx-auto">
            Nexus NFTs are productive assets, not collectibles. NFT holders participate in mining rewards and ecosystem revenue distribution.
          </p>
        </motion.div>

        {/* NFT Tier Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {nftTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5 + i * 0.15 }}
              className={`cyber-card-3d overflow-hidden ${
                tier.color === 'primary' ? '' : 
                tier.color === 'secondary' ? 'cyber-card-magenta' : 'cyber-card-gold'
              }`}
            >
              {/* NFT Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={tier.image}
                  alt={`${tier.name}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-display uppercase ${
                    tier.color === 'primary' ? 'bg-primary/20 text-primary border border-primary/30' : 
                    tier.color === 'secondary' ? 'bg-secondary/20 text-secondary border border-secondary/30' : 
                    'bg-accent/20 text-accent border border-accent/30'
                  }`}>
                    {tier.name}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="cyber-muted text-sm">
                  {tier.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="cyber-muted text-sm">Price</span>
                  <span className={`font-display font-bold ${
                    tier.color === 'primary' ? 'text-primary' : 
                    tier.color === 'secondary' ? 'text-secondary' : 'text-accent'
                  }`}>
                    {tier.price}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="cyber-muted text-sm">Reward Type</span>
                  <span className={`font-display font-bold ${
                    tier.color === 'primary' ? 'text-primary' : 
                    tier.color === 'secondary' ? 'text-secondary' : 'text-accent'
                  }`}>
                    {tier.reward}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="cyber-muted text-sm">Supply</span>
                  <span className="text-foreground text-sm font-mono">
                    {tier.supply} ({tier.percentage})
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
