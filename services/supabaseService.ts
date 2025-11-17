import { createClient } from '@supabase/supabase-js';
import { Mezmur } from '@/types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseService {
  static async fetchMezmurs(): Promise<{ success: boolean; mezmurs: Mezmur[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('mezmurs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        return { success: false, mezmurs: [], error: error.message };
      }

      // Transform database response to match our Mezmur interface
      const mezmurs: Mezmur[] = (data || []).map((item: { mezmur_id: any; title: any; first_line: any; content: any; language: any; category: any; audio_url: any; audio_duration: any; audio_file_size: any; created_at: any; updated_at: any; user_id: any; }) => ({
        id: item.mezmur_id,
        title: item.title,
        description: item.first_line || '', // Use first_line as description
        content: item.content,
        lyrics: item.content, // For backward compatibility and search
        language: item.language || 'am',
        category: item.category,
        first_line: item.first_line || '',
        audio_url: item.audio_url,
        audio_duration: item.audio_duration,
        audio_file_size: item.audio_file_size,
        created_at: item.created_at,
        updated_at: item.updated_at,
        user_id: item.user_id,
        isUserAdded: false,
        syncedFromServer: true
      }));

      return { success: true, mezmurs };
    } catch (error) {
      console.error('Network error fetching mezmurs:', error);
      return { 
        success: false, 
        mezmurs: [], 
        error: 'Network error. Please check your connection.' 
      };
    }
  }

  static async fetchMezmursByCategory(category: string): Promise<{ success: boolean; mezmurs: Mezmur[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('mezmurs')
        .select('*')
        .eq('category', category)
        .order('title', { ascending: true });

      if (error) {
        console.error('Supabase category fetch error:', error);
        return { success: false, mezmurs: [], error: error.message };
      }

      const mezmurs: Mezmur[] = (data || []).map((item: { mezmur_id: any; title: any; first_line: any; content: any; language: any; category: any; audio_url: any; audio_duration: any; audio_file_size: any; created_at: any; updated_at: any; user_id: any; }) => ({
        id: item.mezmur_id,
        title: item.title,
        description: item.first_line || '',
        content: item.content,
        lyrics: item.content, // For backward compatibility and search
        language: item.language || 'am',
        category: item.category,
        first_line: item.first_line || '',
        audio_url: item.audio_url,
        audio_duration: item.audio_duration,
        audio_file_size: item.audio_file_size,
        created_at: item.created_at,
        updated_at: item.updated_at,
        user_id: item.user_id,
        isUserAdded: false,
        syncedFromServer: true
      }));

      return { success: true, mezmurs };
    } catch (error) {
      console.error('Network error fetching category mezmurs:', error);
      return { 
        success: false, 
        mezmurs: [], 
        error: 'Network error. Please check your connection.' 
      };
    }
  }

  static async searchMezmurs(query: string): Promise<{ success: boolean; mezmurs: Mezmur[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('mezmurs')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,first_line.ilike.%${query}%`)
        .order('title', { ascending: true });

      if (error) {
        console.error('Supabase search error:', error);
        return { success: false, mezmurs: [], error: error.message };
      }

      const mezmurs: Mezmur[] = (data || []).map((item: { mezmur_id: any; title: any; first_line: any; content: any; language: any; category: any; audio_url: any; audio_duration: any; audio_file_size: any; created_at: any; updated_at: any; user_id: any; }) => ({
        id: item.mezmur_id,
        title: item.title,
        description: item.first_line || '',
        content: item.content,
        lyrics: item.content, // For backward compatibility and search
        language: item.language || 'am',
        category: item.category,
        first_line: item.first_line || '',
        audio_url: item.audio_url,
        audio_duration: item.audio_duration,
        audio_file_size: item.audio_file_size,
        created_at: item.created_at,
        updated_at: item.updated_at,
        user_id: item.user_id,
        isUserAdded: false,
        syncedFromServer: true
      }));

      return { success: true, mezmurs };
    } catch (error) {
      console.error('Network error searching mezmurs:', error);
      return { 
        success: false, 
        mezmurs: [], 
        error: 'Network error. Please check your connection.' 
      };
    }
  }
}