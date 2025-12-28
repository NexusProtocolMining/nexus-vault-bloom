import { useState } from 'react';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  Wallet, Copy, Users, Coins, TrendingUp, Package, CheckCircle, 
  Zap, Gift, Link2, UserPlus, Award, BarChart3
} from 'lucide-react';
import { CONTRACTS } from '@/config/contracts';
import { NFT_SALE_ABI, NFT_MINER_ABI, ERC20_ABI, STAKING_ABI } from '@/config/abis';
import { toast } from '@/hooks/use-toast';

import treeNFT from '@/assets/tree-nft.png';
import diamondNFT from '@/assets/diamond-nft.png';
import carbonNFT from '@/assets/carbon-nft.png';

const tierImages: Record<number, string> = { 0: treeNFT, 1: diamondNFT, 2: carbonNFT };
const tierNames: Record<number, string> = { 0: 'TREE', 1: 'DIAMOND', 2: 'CARBON' };

const Dashboard = () => {
  const { address, isConnected } = useAccount();
  const [copied, setCopied] = useState(false);

  const referralLink = address ? `${window.location.origin}/buy?ref=${address}` : '';

  const { data: referrer } = useReadContract({ address: CONTRACTS.NFT_SALE, abi: NFT_SALE_ABI, functionName: 'referrer', args: address ? [address] : undefined, query: { enabled: !!address } });
  const { data: referralCount } = useReadContract({ address: CONTRACTS.NFT_SALE, abi: NFT_SALE_ABI, functionName: 'referralCount', args: address ? [address] : undefined, query: { enabled: !!address } });
  const { data: totalReferralEarnings } = useReadContract({ address: CONTRACTS.NFT_SALE, abi: NFT_SALE_ABI, functionName: 'totalReferralEarnings', args: address ? [address] : undefined, query: { enabled: !!address } });
  const { data: tokenIds } = useReadContract({ address: CONTRACTS.NFT_MINER, abi: NFT_MINER_ABI, functionName: 'tokensOfOwner', args: address ? [address] : undefined, query: { enabled: !!address } });
  const { data: nxpBalance } = useReadContract({ address: CONTRACTS.NXP, abi: ERC20_ABI, functionName: 'balanceOf', args: address ? [address] : undefined, query: { enabled: !!address } });

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: 'LINK COPIED!', description: 'REFERRAL LINK COPIED TO CLIPBOARD' });
    setTimeout(() => setCopied(false), 2000);
  };

  const nftCount = tokenIds ? (tokenIds as bigint[]).length : 0;
  const nxpFormatted = nxpBalance ? formatUnits(nxpBalance as bigint, 18) : '0';
  const hasReferrer = referrer && referrer !== '0x0000000000000000000000000000000000000000';
  const referralCountNum = referralCount ? Number(referralCount) : 0;
  const referralEarningsFormatted = totalReferralEarnings ? formatUnits(totalReferralEarnings as bigint, 18) : '0';

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 tech-grid-bg opacity-40 pointer-events-none" />
      <div className="fixed top-1/4 left-1/3 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/3 w-80 h-80 bg-primary/6 rounded-full blur-3xl pointer-events-none" />
      
      <Navbar />
      
      <main className="pt-28 pb-20 relative z-10">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
            <div className="badge-tech mb-6">
              <BarChart3 className="w-4 h-4" />
              <span>MINING DASHBOARD</span>
            </div>
            <h1 className="neon-headline text-5xl sm:text-6xl md:text-7xl mb-4">DASHBOARD</h1>
            <p className="neon-body max-w-xl mx-auto text-lg">TRACK YOUR NFT MINING PERFORMANCE IN REALTIME</p>
          </motion.div>

          {!isConnected && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto glass-card p-10 text-center neon-glow">
              <Wallet className="w-16 h-16 text-primary mx-auto mb-5" />
              <h2 className="neon-card-title text-2xl mb-3">CONNECT WALLET</h2>
              <p className="neon-muted">PLEASE CONNECT YOUR WALLET TO VIEW YOUR DASHBOARD.</p>
            </motion.div>
          )}

          {isConnected && (
            <div className="space-y-8">
              {/* Referral Link Card */}
              <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="hero-card p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/40" style={{ boxShadow: '0 0 30px hsl(120 100% 50% / 0.3)' }}>
                    <Link2 className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="neon-card-title text-xl">REFERRAL LINK</h2>
                    <p className="neon-muted text-sm">AUTO-GENERATED ON-CHAIN REFERRAL</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input type="text" value={referralLink} readOnly className="flex-1 bg-background/60 border border-primary/40 rounded-xl px-5 py-4 text-sm font-mono text-primary/80 focus:outline-none truncate" />
                  <motion.button onClick={copyReferralLink} className="btn-primary-glow flex items-center justify-center gap-2 px-8" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    {copied ? <><CheckCircle className="w-4 h-4" />COPIED!</> : <><Copy className="w-4 h-4" />COPY LINK</>}
                  </motion.button>
                </div>
                <p className="neon-muted text-xs mt-4">SHARE THIS LINK. WHEN FRIENDS BUY NFTS, YOU EARN REFERRAL REWARDS ON-CHAIN.</p>
              </motion.div>

              {/* Referral Analytics */}
              <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6 sm:p-8">
                <h2 className="neon-card-title text-xl mb-6 flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-primary" />REFERRAL ANALYTICS
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="stats-card p-6 text-center">
                    <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-4 border border-primary/30" style={{ boxShadow: '0 0 25px hsl(120 100% 50% / 0.2)' }}>
                      <UserPlus className="w-7 h-7 text-primary" />
                    </div>
                    <p className="neon-label mb-2">REFERRED USERS</p>
                    <motion.p key={referralCountNum} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="neon-metric text-4xl">{referralCountNum}</motion.p>
                    <p className="neon-muted text-xs mt-1">TOTAL REFERRALS</p>
                  </div>
                  <div className="stats-card p-6 text-center">
                    <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-4 border border-primary/30" style={{ boxShadow: '0 0 25px hsl(120 100% 50% / 0.2)' }}>
                      <Award className="w-7 h-7 text-primary" />
                    </div>
                    <p className="neon-label mb-2">REFERRAL EARNINGS</p>
                    <motion.p key={referralEarningsFormatted} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="neon-metric text-3xl">{Number(referralEarningsFormatted).toLocaleString(undefined, { maximumFractionDigits: 2 })}</motion.p>
                    <p className="neon-muted text-xs mt-1">USDT EARNED</p>
                  </div>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { icon: Coins, label: 'NXP BALANCE', value: Number(nxpFormatted).toLocaleString(undefined, { maximumFractionDigits: 2 }), sub: 'TOTAL NXP' },
                  { icon: Package, label: 'NFTS OWNED', value: nftCount, sub: 'TOTAL COLLECTION' },
                  { icon: Users, label: 'YOUR REFERRER', value: hasReferrer ? `${(referrer as string).slice(0, 6)}...${(referrer as string).slice(-4)}` : 'NONE', sub: 'UPLINE ADDRESS', isMono: true },
                  { icon: TrendingUp, label: 'NETWORK', value: 'BSC', sub: 'BINANCE SMART CHAIN' },
                ].map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="card-3d p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center border border-primary/30">
                        <stat.icon className="w-6 h-6 text-primary" />
                      </div>
                      <span className="neon-label">{stat.label}</span>
                    </div>
                    <motion.p key={String(stat.value)} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`${stat.isMono ? 'text-primary text-sm font-mono truncate' : 'neon-metric text-2xl'}`}>{stat.value}</motion.p>
                    <p className="neon-muted text-xs mt-1">{stat.sub}</p>
                  </motion.div>
                ))}
              </div>

              {/* Mining Inventory */}
              <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6 sm:p-8">
                <h2 className="neon-card-title text-xl mb-6 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-primary" />MINING INVENTORY
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <TotalEarningCard tokenIds={tokenIds as bigint[] | undefined} period="MINING REWARDS" />
                  <div className="stats-card p-6 text-center">
                    <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-4 border border-primary/30">
                      <Award className="w-7 h-7 text-primary" />
                    </div>
                    <p className="neon-label mb-2">REFERRAL REWARDS</p>
                    <motion.p key={referralEarningsFormatted} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="neon-metric text-3xl">{Number(referralEarningsFormatted).toLocaleString(undefined, { maximumFractionDigits: 2 })}</motion.p>
                    <p className="neon-muted text-xs mt-1">USDT</p>
                  </div>
                </div>
              </motion.div>

              {/* NFT Collection */}
              <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <h2 className="neon-card-title text-xl mb-6 flex items-center gap-3">
                  <Package className="w-6 h-6 text-primary" />NFT COLLECTION
                </h2>

                {nftCount === 0 ? (
                  <div className="glass-card p-10 text-center">
                    <Package className="w-16 h-16 text-primary/40 mx-auto mb-5" />
                    <p className="neon-muted mb-5">YOU DON'T OWN ANY NFTS YET.</p>
                    <motion.a href="/buy" className="btn-primary-glow inline-flex items-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Zap className="w-4 h-4" />BUY NFT NOW
                    </motion.a>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    {(tokenIds as bigint[]).map((tokenId) => <NFTCard key={tokenId.toString()} tokenId={tokenId} />)}
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

const NFTCard = ({ tokenId }: { tokenId: bigint }) => {
  const { data: tokenTier } = useReadContract({ address: CONTRACTS.NFT_MINER, abi: NFT_MINER_ABI, functionName: 'tokenTier', args: [tokenId] });
  const tier = tokenTier !== undefined ? Number(tokenTier) : 0;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="nft-card overflow-hidden group">
      <div className="aspect-square overflow-hidden">
        <img src={tierImages[tier] || treeNFT} alt={`NFT #${tokenId.toString()}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      </div>
      <div className="p-4 text-center">
        <p className="neon-label text-xs">#{tokenId.toString()}</p>
        <p className="text-primary font-display font-bold tracking-wider">{tierNames[tier] || 'NFT'}</p>
      </div>
    </motion.div>
  );
};

const TotalEarningCard = ({ tokenIds, period }: { tokenIds: bigint[] | undefined; period: string }) => {
  const { data: stakingResults } = useReadContracts({
    contracts: tokenIds?.map((tokenId) => ({ address: CONTRACTS.STAKING, abi: STAKING_ABI, functionName: 'totalClaimed', args: [tokenId] })) || [],
    query: { enabled: !!tokenIds && tokenIds.length > 0 },
  });

  const totalClaimed = stakingResults?.reduce((acc, result) => result.status === 'success' && result.result ? acc + (result.result as bigint) : acc, BigInt(0)) || BigInt(0);
  const totalClaimedFormatted = formatUnits(totalClaimed, 18);

  return (
    <div className="stats-card p-6 text-center">
      <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-4 border border-primary/30">
        <Gift className="w-7 h-7 text-primary" />
      </div>
      <p className="neon-label mb-2">{period}</p>
      <motion.p key={totalClaimedFormatted} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="neon-metric text-3xl">{Number(totalClaimedFormatted).toLocaleString(undefined, { maximumFractionDigits: 2 })}</motion.p>
      <p className="neon-muted text-xs mt-1">NXP</p>
    </div>
  );
};

export default Dashboard;
