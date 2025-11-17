import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface CustomSliderProps {
  value: number;
  minimumValue: number;
  maximumValue: number;
  onSlidingComplete?: (value: number) => void;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
  style?: any;
}

export default function CustomSlider({
  value,
  minimumValue,
  maximumValue,
  onSlidingComplete,
  minimumTrackTintColor,
  maximumTrackTintColor,
  thumbTintColor,
  style,
}: CustomSliderProps) {
  if (Platform.OS === 'web') {
    // Use native HTML5 range input on web (React 19 compatible)
    return (
      <View style={[styles.webSliderContainer, style]}>
        <input
          type="range"
          min={minimumValue}
          max={maximumValue}
          value={value}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value);
            onSlidingComplete?.(newValue);
          }}
          style={{
            width: '100%',
            height: 4,
            cursor: 'pointer',
            accentColor: minimumTrackTintColor || '#007AFF',
          } as any}
        />
      </View>
    );
  }

  // Use native slider on mobile platforms
  return (
    <Slider
      value={value}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      onSlidingComplete={onSlidingComplete}
      minimumTrackTintColor={minimumTrackTintColor}
      maximumTrackTintColor={maximumTrackTintColor}
      thumbTintColor={thumbTintColor}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  webSliderContainer: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
});