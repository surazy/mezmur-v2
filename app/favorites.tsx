import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useMezmur } from '@/hooks/useMezmur';
import MezmurListItem from '@/components/ui/MezmurListItem';
import { Mezmur } from '@/types';

export default function FavoritesPage() {
  const { colors } = useTheme();
  const { mezmurs, userMezmurs, favorites, reorderFavorites } = useMezmur();
  const insets = useSafeAreaInsets();
  const [reorderMode, setReorderMode] = useState(false);

  // Get actual mezmur objects from favorites list
  const favoriteMezmurs: Mezmur[] = favorites.map(favorite => {
    const allMezmurs = [...mezmurs, ...userMezmurs];
    return allMezmurs.find(m => m.id === favorite.mezmurId);
  }).filter(Boolean) as Mezmur[];

  // Sort by most recently favorited
  const sortedFavorites = favoriteMezmurs.sort((a, b) => {
    const aFavorite = favorites.find(f => f.mezmurId === a.id);
    const bFavorite = favorites.find(f => f.mezmurId === b.id);
    return new Date(bFavorite?.addedAt || 0).getTime() - new Date(aFavorite?.addedAt || 0).getTime();
  });

  const handleMezmurPress = (mezmur: Mezmur) => {
    if (reorderMode) {
      // Do nothing in reorder mode
      return;
    }
    
    router.push({
      pathname: '/mezmur/[id]',
      params: { id: mezmur.id }
    });
  };

  const toggleReorderMode = () => {
    setReorderMode(!reorderMode);
  };

  const handleMoveUp = async (index: number) => {
    if (index > 0) {
      await reorderFavorites(index, index - 1);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index < sortedFavorites.length - 1) {
      await reorderFavorites(index, index + 1);
    }
  };

  const renderMezmur = ({ item, index }: { item: Mezmur; index: number }) => (
    <MezmurListItem
      mezmur={item}
      number={index + 1}
      onPress={() => handleMezmurPress(item)}
      showReorderControls={reorderMode}
      onMoveUp={() => handleMoveUp(index)}
      onMoveDown={() => handleMoveDown(index)}
      canMoveUp={index > 0}
      canMoveDown={index < sortedFavorites.length - 1}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { 
        paddingTop: insets.top,
        backgroundColor: colors.primary,
        borderBottomColor: colors.border 
      }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>
              Favorites
            </Text>
            <Text style={styles.headerSubtitle}>
              {sortedFavorites.length} favorite mezmurs
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity 
              onPress={toggleReorderMode}
              style={[styles.actionButton, reorderMode && { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            >
              <MaterialIcons 
                name="swap-vert" 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
            
            <MaterialIcons name="favorite" size={24} color="white" />
          </View>
        </View>

        {/* Mode Indicator */}
        {reorderMode && (
          <View style={styles.modeBar}>
            <Text style={styles.modeText}>
              Reorder Mode - Use arrows to rearrange favorites
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <FlatList
        data={sortedFavorites}
        renderItem={renderMezmur}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="favorite-border" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No favorite mezmurs yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Tap the heart icon on any mezmur to add it to your favorites
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    gap: 12,
  },
  actionButton: {
    padding: 4,
    borderRadius: 4,
  },
  modeBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  modeText: {
    color: 'white',
    fontSize: 14,
    fontStyle: 'italic',
  },
  list: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});