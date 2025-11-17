export interface Mezmur {
  id: string;
  title: string;
  description: string;
  content: string; // Full lyrics content
  lyrics: string; // For backward compatibility and search
  language: string;
  category: MezmurCategory;
  first_line: string; // First line for quick preview
  audio_url?: string;
  audio_duration?: number;
  audio_file_size?: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
  isUserAdded?: boolean;
  syncedFromServer?: boolean;
}

export type MezmurCategory = 
  | 'yohanes'           // የዐውደ ዓመት መዝሙራት(ቅዱስ ዮሐንስ)
  | 'meskel'            // የመስቀል መዝሙራት
  | 'arsema'            // የቅድስት አርሴማ መዝሙራት
  | 'medhanialem1'      // የጥቅምት መድኃኔዓለም መዝሙራት
  | 'ledet'             // የልደት መዝሙራት
  | 'ketera'            // የከተራ መዝሙራትን
  | 'temket'            // የጥምቀት መዝሙራት
  | 'medhanialem2'      // የጥር መድኃኔዓለም መዝሙራት
  | 'neseha'            // የንስሐ መዝሙራት
  | 'medhanialem3'      // የመጋቢት መድኃኔዓለም መዝሙራት
  | 'giyorgis'          // የቅዱስ ጊዮርጊስ መዝሙራት
  | 'estenfase'         // የአቡነ እስትንፋሰ ክርስቶስ መዝሙራት
  | 'buhe'              // የደብረ ታቦር መዝሙራት
  | 'kidanemeheret'     // የኪዳነምሕረት መዝሙራት
  | 'mesgana'           // የምሥጋና መዝሙራት
  | 'wereb'             // ሌሎች
  | 'serg';             // የሰርግ መዝሙራት

export interface UserSettings {
  fontSize: number;
  themeMode: 'light' | 'dark' | 'auto';
  autoSync: boolean;
  lastSyncDate?: string;
}

export interface FavoriteItem {
  mezmurId: string;
  addedAt: string;
}

export interface HistoryItem {
  mezmurId: string;
  viewedAt: string;
}

export interface CategoryInfo {
  [x: string]: ImageSourcePropType | undefined;
  id: MezmurCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  imageUrl?: any; // Optional - support for require() local images or string URLs
}