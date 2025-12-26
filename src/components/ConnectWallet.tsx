import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ChevronDown, LogOut, Copy, ExternalLink, AlertTriangle } from 'lucide-react';
import { BSC_CHAIN_ID, getExplorerUrl } from '@/config/contracts';
import { toast } from '@/hooks/use-toast';

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isOpen, setIsOpen] = useState(false);

  const isWrongNetwork = isConnected && chainId !== BSC_CHAIN_ID;

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const handleSwitchNetwork = () => {
    switchChain({ chainId: bsc.id });
  };

  if (isWrongNetwork) {
    return (
      <motion.button
        onClick={handleSwitchNetwork}
        className="flex items-center gap-2 bg-destructive/20 border border-destructive text-destructive px-4 py-2 rounded-lg font-semibold transition-all hover:bg-destructive/30"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <AlertTriangle className="w-4 h-4" />
        <span className="hidden sm:inline">Switch to BSC</span>
        <span className="sm:hidden">Wrong Network</span>
      </motion.button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 glass-card px-4 py-2 border border-primary/30 hover:border-primary/60 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-sm text-foreground">{formatAddress(address)}</span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-56 glass-card border border-primary/20 rounded-xl overflow-hidden z-50"
            >
              <div className="p-3 border-b border-primary/10">
                <p className="text-xs text-muted-foreground mb-1">Connected to BSC</p>
                <p className="font-mono text-sm text-foreground">{formatAddress(address)}</p>
              </div>
              
              <div className="p-2">
                <button
                  onClick={copyAddress}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors text-left"
                >
                  <Copy className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Copy Address</span>
                </button>
                
                <a
                  href={getExplorerUrl('address', address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">View on BSCScan</span>
                </a>
                
                <button
                  onClick={() => {
                    disconnect();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 transition-colors text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Disconnect</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="btn-primary-glow flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Wallet className="w-4 h-4" />
        <span>{isPending ? 'Connecting...' : 'Connect Wallet'}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && !isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-64 glass-card border border-primary/20 rounded-xl overflow-hidden z-50"
          >
            <div className="p-3 border-b border-primary/10">
              <p className="text-sm font-semibold text-foreground">Connect Wallet</p>
              <p className="text-xs text-muted-foreground">Choose your wallet provider</p>
            </div>
            
            <div className="p-2">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => {
                    connect({ connector });
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-primary/10 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{connector.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
