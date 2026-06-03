import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  ImageBackground, 
  Pressable 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { CategoryInfo } from '@/types';
import { CATEGORIES } from '@/constants/categories';
import { useMezmur } from '@/hooks/useMezmur';

interface CategoryGridProps {
  onCategoryPress: (category: CategoryInfo) => void;
}

interface CategoryCardProps {
  item: CategoryInfo;
  count: number;
  onPress: (category: CategoryInfo) => void;
  colors: any;
  isDark: boolean;
}

const CategoryCard = React.memo(({ item, count, onPress, colors, isDark }: CategoryCardProps) => {
  const animatedValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    onPress(item);
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      android_disableSound
      pressRetentionOffset={{ top: 20, left: 20, right: 20, bottom: 20 }} // Prevents accidental taps while scrolling
    >
      <Animated.View
        style={[
          styles.categoryCard,
          { 
            shadowColor: isDark ? colors.primary : '#000',
            elevation: isDark ? 8 : 4,
            transform: [{ scale: animatedValue }],
          }
        ]}
      >
        <ImageBackground
          source={item.image}
          resizeMode="cover"
          style={styles.backgroundImage}
          resizeMethod="resize"
        >
          <LinearGradient
            colors={
              isDark 
                ? ['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']
                : ['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.5)']
            }
            style={styles.overlay}
          >
            <View style={styles.cardContent}>
              <Text 
                style={[
                  styles.categoryName, 
                  { color: '#FFD700', textShadowColor: 'rgba(0,0,0,0.9)' }
                ]}
                numberOfLines={2}
              >
                {item.name}
              </Text>
              <Text 
                style={[
                  styles.categoryCount,
                  { color: '#FFD700', textShadowColor: 'rgba(0,0,0,0.8)' }
                ]}
              >
                {count} መዝሙራት
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </Animated.View>
    </Pressable>
  );
});

export default function CategoryGrid({ onCategoryPress }: CategoryGridProps) {
  const { colors, isDark } = useTheme();
  const { getMezmursByCategory } = useMezmur();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {CATEGORIES.map((item) => {
        const count = getMezmursByCategory(item.id).length;
        return (
          <CategoryCard
            key={item.id}
            item={item}
            count={count}
            onPress={onCategoryPress}
            colors={colors}
            isDark={isDark}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 32,
  },
  categoryCard: {
    height: 160,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardContent: {
    padding: 16,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.9,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
