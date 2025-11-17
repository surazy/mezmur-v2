import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  Modal,
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useMezmur } from '@/hooks/useMezmur';
import { LinearGradient } from 'expo-linear-gradient';

interface ManageSectionProps {
  title: string;
  icon: string;
  count?: number;
  onPress: () => void;
  color?: string;
}

function ManageSection({ title, icon, count, onPress, color }: ManageSectionProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.sectionIcon, { backgroundColor: `${color || colors.primary}20` }]}>
        <MaterialIcons name={icon as any} size={24} color={color || colors.primary} />
      </View>
      <View style={styles.sectionContent}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        {count !== undefined && (
          <Text style={[styles.sectionCount, { color: colors.textSecondary }]}>
            {count} items
          </Text>
        )}
      </View>
      <MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

export default function ManagePage() {
  const { colors, settings, updateSettings, toggleTheme } = useTheme();
  const { favorites, userMezmurs } = useMezmur();
  const insets = useSafeAreaInsets();
  const [aboutVisible, setAboutVisible] = useState(false);

  const handleThemePress = () => toggleTheme();
  const handleFavoritesPress = () => router.push('/favorites');
  const handleUserMezmursPress = () => router.push('/my-mezmurs');

  const handleSocialMediaPress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  const handleAboutPress = () => setAboutVisible(true);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: colors.primary }]}>
        <Text
          style={[
            styles.headerTitle,
            { color: colors.background === '#000000' ? '#000' : 'white' },
          ]}
        >
          Manage
        </Text>
        <Text
          style={[
            styles.headerSubtitle,
            {
              color:
                colors.background === '#000000'
                  ? 'rgba(0,0,0,0.8)'
                  : 'rgba(255,255,255,0.8)',
            },
          ]}
        >
          Settings & Content
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* MY CONTENT */}
        <View style={styles.group}>
          <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>MY CONTENT</Text>
          <ManageSection
            title="Favorites"
            icon="favorite"
            count={favorites.length}
            onPress={handleFavoritesPress}
            color="#FFD700"
          />
          <ManageSection
            title="My Mezmurs"
            icon="person"
            count={userMezmurs.length}
            onPress={handleUserMezmursPress}
            color="#FFD700"
          />
        </View>

        {/* SETTINGS */}
        <View style={styles.group}>
          <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>SETTINGS</Text>
          <ManageSection
            title={`Theme: ${
              settings.themeMode === 'auto'
                ? 'Auto'
                : settings.themeMode === 'dark'
                ? 'Dark'
                : 'Light'
            }`}
            icon="palette"
            onPress={handleThemePress}
            color="#FFD700"
          />
        </View>

        {/* SOCIAL */}
        <View style={styles.group}>
          <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>CONNECT WITH US</Text>
          <View
            style={[
              styles.socialMediaContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() =>
                handleSocialMediaPress('https://youtube.com/@felegebirhansundayschool27')
              }
            >
              <FontAwesome name="youtube-play" size={32} color="#FF0000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() => handleSocialMediaPress('https://tiktok.com/@felege_birhan27')}
            >
              <MaterialIcons name="tiktok" size={32} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() => handleSocialMediaPress('https://instagram.com/surazy_16')}
            >
              <FontAwesome name="instagram" size={32} color="#E4405F" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() => handleSocialMediaPress('https://t.me/felegebirhan27')}
            >
              <FontAwesome name="telegram" size={32} color="#0088cc" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ABOUT */}
        <View style={styles.group}>
          <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>INFORMATION</Text>
          <ManageSection title="About" icon="info" onPress={handleAboutPress} color="#FFD700" />
        </View>
      </ScrollView>

      {/* Custom About Modal */}
      {/* Custom About Modal */}
<Modal visible={aboutVisible} transparent animationType="fade">
  <View style={styles.modalBackground}>
    <LinearGradient colors={['#FFD700', '#FFB300']} style={styles.modalContainer}>
      <Text style={styles.modalTitle}>ፈለገ መዝሙራት</Text>
      <Text style={styles.modalVersion}>ስሪት 1.0.0</Text>

      <Text style={styles.modalDescription}>
        ፈለገ መዝሙራት የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን መዝሙሮችን፣ መዝሙር ቃላትን፣ 
        እና መዝሙር መርሃ ግብሮችን በአንድ ቦታ ያካትታል። ይህ መተግበሪያ በመንፈሳዊ እድገትና 
        በእምነት መሠረት የተመሰረተ ነው። መዝሙሮችን በቀላሉ ለመፈለግ፣ ለመያዝ እና 
        ለመካፈል ያስችላል።
      </Text>

      <Text style={styles.modalDescription}>
        ይህ መተግበሪያ በኢትዮጵያዊ መንፈሳዊ ባህላዊ እና ቅዱሳዊ ዜማ ባለሞያዎች በመተባበር 
        ተዘጋጀ ሲሆን፣ የተጠቃሚዎች ልምድን ለማሻሻል በዘመናዊ ቴክኖሎጂ ተቀላቅሏል።
      </Text>

      <Text style={styles.modalCopyright}>
        © 2025 ፈለገ መዝሙራት፣ መብቱ በሙሉ የተጠበቀ ነው።
      </Text>

      <TouchableOpacity
        style={styles.modalCloseButton}
        onPress={() => setAboutVisible(false)}
      >
        <Text style={styles.modalCloseText}>ዝጋ</Text>
      </TouchableOpacity>
    </LinearGradient>
  </View>
</Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 4 },
  headerSubtitle: { fontSize: 16 },
  content: { flex: 1, padding: 16 },
  group: { marginBottom: 32 },
  groupTitle: { fontSize: 12, fontWeight: '600', letterSpacing: 1, marginBottom: 12, marginLeft: 4 },
  section: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1 },
  sectionIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  sectionContent: { flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  sectionCount: { fontSize: 14 },
  socialMediaContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 20, borderRadius: 12, borderWidth: 1 },
  socialIcon: { padding: 8 },

  // Modal Styles
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '80%', padding: 24, borderRadius: 20, alignItems: 'center' },
  modalTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  modalVersion: { fontSize: 18, color: '#fff', marginBottom: 8 },
  modalDescription: { fontSize: 16, color: '#fff', textAlign: 'center', marginBottom: 12 },
  modalCopyright: { fontSize: 14, color: '#fff', marginBottom: 16 },
  modalCloseButton: { backgroundColor: '#fff', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12 },
  modalCloseText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});
