import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  Loader2, Wallet, Clock, Coins, Lock, Unlock, Gift, 
  Zap, TrendingUp, ArrowDown, Calendar, AlertCircle, CheckCircle,
  Sparkles, Activity
} from 'lucide-react';
import { CONTRACTS } from '@/config/contracts';
import { NFT_MINER_ABI, STAKING_ABI, INTERNAL_POOL_ABI, ERC20_ABI } from '@/config/abis';
import { toast } from '@/hooks/use-toast';
import { useStakedNFTs, type StakedNFTData } from '@/hooks/useStakedNFTs';

// Staking components
import { TierComparisonChart } from '@/components/staking/TierComparisonChart';
import { RewardHistory, ClaimHistoryItem } from '@/components/staking/RewardHistory';
import { TotalRewardsAggregation } from '@/components/staking/TotalRewardsAggregation';

import treeNFT from '@/assets/tree-nft.png';
import diamondNFT from '@/assets/diamond-nft.png';
import carbonNFT from '@/assets/carbon-nft.png';

const tierImages: Record<number, string> = {
  0: treeNFT,
  1: diamondNFT,
  2: carbonNFT,
};

const tierNames: Record<number, string> = {
  0: 'TREE',
  1: 'DIAMOND',
  2: 'CARBON',
};

// Countdown Hook
const useCountdown = (targetTimestamp: bigint | undefined) => {
  const calculateTimeLeft = useCallback(() => {
    if (!targetTimestamp) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, totalSeconds: 0 };
    }

    const now = Math.floor(Date.now() / 1000);
    const target = Number(targetTimestamp);
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, totalSeconds: 0 };
    }

    return {
      days: Math.floor(difference / (60 * 60 * 24)),
      hours: Math.floor((difference % (60 * 60 * 24)) / (60 * 60)),
      minutes: Math.floor((difference % (60 * 60)) / 60),
      seconds: difference % 60,
      isExpired: false,
      totalSeconds: difference,
    };
  }, [targetTimestamp]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return timeLeft;
};

// Countdown Timer Component
const CountdownTimer = ({ 
  targetTimestamp, 
  label, 
  variant = 'default'
}: { 
  targetTimestamp: bigint | undefined; 
  label: string;
  variant?: 'default' | 'large';
}) => {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetTimestamp);

  if (isExpired) {
    return (
      <div className="text-center">
        <p className="text-xs text-muted-foreground mb-2">{label}</p>
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/40 rounded-lg"
        >
          <CheckCircle className="w-4 h-4 text-primary" />
          <span className="text-primary font-bold">Ready!</span>
        </motion.div>
      </div>
    );
  }

  const isLarge = variant === 'large';

  return (
    <div className="text-center">
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <div className="flex justify-center gap-1">
        {days > 0 && (
          <div className={`bg-card/80 border border-primary/20 rounded-lg ${isLarge ? 'px-3 py-2' : 'px-2 py-1'}`}>
            <motion.span 
              key={days}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`font-bold text-primary font-mono ${isLarge ? 'text-xl' : 'text-sm'}`}
            >
              {days}
            </motion.span>
            <span className={`block text-muted-foreground ${isLarge ? 'text-xs' : 'text-[10px]'}`}>Days</span>
          </div>
        )}
        <div className={`bg-card/80 border border-primary/20 rounded-lg ${isLarge ? 'px-3 py-2' : 'px-2 py-1'}`}>
          <span className={`font-bold text-primary font-mono ${isLarge ? 'text-xl' : 'text-sm'}`}>
            {hours.toString().padStart(2, '0')}
          </span>
          <span className={`block text-muted-foreground ${isLarge ? 'text-xs' : 'text-[10px]'}`}>Hrs</span>
        </div>
        <div className={`bg-card/80 border border-primary/20 rounded-lg ${isLarge ? 'px-3 py-2' : 'px-2 py-1'}`}>
          <span className={`font-bold text-primary font-mono ${isLarge ? 'text-xl' : 'text-sm'}`}>
            {minutes.toString().padStart(2, '0')}
          </span>
          <span className={`block text-muted-foreground ${isLarge ? 'text-xs' : 'text-[10px]'}`}>Min</span>
        </div>
        <div className={`bg-card/80 border border-primary/20 rounded-lg ${isLarge ? 'px-3 py-2' : 'px-2 py-1'}`}>
          <motion.span 
            key={seconds}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className={`font-bold text-primary font-mono ${isLarge ? 'text-xl' : 'text-sm'}`}
          >
            {seconds.toString().padStart(2, '0')}
          </motion.span>
          <span className={`block text-muted-foreground ${isLarge ? 'text-xs' : 'text-[10px]'}`}>Sec</span>
        </div>
      </div>
    </div>
  );
};

