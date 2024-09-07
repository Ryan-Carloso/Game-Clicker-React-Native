import React, { createContext, useState, useContext, ReactNode } from 'react';
import { bossesData } from '../assets/bossesdata'; // Adjust the import path as necessary

type GameContextType = {
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  damage: number;
  setDamage: React.Dispatch<React.SetStateAction<number>>;
  bossHealth: number;
  setBossHealth: React.Dispatch<React.SetStateAction<number>>;
  bossIndex: number;
  setBossIndex: React.Dispatch<React.SetStateAction<number>>;
  increaseCoins: (amount: number) => void;
  applyDamageToBoss: (damage: number) => void;
  autoHitUpgrade: boolean;
  setAutoHitUpgrade: React.Dispatch<React.SetStateAction<boolean>>;
  animateText: any;
  setAnimateText: any;
};

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<number>(0);
  const [damage, setDamage] = useState<number>(1);
  const [bossHealth, setBossHealth] = useState<number>(bossesData[0].health);
  const [bossIndex, setBossIndex] = useState<number>(0);
  const [autoHitUpgrade, setAutoHitUpgrade] = useState(false);
  const [animateText, setAnimateText] = useState(false); // Novo estado para animação



  const increaseCoins = (amount: number) => {
    setCoins((prevCoins) => prevCoins + amount);
  };

  const applyDamageToBoss = (damage: number) => {
    setBossHealth((currentHealth) => {
      const newHealth = Math.max(currentHealth - damage, 0);
      if (newHealth <= 0) {
        if (bossIndex < bossesData.length - 1) {
          setBossIndex((currentBossIndex) => currentBossIndex + 1);
          return bossesData[bossIndex + 1].health;
        }
        // Handle the case when all bosses are defeated
      }
      setAnimateText(true); // Ativa a animação

      return newHealth;
    });
  };

  return (
    <GameContext.Provider value={{
      coins, setCoins, damage, setDamage, bossHealth, setBossHealth, bossIndex, setBossIndex,
      increaseCoins, applyDamageToBoss, autoHitUpgrade, setAutoHitUpgrade, animateText, setAnimateText

    }}>
      {children}
    </GameContext.Provider>
  );
};