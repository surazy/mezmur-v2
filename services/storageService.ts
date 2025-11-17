import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mezmur, UserSettings, FavoriteItem, HistoryItem } from '@/types';

const KEYS = {
  MEZMURS: 'mezmurs',
  FAVORITES: 'favorites',
  HISTORY: 'history',
  SETTINGS: 'settings',
  USER_MEZMURS: 'userMezmurs',
  LAST_SYNC: 'lastSync',
  CATEGORY_ORDERS: 'categoryOrders'
};

export class StorageService {
  static async getMezmurs(): Promise<Mezmur[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.MEZMURS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting mezmurs:', error);
      return [];
    }
  }

  static async saveMezmurs(mezmurs: Mezmur[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.MEZMURS, JSON.stringify(mezmurs));
    } catch (error) {
      console.error('Error saving mezmurs:', error);
    }
  }

  static async getUserMezmurs(): Promise<Mezmur[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_MEZMURS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting user mezmurs:', error);
      return [];
    }
  }

  static async saveUserMezmurs(mezmurs: Mezmur[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_MEZMURS, JSON.stringify(mezmurs));
    } catch (error) {
      console.error('Error saving user mezmurs:', error);
    }
  }

  static async getFavorites(): Promise<FavoriteItem[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  static async saveFavorites(favorites: FavoriteItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  static async getHistory(): Promise<HistoryItem[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }

  static async saveHistory(history: HistoryItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }

  static async getSettings(): Promise<UserSettings> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SETTINGS);
      return data ? JSON.parse(data) : {
        fontSize: 16,
        themeMode: 'auto',
        autoSync: true
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        fontSize: 16,
        themeMode: 'auto',
        autoSync: true
      };
    }
  }

  static async saveSettings(settings: UserSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  static async getLastSyncDate(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.LAST_SYNC);
    } catch (error) {
      console.error('Error getting last sync date:', error);
      return null;
    }
  }

  static async saveLastSyncDate(date: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.LAST_SYNC, date);
    } catch (error) {
      console.error('Error saving last sync date:', error);
    }
  }

  static async getCategoryOrders(): Promise<{ [key: string]: string[] }> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CATEGORY_ORDERS);
      const orders = data ? JSON.parse(data) : {};
      console.log('📱 Loaded category orders:', Object.keys(orders).length, 'categories');
      return orders;
    } catch (error) {
      console.error('Error getting category orders:', error);
      return {};
    }
  }

  static async saveCategoryOrders(orders: { [key: string]: string[] }): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.CATEGORY_ORDERS, JSON.stringify(orders));
      console.log('💾 Saved category orders for', Object.keys(orders).length, 'categories');
    } catch (error) {
      console.error('Error saving category orders:', error);
      throw error; // Re-throw to allow caller to handle
    }
  }

  static async clearCategoryOrders(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.CATEGORY_ORDERS);
      console.log('🗑️ Cleared all category orders');
    } catch (error) {
      console.error('Error clearing category orders:', error);
    }
  }

  // Debug method to see all stored data
  static async getStorageDebugInfo(): Promise<{ [key: string]: any }> {
    try {
      const debugInfo: { [key: string]: any } = {};
      
      for (const [name, key] of Object.entries(KEYS)) {
        const data = await AsyncStorage.getItem(key);
        debugInfo[name] = data ? JSON.parse(data) : null;
      }
      
      return debugInfo;
    } catch (error) {
      console.error('Error getting debug info:', error);
      return {};
    }
  }
}