import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Loader2, CheckCircle, AlertCircle, Wallet, Leaf, TreePine, Sparkles } from 'lucide-react';
import { CONTRACTS } from '@/config/contracts';
import { NFT_SALE_ABI, ERC20_ABI } from '@/config/abis';
import { toast } from '@/hooks/use-toast';

import treeNFT from '@/assets/tree-nft.png';
import diamondNFT from '@/assets/diamond-nft.png';
import carbonNFT from '@/assets/carbon-nft.png';

const NFT_TIERS = [
  { 
    key: 'tree', 
    name: 'TREE NFT', 
    image: treeNFT, 
    priceUSD: 10,
    description: 'Represents real tree planting and long-term carbon offset. Start your green journey.',
    miningPower: '1x',
  },
  { 
    key: 'diamond', 
    name: 'DIAMOND NFT', 
    image: diamondNFT, 
    priceUSD: 100,
    description: 'Premium tier with enhanced mining rewards and exclusive ecosystem privileges.',
    miningPower: '10x',
  },
  { 
    key: 'carbon', 
    name: 'CARBON NFT', 
    image: carbonNFT, 
    priceUSD: 1000,
    description: 'Directly linked to verified carbon credit mechanisms. Maximum environmental impact.',
    miningPower: '100x',
  },
];

