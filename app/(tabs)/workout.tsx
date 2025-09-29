import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { achievementsService } from '../achievements-service';

// Типы
interface WorkoutLog {
  id: string;
  type: string;
  duration: number; // в минутах
  calories: number;
  timestamp: Date;
  customName?: string;
}

interface WorkoutType {
  id: string;
  name: string;
  icon: string;
  caloriesPerMinute: number;
  color: string;
  isCustom?: boolean;
}

const DEFAULT_WORKOUT_TYPES: WorkoutType[] = [
  {
    id: 'running',
    name: 'Бег',
    icon: '🏃‍♂️',
    caloriesPerMinute: 10,
    color: '#4CAF50'
  },
  {
    id: 'cycling',
    name: 'Велосипед',
    icon: '🚴‍♂️',
    caloriesPerMinute: 8,
    color: '#2196F3'
  },
  {
    id: 'swimming',
    name: 'Плавание',
    icon: '🏊‍♂️',
    caloriesPerMinute: 11,
    color: '#00BCD4'
  },
  {
    id: 'yoga',
    name: 'Йога',
    icon: '🧘‍♂️',
    caloriesPerMinute: 4,
    color: '#9C27B0'
  },
  {
    id: 'strength',
    name: 'Силовая',
    icon: '💪',
    caloriesPerMinute: 7,
    color: '#FF5722'
  },
  {
    id: 'walking',
    name: 'Ходьба',
    icon: '🚶‍♂️',
    caloriesPerMinute: 5,
    color: '#795548'
  }
];

