import React, { useEffect, useContext } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MezmurProvider } from '@/contexts/MezmurContext';
import { OnboardingProvider, OnboardingContext } from '@/contexts/OnboardingContext';
import OnboardingFlow from '@/components/ui/OnboardingFlow';
import WelcomeSplash from '@/components/ui/WelcomeSplash';

// Prevent system splash from auto-hiding
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { hasSeenOnboarding, showSplash, completeOnboarding, hideSplash } = useContext(OnboardingContext)!;

  useEffect(() => {
    // Hide the system splash screen after a short delay
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // If user hasn't completed onboarding yet
  if (!hasSeenOnboarding) {
    return <OnboardingFlow onComplete={completeOnboarding} />;
  }

  return (
    <>
      {/* Main App */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />

      {/* Overlay Splash */}
      {showSplash && <WelcomeSplash onComplete={hideSplash} />}
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <MezmurProvider>
        <OnboardingProvider>
          <AppContent />
        </OnboardingProvider>
      </MezmurProvider>
    </ThemeProvider>
  );
}
