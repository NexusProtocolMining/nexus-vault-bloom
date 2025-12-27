import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Loader2, CheckCircle, AlertCircle, Wallet } from 'lucide-react';
import { CONTRACTS } from '@/config/contracts';
import { NFT_SALE_ABI, ERC20_ABI } from '@/config/abis';
import { toast } from '@/hooks/use-toast';

import treeNFT from '@/assets/tree-nft.png';
import diamondNFT from '@/assets/diamond-nft.png';
import carbonNFT from '@/assets/carbon-nft.png';

const NFT_TIERS = [
  { key: 'tree', name: 'TREE', image: treeNFT, priceUSD: 10 },
  { key: 'diamond', name: 'DIAMOND', image: diamondNFT, priceUSD: 100 },
  { key: 'carbon', name: 'CARBON', image: carbonNFT, priceUSD: 1000 },
];

const BuyNFT = () => {
  const { address, isConnected } = useAccount();
  const [searchParams] = useSearchParams();
  const referrer = searchParams.get('ref') || '0x0000000000000000000000000000000000000000';
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [step, setStep] = useState<'idle' | 'approve' | 'buy'>('idle');

  // Read NFT prices
  const { data: priceTree } = useReadContract({
    address: CONTRACTS.NFT_SALE,
    abi: NFT_SALE_ABI,
    functionName: 'priceTree',
  });

  const { data: priceDiamond } = useReadContract({
    address: CONTRACTS.NFT_SALE,
    abi: NFT_SALE_ABI,
    functionName: 'priceDiamond',
  });

  const { data: priceCarbon } = useReadContract({
    address: CONTRACTS.NFT_SALE,
    abi: NFT_SALE_ABI,
    functionName: 'priceCarbon',
  });

  // Read USDT allowance
  const { data: usdtAllowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.USDT,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.NFT_SALE] : undefined,
    query: { enabled: !!address },
  });

  // Read USDT balance
  const { data: usdtBalance } = useReadContract({
    address: CONTRACTS.USDT,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Write contracts
  const { writeContract: approveUSDT, data: approveTxHash, isPending: isApproving } = useWriteContract();
  const { writeContract: buyNFT, data: buyTxHash, isPending: isBuying } = useWriteContract();

  // Wait for transactions
  const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed } = useWaitForTransactionReceipt({
    hash: approveTxHash,
  });

  const { isLoading: isBuyConfirming, isSuccess: isBuyConfirmed } = useWaitForTransactionReceipt({
    hash: buyTxHash,
  });

  // Get price for tier
  const getPriceForTier = (tier: string): bigint | undefined => {
    switch (tier) {
      case 'tree': return priceTree as bigint;
      case 'diamond': return priceDiamond as bigint;
      case 'carbon': return priceCarbon as bigint;
      default: return undefined;
    }
  };

  // Handle approve
  const handleApprove = (tier: string) => {
    const price = getPriceForTier(tier);
    if (!price) return;
    
    setSelectedTier(tier);
    setStep('approve');
    
    approveUSDT({
      address: CONTRACTS.USDT,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [CONTRACTS.NFT_SALE, price],
    } as any);
  };

  // Handle buy
  const handleBuy = (tier: string) => {
    setSelectedTier(tier);
    setStep('buy');
    
    const buyFunction = tier === 'tree' ? 'buyTree' : tier === 'diamond' ? 'buyDiamond' : 'buyCarbon';
    
    buyNFT({
      address: CONTRACTS.NFT_SALE,
      abi: NFT_SALE_ABI,
      functionName: buyFunction,
      args: [referrer as `0x${string}`],
    } as any);
  };

  // Effect to handle approve confirmation
  useEffect(() => {
    if (isApproveConfirmed && selectedTier) {
      toast({
        title: 'Approval Successful',
        description: 'USDT approved. You can now buy the NFT.',
      });
      refetchAllowance();
      setStep('idle');
    }
  }, [isApproveConfirmed, selectedTier, refetchAllowance]);

  // Effect to handle buy confirmation
  useEffect(() => {
    if (isBuyConfirmed) {
      toast({
        title: 'NFT Purchased!',
        description: `You have successfully purchased a ${selectedTier?.toUpperCase()} NFT!`,
      });
      setStep('idle');
      setSelectedTier(null);
    }
  }, [isBuyConfirmed, selectedTier]);

  // Check if needs approval
  const needsApproval = (tier: string): boolean => {
    const price = getPriceForTier(tier);
    if (!price || !usdtAllowance) return true;
    return (usdtAllowance as bigint) < price;
  };

  return (
    <div className="min-h-screen bg-background particle-bg">
      {/* Background effects */}
      <div className="fixed inset-0 tech-grid-bg opacity-40 pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      
      <Navbar />
      
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <motion.div 
              className="inline-flex items-center gap-2 badge-tech mb-6"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span className="nexus-label text-white/75">NFT MARKETPLACE</span>
            </motion.div>
            <h1 className="nexus-section-title text-4xl sm:text-5xl md:text-6xl mb-4">
              Buy <span className="nexus-highlight">NFT</span>
            </h1>
            <p className="nexus-body max-w-xl mx-auto text-lg">
              Choose your NFT tier and start mining NXP tokens. Higher tiers earn more rewards.
            </p>
            {referrer !== '0x0000000000000000000000000000000000000000' && (
              <motion.div 
                className="mt-6 inline-flex items-center gap-2 glass-card px-5 py-3 text-sm neon-glow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="text-foreground">Referrer: <span className="font-mono text-primary">{referrer.slice(0, 6)}...{referrer.slice(-4)}</span></span>
              </motion.div>
            )}
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
                Please connect your wallet to purchase NFTs on BSC.
              </p>
            </motion.div>
          )}

          {/* NFT Cards */}
          {isConnected && (
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {NFT_TIERS.map((tier, i) => {
                const price = getPriceForTier(tier.key);
                const priceFormatted = price ? formatUnits(price, 18) : tier.priceUSD.toString();
                const hasBalance = usdtBalance && price ? (usdtBalance as bigint) >= price : false;
                const needsApprovalFlag = needsApproval(tier.key);
                const isProcessing = selectedTier === tier.key && (isApproving || isApproveConfirming || isBuying || isBuyConfirming);

                return (
                  <motion.div
                    key={tier.key}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="nft-card group"
                  >
                    <div className="relative overflow-hidden rounded-xl bg-card">
                      {/* NFT Image */}
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <img
                          src={tier.image}
                          alt={tier.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      </div>

                      {/* Info */}
                      <div className="p-6">
                        <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                          {tier.name}
                        </h3>
                        <p className="text-3xl font-display font-bold text-primary mb-4">
                          ${priceFormatted} <span className="text-sm text-muted-foreground">USDT</span>
                        </p>

                        {/* Action Button */}
                        {needsApprovalFlag ? (
                          <motion.button
                            onClick={() => handleApprove(tier.key)}
                            disabled={isProcessing || !hasBalance}
                            className="w-full btn-outline-glow flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Approving...
                              </>
                            ) : (
                              'Approve USDT'
                            )}
                          </motion.button>
                        ) : (
                          <motion.button
                            onClick={() => handleBuy(tier.key)}
                            disabled={isProcessing || !hasBalance}
                            className="w-full btn-primary-glow flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Buying...
                              </>
                            ) : (
                              'Buy NFT'
                            )}
                          </motion.button>
                        )}

                        {!hasBalance && (
                          <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Insufficient USDT balance
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* USDT Balance */}
          {isConnected && usdtBalance && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8"
            >
              <p className="text-sm text-muted-foreground">
                Your USDT Balance: <span className="text-foreground font-mono">{formatUnits(usdtBalance as bigint, 18)} USDT</span>
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BuyNFT;
