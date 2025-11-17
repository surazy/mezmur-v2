import { useContext } from 'react';
import { OnboardingContext, OnboardingContextType } from '@/contexts/OnboardingContext';

export function useOnboarding(): OnboardingContextType {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}