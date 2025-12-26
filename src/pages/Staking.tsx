import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits } from 'viem';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Loader2, Wallet, Clock, Coins, Lock, Unlock, Gift } from 'lucide-react';
import { CONTRACTS } from '@/config/contracts';
import { NFT_MINER_ABI, STAKING_ABI } from '@/config/abis';
import { toast } from '@/hooks/use-toast';
import nexusStaking from '@/assets/nexus-staking.jpeg';

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

interface NFTData {
  tokenId: bigint;
  tier: number;
  stakeInfo?: {
    staker: string;
    stakedAt: bigint;
    lastClaimAt: bigint;
  };
  pendingReward?: bigint;
  isStaked: boolean;
}

const Staking = () => {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [processingId, setProcessingId] = useState<bigint | null>(null);

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

  // Write contracts
  const { writeContract: stakeNFT, data: stakeTxHash, isPending: isStaking } = useWriteContract();
  const { writeContract: claimReward, data: claimTxHash, isPending: isClaiming } = useWriteContract();
  const { writeContract: unstakeNFT, data: unstakeTxHash, isPending: isUnstaking } = useWriteContract();

  // Transaction receipts
  const { isSuccess: isStakeSuccess } = useWaitForTransactionReceipt({ hash: stakeTxHash });
  const { isSuccess: isClaimSuccess } = useWaitForTransactionReceipt({ hash: claimTxHash });
  const { isSuccess: isUnstakeSuccess } = useWaitForTransactionReceipt({ hash: unstakeTxHash });

  // Handle stake
  const handleStake = async (tokenId: bigint) => {
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
      setProcessingId(null);
    }
  }, [isClaimSuccess]);

  useEffect(() => {
    if (isUnstakeSuccess) {
      toast({ title: 'NFT Unstaked!', description: 'Your NFT has been returned to your wallet.' });
      refetchTokens();
      setProcessingId(null);
    }
  }, [isUnstakeSuccess, refetchTokens]);

  // Format duration
  const formatDuration = (seconds: bigint): string => {
    const days = Number(seconds) / 86400;
    if (days >= 365) return `${Math.floor(days / 365)} years`;
    if (days >= 30) return `${Math.floor(days / 30)} months`;
    return `${Math.floor(days)} days`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <div className="relative h-64 overflow-hidden mb-12">
          <img
            src={nexusStaking}
            alt="Nexus Staking"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
                NFT <span className="text-primary">Staking</span>
              </h1>
              <p className="text-muted-foreground">Stake your NFTs and earn NXP rewards</p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          {/* Staking Info Cards */}
          {lockDuration && claimInterval && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              <div className="glass-card p-4 text-center">
                <Lock className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Lock Duration</p>
                <p className="font-display font-bold text-lg">{formatDuration(lockDuration as bigint)}</p>
              </div>
              <div className="glass-card p-4 text-center">
                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Claim Interval</p>
                <p className="font-display font-bold text-lg">{formatDuration(claimInterval as bigint)}</p>
              </div>
              <div className="glass-card p-4 text-center">
                <Coins className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Reward Token</p>
                <p className="font-display font-bold text-lg">NXP</p>
              </div>
              <div className="glass-card p-4 text-center">
                <Gift className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Your NFTs</p>
                <p className="font-display font-bold text-lg">{tokenIds ? (tokenIds as bigint[]).length : 0}</p>
              </div>
            </div>
          )}

          {/* Connect Wallet Message */}
          {!isConnected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto glass-card p-8 text-center"
            >
              <Wallet className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="font-display text-xl font-bold mb-2">Connect Wallet</h2>
              <p className="text-muted-foreground text-sm">
                Please connect your wallet to view and stake your NFTs.
              </p>
            </motion.div>
          )}

          {/* No NFTs Message */}
          {isConnected && tokenIds && (tokenIds as bigint[]).length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto glass-card p-8 text-center"
            >
              <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-xl font-bold mb-2">No NFTs Found</h2>
              <p className="text-muted-foreground text-sm">
                You don't own any Nexus NFTs yet. Purchase one to start staking.
              </p>
            </motion.div>
          )}

          {/* NFT Grid */}
          {isConnected && tokenIds && (tokenIds as bigint[]).length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(tokenIds as bigint[]).map((tokenId, i) => (
                <NFTStakingCard
                  key={tokenId.toString()}
                  tokenId={tokenId}
                  index={i}
                  processingId={processingId}
                  isStaking={isStaking}
                  isClaiming={isClaiming}
                  isUnstaking={isUnstaking}
                  onStake={handleStake}
                  onClaim={handleClaim}
                  onUnstake={handleUnstake}
                />
              ))}
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

  const tierNum = tier !== undefined ? Number(tier) : 0;
  const isStaked = stakeInfo && (stakeInfo as [string, bigint, bigint])[0] !== '0x0000000000000000000000000000000000000000';
  const isProcessing = processingId === tokenId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="nft-card"
    >
      <div className="relative overflow-hidden rounded-xl bg-card">
        {/* Status badge */}
        <div className="absolute top-3 right-3 z-10">
          {isStaked ? (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
              Staking
            </span>
          ) : (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-muted text-muted-foreground">
              Available
            </span>
          )}
        </div>

        {/* NFT Image */}
        <div className="aspect-[3/4] relative overflow-hidden">
          <img
            src={tierImages[tierNum]}
            alt={tierNames[tierNum]}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-lg font-bold">{tierNames[tierNum]}</h3>
            <span className="text-xs text-muted-foreground">#{tokenId.toString()}</span>
          </div>

          {isStaked && pendingReward && (
            <div className="glass-card p-3 mb-3">
              <p className="text-xs text-muted-foreground">Pending Reward</p>
              <p className="font-display font-bold text-primary">
                {formatUnits(pendingReward as bigint, 18)} NXP
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {!isStaked ? (
              <motion.button
                onClick={() => onStake(tokenId)}
                disabled={isProcessing && isStaking}
                className="flex-1 btn-primary-glow text-sm py-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isProcessing && isStaking ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  'Stake'
                )}
              </motion.button>
            ) : (
              <>
                <motion.button
                  onClick={() => onClaim(tokenId)}
                  disabled={isProcessing && isClaiming}
                  className="flex-1 btn-primary-glow text-sm py-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isProcessing && isClaiming ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    'Claim'
                  )}
                </motion.button>
                <motion.button
                  onClick={() => onUnstake(tokenId)}
                  disabled={isProcessing && isUnstaking}
                  className="btn-outline-glow text-sm py-2 px-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isProcessing && isUnstaking ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
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
