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
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
  image: any;
}

const onboardingPages: OnboardingPage[] = [
  {
    id: 1,
    title: 'ፈለገ መዝሙራት',
    subtitle: 'Ethiopian Religious Songs',
    description: 'Discover thousands of beautiful Ethiopian religious songs and mezmurs in one comprehensive collection.',
    icon: 'music-note',
    gradientColors: ['#0a0e27', '#1a2951', '#0d1b3e'],
    image: require('../../assets/images/categories/medeye.png')
  },
  {
    id: 2,
    title: 'የክፍሎች',
    subtitle: 'Organized Collections',
    description: 'Explore mezmurs organized by religious seasons, saints, and occasions. Find exactly what you are looking for.',
    icon: 'category',
    gradientColors: ['#0d1b3e', '#152a5a', '#0a0e27'],
    image: require('../../assets/images/categories/medeye.png')
  },
  {
    id: 3,
    title: 'መፍጠር & መግባት',
    subtitle: 'Your Personal Collection',
    description: 'Add your own mezmurs to the collection. Create a personal library that syncs across all your devices.',
    icon: 'add-circle',
    gradientColors: ['#1a2951', '#0f1c3d', '#0a0e27'],
    image: require('../../assets/images/categories/medeye.png')
  },
  {
    id: 4,
    title: 'ተወዳጆች & ስምምነት',
    subtitle: 'Never Lose Your Favorites',
    description: 'Mark your favorite mezmurs and sync them across devices. Access your collection anytime, anywhere.',
    icon: 'favorite',
    gradientColors: ['#0a0e27', '#1531d1', '#0d1b3e'],
    image: require('../../assets/images/categories/medeye.png')
  }
];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const insets = useSafeAreaInsets();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

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
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const renderPage = (page: OnboardingPage, index: number) => {
    const opacity = scrollX.interpolate({
      inputRange: [
        (index - 1) * screenWidth,
        index * screenWidth,
        (index + 1) * screenWidth,
      ],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });

    const scale = scrollX.interpolate({
      inputRange: [
        (index - 1) * screenWidth,
        index * screenWidth,
        (index + 1) * screenWidth,
      ],
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    const translateX = scrollX.interpolate({
      inputRange: [
        (index - 1) * screenWidth,
        index * screenWidth,
        (index + 1) * screenWidth,
      ],
      outputRange: [screenWidth * 0.3, 0, -screenWidth * 0.3],
      extrapolate: 'clamp',
    });

    return (
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
                  paddingTop: 0,
                  paddingBottom: insets.bottom + 150,
                  opacity,
                  transform: [
                    { scale },
                    { translateX }
                  ]
                }
              ]}
            >
              {/* Image with gradient mask */}
              <View style={styles.imageContainer}>
                <Image
                  source={page.image}
                  style={styles.cardImage}
                  resizeMode="cover"
                  resizeMethod="resize"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.4)', page.gradientColors[page.gradientColors.length - 1]]}
                  style={styles.imageGradientMask}
                />
              </View>

              {/* Floating Icon */}
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={['#1531d1', '#007AFF', '#00D4FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconGradient}
                >
                  <MaterialIcons
                    name={page.icon as any}
                    size={32}
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
            </Animated.View>
          </LinearGradient>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef as any}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { 
            useNativeDriver: true,
            listener: (event: any) => handleScroll(event)
          }
        )}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {onboardingPages.map(renderPage)}
      </Animated.ScrollView>

      {/* Static bottom controls */}
      <View 
        pointerEvents="box-none"
        style={[styles.bottomContainer, { paddingBottom: insets.bottom + 30 }]}
      >
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
        <View style={styles.navigationContainer}>
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
      </View>

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
  },
  imageContainer: {
    width: '100%',
    height: screenHeight * 0.42,
    position: 'relative',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageGradientMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
  },
  iconContainer: {
    marginTop: -35,
    zIndex: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  iconGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#1531d1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 40,
  },
  pageTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
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
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});