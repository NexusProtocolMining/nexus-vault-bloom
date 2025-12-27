import { useEffect, useState, useCallback } from 'react';
import { useAccount, useReadContracts } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { STAKING_ABI, NFT_MINER_ABI } from '@/config/abis';

export interface StakedNFTData {
  tokenId: bigint;
  tier: number;
  stakeOwner: string;
  startTime: bigint;
  lastClaim: bigint;
  unlockTime: bigint;
  pendingReward: bigint;
  monthlyReward: bigint;
  yearlyReward: bigint;
  totalClaimed: bigint;
}

// Scan a range of tokenIds to find NFTs staked by the connected wallet
export function useStakedNFTs(maxTokenId: number = 500) {
  const { address } = useAccount();
  const [stakedNFTs, setStakedNFTs] = useState<StakedNFTData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Create batch calls for getStakeCore for tokenIds 1 to maxTokenId
  const stakeCoreCalls = Array.from({ length: maxTokenId }, (_, i) => ({
    address: CONTRACTS.STAKING as `0x${string}`,
    abi: STAKING_ABI,
    functionName: 'getStakeCore' as const,
    args: [BigInt(i + 1)],
  }));

  const { data: stakeCoreResults, isLoading, refetch } = useReadContracts({
    contracts: stakeCoreCalls,
    query: {
      enabled: !!address,
      refetchInterval: 15000,
    },
  });

  // Find user's staked tokenIds
  const userStakedTokenIds = stakeCoreResults?.reduce<bigint[]>((acc, result, index) => {
    if (result.status === 'success' && result.result) {
      const [staked, stakeOwner] = result.result as [boolean, string, bigint, bigint, bigint];
      if (staked && address && stakeOwner.toLowerCase() === address.toLowerCase()) {
        acc.push(BigInt(index + 1));
      }
    }
    return acc;
  }, []) ?? [];

  // Create calls for detailed data of staked NFTs
  const detailCalls = userStakedTokenIds.flatMap((tokenId) => [
    {
      address: CONTRACTS.STAKING as `0x${string}`,
      abi: STAKING_ABI,
      functionName: 'getStakeCore' as const,
      args: [tokenId],
    },
    {
      address: CONTRACTS.STAKING as `0x${string}`,
      abi: STAKING_ABI,
      functionName: 'getStakeReward' as const,
      args: [tokenId],
    },
    {
      address: CONTRACTS.NFT_MINER as `0x${string}`,
      abi: NFT_MINER_ABI,
      functionName: 'tokenTier' as const,
      args: [tokenId],
    },
  ]);

  const { data: detailResults } = useReadContracts({
    contracts: detailCalls,
    query: {
      enabled: userStakedTokenIds.length > 0,
      refetchInterval: 15000,
    },
  });

  // Parse detail results and update stakedNFTs
  useEffect(() => {
    if (!detailResults || userStakedTokenIds.length === 0) {
      if (stakeCoreResults && userStakedTokenIds.length === 0) {
        setStakedNFTs([]);
      }
      return;
    }

    const nfts: StakedNFTData[] = [];
    for (let i = 0; i < userStakedTokenIds.length; i++) {
      const tokenId = userStakedTokenIds[i];
      const stakeCore = detailResults[i * 3];
      const stakeReward = detailResults[i * 3 + 1];
      const tierResult = detailResults[i * 3 + 2];

      if (stakeCore?.status === 'success' && stakeReward?.status === 'success') {
        const [staked, stakeOwner, startTime, lastClaim, unlockTime] = stakeCore.result as [boolean, string, bigint, bigint, bigint];
        const [pending, monthly, year, claimed] = stakeReward.result as [bigint, bigint, bigint, bigint];
        const tier = tierResult?.status === 'success' ? Number(tierResult.result) : 0;

        nfts.push({
          tokenId,
          tier,
          stakeOwner,
          startTime,
          lastClaim,
          unlockTime,
          pendingReward: pending,
          monthlyReward: monthly,
          yearlyReward: year,
          totalClaimed: claimed,
        });
      }
    }

    setStakedNFTs(nfts);
    setLastUpdate(new Date());
  }, [detailResults, stakeCoreResults]);

  return {
    stakedNFTs,
    isLoading,
    lastUpdate,
    refetch,
  };
}
