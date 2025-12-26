import { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Wallet, Copy, Users, Coins, TrendingUp, Package, CheckCircle } from 'lucide-react';
import { CONTRACTS } from '@/config/contracts';
import { NFT_SALE_ABI, NFT_MINER_ABI, ERC20_ABI } from '@/config/abis';
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

  // Generate referral link
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Your <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Track your NFTs, earnings, and referral performance
            </p>
          </motion.div>

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
                Please connect your wallet to view your dashboard.
              </p>
            </motion.div>
          )}

          {isConnected && (
            <>
              {/* Stats Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Coins className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">NXP Balance</span>
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground">
                    {Number(nxpFormatted).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground">NXP Tokens</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">NFTs Owned</span>
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground">{nftCount}</p>
                  <p className="text-xs text-muted-foreground">Total NFTs</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Referrer</span>
                  </div>
                  <p className="font-display text-sm font-bold text-foreground font-mono">
                    {hasReferrer 
                      ? `${(referrer as string).slice(0, 6)}...${(referrer as string).slice(-4)}`
                      : 'None'
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">Your Upline</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Network</span>
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground">BSC</p>
                  <p className="text-xs text-muted-foreground">Mainnet</p>
                </motion.div>
              </div>

              {/* Referral Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-6 mb-12"
              >
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Your Referral Link
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Share this link with friends. They'll be linked to you when they buy NFTs.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 bg-muted/50 border border-primary/20 rounded-lg px-4 py-3 text-sm font-mono text-muted-foreground focus:outline-none focus:border-primary/50"
                  />
                  <motion.button
                    onClick={copyReferralLink}
                    className="btn-primary-glow flex items-center gap-2"
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
                        Copy
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* NFT Collection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Your NFT Collection
                </h2>

                {nftCount === 0 ? (
                  <div className="glass-card p-8 text-center">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">You don't own any NFTs yet.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {(tokenIds as bigint[]).map((tokenId, i) => (
                      <NFTCard key={tokenId.toString()} tokenId={tokenId} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

interface NFTCardProps {
  tokenId: bigint;
  index: number;
}

function NFTCard({ tokenId, index }: NFTCardProps) {
  const { data: tier } = useReadContract({
    address: CONTRACTS.NFT_MINER,
    abi: NFT_MINER_ABI,
    functionName: 'tokenTier',
    args: [tokenId],
  });

  const tierNum = tier !== undefined ? Number(tier) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card p-2 hover:border-primary/40 transition-all"
    >
      <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2">
        <img
          src={tierImages[tierNum]}
          alt={tierNames[tierNum]}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="px-2 pb-2">
        <p className="font-display font-bold text-sm">{tierNames[tierNum]}</p>
        <p className="text-xs text-muted-foreground">#{tokenId.toString()}</p>
      </div>
    </motion.div>
  );
}

export default Dashboard;
