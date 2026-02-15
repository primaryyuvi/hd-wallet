import React, { useState } from 'react';
import { Plus, LayoutGrid } from 'lucide-react';

const COLORS = {
  primary: "#9945FF",
  primaryLow: "rgba(153, 69, 255, 0.1)", 
  light: {
    card: "#ffffff",
    text: "#111827",
    textMuted: "#6b7280",
    border: "#e5e7eb",
  },
  dark: {
    card: "#18181b", 
    text: "#ffffff",
    textMuted: "#9ca6ba",
    border: "#1f2937", 
  }
};

interface CreateWalletCardProps {
  onCreate: () => void;
  isDark: boolean;
}

export const CreateWalletCard: React.FC<CreateWalletCardProps> = ({ onCreate, isDark }) => {
  const theme = isDark ? COLORS.dark : COLORS.light;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="flex flex-col justify-between overflow-hidden rounded-xl shadow-sm transition-all duration-300"
      style={{ 
        backgroundColor: theme.card, 
        border: `1px solid ${isHovered ? COLORS.primary : theme.border}`,
        boxShadow: isHovered ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
        transform: isHovered ? 'translateY(-2px)' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6 md:p-8 flex flex-col h-full">
        <div 
          className="mb-6 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: COLORS.primaryLow, color: COLORS.primary }}
        >
          <Plus className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold mb-2" style={{ color: theme.text }}>
          Create New Wallet
        </h3>
        
        <p className="text-sm leading-relaxed mb-6" style={{ color: theme.textMuted }}>
          Generate a new 12-word seed phrase to start a fresh multi-chain wallet. Your keys are generated locally and never leave your device.
        </p>

        <div 
          className="relative w-full h-32 mb-6 rounded-lg overflow-hidden"
          style={{ 
            background: `linear-gradient(to right, ${COLORS.primaryLow}, rgba(168, 85, 247, 0.2))` // primary to purple
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <LayoutGrid className="w-16 h-16" style={{ color: COLORS.primary, opacity: 0.4 }} />
          </div>
        </div>

        <div className="mt-auto">
          <button 
            onClick={onCreate}
            className="w-full cursor-pointer flex items-center justify-center gap-2 rounded-lg h-12 px-6 text-white text-sm font-semibold transition-colors shadow-lg"
            style={{ 
              backgroundColor: COLORS.primary,
              boxShadow: `0 10px 15px -3px ${COLORS.primaryLow}`
            }}
          >
            <Plus className="w-5 h-5" />
            Generate Wallet
          </button>
        </div>
      </div>
    </div>
  );
};