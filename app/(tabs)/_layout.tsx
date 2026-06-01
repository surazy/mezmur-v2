import React, { useRef, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Animated, Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

function BouncyIcon({ name, color, size, focused }: any) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1.25 : 1,
        friction: 6,
        tension: 150,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: focused ? -6 : 0,
        friction: 6,
        tension: 150,
        useNativeDriver: true,
      })
    ]).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale }, { translateY }] }}>
      <MaterialIcons name={name} size={size + 2} color={color} />
    </Animated.View>
  );
}

export default function TabLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = colors.background === '#000000';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        screenOptions={{
          headerShown: false,



          // ⭐ Beautiful blurred glass effect
          tabBarBackground: () => (
            <BlurView
              intensity={90}
              tint={isDark ? 'dark' : 'light'}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '100%',
                borderRadius: 24,
              }}
            />
          ),

          // ⭐ Floating frosted bar styling
          tabBarStyle: {
            position: 'absolute',
            bottom: 20 + insets.bottom,
            left: 25,
            right: 25,
            height: 65,

            backgroundColor: 'transparent',
            borderRadius: 26,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
            overflow: 'hidden',

            // Soft floating glass shadow
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowOffset: { width: 0, height: 8 },
            shadowRadius: 20,
            elevation: 25,

            paddingBottom: Platform.OS === 'ios' ? 10 : 6,
            paddingTop: 8,
          },

          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: isDark ? '#9E9E9E' : '#666',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginBottom: 5,
            fontFamily: 'Zemenay_Regular_Abel_Yeshewalem_c74cc019f5',
          },
          tabBarIconStyle: { marginTop: 4 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'መዝሙሮች',
            tabBarIcon: ({ color, size, focused }) => (
              <BouncyIcon name="music-note" color={color} size={size} focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="favorites"
          options={{
            title: 'ተወዳጆች',
            tabBarIcon: ({ color, size, focused }) => (
              <BouncyIcon name="favorite" color={color} size={size} focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="manage"
          options={{
            title: 'አስተዳደር',
            tabBarIcon: ({ color, size, focused }) => (
              <BouncyIcon name="settings" color={color} size={size} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
