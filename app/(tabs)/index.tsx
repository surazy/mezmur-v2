import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Text,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useMezmur } from '@/hooks/useMezmur';
import CategoryGrid from '@/components/ui/CategoryGrid';
import SearchOverlay from '@/components/ui/SearchOverlay';
import { CategoryInfo, Mezmur } from '@/types';

const { height, width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = height * 0.28;
const HEADER_MIN_HEIGHT = 100;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function HomePage() {
  const { colors } = useTheme();
  const { syncing, syncMezmurs } = useMezmur();
  const insets = useSafeAreaInsets();
  const [showSearch, setShowSearch] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleCategoryPress = (category: CategoryInfo) => {
    router.push({
      pathname: '/category/[id]',
      params: { id: category.id, name: category.name },
    });
  };

  const handleMezmurPress = (mezmur: Mezmur) => {
    router.push({
      pathname: '/mezmur/[id]',
      params: { id: mezmur.id },
    });
  };

  const handleSync = () => {
    if (!syncing) syncMezmurs();
  };

  // Header animations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.7],
    extrapolate: 'clamp',
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -10],
    extrapolate: 'clamp',
  });

  // Move text horizontally from center → left
  const titleTranslateX = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -width / 3], // move to left on collapse
    extrapolate: 'clamp',
  });

  const subtitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.4, 0],
    extrapolate: 'clamp',
  });

  // Fade from image to solid color
  const fadeToColor = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Collapsing Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <ImageBackground
          source={require('@/assets/images/categories/mesgana.jpg')}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          {/* Color fade overlay */}
          <Animated.View
            style={[
              styles.fadeOverlay,
              { backgroundColor: colors.primary, opacity: fadeToColor },
            ]}
          />

          {/* Animated text container */}
          <View style={styles.overlay}>
            <Animated.View
              style={[
                styles.textContainer,
                {
                  transform: [
                    { scale: titleScale },
                    { translateY: titleTranslateY },
                    { translateX: titleTranslateX },
                  ],
                },
              ]}
            >
              <Text style={styles.headerTitle}>ፈለገ መዝሙራት</Text>
              <Animated.Text
                style={[styles.headerSubtitle, { opacity: subtitleOpacity }]}
              >
                Ethiopian Religious Songs
              </Animated.Text>
            </Animated.View>
          </View>
        </ImageBackground>

        {/* Floating buttons */}
        <View style={[styles.headerActions, { top: insets.top + 10 }]}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleSync}
            disabled={syncing}
            activeOpacity={0.8}
          >
            <MaterialIcons name="refresh" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowSearch(true)}
            activeOpacity={0.8}
          >
            <MaterialIcons name="search" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Scroll Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <CategoryGrid onCategoryPress={handleCategoryPress} />
      </Animated.ScrollView>

      <SearchOverlay
        visible={showSearch}
        onClose={() => setShowSearch(false)}
        onMezmurPress={handleMezmurPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 2,
  },
  imageBackground: { flex: 1 },
  fadeOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // starts centered
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: -40,
  },
  headerTitle: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
  },
  headerActions: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    gap: 16,
    zIndex: 3,
  },
  headerButton: {
    padding: 8,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  scrollView: { flex: 1 },
});
