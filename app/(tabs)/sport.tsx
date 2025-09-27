import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

// Тип для вида спорта
interface SportType {
  id: string;
  name: string;
  iconName: string;
  iconSet: 'Ionicons' | 'MaterialIcons' | 'FontAwesome5';
}

// Тип для записи тренировки
interface WorkoutLog {
  id: string;
  sportId: string; 
  duration: number; // в минутах
  timestamp: Date;
}

// Базовые виды спорта с иконками
const DEFAULT_SPORTS: SportType[] = [
  { id: '1', name: 'Бег', iconName: 'walk', iconSet: 'Ionicons' }, 
  { id: '2', name: 'Ходьба', iconName: 'directions-walk', iconSet: 'MaterialIcons' }, 
  { id: '3', name: 'Велосипед', iconName: 'pedal-bike', iconSet: 'MaterialIcons' }, 
  { id: '4', name: 'Тренировка в зале', iconName: 'fitness', iconSet: 'Ionicons' }, 
  { id: '5', name: 'Йога', iconName: 'spa', iconSet: 'MaterialIcons' }, 
  { id: '6', name: 'Плавание', iconName: 'water', iconSet: 'Ionicons' }, 
  { id: '7', name: 'Танцы', iconName: 'musical-notes', iconSet: 'Ionicons' }, 
  { id: '8', name: 'Футбол', iconName: 'futbol', iconSet: 'FontAwesome5' }, 
];

