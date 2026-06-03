import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface WelcomeSplashProps {
  onComplete?: () => void;
}

export default function WelcomeSplash({ onComplete = () => {} }: WelcomeSplashProps) {
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(30)).current;
  const gradientOpacity = useRef(new Animated.Value(0)).current;

  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Gradient fade in
    Animated.timing(gradientOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Logo entrance
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 900,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Title entrance
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 800,
        delay: 800,
        useNativeDriver: true,
      }),
      Animated.timing(textTranslate, {
        toValue: 0,
        duration: 800,
        delay: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtitle entrance
    Animated.timing(subtitleOpacity, {
      toValue: 1,
      duration: 800,
      delay: 1400,
      useNativeDriver: true,
    }).start();

    // Pulsing dots
    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dot1Opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(dot1Opacity, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        Animated.sequence([
          Animated.timing(dot2Opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      }, 200);

      setTimeout(() => {
        Animated.sequence([
          Animated.timing(dot3Opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      }, 400);
    };

    const dotsInterval = setInterval(animateDots, 1500);
    animateDots();

    // Fade out after 4 seconds
    const timeout = setTimeout(() => {
      clearInterval(dotsInterval);
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        onComplete();
      });
    }, 4000);

    return () => {
      clearInterval(dotsInterval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      {/* Animated Gradient Background */}
      <Animated.View style={[styles.gradientWrapper, { opacity: gradientOpacity }]}>
        <LinearGradient
          colors={['#0a0e27', '#1a2951', '#0d1b3e']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.backgroundGradient}
        />
      </Animated.View>

      {/* Overlay with accent colors */}
      <LinearGradient
        colors={['rgba(21, 49, 209, 0.1)', 'rgba(0, 0, 0, 0.3)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.overlay}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Logo with gradient border */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <LinearGradient
            colors={['#1531d1', '#007AFF', '#1531d1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <Image
              source={require('@/assets/images/categories/iconer.jpg')}
              style={styles.logo}
              resizeMode="cover"
              resizeMethod="resize"
            />
          </LinearGradient>
        </Animated.View>

        {/* Title */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: titleOpacity,
              transform: [{ translateY: textTranslate }],
            },
          ]}
        >
          <Text style={styles.title}>ፈለገ መዝሙራት</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View style={[styles.subtitleContainer, { opacity: subtitleOpacity }]}>
          <Text style={styles.subtitle}>ፈለገ ብርሃን ሰንበት ትምሕርት ቤት</Text>
        </Animated.View>

        {/* Loading Dots */}
        <View style={styles.loadingContainer}>
          <Animated.View
            style={[styles.dot, { opacity: dot1Opacity, backgroundColor: '#1531d1' }]}
          />
          <Animated.View
            style={[styles.dot, { opacity: dot2Opacity, backgroundColor: '#1531d1' }]}
          />
          <Animated.View
            style={[styles.dot, { opacity: dot3Opacity, backgroundColor: '#1531d1' }]}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  logoContainer: {
    marginBottom: 40,
  },
  gradientBorder: {
    padding: 4,
    borderRadius: 90,
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  textContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.8,
    fontFamily: 'Zemenay_Regular_Abel_Yeshewalem_c74cc019f5',
  },
  subtitleContainer: {
    marginBottom: 50,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.5,
    fontFamily: 'Zemenay_Regular_Abel_Yeshewalem_c74cc019f5',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowColor: '#1531d1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
});
