import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useMezmur } from '@/hooks/useMezmur';
import MezmurListItem from '@/components/ui/MezmurListItem';
import { Mezmur } from '@/types';
import { SupabaseService } from '@/services/supabaseService';
import { PDFService } from '@/services/pdfService';

export default function CategoryPage() {
  const { colors, settings } = useTheme();
  const { getMezmursByCategory, reorderMezmurs } = useMezmur();
  const insets = useSafeAreaInsets();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();

  const [mezmurs, setMezmurs] = useState<Mezmur[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  useEffect(() => {
    loadCategoryMezmurs();
  }, [id]);

  // Refresh mezmurs when context changes (for reordering)
  useEffect(() => {
    if (id) {
      const categoryMezmurs = getMezmursByCategory(id as any);
      setMezmurs(categoryMezmurs);
    }
  }, [getMezmursByCategory, id]);

  const loadCategoryMezmurs = async () => {
    setLoading(true);
    try {
      // Try to fetch from Supabase first
      const result = await SupabaseService.fetchMezmursByCategory(id);

      if (result.success && result.mezmurs.length > 0) {
        setMezmurs(result.mezmurs);
      } else {
        // Fallback to local mezmurs
        const localMezmurs = getMezmursByCategory(id as any);
        setMezmurs(localMezmurs);
      }
    } catch (error) {
      console.error('Error loading category mezmurs:', error);
      // Fallback to local mezmurs
      const localMezmurs = getMezmursByCategory(id as any);
      setMezmurs(localMezmurs);
    } finally {
      setLoading(false);
    }
  };

  const handleMezmurPress = (mezmur: Mezmur) => {
    if (selectionMode) {
      toggleSelection(mezmur.id);
    } else if (reorderMode) {
      // Do nothing in reorder mode
      return;
    } else {
      router.push({
        pathname: '/mezmur/[id]',
        params: { id: mezmur.id }
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
    if (selectedIds.length === mezmurs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mezmurs.map(m => m.id));
    }
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedIds([]);
    if (reorderMode) setReorderMode(false);
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
      console.log(`🔼 Moving mezmur up: ${index} → ${index - 1}`);
      try {
        await reorderMezmurs(id as any, index, index - 1);
        // The context will update and useEffect will refresh the local state
      } catch (error) {
        console.error('Error moving mezmur up:', error);
        Alert.alert('Error', 'Failed to reorder mezmur. Please try again.');
      }
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index < mezmurs.length - 1) {
      console.log(`🔽 Moving mezmur down: ${index} → ${index + 1}`);
      try {
        await reorderMezmurs(id as any, index, index + 1);
        // The context will update and useEffect will refresh the local state
      } catch (error) {
        console.error('Error moving mezmur down:', error);
        Alert.alert('Error', 'Failed to reorder mezmur. Please try again.');
      }
    }
  };

  const handleShare = async () => {
     if (selectedIds.length === 0) {
      Alert.alert('No Selection', 'Please select mezmurs to export');
      return;
    }

    setExportingPDF(true);
    try {
      // Get selected mezmurs
      const selectedMezmurs = mezmurs.filter(m => selectedIds.includes(m.id));
      const categoryName = decodeURIComponent(name || 'Category');

      const result = await PDFService.exportAndShare(
        selectedMezmurs,
        `${categoryName} - መዝሙራት`,
        {
          fontSize: settings.fontSize,
          darkMode: settings.themeMode === 'dark'
        }
      );

      if (result.success) {
        // Exit selection mode after successful export
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

  const handleExportPDF = async () => {
    if (selectedIds.length === 0) {
      Alert.alert('No Selection', 'Please select mezmurs to export');
      return;
    }

    setExportingPDF(true);
    try {
      // Get selected mezmurs
      const selectedMezmurs = mezmurs.filter(m => selectedIds.includes(m.id));
      const categoryName = decodeURIComponent(name || 'Category');

      const result = await PDFService.exportAndShare(
        selectedMezmurs,
        `${categoryName} - መዝሙራት`,
        {
          fontSize: settings.fontSize,
          darkMode: settings.themeMode === 'dark'
        }
      );

      if (result.success) {
        // Exit selection mode after successful export
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
      canMoveDown={index < mezmurs.length - 1}
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
            <Text style={styles.headerTitle} numberOfLines={2}>
              {decodeURIComponent(name || '')}
            </Text>
            <Text style={styles.headerSubtitle}>
              {mezmurs.length} መዝሙራት
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
          </View>
        </View>

        {/* Mode Indicators */}
        {(selectionMode || reorderMode) && (
          <View style={styles.modeBar}>
            {reorderMode && (
              <Text style={styles.modeText}>
                Reorder Mode - Use arrows to rearrange
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
                      name={selectedIds.length === mezmurs.length ? "remove-done" : "select-all"}
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleShare} style={styles.selectionAction}>
                    <MaterialIcons name="share" size={20} color="white" />
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
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading mezmurs...
          </Text>
        </View>
      ) : (
        <FlatList
          data={mezmurs}
          renderItem={renderMezmur}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="music-off" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.text }]}>
                No mezmurs found in this category
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Sync to download new content
              </Text>
            </View>
          }
        />
      )}
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
    fontFamily: 'Zemenay_Regular_Abel_Yeshewalem_c74cc019f5',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Zemenay_Regular_Abel_Yeshewalem_c74cc019f5',
  },
  headerActions: {
    flexDirection: 'row',
    marginLeft: 16,
    gap: 8,
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
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
  },
});