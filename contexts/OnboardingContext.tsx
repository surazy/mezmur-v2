import React, { createContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OnboardingContextType {
  hasSeenOnboarding: boolean;
  showSplash: boolean;
  completeOnboarding: () => void;
  hideSplash: () => void;
}

export const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const ONBOARDING_KEY = 'hasSeenOnboarding';

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const seen = await AsyncStorage.getItem(ONBOARDING_KEY);
      setHasSeenOnboarding(seen === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setHasSeenOnboarding(false);
    } finally {  
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setHasSeenOnboarding(true);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      setHasSeenOnboarding(true); // Continue anyway
    }
  };

  const hideSplash = () => {
    setShowSplash(false);
  };

  if (loading) {
    return null; // Return nothing while loading
  }

  return (
    <OnboardingContext.Provider value={{
      hasSeenOnboarding,
      showSplash,
      completeOnboarding,
      hideSplash
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}