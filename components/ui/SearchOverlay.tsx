import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Keyboard
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useMezmur } from '@/hooks/useMezmur';
import { Mezmur } from '@/types';
import MezmurListItem from './MezmurListItem';

interface SearchOverlayProps {
  visible: boolean;
  onClose: () => void;
  onMezmurPress: (mezmur: Mezmur) => void;
}

export default function SearchOverlay({ visible, onClose, onMezmurPress }: SearchOverlayProps) {
  const { colors } = useTheme();
  const { searchMezmurs } = useMezmur();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Mezmur[]>([]);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchMezmurs(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query, searchMezmurs]);

  const handleClose = () => {
    setQuery('');
    setResults([]);
    Keyboard.dismiss();
    onClose();
  };

  const handleMezmurPress = (mezmur: Mezmur) => {
    handleClose();
    onMezmurPress(mezmur);
  };

  const renderMezmur = ({ item, index }: { item: Mezmur; index: number }) => (
    <MezmurListItem
      mezmur={item}
      number={index + 1}
      onPress={() => handleMezmurPress(item)}
    />
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        {/* Search Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MaterialIcons name="search" size={24} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              value={query}
              onChangeText={setQuery}
              placeholder="Search mezmurs..."
              placeholderTextColor={colors.textSecondary}
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <MaterialIcons name="clear" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: colors.primary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Search Results */}
        {query.length > 0 ? (
          <FlatList
            data={results}
            renderItem={renderMezmur}
            keyExtractor={(item) => item.id}
            style={styles.results}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <MaterialIcons name="search-off" size={48} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No mezmurs found for "{query}"
                </Text>
              </View>
            }
          />
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="search" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Search mezmurs by title, description, or lyrics
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 8,
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  closeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  results: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});