const Staking = () => {
  const { address, isConnected } = useAccount();
  const [processingId, setProcessingId] = useState<bigint | null>(null);
  const [sellAmount, setSellAmount] = useState('');
  const [sellStep, setSellStep] = useState<'idle' | 'approve' | 'sell'>('idle');
  const [claimHistory, setClaimHistory] = useState<ClaimHistoryItem[]>([]);
  const [claimingTokenInfo, setClaimingTokenInfo] = useState<{ tokenId: bigint; tier: number } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch staked NFTs using the new hook
  const { stakedNFTs, isLoading: isLoadingStaked, lastUpdate, refetch: refetchStaked } = useStakedNFTs();

  // Read owned NFTs
  const { data: tokenIds, refetch: refetchTokens } = useReadContract({
    address: CONTRACTS.NFT_MINER,
    abi: NFT_MINER_ABI,
    functionName: 'tokensOfOwner',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read staking durations
  const { data: lockDuration } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'LOCK_DURATION',
  });

  const { data: claimInterval } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'CLAIM_INTERVAL',
  });

  // Read NXP balance for sell
  const { data: nxpBalance, refetch: refetchNxpBalance } = useReadContract({
    address: CONTRACTS.NXP,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read NXP allowance for Internal Pool
  const { data: nxpAllowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.NXP,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.INTERNAL_POOL] : undefined,
    query: { enabled: !!address },
  });

  // Read pool data
  const { data: pricePerNXP } = useReadContract({
    address: CONTRACTS.INTERNAL_POOL,
    abi: INTERNAL_POOL_ABI,
    functionName: 'pricePerNXP',
  });

  const { data: sellEnabled } = useReadContract({
    address: CONTRACTS.INTERNAL_POOL,
    abi: INTERNAL_POOL_ABI,
    functionName: 'sellEnabled',
  });

  // Write contracts
  const { writeContract: stakeNFT, data: stakeTxHash, isPending: isStaking } = useWriteContract();
  const { writeContract: claimReward, data: claimTxHash, isPending: isClaiming } = useWriteContract();
  const { writeContract: unstakeNFT, data: unstakeTxHash, isPending: isUnstaking } = useWriteContract();
  const { writeContract: approveNXP, data: approveTxHash, isPending: isApproving } = useWriteContract();
  const { writeContract: sellNXP, data: sellTxHash, isPending: isSelling } = useWriteContract();

  // Transaction receipts
  const { isSuccess: isStakeSuccess } = useWaitForTransactionReceipt({ hash: stakeTxHash });
  const { isSuccess: isClaimSuccess } = useWaitForTransactionReceipt({ hash: claimTxHash });
  const { isSuccess: isUnstakeSuccess } = useWaitForTransactionReceipt({ hash: unstakeTxHash });
  const { isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveTxHash });
  const { isSuccess: isSellSuccess } = useWaitForTransactionReceipt({ hash: sellTxHash });

  // Handle stake
  const handleStake = (tokenId: bigint) => {
    setProcessingId(tokenId);
    stakeNFT({
      address: CONTRACTS.STAKING,
      abi: STAKING_ABI,
      functionName: 'stake',
      args: [tokenId],
    } as any);
  };

  // Handle claim with history tracking
  const handleClaim = (tokenId: bigint, tier?: number) => {
    setProcessingId(tokenId);
    // Store tier info for history logging
    if (tier !== undefined) {
      setClaimingTokenInfo({ tokenId, tier });
    }
    claimReward({
      address: CONTRACTS.STAKING,
      abi: STAKING_ABI,
      functionName: 'claim',
      args: [tokenId],
    } as any);
  };

  // Handle unstake
  const handleUnstake = (tokenId: bigint) => {
    setProcessingId(tokenId);
    unstakeNFT({
      address: CONTRACTS.STAKING,
      abi: STAKING_ABI,
      functionName: 'unstake',
      args: [tokenId],
    } as any);
  };

  // Sell reward handlers
  const sellAmountWei = sellAmount ? parseUnits(sellAmount, 18) : BigInt(0);
  const needsApproval = nxpAllowance !== undefined && sellAmountWei > BigInt(0)
    ? (nxpAllowance as bigint) < sellAmountWei
    : true;

  const handleApprove = () => {
    if (!sellAmountWei) return;
    setSellStep('approve');
    approveNXP({
      address: CONTRACTS.NXP,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [CONTRACTS.INTERNAL_POOL, sellAmountWei],
    } as any);
  };

  const handleSell = () => {
    if (!sellAmountWei) return;
    setSellStep('sell');
    sellNXP({
      address: CONTRACTS.INTERNAL_POOL,
      abi: INTERNAL_POOL_ABI,
      functionName: 'sellNXP',
      args: [sellAmountWei],
    } as any);
  };

  // Transaction success effects
  useEffect(() => {
    if (isStakeSuccess) {
      toast({ title: 'NFT Mining Activated!', description: 'Your NFT is now mining and earning NXP rewards.' });
      refetchTokens();
      refetchStaked();
      setProcessingId(null);
    }
  }, [isStakeSuccess, refetchTokens, refetchStaked]);

  useEffect(() => {
    if (isClaimSuccess && claimingTokenInfo) {
      // Get pending reward from stakedNFTs
      const nftData = stakedNFTs.find(n => n.tokenId === claimingTokenInfo.tokenId);
      const claimedAmount = nftData ? formatUnits(nftData.pendingReward, 18) : '0';
      
      // Add to claim history
      const newHistoryItem: ClaimHistoryItem = {
        id: `${Date.now()}-${claimingTokenInfo.tokenId.toString()}`,
        tokenId: claimingTokenInfo.tokenId.toString(),
        tierName: tierNames[claimingTokenInfo.tier] || 'NFT',
        amount: claimedAmount,
        timestamp: new Date(),
        txHash: claimTxHash,
      };
      setClaimHistory(prev => [newHistoryItem, ...prev]);
      
      toast({ title: 'Mining Rewards Claimed!', description: 'NXP tokens have been sent to your wallet.' });
      refetchNxpBalance();
      refetchStaked();
      setProcessingId(null);
      setClaimingTokenInfo(null);
    }
  }, [isClaimSuccess, claimingTokenInfo, claimTxHash, stakedNFTs, refetchNxpBalance, refetchStaked]);

  useEffect(() => {
    if (isUnstakeSuccess) {
      toast({ title: 'Mining Stopped!', description: 'Your NFT has been returned to your wallet.' });
      refetchTokens();
      refetchStaked();
      setProcessingId(null);
    }
  }, [isUnstakeSuccess, refetchTokens, refetchStaked]);

  useEffect(() => {
    if (isApproveSuccess) {
      toast({ title: 'Approval Successful', description: 'NXP approved for selling.' });
      refetchAllowance();
      setSellStep('idle');
    }
  }, [isApproveSuccess, refetchAllowance]);

  useEffect(() => {
    if (isSellSuccess) {
      toast({ title: 'Sale Complete!', description: `Sold ${sellAmount} NXP successfully.` });
      refetchNxpBalance();
      refetchAllowance();
      setSellAmount('');
      setSellStep('idle');
    }
  }, [isSellSuccess, sellAmount, refetchNxpBalance, refetchAllowance]);

  // Format duration
  const formatDuration = (seconds: bigint): string => {
    const days = Number(seconds) / 86400;
    if (days >= 365) return `${Math.floor(days / 365)} Years`;
    if (days >= 30) return `${Math.floor(days / 30)} Months`;
    return `${Math.floor(days)} Days`;
  };

  const nxpBalanceFormatted = nxpBalance ? formatUnits(nxpBalance as bigint, 18) : '0';
  const priceFormatted = pricePerNXP ? formatUnits(pricePerNXP as bigint, 18) : '0';
  const isSellDisabled = !sellEnabled;
  const isSellProcessing = isApproving || isSelling;

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 tech-grid-bg opacity-40 pointer-events-none" />
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 left-1/4 w-80 h-80 bg-primary/6 rounded-full blur-3xl pointer-events-none" />
      
      <Navbar />
      
      <main className="pt-28 pb-20 relative z-10">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="badge-tech mb-6">
              <Zap className="w-4 h-4" />
              <span>GREEN MINING</span>
            </div>
            <h1 className="neon-headline text-5xl sm:text-6xl md:text-7xl mb-4">
              MINING DASHBOARD
            </h1>
            <p className="neon-body max-w-xl mx-auto text-lg">
              Track your NFT mining performance in realtime
            </p>
          </motion.div>

          {/* Connect Wallet Message */}
          {!isConnected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto glass-card p-10 text-center neon-glow"
            >
              <Wallet className="w-16 h-16 text-primary mx-auto mb-5" />
              <h2 className="neon-card-title text-2xl mb-3">Connect Wallet</h2>
              <p className="neon-muted">
                Please connect your wallet to access green mining features.
              </p>
            </motion.div>
          )}

          {isConnected && (
            <div className="space-y-6 sm:space-y-8">
              {/* Total Rewards Aggregation - Hero Section */}
              <TotalRewardsAggregation 
                stakedNFTs={stakedNFTs}
                nxpBalance={nxpBalanceFormatted}
                lastUpdate={lastUpdate}
                onRefresh={() => {
                  setIsRefreshing(true);
                  refetchStaked();
                  setTimeout(() => setIsRefreshing(false), 1000);
                }}
                isRefreshing={isRefreshing}
              />

              {/* Mining Overview Stats */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                {[
                  { icon: Lock, label: 'Mining Lock', value: lockDuration ? formatDuration(lockDuration as bigint) : '-' },
                  { icon: Clock, label: 'Reward Cycle', value: claimInterval ? formatDuration(claimInterval as bigint) : '-' },
                  { icon: Coins, label: 'Your Balance', value: `${Number(nxpBalanceFormatted).toLocaleString(undefined, { maximumFractionDigits: 2 })} NXP`, isMetric: true },
                  { icon: Gift, label: 'Your NFTs', value: tokenIds ? (tokenIds as bigint[]).length : 0 },
                ].map((stat, i) => (
                  <div key={i} className="stats-card p-5 text-center">
                    <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                    <p className="neon-label text-[10px] mb-2">{stat.label}</p>
                    <p className={stat.isMetric ? "neon-metric text-lg" : "font-display font-bold text-lg text-white"}>{stat.value}</p>
                  </div>
                ))}
              </motion.div>

              {/* Active Staking Section - Real-time Rewards */}
              <ActiveStakingSection
                stakedNFTs={stakedNFTs}
                processingId={processingId}
                isClaiming={isClaiming}
                isUnstaking={isUnstaking}
                claimInterval={claimInterval as bigint | undefined}
                onClaim={handleClaim}
                onUnstake={handleUnstake}
              />

              {/* Main Grid Layout */}
              <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {/* Left Column - Available NFTs to Stake + History */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
                  {/* Tier Comparison Chart */}
                  <TierComparisonChart />

                  {/* Available NFTs */}
                  <AvailableNFTsSection
                    tokenIds={tokenIds as bigint[] | undefined}
                    processingId={processingId}
                    isStaking={isStaking}
                    onStake={handleStake}
                  />

                  {/* Claim History */}
                  <RewardHistory claimHistory={claimHistory} />
                </div>

                {/* Right Column - Sell Rewards */}
                <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
                  {/* Sell Reward Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-4 sm:p-6"
                  >
                    <h2 className="font-display text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      Sell Reward
                    </h2>

                    {/* Pool Status */}
                    <div className={`flex items-center justify-center gap-2 mb-3 sm:mb-4 py-2 px-3 sm:px-4 rounded-lg ${
                      isSellDisabled ? 'bg-destructive/10 border border-destructive/30' : 'bg-primary/10 border border-primary/30'
                    }`}>
                      {isSellDisabled ? (
                        <>
                          <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" />
                          <span className="text-destructive text-xs sm:text-sm">Selling Disabled</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                          <span className="text-primary text-xs sm:text-sm">Selling Enabled</span>
                        </>
                      )}
                    </div>

                    {/* Price Info */}
                    <div className="bg-card/50 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 text-center">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Price per NXP</p>
                      <p className="font-display font-bold text-sm sm:text-lg text-foreground">
                        ${Number(priceFormatted).toFixed(6)} USDT
                      </p>
                    </div>

                    {/* Sell Input */}
                    <div className="mb-3 sm:mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs sm:text-sm text-muted-foreground">Amount to sell</label>
                        <button
                          onClick={() => setSellAmount(nxpBalanceFormatted)}
                          className="text-[10px] sm:text-xs text-primary hover:underline"
                        >
                          Max
                        </button>
                      </div>
                      <input
                        type="number"
                        value={sellAmount}
                        onChange={(e) => setSellAmount(e.target.value)}
                        placeholder="0.00"
                        disabled={isSellDisabled || isSellProcessing}
                        className="w-full bg-muted/50 border border-primary/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-base sm:text-lg font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 disabled:opacity-50"
                      />
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center my-2 sm:my-3">
                      <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>

                    {/* Estimate */}
                    <div className="bg-card/50 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">You receive (estimate)</p>
                      <p className="font-display font-bold text-lg sm:text-xl text-foreground">
                        {sellAmount ? (Number(sellAmount) * Number(priceFormatted)).toFixed(4) : '0.00'} USDT
                      </p>
                    </div>

                    {/* Action Button */}
                    {needsApproval && sellAmount ? (
                      <motion.button
                        onClick={handleApprove}
                        disabled={isSellDisabled || isSellProcessing}
                        className="w-full btn-outline-glow flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Approve NXP
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={handleSell}
                        disabled={isSellDisabled || isSellProcessing || !sellAmount}
                        className="w-full btn-primary-glow flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isSelling ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {isSellDisabled ? 'Selling Disabled' : 'Sell NXP'}
                      </motion.button>
                    )}
                  </motion.div>

                  {/* Mining Reward Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6"
                  >
                    <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Mining Schedule
                    </h2>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-card/50 rounded-lg">
                        <span className="text-muted-foreground text-sm">Reward Cycle</span>
                        <span className="font-display font-bold text-foreground">
                          {claimInterval ? formatDuration(claimInterval as bigint) : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-card/50 rounded-lg">
                        <span className="text-muted-foreground text-sm">Mining Lock</span>
                        <span className="font-display font-bold text-foreground">
                          {lockDuration ? formatDuration(lockDuration as bigint) : '-'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                      Mining rewards backed by real environmental activities
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

// ============= ACTIVE STAKING SECTION =============
interface ActiveStakingSectionProps {
  stakedNFTs: StakedNFTData[];
  processingId: bigint | null;
  isClaiming: boolean;
  isUnstaking: boolean;
  claimInterval: bigint | undefined;
  onClaim: (tokenId: bigint, tier?: number) => void;
  onUnstake: (tokenId: bigint) => void;
}

function ActiveStakingSection({
  stakedNFTs,
  processingId,
  isClaiming,
  isUnstaking,
  claimInterval,
  onClaim,
  onUnstake,
}: ActiveStakingSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-6 sm:p-8 neon-glow"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="neon-card-title text-xl sm:text-2xl flex items-center gap-3">
          <Activity className="w-6 h-6 text-primary animate-pulse" />
          Active Mining
        </h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/15 border border-primary/40 rounded-full" style={{ boxShadow: '0 0 20px hsl(120 100% 50% / 0.2)' }}>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-xs text-primary font-bold">LIVE</span>
        </div>
      </div>

      {stakedNFTs.length === 0 ? (
        <div className="text-center py-12">
          <Sparkles className="w-14 h-14 text-primary/40 mx-auto mb-5" />
          <p className="neon-muted text-lg">No NFTs mining. Purchase and activate NFTs to start earning green rewards.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {stakedNFTs.map((nft, index) => (
            <ActiveStakingCard
              key={nft.tokenId.toString()}
              nftData={nft}
              index={index}
              processingId={processingId}
              isClaiming={isClaiming}
              isUnstaking={isUnstaking}
              claimInterval={claimInterval}
              onClaim={onClaim}
              onUnstake={onUnstake}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ============= ACTIVE STAKING CARD WITH REAL-TIME REWARDS =============
interface ActiveStakingCardProps {
  nftData: StakedNFTData;
  index: number;
  processingId: bigint | null;
  isClaiming: boolean;
  isUnstaking: boolean;
  claimInterval: bigint | undefined;
  onClaim: (tokenId: bigint, tier?: number) => void;
  onUnstake: (tokenId: bigint) => void;
}

function ActiveStakingCard({
  nftData,
  index,
  processingId,
  isClaiming,
  isUnstaking,
  claimInterval,
  onClaim,
  onUnstake,
}: ActiveStakingCardProps) {
  const { tokenId, tier, lastClaim, unlockTime, pendingReward, totalClaimed } = nftData;
  
  const isProcessing = processingId === tokenId;
  
  // Calculate next claim time
  const nextClaimTime = claimInterval ? lastClaim + claimInterval : undefined;

  const pendingFormatted = formatUnits(pendingReward, 18);
  const totalClaimedFormatted = formatUnits(totalClaimed, 18);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="relative group"
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <div className="nft-card overflow-hidden">
        {/* Mining Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary rounded-full" style={{ boxShadow: '0 0 20px hsl(120 100% 50% / 0.5)' }}>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-primary-foreground uppercase tracking-wider">Mining</span>
          </div>
        </div>

        {/* NFT Image */}
        <div className="relative h-32 sm:h-40 overflow-hidden">
          <img
            src={tierImages[tier]}
            alt={tierNames[tier]}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          
          {/* Tier Badge */}
          <div className="absolute bottom-2 left-2">
            <div className="px-2 py-1 bg-background/80 backdrop-blur-sm rounded-lg border border-primary/20">
              <span className="font-display font-bold text-xs text-primary">{tierNames[tier]}</span>
              <span className="text-[10px] text-muted-foreground ml-1">#{tokenId.toString()}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 space-y-3">
          {/* Real-time Pending Reward */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/40 p-3 sm:p-4">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  Mining Reward
                </p>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  <span className="text-[8px] sm:text-[10px] text-primary">LIVE</span>
                </div>
              </div>
              <motion.p 
                key={pendingFormatted}
                initial={{ scale: 0.95, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display font-bold text-xl sm:text-2xl text-primary neon-glow-text"
              >
                {Number(pendingFormatted).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                <span className="text-sm ml-1 text-primary/80">NXP</span>
              </motion.p>
            </div>
          </div>

          {/* Total Claimed */}
          <div className="flex justify-between items-center px-2 py-2 bg-card/50 rounded-lg">
            <span className="text-[10px] sm:text-xs text-muted-foreground">Total Claimed</span>
            <span className="font-display font-bold text-xs sm:text-sm text-foreground">
              {Number(totalClaimedFormatted).toLocaleString(undefined, { maximumFractionDigits: 2 })} NXP
            </span>
          </div>
          
          {/* Timers */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-card/60 rounded-lg p-2 border border-border/50">
              <CountdownTimer 
                targetTimestamp={nextClaimTime} 
                label="⏰ Next Claim"
              />
            </div>
            <div className="bg-card/60 rounded-lg p-2 border border-border/50">
              <CountdownTimer 
                targetTimestamp={unlockTime} 
                label="🔒 Unlock"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <motion.button
              onClick={() => onClaim(tokenId, tier)}
              disabled={isProcessing && isClaiming}
              className="flex-1 btn-primary-glow text-xs py-2 flex items-center justify-center gap-1.5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isProcessing && isClaiming ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Gift className="w-3 h-3" />
              )}
              Claim
            </motion.button>
            <motion.button
              onClick={() => onUnstake(tokenId)}
              disabled={isProcessing && isUnstaking}
              className="flex-1 btn-outline-glow text-xs py-2 flex items-center justify-center gap-1.5 border-destructive/50 text-destructive hover:bg-destructive/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isProcessing && isUnstaking ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Unlock className="w-3 h-3" />
              )}
              Stop
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============= AVAILABLE NFTS SECTION =============
interface AvailableNFTsSectionProps {
  tokenIds: bigint[] | undefined;
  processingId: bigint | null;
  isStaking: boolean;
  onStake: (tokenId: bigint) => void;
}

function AvailableNFTsSection({
  tokenIds,
  processingId,
  isStaking,
  onStake,
}: AvailableNFTsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-4 sm:p-6"
    >
      <h2 className="font-display text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-primary" />
        Ready to Mine
      </h2>

      {!tokenIds || tokenIds.length === 0 ? (
        <div className="text-center py-6 sm:py-8">
          <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-sm sm:text-base">No NFTs available. Purchase one to start green mining.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {tokenIds.map((tokenId, index) => (
            <AvailableNFTCard
              key={tokenId.toString()}
              tokenId={tokenId}
              index={index}
              processingId={processingId}
              isStaking={isStaking}
              onStake={onStake}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ============= AVAILABLE NFT CARD =============
interface AvailableNFTCardProps {
  tokenId: bigint;
  index: number;
  processingId: bigint | null;
  isStaking: boolean;
  onStake: (tokenId: bigint) => void;
}

function AvailableNFTCard({
  tokenId,
  index,
  processingId,
  isStaking,
  onStake,
}: AvailableNFTCardProps) {
  // Read tier
  const { data: tier } = useReadContract({
    address: CONTRACTS.NFT_MINER,
    abi: NFT_MINER_ABI,
    functionName: 'tokenTier',
    args: [tokenId],
  });

  // Read stake info
  const { data: stakeInfo } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'getStakeCore',
    args: [tokenId],
  });

  const tierNum = tier !== undefined ? Number(tier) : 0;
  // stakeInfo returns: [staked, stakeOwner, startTime, lastClaim, unlockTime]
  const stakeData = stakeInfo as [boolean, string, bigint, bigint, bigint] | undefined;
  const isStaked = stakeData ? stakeData[0] : false;
  const isProcessing = processingId === tokenId;

  // Don't render if already staked
  if (isStaked) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="nft-card"
    >
      <div className="relative overflow-hidden rounded-xl bg-card">
        {/* Status badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
          <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full bg-muted text-muted-foreground">
            Available
          </span>
        </div>

        {/* NFT Image */}
        <div className="aspect-square relative overflow-hidden">
          <img
            src={tierImages[tierNum]}
            alt={tierNames[tierNum]}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h3 className="font-display text-sm sm:text-lg font-bold">{tierNames[tierNum]}</h3>
            <span className="text-[10px] sm:text-xs text-muted-foreground">#{tokenId.toString()}</span>
          </div>

          {/* Actions */}
          <motion.button
            onClick={() => onStake(tokenId)}
            disabled={isProcessing && isStaking}
            className="w-full btn-primary-glow text-xs sm:text-sm py-2 sm:py-3 flex items-center justify-center gap-1.5 sm:gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isProcessing && isStaking ? (
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
            ) : (
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
            Start Mining
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default Staking;
