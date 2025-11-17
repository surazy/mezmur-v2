import React, { useRef, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Animated, Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

function BouncyIcon({ name, color, size, focused }: any) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.3 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <MaterialIcons name={name} size={size} color={color} />
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
          tabBarBackground: () => (
            <BlurView
              intensity={80}
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
          tabBarStyle: {
            position: 'absolute',
            bottom: 16 + insets.bottom,
            left: 20,
            right: 20,
            borderTopWidth: 0,
            borderRadius: 24,
            height: 65,
            paddingBottom: Platform.OS === 'ios' ? 10 : 8,
            paddingTop: 8,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 6 },
            shadowRadius: 10,
            elevation: 10,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: isDark ? '#aaa' : '#666',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginBottom: 4,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
          sceneStyle: {
            backgroundColor: colors.background,
            paddingBottom: 90,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'መዝሙሮች',
            tabBarIcon: ({ color, size, focused }) => (
              <BouncyIcon name="music-note" color={color} size={size + 2} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="manage"
          options={{
            title: 'አስተዳደር',
            tabBarIcon: ({ color, size, focused }) => (
              <BouncyIcon name="settings" color={color} size={size + 2} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
