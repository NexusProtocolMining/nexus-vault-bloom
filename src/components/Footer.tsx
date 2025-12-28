import { Link } from 'react-router-dom';
import { ExternalLink, Leaf, Zap, Shield, Globe } from 'lucide-react';
import { CONTRACTS, getExplorerUrl } from '@/config/contracts';
import logoNexus from '@/assets/logo-nexus.jpeg';
import { motion } from 'framer-motion';

export function Footer() {
  const contractLinks = [
    { name: 'NFT SALE', address: CONTRACTS.NFT_SALE },
    { name: 'NFT MINER', address: CONTRACTS.NFT_MINER },
    { name: 'MINING', address: CONTRACTS.STAKING },
    { name: 'NXP TOKEN', address: CONTRACTS.NXP },
  ];

  return (
    <footer className="relative border-t border-primary/15 bg-background/90 backdrop-blur-xl overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 tech-lines-bg opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-secondary/6 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <motion.div 
                className="w-12 h-12 rounded-xl overflow-hidden relative border border-primary/40"
                whileHover={{ scale: 1.1, rotate: 5 }}
                style={{
                  boxShadow: '0 0 25px hsl(120 100% 50% / 0.4)',
                }}
              >
                <img src={logoNexus} alt="NEXUS PROTOCOL" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/25 to-transparent" />
              </motion.div>
              <div>
                <span className="neon-title text-xl block">
                  NEXUS
                </span>
                <span className="neon-label">GREEN BLOCKCHAIN</span>
              </div>
            </Link>
            <p className="neon-body text-sm mb-6">
              ONE NEXUS, ONE TREE. A GREEN BLOCKCHAIN ECOSYSTEM FOR REAL-WORLD IMPACT.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center border border-primary/40 hover:bg-primary/25 transition-colors hover:shadow-neon">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center border border-secondary/40 hover:bg-secondary/25 transition-colors">
                <Zap className="w-5 h-5 text-secondary" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center border border-accent/40 hover:bg-accent/25 transition-colors">
                <Globe className="w-5 h-5 text-accent" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="neon-card-title text-sm mb-6 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              QUICK LINKS
            </h4>
            <ul className="space-y-3">
              {[
                { path: '/', name: 'HOME' },
                { path: '/buy', name: 'BUY NFT' },
                { path: '/staking', name: 'MINING' },
                { path: '/pool', name: 'SELL NXP' },
                { path: '/dashboard', name: 'DASHBOARD' },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="neon-muted text-sm hover:text-primary transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/60 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Smart Contracts */}
          <div className="lg:col-span-2">
            <h4 className="neon-card-title text-sm mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              SMART CONTRACTS (BSC)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contractLinks.map((contract) => (
                <a
                  key={contract.name}
                  href={getExplorerUrl('address', contract.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-3 flex items-center justify-between gap-3 group hover:border-primary/50 transition-all duration-300"
                >
                  <div className="min-w-0">
                    <span className="text-sm text-foreground block font-display tracking-wider">{contract.name}</span>
                    <span className="font-mono text-xs text-primary/70 truncate block">
                      {contract.address.slice(0, 8)}...{contract.address.slice(-6)}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="neon-muted text-xs text-center sm:text-left flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ boxShadow: '0 0 12px hsl(120 100% 50% / 0.6)' }} />
            © 2024 NEXUS PROTOCOL. BUILT ON BSC.
          </p>
          <p className="neon-muted text-xs text-center sm:text-right max-w-lg opacity-60">
            THIS WEBSITE USES REAL ON-CHAIN DATA ONLY. ALL BALANCES, REWARDS, AND MINING INFORMATION ARE READ DIRECTLY FROM SMART CONTRACTS.
          </p>
        </div>
      </div>
    </footer>
  );
}
