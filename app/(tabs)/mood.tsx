import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { achievementsService } from '../achievements-service';

// Тип для записи настроения
interface MoodLog {
  id: string;
  moodLevel: number; // 1-5
  moodEmoji: string;
  reason: string;
  factors: string[];
  timestamp: Date;
}

// Эмодзи для шкалы настроения
const MOOD_EMOJIS = ['😞', '😕', '😐', '🙂', '😍'];

// Факторы, влияющие на настроение
const MOOD_FACTORS = [
  'Семья',
  'Друзья',
  'Питомец',
  'Физическая активность',
  'Сон',
  'Еда',
  'Музыка',
  'Кино/сериалы',
  'Природа',
  'Успехи на работе/учёбе',
  'Творчество',
  'Медитация',
];

const Mood: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [reason, setReason] = useState<string>('');
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [hasFirstMoodRecord, setHasFirstMoodRecord] = useState(false);

  // Обработка выбора настроения
  const handleMoodSelect = (level: number) => {
    setSelectedMood(level);
  };

  // Обработка выбора фактора
  const toggleFactor = (factor: string) => {
    setSelectedFactors((prev) =>
      prev.includes(factor)
        ? prev.filter((f) => f !== factor)
        : [...prev, factor]
    );
  };

  // Сохранение записи
  const saveMood = async () => {
    if (selectedMood === null) {
      Alert.alert('Выберите настроение');
      return;
    }

    const newLog: MoodLog = {
      id: Date.now().toString(),
      moodLevel: selectedMood,
      moodEmoji: MOOD_EMOJIS[selectedMood - 1],
      reason: reason.trim() || 'Без комментария',
      factors: selectedFactors.length > 0 ? selectedFactors : ['Не указано'],
      timestamp: new Date(),
    };

    setLogs((prev) => [newLog, ...prev]);
    
    // Проверка достижений для первой записи настроения
    try {
      const currentAchievements = await achievementsService.loadAchievements();
      const updatedAchievements = achievementsService.checkMoodAchievement(currentAchievements);
      await achievementsService.saveAchievements(updatedAchievements);
      
      // Показать уведомление о достижении, если это первая запись
      if (logs.length === 0) {
        const moodAchievement = updatedAchievements.find(a => a.id === 'first_mood' && a.unlocked);
        const wasJustUnlocked = currentAchievements.find(a => a.id === 'first_mood')?.unlocked === false;
        
        if (moodAchievement && wasJustUnlocked) {
          Alert.alert(
            '🎉 Поздравляем!', 
            'Вы получили достижение "Эмоциональный старт"!\n\nВпервые записали своё настроение',
            [
              { 
                text: 'Отлично!', 
                style: 'default',
                onPress: () => {
                  setHasFirstMoodRecord(true);
                  Alert.alert('✅ Сохранено', 'Ваше настроение записано!');
                }
              }
            ]
          );
          return;
        }
      }
      
      Alert.alert('✅ Сохранено', 'Ваше настроение записано!');
    } catch (error) {
      console.error('Error checking achievements:', error);
      Alert.alert('✅ Сохранено', 'Ваше настроение записано!');
    }
    
    // Сброс формы
    setSelectedMood(null);
    setSelectedFactors([]);
    setReason('');
  };

  // Форматирование даты
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Ionicons name="happy-outline" size={36} color="#FF9800" />
          <Text style={styles.title}>Настроение</Text>
        </View>

        {/* Баннер первого достижения */}
        {logs.length === 0 && !hasFirstMoodRecord && (
          <View style={styles.firstRecordBanner}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.firstRecordText}>
              Запишите первое настроение и получите достижение!
            </Text>
          </View>
        )}

        {/* Текущая запись */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Как вы себя чувствуете сегодня?</Text>

          {/* Шкала настроения — эмодзи */}
          <View style={styles.moodScale}>
            {MOOD_EMOJIS.map((emoji, index) => {
              const level = index + 1;
              const isSelected = selectedMood === level;
              return (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.moodButton,
                    isSelected && styles.moodButtonSelected,
                  ]}
                  onPress={() => handleMoodSelect(level)}
                >
                  <Text style={[styles.moodEmoji, isSelected && styles.moodEmojiSelected]}>
                    {emoji}
                  </Text>
                  {logs.length === 0 && level === 3 && !hasFirstMoodRecord && (
                    <View style={styles.achievementHint}>
                      <Text style={styles.achievementHintText}>🏆</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Поле для описания */}
          <Text style={styles.inputLabel}>Почему так? (опционально)</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              value={reason}
              onChangeText={setReason}
              placeholder="Расскажите, что повлияло на ваше настроение..."
              placeholderTextColor="#aaa"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Выбор факторов */}
          <Text style={styles.inputLabel}>Что повлияло? (выберите несколько)</Text>
          <View style={styles.factorsGrid}>
            {MOOD_FACTORS.map((factor) => (
              <TouchableOpacity
                key={factor}
                style={[
                  styles.factorButton,
                  selectedFactors.includes(factor) && styles.factorButtonSelected,
                ]}
                onPress={() => toggleFactor(factor)}
              >
                <Text
                  style={[
                    styles.factorText,
                    selectedFactors.includes(factor) && styles.factorTextSelected,
                  ]}
                >
                  {factor}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Кнопка сохранения */}
          <TouchableOpacity 
            style={[
              styles.saveButton,
              logs.length === 0 && !hasFirstMoodRecord && styles.firstSaveButton
            ]} 
            onPress={saveMood}
          >
            <Text style={styles.saveButtonText}>
              {logs.length === 0 && !hasFirstMoodRecord ? '🏆 Записать первое настроение' : '💾 Сохранить настроение'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* История */}
        <View style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>
              История настроений {logs.length > 0 && `(${logs.length})`}
            </Text>
            {logs.length > 0 && (
              <TouchableOpacity onPress={() => setLogs([])}>
                <Text style={styles.resetText}>Очистить</Text>
              </TouchableOpacity>
            )}
          </View>

          {logs.length === 0 ? (
            <Text style={styles.emptyHistory}>Еще нет записей настроения</Text>
          ) : (
            logs.map((log, index) => (
              <View key={log.id} style={[
                styles.historyItem,
                index === 0 && logs.length === 1 && styles.firstHistoryItem
              ]}>
                <View style={styles.historyHeaderRow}>
                  <Text style={styles.historyEmoji}>{log.moodEmoji}</Text>
                  <Text style={styles.historyTime}>{formatDate(log.timestamp)}</Text>
                  {index === 0 && logs.length === 1 && (
                    <View style={styles.firstRecordIndicator}>
                      <Ionicons name="trophy" size={16} color="#FFD700" />
                      <Text style={styles.firstRecordIndicatorText}>Первая запись</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.historyReason}>{log.reason}</Text>
                <View style={styles.historyFactors}>
                  {log.factors.map((factor, idx) => (
                    <View key={idx} style={styles.factorTag}>
                      <Text style={styles.factorTagText}>{factor}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Импорт TextInput отдельно — он нужен для поля ввода
import { TextInput } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  firstRecordBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF9C4',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    width: '100%',
  },
  firstRecordText: {
    fontSize: 14,
    color: '#5D4037',
    fontWeight: '600',
    flex: 1,
  },
  formCard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  moodScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  moodButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  moodButtonSelected: {
    backgroundColor: '#FFD54F',
    transform: [{ scale: 1.1 }],
  },
  moodEmoji: {
    fontSize: 28,
    textAlign: 'center',
  },
  moodEmojiSelected: {
    fontSize: 32,
  },
  achievementHint: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    padding: 2,
  },
  achievementHintText: {
    fontSize: 10,
    color: '#333',
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
    marginTop: 16,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },
  textArea: {
    fontSize: 16,
    color: '#333',
    minHeight: 80,
  },
  factorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  factorButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  factorButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  factorText: {
    fontSize: 14,
    color: '#555',
  },
  factorTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  firstSaveButton: {
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  historyCard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  resetText: {
    color: '#f44336',
    fontSize: 16,
  },
  emptyHistory: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
  },
  historyItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  firstHistoryItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
    backgroundColor: '#FFF9C4',
    borderRadius: 8,
    marginBottom: 8,
  },
  historyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  historyEmoji: {
    fontSize: 24,
  },
  historyTime: {
    fontSize: 14,
    color: '#888',
  },
  firstRecordIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  firstRecordIndicatorText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  historyReason: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  historyFactors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  factorTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
  },
  factorTagText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
});

export default Mood;