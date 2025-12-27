import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  Loader2, Wallet, Clock, Coins, Lock, Unlock, Gift, Timer, 
  Zap, TrendingUp, ArrowDown, Calendar, AlertCircle, CheckCircle
} from 'lucide-react';
import { CONTRACTS } from '@/config/contracts';
import { NFT_MINER_ABI, STAKING_ABI, INTERNAL_POOL_ABI, ERC20_ABI } from '@/config/abis';
import { toast } from '@/hooks/use-toast';

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

  // Handle claim
  const handleClaim = (tokenId: bigint) => {
    setProcessingId(tokenId);
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
      toast({ title: 'NFT Staked!', description: 'Your NFT is now staking and earning rewards.' });
      refetchTokens();
      setProcessingId(null);
    }
  }, [isStakeSuccess, refetchTokens]);

  useEffect(() => {
    if (isClaimSuccess) {
      toast({ title: 'Rewards Claimed!', description: 'NXP tokens have been sent to your wallet.' });
      refetchNxpBalance();
      setProcessingId(null);
    }
  }, [isClaimSuccess, refetchNxpBalance]);

  useEffect(() => {
    if (isUnstakeSuccess) {
      toast({ title: 'NFT Unstaked!', description: 'Your NFT has been returned to your wallet.' });
      refetchTokens();
      setProcessingId(null);
    }
  }, [isUnstakeSuccess, refetchTokens]);

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
    <div className="min-h-screen bg-background particle-bg">
      {/* Background effects */}
      <div className="fixed inset-0 tech-grid-bg opacity-40 pointer-events-none" />
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      
      <Navbar />
      
      <main className="pt-20 sm:pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-3 sm:px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.div 
              className="inline-flex items-center gap-2 badge-tech mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm">Premium Staking</span>
            </motion.div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 tracking-tight">
              <span className="gradient-text-tech">Luxury Staking</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto px-4">
              Stake your NFTs, earn rewards, and sell your NXP tokens
            </p>
          </motion.div>

          {/* Connect Wallet Message */}
          {!isConnected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto glass-card p-6 sm:p-8 text-center neon-glow"
            >
              <Wallet className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-4" />
              <h2 className="font-display text-lg sm:text-xl font-bold mb-2">Connect Wallet</h2>
              <p className="text-muted-foreground text-sm">
                Please connect your wallet to access staking features.
              </p>
            </motion.div>
          )}

          {isConnected && (
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Left Column - NFT Staking */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
                {/* Staking Info Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4"
                >
                  <div className="glass-card p-3 sm:p-4 text-center">
                    <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1 sm:mb-2" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Lock Duration</p>
                    <p className="font-display font-bold text-sm sm:text-lg text-foreground">
                      {lockDuration ? formatDuration(lockDuration as bigint) : '-'}
                    </p>
                  </div>
                  <div className="glass-card p-3 sm:p-4 text-center">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1 sm:mb-2" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Claim Interval</p>
                    <p className="font-display font-bold text-sm sm:text-lg text-foreground">
                      {claimInterval ? formatDuration(claimInterval as bigint) : '-'}
                    </p>
                  </div>
                  <div className="glass-card p-3 sm:p-4 text-center">
                    <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1 sm:mb-2" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Reward Token</p>
                    <p className="font-display font-bold text-sm sm:text-lg text-foreground">NXP</p>
                  </div>
                  <div className="glass-card p-3 sm:p-4 text-center">
                    <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1 sm:mb-2" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Your NFTs</p>
                    <p className="font-display font-bold text-sm sm:text-lg text-foreground">
                      {tokenIds ? (tokenIds as bigint[]).length : 0}
                    </p>
                  </div>
                </motion.div>

                {/* Available NFTs to Stake */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-4 sm:p-6"
                >
                  <h2 className="font-display text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Stake NFT
                  </h2>

                  {tokenIds && (tokenIds as bigint[]).length === 0 ? (
                    <div className="text-center py-6 sm:py-8">
                      <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground text-sm sm:text-base">No NFTs available. Purchase one to start staking.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {tokenIds && (tokenIds as bigint[]).map((tokenId, i) => (
                        <NFTStakingCard
                          key={tokenId.toString()}
                          tokenId={tokenId}
                          index={i}
                          processingId={processingId}
                          isStaking={isStaking}
                          isClaiming={isClaiming}
                          isUnstaking={isUnstaking}
                          lockDuration={lockDuration as bigint | undefined}
                          claimInterval={claimInterval as bigint | undefined}
                          onStake={handleStake}
                          onClaim={handleClaim}
                          onUnstake={handleUnstake}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Right Column - Sell Rewards */}
              <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
                {/* NXP Balance Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-4 sm:p-6 neon-glow"
                >
                  <h2 className="font-display text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
                    <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    Your NXP Balance
                  </h2>
                  <div className="text-center py-3 sm:py-4">
                    <motion.p 
                      key={nxpBalanceFormatted}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="font-display text-2xl sm:text-3xl font-bold text-primary neon-glow-text"
                    >
                      {Number(nxpBalanceFormatted).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </motion.p>
                    <p className="text-muted-foreground text-xs sm:text-sm">NXP Tokens</p>
                  </div>
                </motion.div>

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

                {/* Daily/Monthly Reward Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card p-6"
                >
                  <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Reward Schedule
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-card/50 rounded-lg">
                      <span className="text-muted-foreground text-sm">Claim Period</span>
                      <span className="font-display font-bold text-foreground">
                        {claimInterval ? formatDuration(claimInterval as bigint) : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-card/50 rounded-lg">
                      <span className="text-muted-foreground text-sm">Lock Period</span>
                      <span className="font-display font-bold text-foreground">
                        {lockDuration ? formatDuration(lockDuration as bigint) : '-'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    Rewards are calculated on-chain based on NFT tier
                  </p>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

interface NFTStakingCardProps {
  tokenId: bigint;
  index: number;
  processingId: bigint | null;
  isStaking: boolean;
  isClaiming: boolean;
  isUnstaking: boolean;
  lockDuration: bigint | undefined;
  claimInterval: bigint | undefined;
  onStake: (tokenId: bigint) => void;
  onClaim: (tokenId: bigint) => void;
  onUnstake: (tokenId: bigint) => void;
}

function NFTStakingCard({
  tokenId,
  index,
  processingId,
  isStaking,
  isClaiming,
  isUnstaking,
  lockDuration,
  claimInterval,
  onStake,
  onClaim,
  onUnstake,
}: NFTStakingCardProps) {
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

  // Read pending reward
  const { data: pendingReward } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'getStakeReward',
    args: [tokenId],
  });

  // Read total claimed
  const { data: totalClaimed } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'totalClaimed',
    args: [tokenId],
  });

  const tierNum = tier !== undefined ? Number(tier) : 0;
  const stakeData = stakeInfo as [string, bigint, bigint] | undefined;
  const isStaked = stakeData && stakeData[0] !== '0x0000000000000000000000000000000000000000';
  const isProcessing = processingId === tokenId;

  // Calculate countdown timestamps
  const stakedAt = stakeData?.[1] ?? BigInt(0);
  const lastClaimAt = stakeData?.[2] ?? BigInt(0);
  
  const nextClaimTime = isStaked && claimInterval ? lastClaimAt + claimInterval : undefined;
  const unlockTime = isStaked && lockDuration ? stakedAt + lockDuration : undefined;

  const pendingFormatted = pendingReward ? formatUnits(pendingReward as bigint, 18) : '0';
  const totalClaimedFormatted = totalClaimed ? formatUnits(totalClaimed as bigint, 18) : '0';

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
          {isStaked ? (
            <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full bg-primary text-primary-foreground animate-pulse">
              Active
            </span>
          ) : (
            <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full bg-muted text-muted-foreground">
              Available
            </span>
          )}
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

          {isStaked && (
            <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
              {/* Pending Reward */}
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-2 sm:p-3">
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Pending Reward</p>
                <p className="font-display font-bold text-sm sm:text-lg text-primary">
                  {Number(pendingFormatted).toLocaleString(undefined, { maximumFractionDigits: 2 })} NXP
                </p>
              </div>

              {/* Total Claimed */}
              <div className="flex justify-between text-xs sm:text-sm px-1">
                <span className="text-muted-foreground">Total Claimed</span>
                <span className="text-foreground font-medium">
                  {Number(totalClaimedFormatted).toLocaleString(undefined, { maximumFractionDigits: 2 })} NXP
                </span>
              </div>
              
              {/* Claim Countdown (30 Days) */}
              <div className="bg-card/80 rounded-lg p-2 sm:p-3 border border-border/50">
                <CountdownTimer 
                  targetTimestamp={nextClaimTime} 
                  label="⏰ Claim (30 Days)"
                />
              </div>
              
              {/* Unstake Countdown (3 Years) */}
              <div className="bg-card/80 rounded-lg p-2 sm:p-3 border border-border/50">
                <CountdownTimer 
                  targetTimestamp={unlockTime} 
                  label="🔒 Unstake (3 Years)"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-1.5 sm:space-y-2">
            {!isStaked ? (
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
                Stake NFT
              </motion.button>
            ) : (
              <>
                <motion.button
                  onClick={() => onClaim(tokenId)}
                  disabled={isProcessing && isClaiming}
                  className="w-full btn-primary-glow text-xs sm:text-sm py-1.5 sm:py-2 flex items-center justify-center gap-1.5 sm:gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isProcessing && isClaiming ? (
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  ) : (
                    <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                  Claim Reward
                </motion.button>
                <motion.button
                  onClick={() => onUnstake(tokenId)}
                  disabled={isProcessing && isUnstaking}
                  className="w-full btn-outline-glow text-xs sm:text-sm py-1.5 sm:py-2 flex items-center justify-center gap-1.5 sm:gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isProcessing && isUnstaking ? (
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  ) : (
                    <Unlock className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                  Unstake
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Staking;
