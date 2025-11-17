import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useMezmur } from '@/hooks/useMezmur';
import { MezmurCategory } from '@/types';
import { CATEGORIES } from '@/constants/categories';

export default function AddMezmurPage() {
  const { colors } = useTheme();
  const { addUserMezmur } = useMezmur();
  const insets = useSafeAreaInsets();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [firstLine, setFirstLine] = useState('');
  const [category, setCategory] = useState<MezmurCategory>('wereb');
  const [description, setDescription] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const showWebAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`${title}\n\n${message}`);
      if (confirmed && onOk) onOk();
    } else {
      Alert.alert(title, message, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      showWebAlert('Validation Error', 'Please enter a title for the mezmur');
      return false;
    }
    if (!content.trim()) {
      showWebAlert('Validation Error', 'Please enter the mezmur content/lyrics');
      return false;
    }
    if (content.trim().length < 10) {
      showWebAlert('Validation Error', 'Mezmur content should be at least 10 characters');
      return false;
    }
    return true;
  };

  const extractFirstLine = (text: string) => {
    const lines = text.trim().split('\n');
    return lines[0]?.trim() || '';
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      const mezmurData = {
        title: title.trim(),
        content: content.trim(),
        description: description.trim() || extractFirstLine(content),
        lyrics: content.trim(), // For search functionality
        language: 'am',
        category,
        first_line: firstLine.trim() || extractFirstLine(content),
      };

      addUserMezmur(mezmurData);
      
      showWebAlert('Success', 'Mezmur saved successfully!', () => {
        router.back();
      });
    } catch (error) {
      console.error('Error saving mezmur:', error);
      showWebAlert('Error', 'Failed to save mezmur. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const selectedCategoryName = CATEGORIES.find(c => c.id === category)?.name || 'Select Category';

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
            <Text style={styles.headerTitle}>Add New Mezmur</Text>
            <Text style={styles.headerSubtitle}>Create your own mezmur</Text>
          </View>

          <TouchableOpacity 
            onPress={handleSave}
            style={[styles.saveButton, { 
              backgroundColor: saving ? colors.border : 'rgba(255,255,255,0.2)' 
            }]}
            disabled={saving}
          >
            <MaterialIcons 
              name={saving ? "hourglass-empty" : "save"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Title Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, { color: colors.text }]}>
            Mezmur Title *
          </Text>
          <TextInput
            style={[styles.textInput, { 
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text 
            }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter the title of the mezmur"
            placeholderTextColor={colors.textSecondary}
            maxLength={100}
          />
        </View>

        {/* Category Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, { color: colors.text }]}>
            Category *
          </Text>
          <TouchableOpacity
            style={[styles.pickerButton, { 
              backgroundColor: colors.surface,
              borderColor: colors.border 
            }]}
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          >
            <Text style={[styles.pickerText, { color: colors.text }]} numberOfLines={1}>
              {selectedCategoryName}
            </Text>
            <MaterialIcons 
              name={showCategoryPicker ? "expand-less" : "expand-more"} 
              size={24} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
          
          {showCategoryPicker && (
            <View style={[styles.categoryList, { 
              backgroundColor: colors.card,
              borderColor: colors.border 
            }]}>
              <ScrollView style={styles.categoryScrollView} nestedScrollEnabled>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryItem, { 
                      backgroundColor: category === cat.id ? colors.primary : 'transparent' 
                    }]}
                    onPress={() => {
                      setCategory(cat.id);
                      setShowCategoryPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.categoryItemText, 
                      { 
                        color: category === cat.id ? 'white' : colors.text,
                        fontWeight: category === cat.id ? 'bold' : 'normal'
                      }
                    ]} numberOfLines={2}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* First Line Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, { color: colors.text }]}>
            First Line (Optional)
          </Text>
          <TextInput
            style={[styles.textInput, { 
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text 
            }]}
            value={firstLine}
            onChangeText={setFirstLine}
            placeholder="First line for preview (auto-extracted if empty)"
            placeholderTextColor={colors.textSecondary}
            maxLength={150}
          />
        </View>

        {/* Description Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, { color: colors.text }]}>
            Description (Optional)
          </Text>
          <TextInput
            style={[styles.textInput, { 
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text 
            }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Brief description of the mezmur"
            placeholderTextColor={colors.textSecondary}
            maxLength={200}
          />
        </View>

        {/* Content Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.fieldLabel, { color: colors.text }]}>
            Mezmur Content/Lyrics *
          </Text>
          <TextInput
            style={[styles.textArea, { 
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text 
            }]}
            value={content}
            onChangeText={setContent}
            placeholder="Enter the full lyrics/content of the mezmur..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
          />
          <Text style={[styles.characterCount, { color: colors.textSecondary }]}>
            {content.length} characters
          </Text>
        </View>

        {/* Instructions */}
        <View style={[styles.instructionsContainer, { 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }]}>
          <MaterialIcons name="info" size={20} color={colors.primary} />
          <View style={styles.instructionsText}>
            <Text style={[styles.instructionsTitle, { color: colors.text }]}>
              Guidelines:
            </Text>
            <Text style={[styles.instructionsContent, { color: colors.textSecondary }]}>
              • All user-added mezmurs are saved locally on your device{'\n'}
              • Choose an appropriate category for better organization{'\n'}
              • Write clear and accurate lyrics for the best experience{'\n'}
              • Your mezmurs will appear in searches and category lists
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  saveButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 48,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 150,
    maxHeight: 300,
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  pickerText: {
    fontSize: 16,
    flex: 1,
  },
  categoryList: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
  },
  categoryScrollView: {
    maxHeight: 200,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  categoryItemText: {
    fontSize: 14,
    lineHeight: 18,
  },
  instructionsContainer: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  instructionsText: {
    flex: 1,
    marginLeft: 12,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  instructionsContent: {
    fontSize: 13,
    lineHeight: 18,
  },
});