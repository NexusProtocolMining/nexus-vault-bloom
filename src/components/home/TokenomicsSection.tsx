import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Coins, TrendingUp } from 'lucide-react';
import tokenomicNexus from '@/assets/tokenomic-nexus.jpeg';
import treeNft from '@/assets/tree-nft.png';
import diamondNft from '@/assets/diamond-nft.png';
import carbonNft from '@/assets/carbon-nft.png';

const tokenomicData = {
  totalSupply: '210,000,000 NXP',
  distribution: [
    { name: 'NFT MINING POOL', amount: '160,000,000', percentage: 76 },
    { name: 'LIQUIDITY POOL (DEX/CEX)', amount: '50,000,000', percentage: 24 },
  ],
};

const nftTiers = [
  { 
    name: 'TREE NFT', 
    supply: '2,070,000', 
    percentage: '98.57%', 
    price: '$10 USDT',
    image: treeNft,
    reward: 'MINING REWARDS',
    description: 'REPRESENTS REAL TREE PLANTING AND LONG-TERM CARBON OFFSET.',
    miningPower: '1X',
  },
  { 
    name: 'DIAMOND NFT', 
    supply: '20,000', 
    percentage: '0.95%', 
    price: '$100 USDT',
    image: diamondNft,
    reward: 'ENHANCED REWARDS',
    description: 'PREMIUM TIER WITH ENHANCED REWARDS AND ECOSYSTEM PRIVILEGES.',
    miningPower: '10X',
  },
  { 
    name: 'CARBON NFT', 
    supply: '10,000', 
    percentage: '0.45%', 
    price: '$1,000 USDT',
    image: carbonNft,
    reward: 'PREMIUM REWARDS',
    description: 'DIRECTLY LINKED TO VERIFIED CARBON CREDIT MECHANISMS.',
    miningPower: '100X',
  },
];

export function TokenomicsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 particle-bg" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Tokenomics Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="badge-tech mb-6">
            <Coins className="w-4 h-4" />
            <span>TOKEN ECONOMICS</span>
          </div>
          <h2 className="neon-headline text-4xl sm:text-5xl md:text-6xl mb-6">
            TOKENOMICS
          </h2>
          <p className="neon-body max-w-2xl mx-auto text-lg">
            FIXED SUPPLY WITH SUSTAINABLE DISTRIBUTION MODEL — TOKEN VALUE SUPPORTED BY REAL ENVIRONMENTAL ACTIVITIES
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 mb-24">
          {/* Tokenomic Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="hero-card p-5 rounded-3xl overflow-hidden">
              <img
                src={tokenomicNexus}
                alt="Nexus Tokenomics"
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </motion.div>

          {/* Tokenomic Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col justify-center"
          >
            <div className="glass-card p-8 rounded-2xl">
              <h3 className="neon-card-title text-2xl mb-3">NXP TOKEN</h3>
              <p className="neon-metric text-5xl mb-4">{tokenomicData.totalSupply}</p>
              <p className="neon-muted text-sm mb-6">FIXED SUPPLY — NO INFLATION</p>
              
              <p className="neon-body text-sm mb-10 leading-relaxed">
                USED FOR NFT MINING REWARDS, ECOSYSTEM INCENTIVES, AND DEX/CEX LIQUIDITY. 
                VALUE SUPPORTED BY REAL ENVIRONMENTAL ACTIVITIES AND ECOSYSTEM GROWTH.
              </p>

              <div className="space-y-7">
                {tokenomicData.distribution.map((item, i) => (
                  <div key={item.name}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-white/90 font-display tracking-wider">{item.name}</span>
                      <span className="neon-metric text-lg">{item.percentage}%</span>
                    </div>
                    <div className="h-4 bg-background/60 rounded-full overflow-hidden border border-primary/30">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${item.percentage}%` } : {}}
                        transition={{ duration: 1.2, delay: 0.6 + i * 0.2 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary"
                        style={{ boxShadow: '0 0 20px hsl(120 100% 50% / 0.6)' }}
                      />
                    </div>
                    <p className="neon-muted text-xs mt-2">{item.amount} NXP</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* NFT Utility Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-center mb-16"
        >
          <div className="badge-tech mb-6">
            <TrendingUp className="w-4 h-4" />
            <span>PRODUCTIVE ASSETS</span>
          </div>
          <h2 className="neon-headline text-4xl sm:text-5xl md:text-6xl mb-6">
            NFT UTILITY
          </h2>
          <p className="neon-body max-w-2xl mx-auto text-lg">
            NEXUS NFTS ARE PRODUCTIVE ASSETS, NOT COLLECTIBLES. HOLDERS PARTICIPATE IN MINING REWARDS AND REVENUE DISTRIBUTION.
          </p>
        </motion.div>

        {/* NFT Tier Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {nftTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 + i * 0.15 }}
              className="nft-card overflow-hidden group"
            >
              {/* NFT Image */}
              <div className="relative aspect-square overflow-hidden">
                <motion.img
                  src={tier.image}
                  alt={tier.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 rounded-full text-xs font-display font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/40"
                    style={{ boxShadow: '0 0 20px hsl(120 100% 50% / 0.3)' }}
                  >
                    {tier.name}
                  </span>
                </div>

                {/* Mining Power Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1.5 rounded-lg text-xs font-display font-bold bg-background/80 text-primary border border-primary/40 tracking-wider">
                    {tier.miningPower} POWER
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-7 space-y-5">
                <p className="neon-muted text-sm leading-relaxed">{tier.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="stats-card p-4 text-center">
                    <p className="neon-label text-[10px] mb-1">PRICE</p>
                    <p className="neon-metric text-lg">{tier.price}</p>
                  </div>
                  <div className="stats-card p-4 text-center">
                    <p className="neon-label text-[10px] mb-1">SUPPLY</p>
                    <p className="text-white font-mono text-sm">{tier.supply}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="neon-muted text-sm">REWARD TYPE</span>
                  <span className="text-primary font-display font-bold text-sm tracking-wider">{tier.reward}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
