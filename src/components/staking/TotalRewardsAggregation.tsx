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
  const totalPendingReward = stakedNFTs.reduce((acc, nft) => acc + nft.pendingReward, BigInt(0));
  const totalClaimedReward = stakedNFTs.reduce((acc, nft) => acc + nft.totalClaimed, BigInt(0));
  const stakedCount = stakedNFTs.length;

  const pendingFormatted = formatUnits(totalPendingReward, 18);
  const claimedFormatted = formatUnits(totalClaimedReward, 18);

  return (
    <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden">
      <div className="hero-card p-6 sm:p-8">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="neon-card-title text-xl sm:text-2xl flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              Total Mining Rewards
            </h2>
            <motion.button
              onClick={onRefresh}
              className="p-3 rounded-xl bg-primary/15 hover:bg-primary/25 transition-colors border border-primary/30"
              whileTap={{ scale: 0.95 }}
              style={{ boxShadow: '0 0 20px hsl(120 100% 50% / 0.2)' }}
            >
              <RefreshCw className={`w-5 h-5 text-primary ${isRefreshing ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {/* Total Pending - Hero Stat */}
            <div className="col-span-2 stats-card p-6 sm:p-8 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/50">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="neon-label">Total Pending</span>
                <div className="flex items-center gap-1 ml-auto">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-[10px] text-primary font-bold">LIVE</span>
                </div>
              </div>
              <motion.p 
                key={pendingFormatted}
                initial={{ scale: 0.95, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="neon-metric text-4xl sm:text-5xl"
              >
                {Number(pendingFormatted).toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </motion.p>
              <p className="neon-muted text-sm mt-2">NXP Tokens</p>
            </div>

            {/* Total Claimed */}
            <div className="stats-card p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <Coins className="w-4 h-4 text-primary/70" />
                <span className="neon-label text-[10px]">Total Claimed</span>
              </div>
              <p className="neon-metric text-xl sm:text-2xl">
                {Number(claimedFormatted).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="neon-muted text-xs mt-1">NXP</p>
            </div>

            {/* Wallet Balance */}
            <div className="stats-card p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="w-4 h-4 text-primary/70" />
                <span className="neon-label text-[10px]">Wallet</span>
              </div>
              <p className="neon-metric text-xl sm:text-2xl">
                {Number(nxpBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="neon-muted text-xs mt-1">NXP</p>
            </div>
          </div>

          {/* Active NFTs indicator */}
          <div className="mt-6 flex items-center justify-center gap-5 text-sm neon-muted">
            <span className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-primary rounded-full" style={{ boxShadow: '0 0 10px hsl(120 100% 50% / 0.8)' }} />
              {stakedCount} Mining NFT{stakedCount !== 1 ? 's' : ''} Active
            </span>
            <span className="text-primary/40">•</span>
            <span>Updated {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
