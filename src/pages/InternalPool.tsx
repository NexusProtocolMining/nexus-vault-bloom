import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Loader2, Wallet, ArrowDown, Info, CheckCircle, AlertCircle, TrendingDown } from 'lucide-react';
import { CONTRACTS } from '@/config/contracts';
import { INTERNAL_POOL_ABI, ERC20_ABI } from '@/config/abis';
import { toast } from '@/hooks/use-toast';

const InternalPool = () => {
  const { address, isConnected } = useAccount();
  const [sellAmount, setSellAmount] = useState('');
  const [step, setStep] = useState<'idle' | 'approve' | 'sell'>('idle');

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

  const { data: sellFeeBps } = useReadContract({
    address: CONTRACTS.INTERNAL_POOL,
    abi: INTERNAL_POOL_ABI,
    functionName: 'SELL_FEE_BPS',
  });

  const { data: bps } = useReadContract({
    address: CONTRACTS.INTERNAL_POOL,
    abi: INTERNAL_POOL_ABI,
    functionName: 'BPS',
  });

  // Read NXP balance
  const { data: nxpBalance, refetch: refetchBalance } = useReadContract({
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

  // Write contracts
  const { writeContract: approveNXP, data: approveTxHash, isPending: isApproving } = useWriteContract();
  const { writeContract: sellNXP, data: sellTxHash, isPending: isSelling } = useWriteContract();

  // Wait for transactions
  const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed } = useWaitForTransactionReceipt({
    hash: approveTxHash,
  });

  const { isLoading: isSellConfirming, isSuccess: isSellConfirmed } = useWaitForTransactionReceipt({
    hash: sellTxHash,
  });

  // Calculate sell amount in wei
  const sellAmountWei = sellAmount ? parseUnits(sellAmount, 18) : BigInt(0);

  // Check if needs approval
  const needsApproval = nxpAllowance !== undefined && sellAmountWei > BigInt(0)
    ? (nxpAllowance as bigint) < sellAmountWei
    : true;

  // Check if has sufficient balance
  const hasSufficientBalance = nxpBalance !== undefined && sellAmountWei > BigInt(0)
    ? (nxpBalance as bigint) >= sellAmountWei
    : false;

  // Handle approve
  const handleApprove = () => {
    if (!sellAmountWei) return;
    
    setStep('approve');
    approveNXP({
      address: CONTRACTS.NXP,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [CONTRACTS.INTERNAL_POOL, sellAmountWei],
    } as any);
  };

  // Handle sell
  const handleSell = () => {
    if (!sellAmountWei) return;
    
    setStep('sell');
    sellNXP({
      address: CONTRACTS.INTERNAL_POOL,
      abi: INTERNAL_POOL_ABI,
      functionName: 'sellNXP',
      args: [sellAmountWei],
    } as any);
  };

  // Effect for approve confirmation
  useEffect(() => {
    if (isApproveConfirmed) {
      toast({
        title: 'Approval Successful',
        description: 'NXP approved. You can now sell.',
      });
      refetchAllowance();
      setStep('idle');
    }
  }, [isApproveConfirmed, refetchAllowance]);

  // Effect for sell confirmation
  useEffect(() => {
    if (isSellConfirmed) {
      toast({
        title: 'Sale Complete!',
        description: `Successfully sold ${sellAmount} NXP`,
      });
      refetchBalance();
      refetchAllowance();
      setSellAmount('');
      setStep('idle');
    }
  }, [isSellConfirmed, sellAmount, refetchBalance, refetchAllowance]);

  // Set max amount
  const handleSetMax = () => {
    if (nxpBalance) {
      setSellAmount(formatUnits(nxpBalance as bigint, 18));
    }
  };

  // Format values
  const priceFormatted = pricePerNXP ? formatUnits(pricePerNXP as bigint, 18) : '0';
  const nxpBalanceFormatted = nxpBalance ? formatUnits(nxpBalance as bigint, 18) : '0';
  const feePercentage = sellFeeBps && bps 
    ? (Number(sellFeeBps) / Number(bps) * 100).toFixed(2) 
    : '0';

  const isProcessing = isApproving || isApproveConfirming || isSelling || isSellConfirming;
  const isSellDisabled = !sellEnabled;

  return (
    <div className="min-h-screen bg-background particle-bg">
      {/* Background effects */}
      <div className="fixed inset-0 tech-grid-bg opacity-40 pointer-events-none" />
      <div className="fixed top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      
      <Navbar />
      
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div 
              className="inline-flex items-center gap-2 badge-tech mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <TrendingDown className="w-4 h-4 text-primary" />
              <span className="text-sm">Liquidity Pool</span>
            </motion.div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              Internal <span className="gradient-text-tech">Pool</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Sell your NXP tokens directly to the internal liquidity pool
            </p>
          </motion.div>

          {/* Pool Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-lg mx-auto mb-8"
          >
            <div className={`glass-card p-4 flex items-center justify-center gap-3 ${
              isSellDisabled ? 'border-destructive/50' : 'border-primary/50'
            }`}>
              {isSellDisabled ? (
                <>
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <span className="text-destructive font-medium">Selling is currently disabled</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-primary font-medium">Selling is enabled</span>
                </>
              )}
            </div>
          </motion.div>

          {/* Pool Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8"
          >
            <div className="glass-card p-5 text-center">
              <TrendingDown className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Price per NXP</p>
              <p className="font-display text-xl font-bold text-foreground">
                ${Number(priceFormatted).toFixed(6)}
              </p>
              <p className="text-xs text-muted-foreground">USDT</p>
            </div>

            <div className="glass-card p-5 text-center">
              <Info className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Sell Fee</p>
              <p className="font-display text-xl font-bold text-foreground">
                {feePercentage}%
              </p>
              <p className="text-xs text-muted-foreground">On-chain fee</p>
            </div>

            <div className="glass-card p-5 text-center">
              <Wallet className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Your NXP</p>
              <p className="font-display text-xl font-bold text-foreground">
                {Number(nxpBalanceFormatted).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">Balance</p>
            </div>
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
                Please connect your wallet to sell NXP tokens.
              </p>
            </motion.div>
          )}

          {/* Sell Form */}
          {isConnected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-lg mx-auto"
            >
              <div className="glass-card p-6">
                <h2 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-primary" />
                  Sell NXP
                </h2>

                {/* Input */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-muted-foreground">Amount to sell</label>
                    <button
                      onClick={handleSetMax}
                      className="text-xs text-primary hover:underline"
                    >
                      Max: {Number(nxpBalanceFormatted).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={sellAmount}
                      onChange={(e) => setSellAmount(e.target.value)}
                      placeholder="0.00"
                      disabled={isSellDisabled || isProcessing}
                      className="w-full bg-muted/50 border border-primary/20 rounded-lg px-4 py-4 pr-20 text-lg font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 disabled:opacity-50"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                      NXP
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center my-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ArrowDown className="w-5 h-5 text-primary" />
                  </div>
                </div>

                {/* Output estimate - informational only */}
                <div className="mb-6">
                  <label className="text-sm text-muted-foreground mb-2 block">You will receive (before fee)</label>
                  <div className="glass-card p-4 flex items-center justify-between">
                    <span className="font-display text-xl font-bold text-foreground">
                      {sellAmount && pricePerNXP 
                        ? (Number(sellAmount) * Number(priceFormatted)).toFixed(4)
                        : '0.00'
                      }
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">USDT</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Final amount determined by smart contract after {feePercentage}% fee
                  </p>
                </div>

                {/* Error Messages */}
                {sellAmount && !hasSufficientBalance && (
                  <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <span className="text-sm text-destructive">Insufficient NXP balance</span>
                  </div>
                )}

                {/* Action Button */}
                {needsApproval && sellAmount ? (
                  <motion.button
                    onClick={handleApprove}
                    disabled={isSellDisabled || isProcessing || !hasSufficientBalance || !sellAmount}
                    className="w-full btn-outline-glow flex items-center justify-center gap-2 py-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isApproving || isApproveConfirming ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Approving NXP...
                      </>
                    ) : (
                      'Approve NXP'
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleSell}
                    disabled={isSellDisabled || isProcessing || !hasSufficientBalance || !sellAmount}
                    className="w-full btn-primary-glow flex items-center justify-center gap-2 py-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSelling || isSellConfirming ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Selling NXP...
                      </>
                    ) : isSellDisabled ? (
                      'Selling Disabled'
                    ) : (
                      'Sell NXP'
                    )}
                  </motion.button>
                )}
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-xs text-muted-foreground text-center">
                  All prices and fees are read directly from the smart contract. 
                  The final USDT amount is calculated on-chain.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InternalPool;