const Workout: React.FC = () => {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutType | null>(null);
  const [duration, setDuration] = useState<number>(30);
  const [customDuration, setCustomDuration] = useState<string>('');
  const [weeklyGoal, setWeeklyGoal] = useState<number>(150);
  const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>(DEFAULT_WORKOUT_TYPES);
  
  // Модальные окна
  const [showCustomWorkoutModal, setShowCustomWorkoutModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showCustomTimeModal, setShowCustomTimeModal] = useState(false);
  
  // Данные для кастомной тренировки
  const [customWorkoutName, setCustomWorkoutName] = useState('');
  const [customWorkoutCalories, setCustomWorkoutCalories] = useState('7');
  const [newWeeklyGoal, setNewWeeklyGoal] = useState('150');

  // Статистика
  const totalWorkouts = logs.length;
  const totalMinutes = logs.reduce((sum, log) => sum + log.duration, 0);
  const totalCalories = logs.reduce((sum, log) => sum + log.calories, 0);
  const weeklyMinutes = logs
    .filter(log => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return log.timestamp > weekAgo;
    })
    .reduce((sum, log) => sum + log.duration, 0);

  const weeklyProgress = Math.min(weeklyMinutes / weeklyGoal, 1);

  // Добавить кастомную тренировку
  const addCustomWorkout = () => {
    if (!customWorkoutName.trim()) {
      Alert.alert('Ошибка', 'Введите название тренировки');
      return;
    }

    const caloriesValue = parseInt(customWorkoutCalories) || 7;
    
    const newWorkout: WorkoutType = {
      id: `custom_${Date.now()}`,
      name: customWorkoutName.trim(),
      icon: '🏅',
      caloriesPerMinute: caloriesValue,
      color: getRandomColor(),
      isCustom: true
    };

    setWorkoutTypes(prev => [...prev, newWorkout]);
    setShowCustomWorkoutModal(false);
    setCustomWorkoutName('');
    setCustomWorkoutCalories('7');
    
    Alert.alert('✅ Успешно', `Тренировка "${customWorkoutName}" добавлена!`);
  };

  // Получить случайный цвет для кастомной тренировки
  const getRandomColor = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Установить новую цель
  const setNewGoal = () => {
    const goalValue = parseInt(newWeeklyGoal);
    if (goalValue && goalValue > 0) {
      setWeeklyGoal(goalValue);
      setShowGoalModal(false);
      Alert.alert('✅ Цель обновлена', `Новая недельная цель: ${goalValue} минут`);
    } else {
      Alert.alert('Ошибка', 'Введите корректное число минут');
    }
  };

  // Установить кастомное время
  const setCustomTime = () => {
    const timeValue = parseInt(customDuration);
    if (timeValue && timeValue > 0 && timeValue <= 480) { // Макс 8 часов
      setDuration(timeValue);
      setShowCustomTimeModal(false);
      setCustomDuration('');
    } else {
      Alert.alert('Ошибка', 'Введите число от 1 до 480 минут');
    }
  };

  // Добавить тренировку
  const addWorkout = async () => {
    if (!selectedWorkout) {
      Alert.alert('Выберите тип тренировки');
      return;
    }

    const calories = Math.round(selectedWorkout.caloriesPerMinute * duration);

    const newLog: WorkoutLog = {
      id: Date.now().toString(),
      type: selectedWorkout.id,
      duration,
      calories,
      timestamp: new Date(),
      customName: selectedWorkout.isCustom ? selectedWorkout.name : undefined
    };

    setLogs((prev) => [newLog, ...prev]);

    // Проверка достижений
    try {
      const currentAchievements = await achievementsService.loadAchievements();
      
      // Проверка первой тренировки
      // Рассчитываем статистику для тренировок
const workoutTypes = new Set([...logs.map(log => log.type), selectedWorkout?.id]).size;

const updatedAchievements = achievementsService.checkWorkoutAchievement(
  totalWorkouts + 1,
  weeklyMinutes + duration,
  workoutTypes,
  currentAchievements
);
await achievementsService.saveAchievements(updatedAchievements);

// Проверка первой тренировки
if (totalWorkouts === 0) {
  const workoutAchievement = updatedAchievements.find(a => a.id === 'first_workout' && a.unlocked);
  if (workoutAchievement) {
    Alert.alert(
      '🎉 Поздравляем!', 
      'Вы получили достижение "Спортивный старт"!\n\nПервая тренировка завершена',
      [{ text: 'Отлично!', style: 'default' }]
    );
  }
}

// Проверка недельной цели
if (weeklyMinutes + duration >= weeklyGoal && weeklyMinutes < weeklyGoal) {
  const weeklyAchievement = updatedAchievements.find(a => a.id === 'weekly_goal' && a.unlocked);
  if (weeklyAchievement) {
    Alert.alert(
      '🎉 Отлично!', 
      'Вы получили достижение "Активная неделя"!\n\nВыполнена недельная норма тренировок',
      [{ text: 'Супер!', style: 'default' }]
    );
  }
}

      // Проверка недельной цели
      if (weeklyMinutes + duration >= weeklyGoal && weeklyMinutes < weeklyGoal) {
        const updatedAchievements = currentAchievements.map(achievement => {
          if (achievement.id === 'weekly_goal' && !achievement.unlocked) {
            return {
              ...achievement,
              unlocked: true,
              unlockedAt: new Date()
            };
          }
          return achievement;
        });
        await achievementsService.saveAchievements(updatedAchievements);
        
        const weeklyAchievement = updatedAchievements.find(a => a.id === 'weekly_goal' && a.unlocked);
        if (weeklyAchievement) {
          Alert.alert(
            '🎉 Отлично!', 
            'Вы получили достижение "Активная неделя"!\n\nВыполнена недельная норма тренировок',
            [{ text: 'Супер!', style: 'default' }]
          );
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }

    Alert.alert(
      '✅ Тренировка записана!',
      `${selectedWorkout.name} - ${duration} минут\nСожжено: ${calories} калорий`
    );

    // Сброс формы
    setSelectedWorkout(null);
    setDuration(30);
  };

  // Удалить запись
  const deleteWorkout = (id: string) => {
    Alert.alert(
      'Удалить тренировку?',
      'Вы уверены, что хотите удалить эту запись?',
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

  // Удалить кастомную тренировку
  const deleteCustomWorkout = (workoutId: string) => {
    Alert.alert(
      'Удалить тренировку?',
      'Эта тренировка будет удалена из списка',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            setWorkoutTypes(prev => prev.filter(workout => workout.id !== workoutId));
            if (selectedWorkout?.id === workoutId) {
              setSelectedWorkout(null);
            }
          },
        },
      ]
    );
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

  // Получить workout по ID
  const getWorkoutById = (id: string) => {
    return workoutTypes.find(workout => workout.id === id) || workoutTypes[0];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Ionicons name="fitness" size={36} color="#FF5722" />
          <Text style={styles.title}>Тренировки</Text>
        </View>

        {/* Статистика */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalWorkouts}</Text>
            <Text style={styles.statLabel}>тренировок</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalMinutes}</Text>
            <Text style={styles.statLabel}>минут</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalCalories}</Text>
            <Text style={styles.statLabel}>калорий</Text>
          </View>
        </View>

        {/* Недельный прогресс */}
        <View style={styles.weeklyProgress}>
          <View style={styles.weeklyHeader}>
            <View>
              <Text style={styles.weeklyTitle}>Недельная цель</Text>
              <Text style={styles.weeklyStats}>
                {weeklyMinutes} из {weeklyGoal} мин
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.editGoalButton}
              onPress={() => {
                setNewWeeklyGoal(weeklyGoal.toString());
                setShowGoalModal(true);
              }}
            >
              <Ionicons name="create-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${weeklyProgress * 100}%` }
              ]}
            />
          </View>
          {weeklyProgress >= 1 && (
            <View style={styles.goalAchieved}>
              <Ionicons name="trophy" size={16} color="#FFD700" />
              <Text style={styles.goalAchievedText}>Цель недели достигнута! 🎉</Text>
            </View>
          )}
        </View>

        {/* Выбор тренировки */}
        <View style={styles.workoutSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Добавить тренировку</Text>
            <TouchableOpacity 
              style={styles.addCustomButton}
              onPress={() => setShowCustomWorkoutModal(true)}
            >
              <Ionicons name="add-circle" size={24} color="#4CAF50" />
              <Text style={styles.addCustomText}>Своя</Text>
            </TouchableOpacity>
          </View>

          {/* Типы тренировок */}
          <Text style={styles.inputLabel}>Тип тренировки</Text>
          <View style={styles.workoutGrid}>
            {workoutTypes.map((workout) => (
              <TouchableOpacity
                key={workout.id}
                style={[
                  styles.workoutButton,
                  { borderColor: workout.color },
                  selectedWorkout?.id === workout.id && [
                    styles.workoutButtonSelected,
                    { backgroundColor: workout.color + '20' }
                  ]
                ]}
                onPress={() => setSelectedWorkout(workout)}
                onLongPress={() => workout.isCustom && deleteCustomWorkout(workout.id)}
              >
                <Text style={styles.workoutIcon}>{workout.icon}</Text>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.workoutCalories}>
                  {workout.caloriesPerMinute} ккал/мин
                </Text>
                {workout.isCustom && (
                  <View style={styles.customBadge}>
                    <Text style={styles.customBadgeText}>★</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Длительность */}
          <Text style={styles.inputLabel}>Длительность (минут)</Text>
          <View style={styles.durationContainer}>
            {[15, 30, 45, 60, 90].map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.durationButton,
                  duration === time && styles.durationButtonSelected
                ]}
                onPress={() => setDuration(time)}
              >
                <Text style={[
                  styles.durationText,
                  duration === time && styles.durationTextSelected
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[
                styles.durationButton,
                styles.customTimeButton,
                ![15, 30, 45, 60, 90].includes(duration) && styles.durationButtonSelected
              ]}
              onPress={() => setShowCustomTimeModal(true)}
            >
              <Text style={[
                styles.durationText,
                ![15, 30, 45, 60, 90].includes(duration) && styles.durationTextSelected
              ]}>
                {![15, 30, 45, 60, 90].includes(duration) ? duration : 'Своё'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Предварительный расчет */}
          {selectedWorkout && (
            <View style={styles.preview}>
              <Text style={styles.previewTitle}>Будет записано:</Text>
              <View style={styles.previewStats}>
                <Text style={styles.previewText}>
                  {selectedWorkout.name} • {duration} минут
                </Text>
                <Text style={styles.previewCalories}>
                  ~{selectedWorkout.caloriesPerMinute * duration} калорий
                </Text>
              </View>
            </View>
          )}

          {/* Кнопка сохранения */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              !selectedWorkout && styles.saveButtonDisabled
            ]}
            onPress={addWorkout}
            disabled={!selectedWorkout}
          >
            <Text style={styles.saveButtonText}>
              💪 Записать тренировку
            </Text>
          </TouchableOpacity>
        </View>

        {/* История тренировок */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>История тренировок</Text>
            {logs.length > 0 && (
              <TouchableOpacity onPress={() => setLogs([])}>
                <Text style={styles.resetText}>Очистить</Text>
              </TouchableOpacity>
            )}
          </View>

          {logs.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Ionicons name="fitness-outline" size={48} color="#ccc" />
              <Text style={styles.emptyHistoryText}>Еще нет тренировок</Text>
              <Text style={styles.emptyHistorySubtext}>
                Начните с первой тренировки и получите достижение!
              </Text>
            </View>
          ) : (
            logs.map((log) => {
              const workout = getWorkoutById(log.type);
              return (
                <View key={log.id} style={styles.historyItem}>
                  <View style={[styles.historyIcon, { backgroundColor: workout.color + '20' }]}>
                    <Text style={styles.historyEmoji}>{workout.icon}</Text>
                  </View>
                  <View style={styles.historyContent}>
                    <Text style={styles.historyWorkout}>
                      {workout.name}
                      {log.customName && workout.isCustom && (
                        <Text style={styles.customLabel}> • своя</Text>
                      )}
                    </Text>
                    <Text style={styles.historyDetails}>
                      {log.duration} мин • {log.calories} ккал
                    </Text>
                    <Text style={styles.historyTime}>
                      {formatDate(log.timestamp)}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => deleteWorkout(log.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#f44336" />
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Модальное окно добавления своей тренировки */}
      <Modal
        visible={showCustomWorkoutModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Добавить свою тренировку</Text>
            
            <Text style={styles.modalLabel}>Название тренировки</Text>
            <TextInput
              style={styles.textInput}
              value={customWorkoutName}
              onChangeText={setCustomWorkoutName}
              placeholder="Например: Теннис, Бокс, Танцы..."
              placeholderTextColor="#999"
            />
            
            <Text style={styles.modalLabel}>Ккал в минуту (интенсивность)</Text>
            <TextInput
              style={styles.textInput}
              value={customWorkoutCalories}
              onChangeText={setCustomWorkoutCalories}
              placeholder="7"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
            <Text style={styles.helpText}>
              Легкая: 4-6 ккал/мин • Средняя: 7-9 ккал/мин • Высокая: 10+ ккал/мин
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCustomWorkoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={addCustomWorkout}
              >
                <Text style={styles.confirmButtonText}>Добавить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модальное окно изменения цели */}
      <Modal
        visible={showGoalModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Изменить недельную цель</Text>
            
            <Text style={styles.modalLabel}>Минут в неделю</Text>
            <TextInput
              style={styles.textInput}
              value={newWeeklyGoal}
              onChangeText={setNewWeeklyGoal}
              placeholder="150"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
            <Text style={styles.helpText}>
              ВОЗ рекомендует 150+ минут умеренной активности в неделю
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowGoalModal(false)}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={setNewGoal}
              >
                <Text style={styles.confirmButtonText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модальное окно своего времени */}
      <Modal
        visible={showCustomTimeModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Свое время тренировки</Text>
            
            <Text style={styles.modalLabel}>Минут</Text>
            <TextInput
              style={styles.textInput}
              value={customDuration}
              onChangeText={setCustomDuration}
              placeholder="Например: 25, 75, 120..."
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
            <Text style={styles.helpText}>
              Введите длительность тренировки в минутах (1-480)
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCustomTimeModal(false)}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={setCustomTime}
              >
                <Text style={styles.confirmButtonText}>Установить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  weeklyProgress: {
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
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weeklyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  weeklyStats: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  editGoalButton: {
    padding: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  goalAchieved: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 8,
    backgroundColor: '#C8E6C9',
    borderRadius: 8,
  },
  goalAchievedText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  workoutSection: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
  },
  addCustomText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 12,
    marginTop: 16,
  },
  workoutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  workoutButton: {
    width: '48%',
    padding: 16,
    borderWidth: 2,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  workoutButtonSelected: {
    borderWidth: 3,
  },
  workoutIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  workoutCalories: {
    fontSize: 12,
    color: '#666',
  },
  customBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    padding: 2,
  },
  customBadgeText: {
    fontSize: 10,
    color: '#333',
    fontWeight: 'bold',
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  durationButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  customTimeButton: {
    backgroundColor: '#E3F2FD',
  },
  durationButtonSelected: {
    backgroundColor: '#FF5722',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  durationTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  preview: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  previewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  previewCalories: {
    fontSize: 14,
    color: '#FF5722',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  historySection: {
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
    alignItems: 'center',
    padding: 40,
  },
  emptyHistoryText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
    marginBottom: 8,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  historyEmoji: {
    fontSize: 24,
  },
  historyContent: {
    flex: 1,
  },
  historyWorkout: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  customLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'normal',
  },
  historyDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  historyTime: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 8,
  },
  // Модальные окна
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Workout;