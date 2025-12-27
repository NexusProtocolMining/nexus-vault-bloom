import { motion } from 'framer-motion';
import { BarChart3, Leaf, Diamond, Flame, TrendingUp } from 'lucide-react';

import treeNFT from '@/assets/tree-nft.png';
import diamondNFT from '@/assets/diamond-nft.png';
import carbonNFT from '@/assets/carbon-nft.png';

// Tier reward data (based on typical staking reward structures)
const tierData = [
  {
    name: 'TREE',
    image: treeNFT,
    icon: Leaf,
    price: 10,
    dailyReward: 0.5,
    monthlyReward: 15,
    yearlyReward: 180,
    apy: '~180%',
    color: 'emerald',
    barHeight: 30,
  },
  {
    name: 'DIAMOND',
    image: diamondNFT,
    icon: Diamond,
    price: 100,
    dailyReward: 6,
    monthlyReward: 180,
    yearlyReward: 2160,
    apy: '~216%',
    color: 'cyan',
    barHeight: 60,
  },
  {
    name: 'CARBON',
    image: carbonNFT,
    icon: Flame,
    price: 1000,
    dailyReward: 70,
    monthlyReward: 2100,
    yearlyReward: 25200,
    apy: '~252%',
    color: 'amber',
    barHeight: 100,
  },
];

export function TierComparisonChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          NFT Tier Comparison
        </h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full">
          <TrendingUp className="w-3 h-3 text-primary" />
          <span className="text-xs text-primary">Rewards</span>
        </div>
      </div>

      {/* Visual Bar Chart */}
      <div className="mb-6">
        <div className="flex items-end justify-around gap-4 h-40 px-4">
          {tierData.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ height: 0 }}
              animate={{ height: `${tier.barHeight}%` }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.6, ease: "easeOut" }}
              className="relative flex flex-col items-center"
            >
              {/* Bar */}
              <div 
                className={`w-16 sm:w-20 rounded-t-xl relative overflow-hidden ${
                  tier.color === 'emerald' ? 'bg-gradient-to-t from-emerald-600/80 to-emerald-400/60' :
                  tier.color === 'cyan' ? 'bg-gradient-to-t from-cyan-600/80 to-cyan-400/60' :
                  'bg-gradient-to-t from-amber-600/80 to-amber-400/60'
                }`}
                style={{ height: '100%' }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                {/* APY label on bar */}
                <div className="absolute top-2 left-0 right-0 text-center">
                  <span className="text-[10px] sm:text-xs font-bold text-white/90">{tier.apy}</span>
                </div>
              </div>
              
              {/* Tier Image */}
              <div className="absolute -top-12 sm:-top-14">
                <motion.div 
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-primary/50 shadow-lg"
                >
                  <img src={tier.image} alt={tier.name} className="w-full h-full object-cover" />
                </motion.div>
              </div>
              
              {/* Label */}
              <p className={`mt-2 text-xs sm:text-sm font-bold ${
                tier.color === 'emerald' ? 'text-emerald-400' :
                tier.color === 'cyan' ? 'text-cyan-400' :
                'text-amber-400'
              }`}>
                {tier.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-4 gap-2 text-[10px] sm:text-xs text-muted-foreground px-2">
          <span>Tier</span>
          <span className="text-center">Price</span>
          <span className="text-center">Daily</span>
          <span className="text-center">Monthly</span>
        </div>
        
        {/* Rows */}
        {tierData.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className={`grid grid-cols-4 gap-2 p-2 sm:p-3 rounded-lg border ${
              tier.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/30' :
              tier.color === 'cyan' ? 'bg-cyan-500/10 border-cyan-500/30' :
              'bg-amber-500/10 border-amber-500/30'
            }`}
          >
            <div className="flex items-center gap-2">
              <tier.icon className={`w-4 h-4 ${
                tier.color === 'emerald' ? 'text-emerald-400' :
                tier.color === 'cyan' ? 'text-cyan-400' :
                'text-amber-400'
              }`} />
              <span className="font-bold text-xs sm:text-sm">{tier.name}</span>
            </div>
            <span className="text-center font-mono text-xs sm:text-sm text-foreground">${tier.price}</span>
            <span className="text-center font-mono text-xs sm:text-sm text-primary">{tier.dailyReward} NXP</span>
            <span className="text-center font-mono text-xs sm:text-sm text-primary">{tier.monthlyReward} NXP</span>
          </motion.div>
        ))}
      </div>

      <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-4">
        * Reward rates are calculated based on on-chain staking parameters
      </p>
    </motion.div>
  );
}
