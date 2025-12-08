import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useMezmur } from '@/hooks/useMezmur';
import { Mezmur } from '@/types';

interface MezmurListItemProps {
  mezmur: Mezmur;
  onPress: () => void;
  showCheckbox?: boolean;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  number?: number;
  showReorderControls?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export default function MezmurListItem({
  mezmur,
  onPress,
  showCheckbox = false,
  isSelected = false,
  onSelect,
  number,
  showReorderControls = false,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true
}: MezmurListItemProps) {
  const { colors } = useTheme();
  const { isFavorite } = useMezmur();
  const favorite = isFavorite(mezmur.id);

  const handleSelect = () => {
    onSelect?.(!isSelected);
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={showCheckbox ? handleSelect : onPress}
      activeOpacity={0.7}
    >
      {/* Number Badge */}
      {number !== undefined && (
        <View style={[styles.numberBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.numberText}>{number}</Text>
        </View>
      )}

      {showCheckbox && (
        <View style={[styles.checkbox, { marginLeft: number !== undefined ? 8 : 0 }]}>
          <MaterialIcons
            name={isSelected ? 'check-box' : 'check-box-outline-blank'}
            size={24}
            color={isSelected ? colors.primary : colors.textSecondary}
          />
        </View>
      )}

      <View style={[styles.content, { marginLeft: (number !== undefined || showCheckbox) ? 0 : 16 }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {mezmur.title}
          </Text>
          <View style={styles.indicators}>
            {mezmur.audio_url && (
              <MaterialIcons name="play-circle-outline" size={20} color={colors.secondary} />
            )}
            {favorite && (
              <MaterialIcons name="favorite" size={18} color={colors.accent} />
            )}
            {mezmur.isUserAdded && (
              <MaterialIcons name="person" size={18} color={colors.primary} />
            )}
          </View>
        </View>

        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {mezmur.first_line || mezmur.description}
        </Text>

        <View style={styles.footer}>
          {/* <Text style={[styles.category, { color: colors.textSecondary }]}>
            {mezmur.category}
          </Text> */}
        </View>
      </View>

      {/* Reorder Controls */}
      {showReorderControls && (
        <View style={styles.reorderControls}>
          <TouchableOpacity
            style={[
              styles.reorderButton,
              {
                backgroundColor: canMoveUp ? colors.primary : colors.border,
                opacity: canMoveUp ? 1 : 0.5
              }
            ]}
            onPress={onMoveUp}
            disabled={!canMoveUp}
          >
            <MaterialIcons
              name="keyboard-arrow-up"
              size={20}
              color={canMoveUp ? "white" : colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.reorderButton,
              {
                backgroundColor: canMoveDown ? colors.primary : colors.border,
                opacity: canMoveDown ? 1 : 0.5
              }
            ]}
            onPress={onMoveDown}
            disabled={!canMoveDown}
          >
            <MaterialIcons
              name="keyboard-arrow-down"
              size={20}
              color={canMoveDown ? "white" : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    alignItems: 'flex-start',
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  numberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    fontWeight: '500',
  },
  reorderControls: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginLeft: 12,
  },
  reorderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});