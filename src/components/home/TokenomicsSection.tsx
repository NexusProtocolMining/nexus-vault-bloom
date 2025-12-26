import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import tokenomicNexus from '@/assets/tokenomic-nexus.jpeg';
import nftnomicNexus from '@/assets/nftnomic.jpeg';

const tokenomicData = {
  totalSupply: '210,000,000 NXP',
  distribution: [
    { name: 'NFT Mining Pool', amount: '160,000,000', percentage: 76, color: 'primary' },
    { name: 'Liquidity Pool (DEX/CEX)', amount: '50,000,000', percentage: 24, color: 'accent' },
  ],
};

const nftData = {
  totalSupply: '2,100,000',
  tiers: [
    { name: 'TREE', supply: '2,070,000', percentage: '98.57%', price: '$10 USDT' },
    { name: 'DIAMOND', supply: '20,000', percentage: '0.95%', price: '$100 USDT' },
    { name: 'CARBON', supply: '10,000', percentage: '0.45%', price: '$1,000 USDT' },
  ],
};

export function TokenomicsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Tokenomics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">Token</span>omics
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fixed supply with sustainable distribution model
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
            <div className="glass-card p-4 rounded-2xl overflow-hidden">
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
            <div className="glass-card p-8">
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                NXP Token
              </h3>
              <p className="text-4xl font-display font-bold text-primary mb-6">
                {tokenomicData.totalSupply}
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Fixed Supply - No Inflation
              </p>

              <div className="space-y-6">
                {tokenomicData.distribution.map((item, i) => (
                  <div key={item.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">{item.name}</span>
                      <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${item.percentage}%` } : {}}
                        transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                        className={`h-full rounded-full ${
                          item.color === 'primary' ? 'bg-primary' : 'bg-accent'
                        }`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.amount} NXP
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* NFTnomics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">NFT</span>nomics
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three tiers of NFTs powering the mining ecosystem
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* NFTnomic Details */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col justify-center order-2 lg:order-1"
          >
            <div className="glass-card p-8">
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                NFT Collection
              </h3>
              <p className="text-4xl font-display font-bold text-primary mb-6">
                {nftData.totalSupply}
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Total NFT Supply
              </p>

              <div className="space-y-4">
                {nftData.tiers.map((tier, i) => (
                  <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-primary/10 hover:border-primary/30 transition-colors"
                  >
                    <div>
                      <h4 className="font-display font-bold text-foreground">{tier.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {tier.supply} ({tier.percentage})
                      </p>
                    </div>
                    <span className="font-display font-bold text-primary">
                      {tier.price}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* NFTnomic Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative order-1 lg:order-2"
          >
            <div className="glass-card p-4 rounded-2xl overflow-hidden">
              <img
                src={nftnomicNexus}
                alt="Nexus NFTnomics"
                className="w-full h-auto rounded-xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
