import React, { createContext, ReactNode, useState, useEffect } from 'react';
import { Mezmur, FavoriteItem, HistoryItem, MezmurCategory } from '@/types';
import { StorageService } from '@/services/storageService';
import { SyncService } from '@/services/syncService';

export interface MezmurContextType {
  mezmurs: Mezmur[];
  userMezmurs: Mezmur[];
  favorites: FavoriteItem[];
  history: HistoryItem[];
  loading: boolean;
  syncing: boolean;
  addToFavorites: (mezmurId: string) => void;
  removeFromFavorites: (mezmurId: string) => void;
  addToHistory: (mezmurId: string) => void;
  addUserMezmur: (mezmur: Omit<Mezmur, 'id' | 'createdAt' | 'isUserAdded' | 'syncedFromServer'>) => void;
  deleteUserMezmur: (mezmurId: string) => void;
  syncMezmurs: () => Promise<void>;
  getMezmursByCategory: (category: MezmurCategory) => Mezmur[];
  searchMezmurs: (query: string) => Mezmur[];
  isFavorite: (mezmurId: string) => boolean;
  reorderMezmurs: (category: MezmurCategory, fromIndex: number, toIndex: number) => Promise<void>;
  reorderFavorites: (fromIndex: number, toIndex: number) => Promise<void>;
  reorderUserMezmurs: (fromIndex: number, toIndex: number) => Promise<void>;
}

export const MezmurContext = createContext<MezmurContextType | undefined>(undefined);

