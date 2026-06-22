import { CategoryInfo, MezmurCategory } from '@/types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'yohanes',
    name: 'የዐውደ ዓመት መዝሙራት(ቅዱስ ዮሐንስ)',
    description: 'Annual cycle songs of St. John',
    icon: 'calendar-today',
    image: require('@/assets/images/categories/yohaans.png'),
    color: '#00000'
  },
  {
    id: 'meskel',
    name: 'የመስቀል መዝሙራት',
    description: 'Songs of the Holy Cross',
    icon: 'add',
    image: require('@/assets/images/categories/meskeel.png'),
    color: '#00000'
  },
  {
    id: 'arsema',
    name: 'የቅድስት አርሴማ መዝሙራት',
    description: 'Songs of Saint Arsema',
    icon: 'person',
    image: require('@/assets/images/categories/ars.png'),
    color: '#EC4899'
  },
  {
    id: 'medhanialem1',
    name: 'የጥቅምት መድኃኔዓለም መዝሙራት',
    description: 'Tekemt Savior of the World songs',
    icon: 'public',
    image: require('@/assets/images/categories/medeye.png'),
    color: '#F59E0B'
  },
  {
    id: 'ledet',
    name: 'የልደት መዝሙራት',
    description: 'Christmas Nativity songs',
    icon: 'star',
    image: require('@/assets/images/categories/genaa.png'),
    color: '#10B981'
  },
  {
    id: 'ketera',
    name: 'የከተራ መዝሙራትን',
    description: 'Ketera ceremonial songs',
    icon: 'music-note',
    image: require('@/assets/images/categories/keteraa.png'),
    color: '#6366F1'
  },
  {
    id: 'temket',
    name: 'የጥምቀት መዝሙራት',
    description: 'Epiphany baptism songs',
    icon: 'water-drop',
    image: require('@/assets/images/categories/timkeet.png'),
    color: '#06B6D4'
  },
  {
    id: 'medhanialem2',
    name: 'የጥር መድኃኔዓለም መዝሙራት',
    description: 'Ter Savior of the World songs',
    icon: 'brightness-high',
    image: require('@/assets/images/categories/medeye.png'),
    color: '#EF4444'
  },
  {
    id: 'neseha',
    name: 'የንስሐ መዝሙራት',
    description: 'Songs of repentance',
    icon: 'favorite',
    image: require('@/assets/images/categories/begen.png'),
    color: '#7C3AED'
  },
  {
    id: 'medhanialem3',
    name: 'የመጋቢት መድኃኔዓለም መዝሙራት',
    description: 'Megabit Savior of the World songs',
    icon: 'wb-sunny',
    image: require('@/assets/images/categories/medh.png'),
    color: '#F97316'
  },
  {
    id: 'giyorgis',
    name: 'የቅዱስ ጊዮርጊስ መዝሙራት',
    description: 'Songs of Saint George',
    icon: 'shield',
    image: require('@/assets/images/categories/giyor.png'),
    color: '#059669'
  },
  {
    id: 'estenfase',
    name: 'የአቡነ እስትንፋሰ ክርስቶስ መዝሙራት',
    description: 'Songs of Abune Estinfase Kristos',
    icon: 'air',
    image: require('@/assets/images/categories/esten.png'),
    color: '#0891B2'
  },
  {
    id: 'buhe',
    name: 'የደብረ ታቦር መዝሙራት',
    description: 'Songs of Mount Tabor',
    icon: 'landscape',
    image: require('@/assets/images/categories/buuh.png'),
    color: '#65A30D'
  },
  {
    id: 'kidanemeheret',
    name: 'የኪዳነምሕረት መዝሙራት',
    description: 'Songs of Covenant of Mercy',
    icon: 'handshake',
    image: require('@/assets/images/categories/kidey.png'),
    color: '#DC2626'
  },
  {
    id: 'mesgana',
    name: 'የምሥጋና መዝሙራት',
    description: 'Thanksgiving songs',
    icon: 'celebration',
    image: require('@/assets/images/categories/mesgana.png'),
    color: '#CA8A04'
  },
  {
    id: 'serg',
    name: 'የሰርግ መዝሙራት',
    description: 'Wedding songs',
    icon: 'favorite',
    image: require('@/assets/images/categories/wedd.png'),
    color: '#F472B6'
  },
  // {
  //   id: 'wereb',
  //   name: 'ሌሎች',
  //   description: 'Other spiritual songs',
  //   icon: 'more-horiz',
  //   image: require('@/assets/images/categories/meskel.jpg'),
  //   color: '#6B7280'
  // }
  
];

export const DEFAULT_FONT_SIZE = 16;
export const MIN_FONT_SIZE = 12;
export const MAX_FONT_SIZE = 24;