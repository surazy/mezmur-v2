import { Mezmur } from '@/types';
import { StorageService } from './storageService';
import { SupabaseService } from './supabaseService';

export class SyncService {
  static async syncMezmurs(): Promise<{ success: boolean; newCount: number; error?: string }> {
    try {
      // Fetch mezmurs from Supabase
      const result = await SupabaseService.fetchMezmurs();
      
      if (!result.success) {
        return { success: false, newCount: 0, error: result.error };
      }

      // Get existing local mezmurs
      const existingMezmurs = await StorageService.getMezmurs();
      const existingIds = new Set(existingMezmurs.map(m => m.id));
      
      // Filter new mezmurs
      const newMezmurs = result.mezmurs.filter(m => !existingIds.has(m.id));
      
      if (newMezmurs.length > 0) {
        // Merge with existing and save
        const updatedMezmurs = [...existingMezmurs, ...newMezmurs];
        await StorageService.saveMezmurs(updatedMezmurs);
        await StorageService.saveLastSyncDate(new Date().toISOString());
      }

      return { success: true, newCount: newMezmurs.length };
    } catch (error) {
      console.error('Sync error:', error);
      return { 
        success: false, 
        newCount: 0, 
        error: 'Sync failed. Please try again.' 
      };
    }
  }

  static async initializeWithSampleData(): Promise<void> {
    const existingMezmurs = await StorageService.getMezmurs();
    if (existingMezmurs.length === 0) {
      // Try to sync from Supabase first
      const syncResult = await this.syncMezmurs();
      
      // If sync fails, fallback to sample data
      if (!syncResult.success) {
        const sampleMezmurs: Mezmur[] = [
          {
            id: 'sample_yohanes_1',
            title: 'ቅዱስ ዮሐንስ መዝሙር',
            description: 'Sample mezmur for St. John category',
            content: `ቅዱስ ዮሐንስ አንቀጸ ብርሃን፤
የክርስቶስ ወዳጅ እና ምስክር፤
በሰማያት መንግሥት ዘለዓለማዊ ክብር፤
ለኛም በምድር እግዚአብሔርን ያስታውቅ።

ወንጌል አዘጋጅ እና የዐውደ ዓመት መዝሙር፤
በኃይለ መንፈስ ቅዱስ የተሞላ ሰው፤
የተቀደሰ ልብ እና የተነሳሽ ልሳን፤
ለእግዚአብሔር ውዳሴ እና ምስጋና።`,
            lyrics: `ቅዱስ ዮሐንስ አንቀጸ ብርሃን፤ የክርስቶስ ወዳጅ እና ምስክር፤ በሰማያት መንግሥት ዘለዓለማዊ ክብር፤ ለኛም በምድር እግዚአብሔርን ያስታውቅ።`,
            language: 'am',
            category: 'yohanes',
            first_line: 'ቅዱስ ዮሐንስ አንቀጸ ብርሃን፤ የክርስቶስ ወዳጅ እና ምስክር',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            isUserAdded: false,
            syncedFromServer: false
          },
          {
            id: 'sample_meskel_1',
            title: 'መስቀል ዝማሬ',
            description: 'Sample mezmur for Holy Cross',
            content: `መስቀል የመዳን ምልክት፤
የክርስቶስ ፍቅር ሰምበድ፤
በመስቀል ሞት ሲሞት፤
ለኛ ሕይወት አመጣ።

ክብር ለመስቀል ክብር ለመስቀል፤
የሰማያት እና የምድር አንጋይ፤
በመስቀል ኃይል የሰይጣን ግዛት፤
ተፈራርሶ እና ወደመ።`,
            lyrics: `መስቀል የመዳን ምልክት፤ የክርስቶስ ፍቅር ሰምበድ፤ በመስቀል ሞት ሲሞት፤ ለኛ ሕይወት አመጣ።`,
            language: 'am',
            category: 'meskel',
            first_line: 'መስቀል የመዳን ምልክት፤ የክርስቶስ ፍቅር ሰምበድ',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            isUserAdded: false,
            syncedFromServer: false
          },
          {
            id: 'sample_ledet_1',
            title: 'የልደት ዝማሬ',
            description: 'Christmas nativity song',
            content: `ዛሬ ለኛ ተወለደ መድኃኒታችን፤
በቤተልሔም ከተማ የዳዊት ልጅ፤
መላእክት በሰማይ ሃሌ ሉያ ይሉ፤
ለምድርም ሰላም እና ለሰው ተስፋ።

ዘልዓለማዊው ቃል ሥጋ ሆነ፤
በድንግል ማርያም ማሕፀን ውስጥ፤
እግዚአብሔር ሰው ሆኖ መጣ፤
ለማዳን እና ለመቤዝ ዓለም።`,
            lyrics: `ዛሬ ለኛ ተወለደ መድኃኒታችን፤ በቤተልሔም ከተማ የዳዊት ልጅ፤ መላእክት በሰማይ ሃሌ ሉያ ይሉ፤ ለምድርም ሰላም እና ለሰው ተስፋ።`,
            language: 'am',
            category: 'ledet',
            first_line: 'ዛሬ ለኛ ተወለደ መድኃኒታችን፤ በቤተልሔም ከተማ የዳዊት ልጅ',
            audio_url: 'https://example.com/sample-audio.mp3',
            audio_duration: 180,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            isUserAdded: false,
            syncedFromServer: false
          }
        ];

        await StorageService.saveMezmurs(sampleMezmurs);
      }
    }
  }
}