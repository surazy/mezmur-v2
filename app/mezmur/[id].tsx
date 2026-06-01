import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  FlatList,
  Dimensions,
  ListRenderItemInfo
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import { useMezmur } from '@/hooks/useMezmur';
import { Mezmur } from '@/types';
import { PDFService } from '@/services/pdfService';

export default function MezmurDetailPage() {
  const { colors, settings, updateSettings } = useTheme();
  const { mezmurs, userMezmurs, favorites, addToFavorites, removeFromFavorites, addToHistory, isFavorite, getMezmursByCategory } = useMezmur();
  const insets = useSafeAreaInsets();
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();

  const [mezmur, setMezmur] = useState<Mezmur | null>(null);
  const [activeMezmur, setActiveMezmur] = useState<Mezmur | null>(null);
  const [categoryMezmurs, setCategoryMezmurs] = useState<Mezmur[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  // Find and set mezmur when ID changes
  useEffect(() => {
    if (id) {
      const allMezmurs = [...mezmurs, ...userMezmurs];
      const foundMezmur = allMezmurs.find(m => m.id === id);

      if (foundMezmur) {
        setMezmur(foundMezmur);
        setActiveMezmur(foundMezmur);
        addToHistory(id);
      } else {
        setMezmur(null);
        setActiveMezmur(null);
      }
    }
  }, [id, mezmurs, userMezmurs]);

  // Update category list and current index when mezmur or context changes
  useEffect(() => {
    if (mezmur) {
      let playlist: Mezmur[] = [];

      if (from === 'favorites') {
        const allMezmurs = [...mezmurs, ...userMezmurs];
        // Reconstruct favorites list in order
        // Note: We should ideally respect the sort order from favorites page, 
        // but for now we'll just use the order in the favorites array (which is insertion order unless reordered)
        // Wait, favorites page does this:
        /*
          const sortedFavorites = uniqueFavoriteMezmurs.sort((a, b) => {
            const aFavorite = favorites.find(f => f.mezmurId === a.id);
            const bFavorite = favorites.find(f => f.mezmurId === b.id);
            return new Date(bFavorite?.addedAt || 0).getTime() - new Date(aFavorite?.addedAt || 0).getTime();
          });
        */
        // If I just map favorites, I get them in the order they are in the array.
        // Does reorderFavorites update the array order? Yes.
        // So I should just map the favorites array to mezmurs.

        playlist = favorites.map(f => allMezmurs.find(m => m.id === f.mezmurId)).filter(Boolean) as Mezmur[];

        // Deduplicate just in case
        playlist = Array.from(new Set(playlist.map(m => m.id)))
          .map(id => playlist.find(m => m.id === id)!)
          .filter(Boolean);

      } else {
        playlist = getMezmursByCategory(mezmur.category);
      }

      setCategoryMezmurs(playlist);

      const index = playlist.findIndex(m => m.id === mezmur.id);
      setCurrentIndex(index);
    }
  }, [mezmur, mezmurs, userMezmurs, favorites, getMezmursByCategory, from]);

  const handleFavoriteToggle = () => {
    if (!mezmur) return;

    if (isFavorite(mezmur.id)) {
      removeFromFavorites(mezmur.id);
    } else {
      addToFavorites(mezmur.id);
    }
  };

  const handleFontSizeChange = (increment: boolean) => {
    const newSize = increment ? settings.fontSize + 2 : settings.fontSize - 2;
    const clampedSize = Math.max(12, Math.min(24, newSize));
    updateSettings({ fontSize: clampedSize });
  };

  const handleShare = async () => {
     if (!mezmur) return;

    setExportingPDF(true);
    try {
      const result = await PDFService.exportAndShare(
        mezmur,
        undefined,
        {
          fontSize: settings.fontSize,
          darkMode: settings.themeMode === 'dark'
        }
      );

      if (!result.success) {
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
    if (!mezmur) return;

    setExportingPDF(true);
    try {
      const result = await PDFService.exportAndShare(
        mezmur,
        undefined,
        {
          fontSize: settings.fontSize,
          darkMode: settings.themeMode === 'dark'
        }
      );

      if (!result.success) {
        Alert.alert('Export Error', result.error || 'Failed to export PDF');
      }
    } catch (error) {
      console.error('PDF export error:', error);
      Alert.alert('Export Error', 'An unexpected error occurred while exporting PDF');
    } finally {
      setExportingPDF(false);
    }
  };

  const handleAudioToggle = () => {
    if (!mezmur?.audio_url) return;

    // Audio playback implementation would go here
    setIsPlaying(!isPlaying);
    console.log(`${isPlaying ? 'Pausing' : 'Playing'} audio:`, mezmur.audio_url);
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);

    if (index >= 0 && index < categoryMezmurs.length) {
      const currentVisibleMezmur = categoryMezmurs[index];
      if (currentVisibleMezmur.id !== activeMezmur?.id) {
        setActiveMezmur(currentVisibleMezmur);
      }
    }
  };

  const handlePageChange = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);

    if (index !== currentIndex && index >= 0 && index < categoryMezmurs.length) {
      const nextMezmur = categoryMezmurs[index];
      // Preserve the 'from' param when navigating
      router.setParams({ id: nextMezmur.id, from });
    }
  };

  const getItemLayout = (_: any, index: number) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });

  const renderMezmurItem = ({ item: currentMezmur }: ListRenderItemInfo<Mezmur>) => {
    return (
      <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
        {/* Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[
            styles.lyricsText,
            {
              color: colors.text,
              fontSize: settings.fontSize,
              lineHeight: settings.fontSize * 1.6
            }
          ]}>
            {currentMezmur.content}
          </Text>

          {/* Mezmur Info */}
          <View style={[styles.infoSection, { borderTopColor: colors.border }]}>
            {currentMezmur.isUserAdded && (
              <>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  Source:
                </Text>
                <Text style={[styles.infoValue, { color: colors.accent }]}>
                  User Added
                </Text>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  if (!mezmur || !activeMezmur || categoryMezmurs.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notFound}>
          <MaterialIcons name="music-off" size={64} color={colors.textSecondary} />
          <Text style={[styles.notFoundText, { color: colors.text }]}>
            Mezmur not found
          </Text>
        </View>
      </View>
    );
  }



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
              {activeMezmur.title}
            </Text>
            {activeMezmur.first_line && (
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                {activeMezmur.first_line}
              </Text>
            )}
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => {
                if (isFavorite(activeMezmur.id)) {
                  removeFromFavorites(activeMezmur.id);
                } else {
                  addToFavorites(activeMezmur.id);
                }
              }}
              style={styles.actionButton}
            >
              <MaterialIcons
                name={isFavorite(activeMezmur.id) ? "favorite" : "favorite-border"}
                size={24}
                color={isFavorite(activeMezmur.id) ? "#F59E0B" : "white"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              style={styles.actionButton}
            >
              <MaterialIcons name="share" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Controls */}
      <View style={[styles.controls, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {/* Audio Controls */}
        {activeMezmur.audio_url && (
          <View style={styles.audioControls}>
            <TouchableOpacity
              onPress={handleAudioToggle}
              style={[styles.audioButton, { backgroundColor: colors.primary }]}
            >
              <MaterialIcons
                name={isPlaying ? "pause" : "play-arrow"}
                size={24}
                color="white"
              />
            </TouchableOpacity>
            <View style={styles.audioInfo}>
              <Text style={[styles.audioText, { color: colors.text }]}>
                {isPlaying ? 'Playing...' : 'Tap to play'}
              </Text>
              {activeMezmur.audio_duration && (
                <Text style={[styles.audioDuration, { color: colors.textSecondary }]}>
                  {Math.floor(activeMezmur.audio_duration / 60)}:{String(activeMezmur.audio_duration % 60).padStart(2, '0')}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Font Controls */}
        <View style={styles.fontControls}>
          <TouchableOpacity
            onPress={() => handleFontSizeChange(false)}
            style={[styles.fontButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            disabled={settings.fontSize <= 12}
          >
            <MaterialIcons name="text-decrease" size={20} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.fontSizeText, { color: colors.text }]}>
            {settings.fontSize}px
          </Text>

          <TouchableOpacity
            onPress={() => handleFontSizeChange(true)}
            style={[styles.fontButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            disabled={settings.fontSize >= 24}
          >
            <MaterialIcons name="text-increase" size={20} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleExportPDF}
            style={[styles.exportButton, { backgroundColor: colors.secondary }]}
            disabled={exportingPDF}
          >
            {exportingPDF ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <MaterialIcons name="picture-as-pdf" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={categoryMezmurs}
        renderItem={renderMezmurItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={currentIndex}
        getItemLayout={getItemLayout}
        onMomentumScrollEnd={handlePageChange}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
        style={styles.flatList}
        scrollEventThrottle={16}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
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
    height: 60,
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
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    justifyContent: 'center',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 4,
  },
  positionIndicator: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 16,
  },
  positionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 12,
    textAlign: 'center',
  },
  controls: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  audioButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  audioInfo: {
    flex: 1,
  },
  audioText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  audioDuration: {
    fontSize: 14,
  },
  fontControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fontButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  fontSizeText: {
    fontSize: 14,
    fontWeight: '500',
    minWidth: 40,
    textAlign: 'center',
  },
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  lyricsText: {
    textAlign: 'center',
    marginBottom: 32,
    backgroundColor: 'rgba(0, 122, 255, 0.06)',
    paddingHorizontal: 20,
    paddingVertical: 28,
    borderRadius: 16,
    letterSpacing: 0.5,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.15)',
    fontFamily: 'Bela_Bereka_6a62aa4ee7',
  },
  infoSection: {
    borderTopWidth: 1,
    paddingTop: 20,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    marginTop: 8,
  },
  infoValue: {
    fontSize: 16,
    marginBottom: 8,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  flatList: {
    flex: 1,
  },
});