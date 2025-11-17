import { useContext } from 'react';
import { MezmurContext, MezmurContextType } from '@/contexts/MezmurContext';

export function useMezmur(): MezmurContextType {
  const context = useContext(MezmurContext);
  if (!context) {
    throw new Error('useMezmur must be used within MezmurProvider');
  }
  return context;
}