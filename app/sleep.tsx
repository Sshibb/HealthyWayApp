import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Тип для записи сна
interface SleepLog {
  id: string;
  sleepStart: Date;
  sleepEnd: Date;
  durationHours: number;
}

const GOAL_HOURS = 8; // Рекомендуемая цель — 8 часов

const Sleep: React.FC = () => {
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [tempStart, setTempStart] = useState<Date>(new Date());
  const [tempEnd, setTempEnd] = useState<Date>(new Date());

  // Рассчитать общее среднее за последние 7 дней
  const totalDuration = logs.reduce((sum, log) => sum + log.durationHours, 0);
  const avgDuration = logs.length > 0 ? totalDuration / logs.length : 0;
  const progress = Math.min(avgDuration / GOAL_HOURS, 1);

  // Добавить запись сна
  const addSleepLog = () => {
    if (tempStart >= tempEnd) {
      Alert.alert('Ошибка', 'Время пробуждения должно быть позже времени засыпания');
      return;
    }

    const diffMs = tempEnd.getTime() - tempStart.getTime();
    const durationHours = diffMs / (1000 * 60 * 60);

    const newLog: SleepLog = {
      id: Date.now().toString(),
      sleepStart: tempStart,
      sleepEnd: tempEnd,
      durationHours,
    };

    setLogs((prev) => [...prev, newLog]);
    Alert.alert('✅ Успешно', `Записано: ${durationHours.toFixed(1)} часов сна`);
  };

  // Удалить запись
  const deleteLog = (id: string) => {
    Alert.alert(
      'Удалить запись?',
      'Вы уверены, что хотите удалить эту запись сна?',
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

  // Форматирование времени
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Ionicons name="bed-outline" size={36} color="#6200EE" />
          <Text style={styles.title}>Сон</Text>
        </View>

        {/* Прогресс */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Среднее за {logs.length} ночей</Text>
          <Text style={styles.progressValue}>
            {avgDuration.toFixed(1)} <Text style={styles.progressUnit}>ч</Text>
          </Text>
          <Text style={styles.goalText}>Цель: {GOAL_HOURS} часов</Text>

          {/* Полоса прогресса */}
          <View style={styles.progressBarBackground}>
            <View
           style={[
                styles.progressBarFill,
                { width: `${progress * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Ввод времени сна */}
        <View style={styles.inputSection}>
          <Text style={styles.inputTitle}>Добавить сон сегодня</Text>

          <View style={styles.timeRow}>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Text style={styles.timeButtonText}>Заснул в</Text>
              <Text style={styles.timeValue}>{formatTime(tempStart)}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Text style={styles.timeButtonText}>Проснулся в</Text>
              <Text style={styles.timeValue}>{formatTime(tempEnd)}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={addSleepLog}>
            <Text style={styles.addButtonText}>✅ Записать сон</Text>
          </TouchableOpacity>
        </View>

        {/* История */}
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>История сна</Text>
            {logs.length > 0 && (
              <TouchableOpacity onPress={() => setLogs([])}>
                <Text style={styles.resetText}>Очистить</Text>
              </TouchableOpacity>
            )}
          </View>

          {logs.length === 0 ? (
            <Text style={styles.emptyHistory}>Еще нет записей сна</Text>
          ) : (
            logs
              .slice()
              .reverse()
              .map((log) => (
                <View key={log.id} style={styles.historyItem}>
                  <View>
                    <Text style={styles.historyDate}>{formatDate(log.sleepStart)}</Text>
                    <Text style={styles.historyTime}>
                      {formatTime(log.sleepStart)} – {formatTime(log.sleepEnd)}
                    </Text>
                  </View>
                  <View style={styles.historyDurationContainer}>
                    <Text style={styles.historyDuration}>
                      {log.durationHours.toFixed(1)} ч
                    </Text>
                    <TouchableOpacity onPress={() => deleteLog(log.id)}>
                      <Ionicons name="trash-outline" size={20} color="#f44336" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
          )}
        </View>

                {/* DateTimePickers */}
        {showStartTimePicker && (
          <DateTimePicker
            value={tempStart}
            mode="time"
            is24Hour={true}
            onChange={(_: any, selectedDate?: Date) => {
              setShowStartTimePicker(false);
              if (selectedDate) setTempStart(selectedDate);
            }}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          />
        )}

        {showEndTimePicker && (
          <DateTimePicker
            value={tempEnd}
            mode="time"
            is24Hour={true}
            onChange={(_: any, selectedDate?: Date) => {
              setShowEndTimePicker(false);
              if (selectedDate) setTempEnd(selectedDate);
            }}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          />
        )}
      </ScrollView>
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
  progressContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  progressLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  progressValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 4,
  },
  progressUnit: {
    fontSize: 24,
    fontWeight: '500',
  },
  goalText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  progressBarBackground: {
    height: 10,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6200EE',
    borderRadius: 5,
  },
  inputSection: {
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
  inputTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  timeButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  historyContainer: {
    width: '100%',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  historyDurationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyDuration: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6200EE',
  },
});

export default Sleep;