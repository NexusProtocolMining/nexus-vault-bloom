import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatUnits } from 'viem';
import { Sparkles, TrendingUp, Coins, Wallet, RefreshCw } from 'lucide-react';
import type { StakedNFTData } from '@/hooks/useStakedNFTs';

interface TotalRewardsAggregationProps {
  stakedNFTs: StakedNFTData[];
  nxpBalance: string;
  lastUpdate: Date;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function TotalRewardsAggregation({ 
  stakedNFTs, 
  nxpBalance, 
  lastUpdate, 
  onRefresh, 
  isRefreshing 
}: TotalRewardsAggregationProps) {
  // Aggregate rewards from staked NFTs
  const totalPendingReward = stakedNFTs.reduce((acc, nft) => {
    return acc + nft.pendingReward;
  }, BigInt(0));

  const totalClaimedReward = stakedNFTs.reduce((acc, nft) => {
    return acc + nft.totalClaimed;
  }, BigInt(0));

  const stakedCount = stakedNFTs.length;

  const pendingFormatted = formatUnits(totalPendingReward, 18);
  const claimedFormatted = formatUnits(totalClaimedReward, 18);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden"
    >
      <div className="glass-card p-4 sm:p-6 neon-glow border-primary/40">
        {/* Background glow effect */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              Total Mining Rewards
            </h2>
            <motion.button
              onClick={onRefresh}
              className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 text-primary ${isRefreshing ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Total Pending */}
            <div className="col-span-2 sm:col-span-2 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/40 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-xs sm:text-sm text-muted-foreground">Total Pending</span>
                <div className="flex items-center gap-1 ml-auto">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  <span className="text-[10px] text-primary">LIVE</span>
                </div>
              </div>
              <motion.p 
                key={pendingFormatted}
                initial={{ scale: 0.95, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display font-bold text-2xl sm:text-4xl text-primary neon-glow-text"
              >
                {Number(pendingFormatted).toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </motion.p>
              <p className="text-xs text-primary/70 mt-1">NXP Tokens</p>
            </div>

            {/* Total Claimed */}
            <div className="bg-card/60 border border-border/50 rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-4 h-4 text-muted-foreground" />
                <span className="text-[10px] sm:text-xs text-muted-foreground">Total Claimed</span>
              </div>
              <p className="font-display font-bold text-lg sm:text-xl text-foreground">
                {Number(claimedFormatted).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-muted-foreground">NXP</p>
            </div>

            {/* Wallet Balance */}
            <div className="bg-card/60 border border-border/50 rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-muted-foreground" />
                <span className="text-[10px] sm:text-xs text-muted-foreground">Wallet</span>
              </div>
              <p className="font-display font-bold text-lg sm:text-xl text-foreground">
                {Number(nxpBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-muted-foreground">NXP</p>
            </div>
          </div>

          {/* Active NFTs indicator */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-primary rounded-full" />
              {stakedCount} Mining NFT{stakedCount !== 1 ? 's' : ''}
            </span>
            <span>•</span>
            <span>Updated {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
