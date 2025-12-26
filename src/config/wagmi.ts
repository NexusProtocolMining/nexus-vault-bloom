import { http, createConfig } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// WalletConnect Project ID - users should replace with their own
const WALLETCONNECT_PROJECT_ID = 'YOUR_PROJECT_ID';

export const config = createConfig({
  chains: [bsc],
  connectors: [
    injected(),
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      metadata: {
        name: 'Nexus Protocol',
        description: 'One Nexus, One Tree - A Green Blockchain for a Sustainable Future',
        url: 'https://nexusprotocol.io',
        icons: ['https://nexusprotocol.io/logo.png'],
      },
    }),
  ],
  transports: {
    [bsc.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