export function MezmurProvider({ children }: { children: ReactNode }) {
  const [mezmurs, setMezmurs] = useState<Mezmur[]>([]);
  const [userMezmurs, setUserMezmurs] = useState<Mezmur[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [categoryOrders, setCategoryOrders] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      // Initialize with sample data if needed
      await SyncService.initializeWithSampleData();

      // Load all data
      const [loadedMezmurs, loadedUserMezmurs, loadedFavorites, loadedHistory, loadedOrders] = await Promise.all([
        StorageService.getMezmurs(),
        StorageService.getUserMezmurs(),
        StorageService.getFavorites(),
        StorageService.getHistory(),
        StorageService.getCategoryOrders()
      ]);

      setMezmurs(loadedMezmurs);
      setUserMezmurs(loadedUserMezmurs);

      // Deduplicate favorites to ensure index alignment
      const uniqueFavorites = loadedFavorites.filter((fav, index, self) =>
        index === self.findIndex((t) => t.mezmurId === fav.mezmurId)
      );
      setFavorites(uniqueFavorites);

      setHistory(loadedHistory);
      setCategoryOrders(loadedOrders);

      console.log('🎵 Initialized MezmurContext:', {
        mezmurs: loadedMezmurs.length,
        userMezmurs: loadedUserMezmurs.length,
        favorites: loadedFavorites.length,
        categoryOrders: Object.keys(loadedOrders).length
      });
    } catch (error) {
      console.error('Error initializing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCategoryOrdersWithFallback = async (orders: { [key: string]: string[] }) => {
    const previousOrders = categoryOrders;
    try {
      // Optimistically update state
      setCategoryOrders(orders);

      // Save to storage
      await StorageService.saveCategoryOrders(orders);
      console.log('✅ Category orders saved successfully');
    } catch (error) {
      console.error('❌ Failed to save category orders:', error);

      // Revert state on failure
      setCategoryOrders(previousOrders);
      throw error;
    }
  };

  const addToFavorites = async (mezmurId: string) => {
    if (favorites.some(f => f.mezmurId === mezmurId)) {
      return;
    }
    const newFavorite: FavoriteItem = {
      mezmurId,
      addedAt: new Date().toISOString()
    };
    // Prepend to list (Newest First)
    const updatedFavorites = [newFavorite, ...favorites];
    setFavorites(updatedFavorites);
    await StorageService.saveFavorites(updatedFavorites);
  };

  const removeFromFavorites = async (mezmurId: string) => {
    const updatedFavorites = favorites.filter(f => f.mezmurId !== mezmurId);
    setFavorites(updatedFavorites);
    await StorageService.saveFavorites(updatedFavorites);
  };

  const addToHistory = async (mezmurId: string) => {
    // Remove existing entry if present
    const filteredHistory = history.filter(h => h.mezmurId !== mezmurId);
    const newHistory: HistoryItem = {
      mezmurId,
      viewedAt: new Date().toISOString()
    };
    // Add to beginning and limit to 50 items
    const updatedHistory = [newHistory, ...filteredHistory].slice(0, 50);
    setHistory(updatedHistory);
    await StorageService.saveHistory(updatedHistory);
  };

  const addUserMezmur = async (mezmurData: Omit<Mezmur, 'id' | 'createdAt' | 'isUserAdded' | 'syncedFromServer'>) => {
    const newMezmur: Mezmur = {
      ...mezmurData,
      id: `user_${Date.now()}`,
      created_at: new Date().toISOString(),
      isUserAdded: true,
      syncedFromServer: false
    };
    const updatedUserMezmurs = [...userMezmurs, newMezmur];
    setUserMezmurs(updatedUserMezmurs);
    await StorageService.saveUserMezmurs(updatedUserMezmurs);
  };

  const deleteUserMezmur = async (mezmurId: string) => {
    const updatedUserMezmurs = userMezmurs.filter(m => m.id !== mezmurId);
    setUserMezmurs(updatedUserMezmurs);
    await StorageService.saveUserMezmurs(updatedUserMezmurs);
  };

  const syncMezmurs = async () => {
    setSyncing(true);
    try {
      const result = await SyncService.syncMezmurs();
      if (result.success) {
        const updatedMezmurs = await StorageService.getMezmurs();
        setMezmurs(updatedMezmurs);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  const getMezmursByCategory = (category: MezmurCategory): Mezmur[] => {
    const allCategoryMezmurs = [...mezmurs, ...userMezmurs].filter(m => m.category === category);

    // Check if we have a custom order for this category
    const customOrder = categoryOrders[category];
    if (customOrder && customOrder.length > 0) {
      // Sort by custom order, with any new items at the end
      const orderedMezmurs: Mezmur[] = [];
      const remainingMezmurs = [...allCategoryMezmurs];

      // Add mezmurs in custom order
      customOrder.forEach(id => {
        const index = remainingMezmurs.findIndex(m => m.id === id);
        if (index !== -1) {
          orderedMezmurs.push(remainingMezmurs[index]);
          remainingMezmurs.splice(index, 1);
        }
      });

      // Add any remaining mezmurs (new ones not in custom order)
      orderedMezmurs.push(...remainingMezmurs);

      return orderedMezmurs;
    }

    return allCategoryMezmurs;
  };

  const searchMezmurs = (query: string): Mezmur[] => {
    if (!query.trim()) return [];
    const lowercaseQuery = query.toLowerCase();
    return [...mezmurs, ...userMezmurs].filter(m =>
      m.title.toLowerCase().includes(lowercaseQuery) ||
      m.description.toLowerCase().includes(lowercaseQuery) ||
      m.lyrics.toLowerCase().includes(lowercaseQuery)
    );
  };

  const isFavorite = (mezmurId: string): boolean => {
    return favorites.some(f => f.mezmurId === mezmurId);
  };

  const reorderMezmurs = async (category: MezmurCategory, fromIndex: number, toIndex: number) => {
    const categoryMezmurs = getMezmursByCategory(category);
    if (fromIndex < 0 || fromIndex >= categoryMezmurs.length ||
      toIndex < 0 || toIndex >= categoryMezmurs.length ||
      fromIndex === toIndex) {
      return;
    }

    console.log(`🔄 Reordering ${category}: ${fromIndex} → ${toIndex}`);

    // Create new order
    const reorderedMezmurs = [...categoryMezmurs];
    const [movedItem] = reorderedMezmurs.splice(fromIndex, 1);
    reorderedMezmurs.splice(toIndex, 0, movedItem);

    // Update category order
    const newOrder = reorderedMezmurs.map(m => m.id);
    const updatedOrders = { ...categoryOrders, [category]: newOrder };

    try {
      await saveCategoryOrdersWithFallback(updatedOrders);
    } catch (error) {
      console.error('Failed to save reorder:', error);
    }
  };

  const reorderFavorites = async (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= favorites.length ||
      toIndex < 0 || toIndex >= favorites.length ||
      fromIndex === toIndex) {
      return;
    }

    const reorderedFavorites = [...favorites];
    const [movedItem] = reorderedFavorites.splice(fromIndex, 1);
    reorderedFavorites.splice(toIndex, 0, movedItem);

    setFavorites(reorderedFavorites);
    await StorageService.saveFavorites(reorderedFavorites);
  };

  const reorderUserMezmurs = async (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= userMezmurs.length ||
      toIndex < 0 || toIndex >= userMezmurs.length ||
      fromIndex === toIndex) {
      return;
    }

    const reorderedUserMezmurs = [...userMezmurs];
    const [movedItem] = reorderedUserMezmurs.splice(fromIndex, 1);
    reorderedUserMezmurs.splice(toIndex, 0, movedItem);

    setUserMezmurs(reorderedUserMezmurs);
    await StorageService.saveUserMezmurs(reorderedUserMezmurs);
  };

  return (
    <MezmurContext.Provider value={{
      mezmurs,
      userMezmurs,
      favorites,
      history,
      loading,
      syncing,
      addToFavorites,
      removeFromFavorites,
      addToHistory,
      addUserMezmur,
      deleteUserMezmur,
      syncMezmurs,
      getMezmursByCategory,
      searchMezmurs,
      isFavorite,
      reorderMezmurs,
      reorderFavorites,
      reorderUserMezmurs
    }}>
      {children}
    </MezmurContext.Provider>
  );
}