import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingFlowProps {
  onComplete: () => void;
}

interface OnboardingPage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  gradientColors: string[];
}

const onboardingPages: OnboardingPage[] = [
  {
    id: 1,
    title: 'ፈለገ መዝሙራት',
    subtitle: 'Ethiopian Religious Songs',
    description: 'Discover thousands of beautiful Ethiopian religious songs and mezmurs in one comprehensive collection.',
    icon: 'music-note',
    gradientColors: ['#1a1a1a', '#2d2d2d', '#000000']
  },
  {
    id: 2,
    title: 'Browse Categories',
    subtitle: 'Organized Collections',
    description: 'Explore mezmurs organized by religious seasons, saints, and occasions. Find exactly what you are looking for.',
    icon: 'category',
    gradientColors: ['#2d1810', '#1a1a1a', '#000000']
  },
  {
    id: 3,
    title: 'Create & Share',
    subtitle: 'Your Personal Collection',
    description: 'Add your own mezmurs to the collection. Create a personal library that syncs across all your devices.',
    icon: 'add-circle',
    gradientColors: ['#0d2818', '#1a1a1a', '#000000']
  },
  {
    id: 4,
    title: 'Favorites & Sync',
    subtitle: 'Never Lose Your Favorites',
    description: 'Mark your favorite mezmurs and sync them across devices. Access your collection anytime, anywhere.',
    icon: 'favorite',
    gradientColors: ['#2d1010', '#1a1a1a', '#000000']
  }
];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const insets = useSafeAreaInsets();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentPage < onboardingPages.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      scrollViewRef.current?.scrollTo({
        x: nextPage * screenWidth,
        animated: true
      });
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      scrollViewRef.current?.scrollTo({
        x: prevPage * screenWidth,
        animated: true
      });
    }
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / screenWidth);
    setCurrentPage(page);
  };

  const renderPage = (page: OnboardingPage, index: number) => (
    <View key={page.id} style={styles.page}>
      <LinearGradient
        colors={page.gradientColors}
        style={styles.pageGradient}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
          style={styles.overlay}
        >
          <View style={[styles.pageContent, { paddingTop: insets.top + 60 }]}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.iconGradient}
              >
                <MaterialIcons 
                  name={page.icon as any} 
                  size={60} 
                  color="#000000" 
                />
              </LinearGradient>
            </View>

            {/* Content */}
            <View style={styles.textContainer}>
              <Text style={styles.pageTitle}>{page.title}</Text>
              <Text style={styles.pageSubtitle}>{page.subtitle}</Text>
              <Text style={styles.pageDescription}>{page.description}</Text>
            </View>

            {/* Page Indicators */}
            <View style={styles.indicatorContainer}>
              {onboardingPages.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.indicator,
                    i === currentPage && styles.indicatorActive
                  ]}
                />
              ))}
            </View>

            {/* Navigation */}
            <View style={[styles.navigationContainer, { paddingBottom: insets.bottom + 30 }]}>
              <TouchableOpacity
                onPress={handlePrevious}
                style={[
                  styles.navButton,
                  styles.prevButton,
                  currentPage === 0 && styles.navButtonDisabled
                ]}
                disabled={currentPage === 0}
              >
                <MaterialIcons 
                  name="chevron-left" 
                  size={24} 
                  color={currentPage === 0 ? 'rgba(255,215,0,0.3)' : '#FFD700'} 
                />
                <Text style={[
                  styles.navButtonText,
                  currentPage === 0 && styles.navButtonTextDisabled
                ]}>
                  Previous
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNext}
                style={[styles.navButton, styles.nextButton]}
              >
                <Text style={styles.nextButtonText}>
                  {currentPage === onboardingPages.length - 1 ? 'Get Started' : 'Next'}
                </Text>
                <MaterialIcons 
                  name={currentPage === onboardingPages.length - 1 ? 'check' : 'chevron-right'} 
                  size={24} 
                  color="#000000" 
                />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {onboardingPages.map(renderPage)}
      </ScrollView>

      {/* Skip Button */}
      <TouchableOpacity
        style={[styles.skipButton, { top: insets.top + 20 }]}
        onPress={onComplete}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
          style={styles.skipButtonGradient}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  page: {
    width: screenWidth,
    flex: 1,
  },
  pageGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
  pageContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginTop: 80,
    marginBottom: 50,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  pageTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  pageSubtitle: {
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  pageDescription: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 300,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
    gap: 12,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,215,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.5)',
  },
  indicatorActive: {
    backgroundColor: '#FFD700',
    width: 28,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    minWidth: 120,
    justifyContent: 'center',
    borderWidth: 2,
  },
  prevButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderColor: 'rgba(255,215,0,0.6)',
  },
  nextButton: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderColor: 'rgba(255,215,0,0.2)',
  },
  navButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 6,
  },
  navButtonTextDisabled: {
    color: 'rgba(255,215,0,0.3)',
  },
  nextButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 6,
  },
  skipButton: {
    position: 'absolute',
    right: 24,
    zIndex: 10,
  },
  skipButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.4)',
  },
  skipButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
});