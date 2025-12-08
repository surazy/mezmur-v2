import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useMezmur } from '@/hooks/useMezmur';
import MezmurListItem from '@/components/ui/MezmurListItem';
import { Mezmur } from '@/types';
import { PDFService } from '@/services/pdfService';

export default function FavoritesPage() {
  const { colors, settings } = useTheme();
  const { mezmurs, userMezmurs, favorites, reorderFavorites } = useMezmur();
  const insets = useSafeAreaInsets();
  const [reorderMode, setReorderMode] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [exportingPDF, setExportingPDF] = useState(false);

  // Get actual mezmur objects from favorites list
  const favoriteMezmurs: Mezmur[] = favorites.map(favorite => {
    const allMezmurs = [...mezmurs, ...userMezmurs];
    return allMezmurs.find(m => m.id === favorite.mezmurId);
  }).filter(Boolean) as Mezmur[];

  // Deduplicate
  const uniqueFavoriteMezmurs = Array.from(new Set(favoriteMezmurs.map(m => m.id)))
    .map(id => favoriteMezmurs.find(m => m.id === id)!)
    .filter(Boolean);

  // Sort by most recently favorited - REMOVED to allow manual reordering
  // The order in 'favorites' array is the source of truth
  const sortedFavorites = uniqueFavoriteMezmurs;

  const handleMezmurPress = (mezmur: Mezmur) => {
    if (selectionMode) {
      toggleSelection(mezmur.id);
    } else if (reorderMode) {
      // Do nothing in reorder mode
      return;
    } else {
      router.push({
        pathname: '/mezmur/[id]',
        params: { id: mezmur.id, from: 'favorites' }
      });
    }
  };

  const toggleSelection = (mezmurId: string) => {
    setSelectedIds(prev =>
      prev.includes(mezmurId)
        ? prev.filter(id => id !== mezmurId)
        : [...prev, mezmurId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === sortedFavorites.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedFavorites.map(m => m.id));
    }
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedIds([]);
    if (reorderMode) setReorderMode(false);
  };

  const handleExportPDF = async () => {
    if (selectedIds.length === 0) {
      Alert.alert('No Selection', 'Please select mezmurs to export');
      return;
    }

    setExportingPDF(true);
    try {
      // Get selected mezmurs
      const selectedMezmurs = sortedFavorites.filter(m => selectedIds.includes(m.id));

      const result = await PDFService.exportAndShare(
        selectedMezmurs,
        'Favorite Mezmurs',
        {
          fontSize: settings.fontSize,
          darkMode: settings.themeMode === 'dark'
        }
      );

      if (result.success) {
        setSelectionMode(false);
        setSelectedIds([]);
      } else {
        Alert.alert('Export Error', result.error || 'Failed to export PDF');
      }
    } catch (error) {
      console.error('PDF export error:', error);
      Alert.alert('Export Error', 'An unexpected error occurred while exporting PDF');
    } finally {
      setExportingPDF(false);
    }
  };

  const toggleReorderMode = () => {
    setReorderMode(!reorderMode);
    if (selectionMode) {
      setSelectionMode(false);
      setSelectedIds([]);
    }
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
      showCheckbox={selectionMode}
      isSelected={selectedIds.includes(item.id)}
      onSelect={(selected) => {
        if (selected) {
          setSelectedIds(prev => [...prev, item.id]);
        } else {
          setSelectedIds(prev => prev.filter(id => id !== item.id));
        }
      }}
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

            <TouchableOpacity
              onPress={toggleSelectionMode}
              style={[styles.actionButton, selectionMode && { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            >
              <MaterialIcons
                name={selectionMode ? "close" : "checklist"}
                size={24}
                color="white"
              />
            </TouchableOpacity>

            {/* <MaterialIcons name="favorite" size={24} color="white" /> */}
          </View>
        </View>

        {/* Mode Indicators */}
        {(selectionMode || reorderMode) && (
          <View style={styles.modeBar}>
            {reorderMode && (
              <Text style={styles.modeText}>
                Reorder Mode - Use arrows to rearrange favorites
              </Text>
            )}
            {selectionMode && selectedIds.length > 0 && (
              <>
                <Text style={styles.selectionText}>
                  {selectedIds.length} selected
                </Text>
                <View style={styles.selectionActions}>
                  <TouchableOpacity onPress={handleSelectAll} style={styles.selectionAction}>
                    <MaterialIcons
                      name={selectedIds.length === sortedFavorites.length ? "remove-done" : "select-all"}
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleExportPDF}
                    style={styles.selectionAction}
                    disabled={exportingPDF}
                  >
                    {exportingPDF ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <MaterialIcons name="picture-as-pdf" size={20} color="white" />
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
      </View>

      {/* Content */}
      <FlatList
        data={sortedFavorites}
        renderItem={renderMezmur}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 100 }}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  modeText: {
    color: 'white',
    fontSize: 14,
    fontStyle: 'italic',
    flex: 1,
  },
  selectionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  selectionActions: {
    flexDirection: 'row',
    gap: 16,
  },
  selectionAction: {
    padding: 8,
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