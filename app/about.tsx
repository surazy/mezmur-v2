import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function AboutPage() {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            <LinearGradient
                colors={['#1A1A1A', '#2C2C2C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.background}
            >
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>About</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.card}>
                        <View style={styles.iconContainer}>
                            <MaterialIcons name="info-outline" size={48} color="#FFD700" />
                        </View>

                        <Text style={styles.title}>ፈለገ መዝሙራት</Text>
                        <Text style={styles.version}>ስሪት 1.0.0</Text>

                        <View style={styles.divider} />

                        <Text style={styles.description}>
                            ፈለገ መዝሙራት የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን መዝሙሮችን፣ መዝሙር ቃላትን፣
                            እና መዝሙር መርሃ ግብሮችን በአንድ ቦታ ያካትታል። ይህ መተግበሪያ በመንፈሳዊ እድገትና
                            በእምነት መሠረት የተመሰረተ ነው። መዝሙሮችን በቀላሉ ለመፈለግ፣ ለመያዝ እና
                            ለመካፈል ያስችላል።
                        </Text>

                        <Text style={styles.description}>
                            ይህ መተግበሪያ በኢትዮጵያዊ መንፈሳዊ ባህላዊ እና ቅዱሳዊ ዜማ ባለሞያዎች በመተባበር
                            ተዘጋጀ ሲሆን፣ የተጠቃሚዎች ልምድን ለማሻሻል በዘመናዊ ቴክኖሎጂ ተቀላቅሏል።
                        </Text>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.copyright}>© 2025 ፈለገ መዝሙራት፣ መብቱ በሙሉ የተጠበቀ ነው።</Text>
                    </View>
                </ScrollView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.1)',
        marginBottom: 40,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 8,
        textAlign: 'center',
    },
    version: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 24,
    },
    divider: {
        width: 60,
        height: 4,
        backgroundColor: '#FFD700',
        borderRadius: 2,
        marginBottom: 24,
        opacity: 0.3,
    },
    description: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 20,
    },
    footer: {
        alignItems: 'center',
    },
    copyright: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.4)',
    },
});