const BuyNFT = () => {
  const { address, isConnected } = useAccount();
  const [searchParams] = useSearchParams();
  const referrer = searchParams.get('ref') || '0x0000000000000000000000000000000000000000';
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [step, setStep] = useState<'idle' | 'approve' | 'buy'>('idle');

  const { data: priceTree } = useReadContract({ address: CONTRACTS.NFT_SALE, abi: NFT_SALE_ABI, functionName: 'priceTree' });
  const { data: priceDiamond } = useReadContract({ address: CONTRACTS.NFT_SALE, abi: NFT_SALE_ABI, functionName: 'priceDiamond' });
  const { data: priceCarbon } = useReadContract({ address: CONTRACTS.NFT_SALE, abi: NFT_SALE_ABI, functionName: 'priceCarbon' });

  const { data: usdtAllowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.USDT, abi: ERC20_ABI, functionName: 'allowance',
    args: address ? [address, CONTRACTS.NFT_SALE] : undefined, query: { enabled: !!address },
  });

  const { data: usdtBalance } = useReadContract({
    address: CONTRACTS.USDT, abi: ERC20_ABI, functionName: 'balanceOf',
    args: address ? [address] : undefined, query: { enabled: !!address },
  });

  const { writeContract: approveUSDT, data: approveTxHash, isPending: isApproving } = useWriteContract();
  const { writeContract: buyNFT, data: buyTxHash, isPending: isBuying } = useWriteContract();

  const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed } = useWaitForTransactionReceipt({ hash: approveTxHash });
  const { isLoading: isBuyConfirming, isSuccess: isBuyConfirmed } = useWaitForTransactionReceipt({ hash: buyTxHash });

  const getPriceForTier = (tier: string): bigint | undefined => {
    switch (tier) {
      case 'tree': return priceTree as bigint;
      case 'diamond': return priceDiamond as bigint;
      case 'carbon': return priceCarbon as bigint;
      default: return undefined;
    }
  };

  const handleApprove = (tier: string) => {
    const price = getPriceForTier(tier);
    if (!price) return;
    setSelectedTier(tier);
    setStep('approve');
    approveUSDT({ address: CONTRACTS.USDT, abi: ERC20_ABI, functionName: 'approve', args: [CONTRACTS.NFT_SALE, price] } as any);
  };

  const handleBuy = (tier: string) => {
    setSelectedTier(tier);
    setStep('buy');
    const buyFunction = tier === 'tree' ? 'buyTree' : tier === 'diamond' ? 'buyDiamond' : 'buyCarbon';
    buyNFT({ address: CONTRACTS.NFT_SALE, abi: NFT_SALE_ABI, functionName: buyFunction, args: [referrer as `0x${string}`] } as any);
  };

  useEffect(() => {
    if (isApproveConfirmed && selectedTier) {
      toast({ title: 'Approval Successful', description: 'USDT approved. You can now buy the NFT.' });
      refetchAllowance();
      setStep('idle');
    }
  }, [isApproveConfirmed, selectedTier, refetchAllowance]);

  useEffect(() => {
    if (isBuyConfirmed) {
      toast({ title: 'NFT Purchased!', description: `You have successfully purchased a ${selectedTier?.toUpperCase()} NFT!` });
      setStep('idle');
      setSelectedTier(null);
    }
  }, [isBuyConfirmed, selectedTier]);

  const needsApproval = (tier: string): boolean => {
    const price = getPriceForTier(tier);
    if (!price || !usdtAllowance) return true;
    return (usdtAllowance as bigint) < price;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 tech-grid-bg opacity-40 pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-primary/6 rounded-full blur-3xl pointer-events-none" />
      
      <Navbar />
      
      <main className="pt-28 pb-20 relative z-10">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <div className="badge-tech mb-6">
              <Sparkles className="w-4 h-4" />
              <span>MINING NFT MARKETPLACE</span>
            </div>
            <h1 className="neon-headline text-5xl sm:text-6xl md:text-7xl mb-6">ACQUIRE NFT</h1>
            <p className="neon-body max-w-2xl mx-auto text-lg">
              Acquire NFTs that function as mining assets and start generating rewards instantly.
            </p>
            {referrer !== '0x0000000000000000000000000000000000000000' && (
              <motion.div className="mt-6 inline-flex items-center gap-2 glass-card px-6 py-3 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="text-white/80">Referrer: <span className="font-mono text-primary">{referrer.slice(0, 6)}...{referrer.slice(-4)}</span></span>
              </motion.div>
            )}
          </motion.div>

          {!isConnected && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto glass-card p-10 text-center neon-glow">
              <TreePine className="w-16 h-16 text-primary mx-auto mb-5" />
              <h2 className="neon-card-title text-2xl mb-3">Join the Green Ecosystem</h2>
              <p className="neon-muted">Connect your wallet to acquire productive NFT assets.</p>
            </motion.div>
          )}

          {isConnected && (
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {NFT_TIERS.map((tier, i) => {
                const price = getPriceForTier(tier.key);
                const priceFormatted = price ? formatUnits(price, 18) : tier.priceUSD.toString();
                const hasBalance = usdtBalance && price ? (usdtBalance as bigint) >= price : false;
                const needsApprovalFlag = needsApproval(tier.key);
                const isProcessing = selectedTier === tier.key && (isApproving || isApproveConfirming || isBuying || isBuyConfirming);

                return (
                  <motion.div key={tier.key} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} className="nft-card group">
                    <div className="relative aspect-square overflow-hidden">
                      <motion.img src={tier.image} alt={tier.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="px-4 py-2 rounded-full text-xs font-display font-bold bg-primary/20 text-primary border border-primary/40" style={{ boxShadow: '0 0 20px hsl(120 100% 50% / 0.3)' }}>{tier.name}</span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1.5 rounded-lg text-xs font-display font-bold bg-background/80 text-primary border border-primary/40">{tier.miningPower} POWER</span>
                      </div>
                    </div>

                    <div className="p-7">
                      <p className="neon-muted text-sm mb-4">{tier.description}</p>
                      <p className="neon-metric text-4xl mb-6">${priceFormatted} <span className="text-sm neon-muted">USDT</span></p>

                      {needsApprovalFlag ? (
                        <motion.button onClick={() => handleApprove(tier.key)} disabled={isProcessing || !hasBalance} className="w-full btn-outline-glow flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" />Approving...</> : 'Approve USDT'}
                        </motion.button>
                      ) : (
                        <motion.button onClick={() => handleBuy(tier.key)} disabled={isProcessing || !hasBalance} className="w-full btn-primary-glow flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" />Buying...</> : 'BUY NOW'}
                        </motion.button>
                      )}

                      {!hasBalance && (
                        <p className="text-xs text-destructive mt-3 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />Insufficient USDT balance
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {isConnected && usdtBalance && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center mt-10">
              <p className="neon-muted">Your USDT Balance: <span className="text-primary font-mono neon-metric text-lg">{formatUnits(usdtBalance as bigint, 18)} USDT</span></p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BuyNFT;
