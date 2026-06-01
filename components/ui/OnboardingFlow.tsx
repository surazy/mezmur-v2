import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
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
  gradientColors: [string, string, ...string[]];
}

const onboardingPages: OnboardingPage[] = [
  {
    id: 1,
    title: 'ፈለገ መዝሙራት',
    subtitle: 'Ethiopian Religious Songs',
    description: 'Discover thousands of beautiful Ethiopian religious songs and mezmurs in one comprehensive collection.',
    icon: 'music-note',
    gradientColors: ['#0a0e27', '#1a2951', '#0d1b3e']
  },
  {
    id: 2,
    title: 'የክፍሎች',
    subtitle: 'Organized Collections',
    description: 'Explore mezmurs organized by religious seasons, saints, and occasions. Find exactly what you are looking for.',
    icon: 'category',
    gradientColors: ['#0d1b3e', '#152a5a', '#0a0e27']
  },
  {
    id: 3,
    title: 'መፍጠር & መግባት',
    subtitle: 'Your Personal Collection',
    description: 'Add your own mezmurs to the collection. Create a personal library that syncs across all your devices.',
    icon: 'add-circle',
    gradientColors: ['#1a2951', '#0f1c3d', '#0a0e27']
  },
  {
    id: 4,
    title: 'ተወዳጆች & ስምምነት',
    subtitle: 'Never Lose Your Favorites',
    description: 'Mark your favorite mezmurs and sync them across devices. Access your collection anytime, anywhere.',
    icon: 'favorite',
    gradientColors: ['#0a0e27', '#1531d1', '#0d1b3e']
  }
];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const insets = useSafeAreaInsets();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Reset and animate when page changes
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.9);
    slideAnim.setValue(20);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentPage]);

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
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.6)']}
          style={styles.overlay}
        >
          <Animated.View 
            style={[
              styles.pageContent, 
              { 
                paddingTop: insets.top + 60,
                opacity: index === currentPage ? fadeAnim : 1,
                transform: [
                  { scale: index === currentPage ? scaleAnim : 1 },
                  { translateY: index === currentPage ? slideAnim : 0 }
                ]
              }
            ]}
          >
            {/* Icon */}
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['#1531d1', '#007AFF', '#00D4FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              >
                <MaterialIcons
                  name={page.icon as any}
                  size={60}
                  color="#FFFFFF"
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
                  color={currentPage === 0 ? 'rgba(21, 49, 209, 0.3)' : '#1531d1'}
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
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </Animated.View>
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
        <BlurView intensity={40} style={styles.skipButtonBlur}>
          <LinearGradient
            colors={['rgba(21, 49, 209, 0.3)', 'rgba(0, 122, 255, 0.3)']}
            style={styles.skipButtonGradient}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </LinearGradient>
        </BlurView>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
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
    shadowColor: '#1531d1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 12,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  pageTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Zemenay_Regular_Abel_Yeshewalem_c74cc019f5',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(21, 49, 209, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  pageSubtitle: {
    fontSize: 18,
    color: '#00D4FF',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '600',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 212, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  pageDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 300,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.5)',
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
    backgroundColor: 'rgba(21, 49, 209, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(21, 49, 209, 0.5)',
  },
  indicatorActive: {
    backgroundColor: '#1531d1',
    width: 28,
    borderColor: '#00D4FF',
    shadowColor: '#1531d1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
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
    backgroundColor: 'rgba(21, 49, 209, 0.15)',
    borderColor: 'rgba(21, 49, 209, 0.5)',
  },
  nextButton: {
    backgroundColor: '#1531d1',
    borderColor: '#00D4FF',
    shadowColor: '#1531d1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(21, 49, 209, 0.1)',
    borderColor: 'rgba(21, 49, 209, 0.2)',
  },
  navButtonText: {
    color: '#1531d1',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 6,
  },
  navButtonTextDisabled: {
    color: 'rgba(21, 49, 209, 0.3)',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 6,
  },
  skipButton: {
    position: 'absolute',
    right: 24,
    zIndex: 10,
  },
  skipButtonBlur: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  skipButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 212, 255, 0.6)',
  },
  skipButtonText: {
    color: '#00D4FF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});