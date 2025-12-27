import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, CheckCircle, ExternalLink, Clock, Gift, ChevronDown, ChevronUp } from 'lucide-react';
import { formatUnits } from 'viem';
import { BSCSCAN_URL } from '@/config/contracts';

export interface ClaimHistoryItem {
  id: string;
  tokenId: string;
  tierName: string;
  amount: string;
  timestamp: Date;
  txHash?: string;
}

interface RewardHistoryProps {
  claimHistory: ClaimHistoryItem[];
}

export function RewardHistory({ claimHistory }: RewardHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-4 sm:p-6"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <h2 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Claim History
          {claimHistory.length > 0 && (
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
              {claimHistory.length}
            </span>
          )}
        </h2>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {claimHistory.length === 0 ? (
              <div className="text-center py-6">
                <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No claims yet this session</p>
                <p className="text-muted-foreground text-xs mt-1">Claim rewards to see them here</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {claimHistory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Gift className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">{item.tierName}</span>
                          <span className="text-xs text-muted-foreground">#{item.tokenId}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(item.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-mono font-bold text-sm text-primary">
                          +{Number(item.amount).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                        </p>
                        <p className="text-[10px] text-muted-foreground">NXP</p>
                      </div>
                      {item.txHash && (
                        <a
                          href={`${BSCSCAN_URL}/tx/${item.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 text-primary" />
                        </a>
                      )}
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
