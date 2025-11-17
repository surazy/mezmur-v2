import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface WelcomeSplashProps {
  onComplete?: () => void;
}

export default function WelcomeSplash({ onComplete = () => {} }: WelcomeSplashProps) {
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(20)).current;

  const dot1 = useRef(new Animated.Value(0.2)).current;
  const dot2 = useRef(new Animated.Value(0.2)).current;
  const dot3 = useRef(new Animated.Value(0.2)).current;

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Logo fade in + scale
    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    // Text animation
    Animated.parallel([
      Animated.timing(textOpacity, { toValue: 1, duration: 800, delay: 400, useNativeDriver: true }),
      Animated.timing(textTranslate, { toValue: 0, duration: 800, delay: 400, useNativeDriver: true }),
    ]).start();

    // Pulse animation for logo
    const startPulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]).start(() => startPulse());
    };
    const pulseTimer = setTimeout(startPulse, 500);

    // Animate dots sequentially
    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dot1, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot1, { toValue: 0.2, duration: 400, useNativeDriver: true }),
      ]).start();
      Animated.sequence([
        Animated.timing(dot2, { toValue: 1, duration: 400, delay: 200, useNativeDriver: true }),
        Animated.timing(dot2, { toValue: 0.2, duration: 400, delay: 200, useNativeDriver: true }),
      ]).start();
      Animated.sequence([
        Animated.timing(dot3, { toValue: 1, duration: 400, delay: 400, useNativeDriver: true }),
        Animated.timing(dot3, { toValue: 0.2, duration: 400, delay: 400, useNativeDriver: true }),
      ]).start();
    };
    const dotsInterval = setInterval(animateDots, 1200);

    // Fade out everything after 3.5 seconds
    const timeout = setTimeout(() => {
      clearInterval(dotsInterval);
      clearTimeout(pulseTimer);
      Animated.timing(containerOpacity, { toValue: 0, duration: 800, useNativeDriver: true }).start(() => {
        onComplete();
      });
    }, 3500);

    return () => {
      clearInterval(dotsInterval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      <LinearGradient colors={['#1a1a1a', '#2d2d2d', '#000']} style={styles.backgroundGradient}>
        <LinearGradient
          colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,0.95)']}
          style={styles.overlay}
        >
          <Animated.View style={[styles.content, { transform: [{ scale: logoScale }], opacity: logoOpacity }]}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Image
                source={require('@/assets/images/categories/iconer.jpg')}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>

            <Animated.View style={{ opacity: textOpacity, transform: [{ translateY: textTranslate }] }}>
              <Text style={styles.title}>ፈለገ መዝሙራት</Text>
              <Text style={styles.subtitle}>ፈለገ ብርሃን ሰንበት ትምሕርት ቤት</Text>
            </Animated.View>

            <View style={styles.loadingContainer}>
              <Animated.View style={[styles.loadingDot, { opacity: dot1 }]} />
              <Animated.View style={[styles.loadingDot, { opacity: dot2 }]} />
              <Animated.View style={[styles.loadingDot, { opacity: dot3 }]} />
            </View>
          </Animated.View>
        </LinearGradient>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 9999,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center', paddingHorizontal: 40 },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 20,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 60,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  loadingDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFD700',
    marginHorizontal: 6,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
});
