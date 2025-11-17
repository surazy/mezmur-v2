import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useMezmur } from '@/hooks/useMezmur';
import MezmurListItem from '@/components/ui/MezmurListItem';
import { Mezmur } from '@/types';

export default function MyMezmurasPage() {
  const { colors } = useTheme();
  const { userMezmurs, deleteUserMezmur, reorderUserMezmurs } = useMezmur();
  const insets = useSafeAreaInsets();
  const [reorderMode, setReorderMode] = useState(false);

  const showWebAlert = (title: string, message: string, buttons?: any[]) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`${title}\n\n${message}`);
      if (confirmed && buttons?.[1]?.onPress) {
        buttons[1].onPress();
      }
    } else {
      Alert.alert(title, message, buttons);
    }
  };

  const handleMezmurPress = (mezmur: Mezmur) => {
    if (reorderMode) return;
    
    router.push({
      pathname: '/mezmur/[id]',
      params: { id: mezmur.id }
    });
  };

  const handleDeleteMezmur = (mezmur: Mezmur) => {
    showWebAlert(
      'Delete Mezmur',
      `Are you sure you want to delete "${mezmur.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteUserMezmur(mezmur.id)
        }
      ]
    );
  };

  const toggleReorderMode = () => {
    setReorderMode(!reorderMode);
  };

  const handleMoveUp = async (index: number) => {
    if (index > 0) {
      await reorderUserMezmurs(index, index - 1);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index < userMezmurs.length - 1) {
      await reorderUserMezmurs(index, index + 1);
    }
  };

  const renderMezmur = ({ item, index }: { item: Mezmur; index: number }) => (
    <View style={styles.mezmurContainer}>
      <MezmurListItem
        mezmur={item}
        number={index + 1}
        onPress={() => handleMezmurPress(item)}
        showReorderControls={reorderMode}
        onMoveUp={() => handleMoveUp(index)}
        onMoveDown={() => handleMoveDown(index)}
        canMoveUp={index > 0}
        canMoveDown={index < userMezmurs.length - 1}
      />
      {!reorderMode && (
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: colors.notification }]}
          onPress={() => handleDeleteMezmur(item)}
        >
          <MaterialIcons name="delete" size={20} color="white" />
        </TouchableOpacity>
      )}
    </View>
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
            <Text style={styles.headerTitle}>My Mezmurs</Text>
            <Text style={styles.headerSubtitle}>
              {userMezmurs.length} personal mezmurs
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity 
              onPress={() => router.push('/add-mezmur')}
              style={styles.actionButton}
            >
              <MaterialIcons name="add" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={toggleReorderMode}
              style={[styles.actionButton, reorderMode && { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            >
              <MaterialIcons name="swap-vert" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Mode Indicator */}
        {reorderMode && (
          <View style={styles.modeBar}>
            <Text style={styles.modeText}>
              Reorder Mode - Use arrows to rearrange your mezmurs
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <FlatList
        data={userMezmurs}
        renderItem={renderMezmur}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="music-note" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No personal mezmurs yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Create your first mezmur using the "Add New Mezmur" button
            </Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/add-mezmur')}
            >
              <MaterialIcons name="add" size={24} color="white" />
              <Text style={styles.addButtonText}>Add New Mezmur</Text>
            </TouchableOpacity>
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
    marginLeft: 16,
    gap: 8,
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
  mezmurContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 12,
    borderRadius: 20,
    marginRight: 16,
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
    marginBottom: 32,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});