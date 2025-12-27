import { useState } from 'react';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  Wallet, Copy, Users, Coins, TrendingUp, Package, CheckCircle, 
  Zap, Calendar, Gift, Link2, UserPlus, Award, BarChart3
} from 'lucide-react';
import { CONTRACTS } from '@/config/contracts';
import { NFT_SALE_ABI, NFT_MINER_ABI, ERC20_ABI, STAKING_ABI } from '@/config/abis';
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

const Dashboard = () => {
  const { address, isConnected } = useAccount();
  const [copied, setCopied] = useState(false);

  // Generate referral link (on-chain referral)
  const referralLink = address 
    ? `${window.location.origin}/buy?ref=${address}` 
    : '';

  // Read referrer
  const { data: referrer } = useReadContract({
    address: CONTRACTS.NFT_SALE,
    abi: NFT_SALE_ABI,
    functionName: 'referrer',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read referral count (number of referred users)
  const { data: referralCount } = useReadContract({
    address: CONTRACTS.NFT_SALE,
    abi: NFT_SALE_ABI,
    functionName: 'referralCount',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read total referral earnings
  const { data: totalReferralEarnings } = useReadContract({
    address: CONTRACTS.NFT_SALE,
    abi: NFT_SALE_ABI,
    functionName: 'totalReferralEarnings',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read owned NFTs
  const { data: tokenIds } = useReadContract({
    address: CONTRACTS.NFT_MINER,
    abi: NFT_MINER_ABI,
    functionName: 'tokensOfOwner',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read NXP balance
  const { data: nxpBalance } = useReadContract({
    address: CONTRACTS.NXP,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Copy referral link
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: 'Link Copied!',
      description: 'Referral link copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const nftCount = tokenIds ? (tokenIds as bigint[]).length : 0;
  const nxpFormatted = nxpBalance ? formatUnits(nxpBalance as bigint, 18) : '0';
  const hasReferrer = referrer && referrer !== '0x0000000000000000000000000000000000000000';
  const referralCountNum = referralCount ? Number(referralCount) : 0;
  const referralEarningsFormatted = totalReferralEarnings ? formatUnits(totalReferralEarnings as bigint, 18) : '0';

  return (
    <div className="min-h-screen bg-background particle-bg">
      {/* Background effects */}
      <div className="fixed inset-0 tech-grid-bg opacity-40 pointer-events-none" />
      <div className="fixed top-1/4 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/3 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <Navbar />
      
      <main className="pt-20 sm:pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-3 sm:px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.div 
              className="inline-flex items-center gap-2 badge-tech mb-6"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="nexus-label">ANALYTICS DASHBOARD</span>
            </motion.div>
            <h1 className="neon-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 sm:mb-4">
              DASHBOARD
            </h1>
            <p className="nexus-body text-sm sm:text-base max-w-xl mx-auto px-4">
              Track your NFTs, earnings, and referral performance
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
              <h2 className="nexus-card-title text-lg sm:text-xl mb-2">Connect Wallet</h2>
              <p className="nexus-muted text-sm">
                Please connect your wallet to view your dashboard.
              </p>
            </motion.div>
          )}

          {isConnected && (
            <div className="space-y-6 sm:space-y-8">
              {/* Referral Link Card - Full Width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-4 sm:p-6 neon-glow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30">
                    <Link2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="nexus-card-title text-lg sm:text-xl">Your Referral Link</h2>
                    <p className="nexus-muted text-xs sm:text-sm">Auto-generated on-chain referral</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="w-full bg-background/50 border border-primary/30 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-mono text-primary/80 focus:outline-none truncate"
                  />
                  <motion.button
                    onClick={copyReferralLink}
                    className="btn-primary-glow flex items-center justify-center gap-2 w-full sm:w-auto"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                  </motion.button>
                </div>
                <p className="nexus-muted text-xs mt-3">
                  Share this link. When friends buy NFTs using your link, you earn referral rewards on-chain.
                </p>
              </motion.div>

              {/* Referral Analytics Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-card p-4 sm:p-6"
              >
                <h2 className="nexus-card-title text-lg sm:text-xl mb-4 sm:mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Referral Analytics
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* Referred Users */}
                  <div className="bg-background/50 border border-primary/20 rounded-xl p-4 sm:p-6 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-primary/30">
                      <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <p className="nexus-label mb-1 sm:mb-2">Referred Users</p>
                    <motion.p 
                      key={referralCountNum}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="nexus-metric text-2xl sm:text-3xl"
                    >
                      {referralCountNum}
                    </motion.p>
                    <p className="nexus-muted text-[10px] sm:text-xs mt-1">Total Referrals</p>
                  </div>

                  {/* Total Referral Earnings */}
                  <div className="bg-background/50 border border-primary/20 rounded-xl p-4 sm:p-6 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-primary/30">
                      <Award className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <p className="nexus-label mb-1 sm:mb-2">Referral Earnings</p>
                    <motion.p 
                      key={referralEarningsFormatted}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="nexus-metric text-xl sm:text-3xl"
                    >
                      {Number(referralEarningsFormatted).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </motion.p>
                    <p className="nexus-muted text-[10px] sm:text-xs mt-1">USDT Earned</p>
                  </div>
                </div>
                <p className="nexus-muted text-xs text-center mt-4">
                  Data read directly from smart contract
                </p>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* NXP Balance */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-4 sm:p-6"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30">
                      <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <span className="nexus-label">NXP Balance</span>
                  </div>
                  <motion.p 
                    key={nxpFormatted}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="nexus-metric text-lg sm:text-2xl truncate"
                  >
                    {Number(nxpFormatted).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </motion.p>
                  <p className="nexus-muted text-[10px] sm:text-xs">Total NXP</p>
                </motion.div>

                {/* Total NFTs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card p-4 sm:p-6"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30">
                      <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <span className="nexus-label">NFTs Owned</span>
                  </div>
                  <p className="nexus-metric text-lg sm:text-2xl">{nftCount}</p>
                  <p className="nexus-muted text-[10px] sm:text-xs">Total Collection</p>
                </motion.div>

                {/* Your Referrer */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card p-4 sm:p-6"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <span className="nexus-label">Your Referrer</span>
                  </div>
                  <p className="text-primary text-xs sm:text-sm font-mono truncate">
                    {hasReferrer 
                      ? `${(referrer as string).slice(0, 6)}...${(referrer as string).slice(-4)}`
                      : 'None'
                    }
                  </p>
                  <p className="nexus-muted text-[10px] sm:text-xs">Upline Address</p>
                </motion.div>

                {/* Network */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass-card p-4 sm:p-6"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <span className="nexus-label">Network</span>
                  </div>
                  <p className="nexus-metric text-lg sm:text-2xl">BSC</p>
                  <p className="nexus-muted text-[10px] sm:text-xs">Binance Smart Chain</p>
                </motion.div>
              </div>

              {/* Total Earning Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card p-4 sm:p-6"
              >
                <h2 className="nexus-card-title text-lg sm:text-xl mb-4 sm:mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Total Earning
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TotalEarningCard tokenIds={tokenIds as bigint[] | undefined} period="Staking Rewards" />
                  <div className="bg-background/50 border border-primary/20 rounded-xl p-4 sm:p-6 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-primary/30">
                      <Award className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <p className="nexus-label mb-1 sm:mb-2">Referral Rewards</p>
                    <motion.p 
                      key={referralEarningsFormatted}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="nexus-metric text-2xl sm:text-3xl"
                    >
                      {Number(referralEarningsFormatted).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </motion.p>
                    <p className="nexus-muted text-[10px] sm:text-xs mt-1">USDT</p>
                  </div>
                </div>
                <p className="nexus-muted text-xs text-center mt-4">
                  All earnings calculated from on-chain data
                </p>
              </motion.div>

              {/* NFT Collection Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h2 className="nexus-card-title text-lg sm:text-xl mb-4 sm:mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  NFT Collection
                </h2>

                {nftCount === 0 ? (
                  <div className="glass-card p-6 sm:p-8 text-center">
                    <Package className="w-12 h-12 sm:w-16 sm:h-16 text-primary/50 mx-auto mb-4" />
                    <p className="nexus-muted mb-4 text-sm sm:text-base">You don't own any NFTs yet.</p>
                    <motion.a
                      href="/buy"
                      className="btn-primary-glow inline-flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Buy NFT Now
                    </motion.a>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                    {(tokenIds as bigint[]).map((tokenId) => (
                      <NFTCard key={tokenId.toString()} tokenId={tokenId} />
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

// NFT Card Component
const NFTCard = ({ tokenId }: { tokenId: bigint }) => {
  const { data: tokenTier } = useReadContract({
    address: CONTRACTS.NFT_MINER,
    abi: NFT_MINER_ABI,
    functionName: 'tokenTier',
    args: [tokenId],
  });

  const tier = tokenTier !== undefined ? Number(tokenTier) : 0;
  const image = tierImages[tier] || treeNFT;
  const tierName = tierNames[tier] || 'NFT';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-2 sm:p-3 group hover:border-primary/40 transition-all"
    >
      <div className="aspect-square rounded-lg overflow-hidden mb-2 sm:mb-3 bg-background/50">
        <img
          src={image}
          alt={`NFT #${tokenId.toString()}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="text-center">
        <p className="nexus-label text-[10px] sm:text-xs">#{tokenId.toString()}</p>
        <p className="text-primary font-semibold text-xs sm:text-sm">{tierName}</p>
      </div>
    </motion.div>
  );
};

// Total Earning Card Component
const TotalEarningCard = ({ 
  tokenIds, 
  period 
}: { 
  tokenIds: bigint[] | undefined;
  period: string;
}) => {
  const { data: stakingResults } = useReadContracts({
    contracts: tokenIds?.map((tokenId) => ({
      address: CONTRACTS.STAKING,
      abi: STAKING_ABI,
      functionName: 'totalClaimed',
      args: [tokenId],
    })) || [],
    query: { enabled: !!tokenIds && tokenIds.length > 0 },
  });

  const totalClaimed = stakingResults?.reduce((acc, result) => {
    if (result.status === 'success' && result.result) {
      return acc + (result.result as bigint);
    }
    return acc;
  }, BigInt(0)) || BigInt(0);

  const totalClaimedFormatted = formatUnits(totalClaimed, 18);

  return (
    <div className="bg-background/50 border border-primary/20 rounded-xl p-4 sm:p-6 text-center">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-primary/30">
        <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
      </div>
      <p className="nexus-label mb-1 sm:mb-2">{period}</p>
      <motion.p 
        key={totalClaimedFormatted}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="nexus-metric text-2xl sm:text-3xl"
      >
        {Number(totalClaimedFormatted).toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </motion.p>
      <p className="nexus-muted text-[10px] sm:text-xs mt-1">NXP</p>
    </div>
  );
};

export default Dashboard;
