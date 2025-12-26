import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "@/providers/Web3Provider";
import Index from "./pages/Index";
import BuyNFT from "./pages/BuyNFT";
import Staking from "./pages/Staking";
import Dashboard from "./pages/Dashboard";
import InternalPool from "./pages/InternalPool";
import NotFound from "./pages/NotFound";

const App = () => (
  <Web3Provider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/buy" element={<BuyNFT />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pool" element={<InternalPool />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </Web3Provider>
);

export default App;
