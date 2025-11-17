import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useMezmur } from '@/hooks/useMezmur';
import { Mezmur } from '@/types';
import { PDFService } from '@/services/pdfService';

export default function MezmurDetailPage() {
  const { colors, settings, updateSettings } = useTheme();
  const { mezmurs, userMezmurs, addToFavorites, removeFromFavorites, addToHistory, isFavorite, getMezmursByCategory } = useMezmur();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [mezmur, setMezmur] = useState<Mezmur | null>(null);
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
        addToHistory(id);
      } else {
        setMezmur(null);
      }
    }
  }, [id, mezmurs, userMezmurs]);

  // Update category list and current index when mezmur or context changes
  useEffect(() => {
    if (mezmur) {
      const categoryList = getMezmursByCategory(mezmur.category);
      setCategoryMezmurs(categoryList);
      
      const index = categoryList.findIndex(m => m.id === mezmur.id);
      setCurrentIndex(index);
    }
  }, [mezmur, mezmurs, userMezmurs, getMezmursByCategory]);

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

  const handleShare = () => {
    if (Platform.OS === 'web') {
      Alert.alert('Share', `Sharing: ${mezmur?.title}`);
    } else {
      // Native share implementation
      console.log('Sharing mezmur:', mezmur?.title);
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

  const handlePreviousMezmur = () => {
    if (currentIndex > 0 && categoryMezmurs.length > 0) {
      const previousMezmur = categoryMezmurs[currentIndex - 1];
      router.replace({
        pathname: '/mezmur/[id]',
        params: { id: previousMezmur.id }
      });
    }
  };

  const handleNextMezmur = () => {
    if (currentIndex < categoryMezmurs.length - 1 && categoryMezmurs.length > 0) {
      const nextMezmur = categoryMezmurs[currentIndex + 1];
      router.replace({
        pathname: '/mezmur/[id]',
        params: { id: nextMezmur.id }
      });
    }
  };

  if (!mezmur) {
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

  const showNavigation = categoryMezmurs.length > 1 && currentIndex >= 0;
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < categoryMezmurs.length - 1;

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
              {mezmur.title}
            </Text>
            {mezmur.first_line && (
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                {mezmur.first_line}
              </Text>
            )}
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity 
              onPress={handleFavoriteToggle}
              style={styles.actionButton}
            >
              <MaterialIcons 
                name={isFavorite(mezmur.id) ? "favorite" : "favorite-border"} 
                size={24} 
                color={isFavorite(mezmur.id) ? "#F59E0B" : "white"} 
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

      {/* Navigation Bar */}
      {showNavigation && (
        <View style={[styles.navigationBar, { 
          backgroundColor: colors.surface, 
          borderBottomColor: colors.border 
        }]}>
          <TouchableOpacity 
            onPress={handlePreviousMezmur}
            style={[
              styles.navButton, 
              { 
                backgroundColor: canGoPrevious ? colors.primary : colors.border,
                opacity: canGoPrevious ? 1 : 0.5
              }
            ]}
            disabled={!canGoPrevious}
          >
            <MaterialIcons 
              name="chevron-left" 
              size={20} 
              color={canGoPrevious ? "white" : colors.textSecondary} 
            />
            <Text style={[
              styles.navButtonText, 
              { color: canGoPrevious ? "white" : colors.textSecondary }
            ]}>
              Previous
            </Text>
          </TouchableOpacity>

          <View style={styles.positionIndicator}>
            <Text style={[styles.positionText, { color: colors.text }]}>
              {currentIndex + 1} of {categoryMezmurs.length}
            </Text>
            <Text style={[styles.categoryText, { color: colors.textSecondary }]} numberOfLines={1}>
              in {mezmur.category}
            </Text>
          </View>

          <TouchableOpacity 
            onPress={handleNextMezmur}
            style={[
              styles.navButton, 
              { 
                backgroundColor: canGoNext ? colors.primary : colors.border,
                opacity: canGoNext ? 1 : 0.5
              }
            ]}
            disabled={!canGoNext}
          >
            <Text style={[
              styles.navButtonText, 
              { color: canGoNext ? "white" : colors.textSecondary }
            ]}>
              Next
            </Text>
            <MaterialIcons 
              name="chevron-right" 
              size={20} 
              color={canGoNext ? "white" : colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Controls */}
      <View style={[styles.controls, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {/* Audio Controls */}
        {mezmur.audio_url && (
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
              {mezmur.audio_duration && (
                <Text style={[styles.audioDuration, { color: colors.textSecondary }]}>
                  {Math.floor(mezmur.audio_duration / 60)}:{String(mezmur.audio_duration % 60).padStart(2, '0')}
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
          {mezmur.content}
        </Text>
        
        {/* Mezmur Info */}
        <View style={[styles.infoSection, { borderTopColor: colors.border }]}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            Category:
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {mezmur.category}
          </Text>
          
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            Language:
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {mezmur.language === 'am' ? 'ግእዝ/አማርኛ' : mezmur.language}
          </Text>
          
          {mezmur.isUserAdded && (
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
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace'
    }),
    textAlign: 'left',
    marginBottom: 32,
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
});