const Sport: React.FC = () => {
  const [sports, setSports] = useState<SportType[]>(DEFAULT_SPORTS);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [selectedSportId, setSelectedSportId] = useState<string | null>(null);
  const [duration, setDuration] = useState<string>('');
  const [showAddSportModal, setShowAddSportModal] = useState(false);
  const [newSportName, setNewSportName] = useState('');
  const [newSportIcon, setNewSportIcon] = useState('fitness'); // по умолчанию
  const [newSportIconSet, setNewSportIconSet] = useState<'Ionicons' | 'MaterialIcons' | 'FontAwesome5'>('Ionicons');

  // Доступные иконки для выбора (можно расширить)
  const ICON_OPTIONS = [
    { name: 'fitness', set: 'Ionicons', label: 'Фитнес' },
    { name: 'ios-walk', set: 'Ionicons', label: 'Бег/ходьба' },
    { name: 'water', set: 'Ionicons', label: 'Плавание' },
    { name: 'bicycle', set: 'Ionicons', label: 'Велосипед' },
    { name: 'football', set: 'FontAwesome5', label: 'Футбол' },
    { name: 'basketball', set: 'FontAwesome5', label: 'Баскетбол' },
    { name: 'spa', set: 'MaterialIcons', label: 'Йога/спа' },
    { name: 'directions-bike', set: 'MaterialIcons', label: 'Велосипед (2)' },
    { name: 'music', set: 'Ionicons', label: 'Танцы/музыка' },
    { name: 'rowing', set: 'MaterialIcons', label: 'Гребля' },
    { name: 'hiking', set: 'FontAwesome5', label: 'Походы' },
  ];

  // Сохранение тренировки
  const saveWorkout = () => {
    if (!selectedSportId) {
      Alert.alert('Выберите вид спорта');
      return;
    }
    const durationNum = Number(duration);
    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert('Введите корректную длительность (в минутах)');
      return;
    }

    const newLog: WorkoutLog = {
      id: Date.now().toString(),
      sportId: selectedSportId,
      duration: durationNum,
      timestamp: new Date(),
    };

    setLogs((prev) => [newLog, ...prev]);
    Alert.alert('✅ Успешно', 'Тренировка добавлена!');

    // Сброс формы
    setSelectedSportId(null);
    setDuration('');
  };

  // Добавление нового вида спорта
  const addNewSport = () => {
    if (!newSportName.trim()) {
      Alert.alert('Введите название вида спорта');
      return;
    }

    const newSport: SportType = {
      id: Date.now().toString(),
      name: newSportName.trim(),
      iconName: newSportIcon,
      iconSet: newSportIconSet,
    };

    setSports((prev) => [...prev, newSport]);
    setNewSportName('');
    setShowAddSportModal(false);
    Alert.alert('✅ Успешно', 'Новый вид спорта добавлен!');
  };

  // Удаление тренировки
  const deleteLog = (id: string) => {
    Alert.alert(
      'Удалить запись?',
      'Вы уверены, что хотите удалить эту тренировку?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => setLogs((prev) => prev.filter((log) => log.id !== id)),
        },
      ]
    );
  };

  // Вспомогательная функция для отображения иконки
  const renderIcon = (iconName: string, iconSet: string, size = 24, color = '#666') => {
    if (iconSet === 'Ionicons') {
      return <Ionicons name={iconName as any} size={size} color={color} />;
    } else if (iconSet === 'MaterialIcons') {
      return <MaterialIcons name={iconName as any} size={size} color={color} />;
    } else if (iconSet === 'FontAwesome5') {
      return <FontAwesome5 name={iconName as any} size={size} color={color} />;
    }
    return <Ionicons name="fitness" size={size} color={color} />;
  };

  // Найти спорт по ID
  const getSportById = (id: string) => sports.find((s) => s.id === id);

  // Форматирование даты
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Статистика
  const totalWorkouts = logs.length;
  const totalDuration = logs.reduce((sum, log) => sum + log.duration, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Ionicons name="fitness" size={36} color="#4CAF50" />
          <Text style={styles.title}>Спорт</Text>
        </View>

        {/* Форма добавления */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Добавить тренировку</Text>

          {/* Выбор вида спорта */}
          <Text style={styles.inputLabel}>Вид спорта</Text>
          <View style={styles.sportsGrid}>
            {sports.map((sport) => (
              <TouchableOpacity
                key={sport.id}
                style={[
                  styles.sportButton,
                  selectedSportId === sport.id && styles.sportButtonSelected,
                ]}
                onPress={() => setSelectedSportId(sport.id)}
              >
                {renderIcon(sport.iconName, sport.iconSet, 20, selectedSportId === sport.id ? '#fff' : '#666')}
                <Text
                  style={[
                    styles.sportText,
                    selectedSportId === sport.id && styles.sportTextSelected,
                  ]}
                  numberOfLines={1}
                >
                  {sport.name}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.addSportButton}
              onPress={() => setShowAddSportModal(true)}
            >
              <Ionicons name="add" size={24} color="#4CAF50" />
              <Text style={styles.addSportText}>Добавить свой</Text>
            </TouchableOpacity>
          </View>

          {/* Длительность */}
          <Text style={styles.inputLabel}>Длительность (минуты)</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.numberInput}
              value={duration}
              onChangeText={setDuration}
              placeholder="60"
              keyboardType="numeric"
            />
          </View>

          {/* Кнопка сохранения */}
          <TouchableOpacity style={styles.saveButton} onPress={saveWorkout}>
            <Text style={styles.saveButtonText}>✅ Добавить тренировку</Text>
          </TouchableOpacity>
        </View>

        {/* Статистика */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>📊 Статистика</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalWorkouts}</Text>
              <Text style={styles.statLabel}>тренировок</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{Math.floor(totalDuration / 60)}</Text>
              <Text style={styles.statLabel}>ч {totalDuration % 60} мин</Text>
            </View>
          </View>
        </View>

        {/* История */}
        <View style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>История тренировок</Text>
            {logs.length > 0 && (
              <TouchableOpacity onPress={() => setLogs([])}>
                <Text style={styles.resetText}>Очистить</Text>
              </TouchableOpacity>
            )}
          </View>

          {logs.length === 0 ? (
            <Text style={styles.emptyHistory}>Еще нет тренировок</Text>
          ) : (
            logs.map((log) => {
              const sport = getSportById(log.sportId);
              return (
                <View key={log.id} style={styles.historyItem}>
                  <View style={styles.historyTop}>
                    <View style={styles.historySportInfo}>
                      {sport && renderIcon(sport.iconName, sport.iconSet, 20, '#4CAF50')}
                      <View>
                        <Text style={styles.historyType}>{sport?.name || 'Неизвестно'}</Text>
                        <Text style={styles.historyTime}>{formatDate(log.timestamp)}</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => deleteLog(log.id)}>
                      <Ionicons name="trash-outline" size={20} color="#f44336" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.historyDuration}>⏱️ {log.duration} мин</Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Модальное окно: добавить свой вид спорта */}
      <Modal
        visible={showAddSportModal}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Добавить свой вид спорта</Text>

          <TextInput
            style={styles.modalInput}
            placeholder="Название (например, Пилатес)"
            value={newSportName}
            onChangeText={setNewSportName}
          />

          <Text style={styles.modalLabel}>Выберите иконку:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconsScroll}>
            {ICON_OPTIONS.map((icon, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.iconOption,
                  newSportIcon === icon.name && newSportIconSet === icon.set && styles.iconOptionSelected,
                ]}
                onPress={() => {
                  setNewSportIcon(icon.name);
                  setNewSportIconSet(icon.set as any);
                }}
              >
                {renderIcon(icon.name, icon.set, 28, '#333')}
                <Text style={styles.iconLabel}>{icon.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowAddSportModal(false)}
            >
              <Text style={styles.modalButtonText}>Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButtonModal]}
              onPress={addNewSport}
            >
              <Text style={styles.modalButtonText}>✅ Добавить</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

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
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  formCard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
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
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginTop: 16,
    marginBottom: 8,
  },
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  sportButton: {
    width: 80,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sportButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  sportText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginTop: 4,
  },
  sportTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  addSportButton: {
    width: 80,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSportText: {
    fontSize: 12,
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 4,
  },
  inputRow: {
    marginBottom: 20,
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsCard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
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
  historyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historySportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyTime: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  historyDuration: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  // Модальное окно
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  iconsScroll: {
    marginBottom: 30,
  },
  iconOption: {
    width: 80,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  iconOptionSelected: {
    backgroundColor: '#e8f5e9',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  iconLabel: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginTop: 6,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#3d3434ff',
  },
  saveButtonModal: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default Sport;