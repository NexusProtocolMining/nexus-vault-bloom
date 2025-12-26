// BSC Mainnet Chain ID
export const BSC_CHAIN_ID = 56;

// Contract Addresses
export const CONTRACTS = {
  NFT_SALE: "0x56342CdAB27B787Ea481d60DB0e289BA89739A62" as const,
  NFT_MINER: "0xcd3F7d418CD33318552b7f1Ce04A024895b2Ac2D" as const,
  STAKING: "0x51b86fE80c3f14b2a1Ca194a4ec4f2a55EBA0451" as const,
  REWARD_VAULT: "0x441720F4111FD0fd0C6b598D5a642eEf4FD3B0Cf" as const,
  NXP: "0x9C9Ab1B8F9B59B09AA0B3a90beb76e1B305306Ff" as const,
  INTERNAL_POOL: "0xfD21218DeA13DCA42762E0F82eF84f5094Db5d97" as const,
  USDT: "0x55d398326f99059fF775485246999027B3197955" as const,
} as const;

// BSCScan Explorer URL
export const BSCSCAN_URL = "https://bscscan.com";

export const getExplorerUrl = (type: 'address' | 'tx', value: string) => {
  return `${BSCSCAN_URL}/${type}/${value}`;
};

// NFT Tiers
export const NFT_TIERS = {
  TREE: { name: "TREE", price: 10, color: "emerald" },
  DIAMOND: { name: "DIAMOND", price: 100, color: "cyan" },
  CARBON: { name: "CARBON", price: 1000, color: "gold" },
} as const;

// Token Info
export const TOKEN_INFO = {
  name: "Nexus Protocol",
  symbol: "NXP",
  decimals: 18,
  totalSupply: 210_000_000,
  miningAllocation: 160_000_000,
  liquidityAllocation: 50_000_000,
} as const;
