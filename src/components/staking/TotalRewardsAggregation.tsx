import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { Sparkles, TrendingUp, Coins, Wallet, RefreshCw } from 'lucide-react';
import { CONTRACTS } from '@/config/contracts';
import { STAKING_ABI, NFT_MINER_ABI } from '@/config/abis';

interface TotalRewardsAggregationProps {
  tokenIds: bigint[] | undefined;
  nxpBalance: string;
  nftRewardsMap: Map<string, { pendingReward: bigint; totalClaimed: bigint; isStaked: boolean }>;
}

interface StakedNFTReward {
  tokenId: bigint;
  tier: number;
  pendingReward: bigint;
  totalClaimed: bigint;
  isStaked: boolean;
}

export function TotalRewardsAggregation({ tokenIds, nxpBalance, nftRewardsMap }: TotalRewardsAggregationProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Aggregate rewards from the map
  const totalPendingReward = Array.from(nftRewardsMap.values()).reduce((acc, nft) => {
    if (nft.isStaked) {
      return acc + nft.pendingReward;
    }
    return acc;
  }, BigInt(0));

  const totalClaimedReward = Array.from(nftRewardsMap.values()).reduce((acc, nft) => {
    return acc + nft.totalClaimed;
  }, BigInt(0));

  const stakedCount = Array.from(nftRewardsMap.values()).filter(nft => nft.isStaked).length;

  const pendingFormatted = formatUnits(totalPendingReward, 18);
  const claimedFormatted = formatUnits(totalClaimedReward, 18);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLastUpdate(new Date());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Auto refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

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
              Total Staking Rewards
            </h2>
            <motion.button
              onClick={handleRefresh}
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
              {stakedCount} Active NFT{stakedCount !== 1 ? 's' : ''}
            </span>
            <span>•</span>
            <span>Updated {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Individual NFT reward fetcher component
interface NFTRewardFetcherProps {
  tokenId: bigint;
  onDataLoaded: (data: StakedNFTReward) => void;
}

export function NFTRewardFetcher({ tokenId, onDataLoaded }: NFTRewardFetcherProps) {
  const { data: tier } = useReadContract({
    address: CONTRACTS.NFT_MINER,
    abi: NFT_MINER_ABI,
    functionName: 'tokenTier',
    args: [tokenId],
  });

  const { data: stakeInfo } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'getStakeCore',
    args: [tokenId],
  });

  const { data: pendingReward, refetch } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'getStakeReward',
    args: [tokenId],
  });

  const { data: totalClaimed } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'totalClaimed',
    args: [tokenId],
  });

  useEffect(() => {
    const stakeData = stakeInfo as [string, bigint, bigint] | undefined;
    const isStaked = stakeData && stakeData[0] !== '0x0000000000000000000000000000000000000000';

    onDataLoaded({
      tokenId,
      tier: tier !== undefined ? Number(tier) : 0,
      pendingReward: (pendingReward as bigint) ?? BigInt(0),
      totalClaimed: (totalClaimed as bigint) ?? BigInt(0),
      isStaked: !!isStaked,
    });
  }, [tokenId, tier, stakeInfo, pendingReward, totalClaimed, onDataLoaded]);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 15000);
    return () => clearInterval(interval);
  }, [refetch]);

  return null;
}
