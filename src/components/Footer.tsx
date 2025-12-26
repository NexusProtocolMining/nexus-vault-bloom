import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { CONTRACTS, getExplorerUrl } from '@/config/contracts';
import logoNexus from '@/assets/logo-nexus.jpeg';

export function Footer() {
  const contractLinks = [
    { name: 'NFT Sale', address: CONTRACTS.NFT_SALE },
    { name: 'NFT Miner', address: CONTRACTS.NFT_MINER },
    { name: 'Staking', address: CONTRACTS.STAKING },
    { name: 'NXP Token', address: CONTRACTS.NXP },
  ];

  return (
    <footer className="border-t border-primary/10 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <img src={logoNexus} alt="Nexus Protocol" className="w-full h-full object-cover" />
              </div>
              <span className="font-display text-lg font-bold text-foreground">
                NEXUS<span className="text-primary">PROTOCOL</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              One Nexus, One Tree. A Green Blockchain for a Sustainable Future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/buy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Buy NFT</Link></li>
              <li><Link to="/staking" className="text-sm text-muted-foreground hover:text-primary transition-colors">Staking</Link></li>
              <li><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Smart Contracts */}
          <div className="lg:col-span-2">
            <h4 className="font-display text-sm font-semibold text-foreground mb-4">Smart Contracts (BSC)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {contractLinks.map((contract) => (
                <a
                  key={contract.name}
                  href={getExplorerUrl('address', contract.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                  <span>{contract.name}</span>
                  <span className="font-mono text-xs opacity-60 group-hover:opacity-100">
                    {contract.address.slice(0, 6)}...{contract.address.slice(-4)}
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © 2024 Nexus Protocol. All rights reserved. Built on BSC.
          </p>
          <p className="text-xs text-muted-foreground/60 text-center sm:text-right max-w-md">
            This website uses real on-chain data only. All balances, rewards, referrals, and staking information are read directly from smart contracts.
          </p>
        </div>
      </div>
    </footer>
  );
}
