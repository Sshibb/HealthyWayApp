import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { achievementService } from './achievement-service';

// Типы
interface WaterLog {
  id: string;
  amount: number;
  timestamp: Date;
}

const GOAL_ML = 2000; // Цель — 2 литра в день

// Генерируем часы с 6 утра до 10 вечера
const HOURS = Array.from({ length: 17 }, (_, i) => 6 + i); // 6, 7, ..., 22

const Water: React.FC = () => {
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const totalConsumed = logs.reduce((sum, log) => sum + log.amount, 0);
  const progress = Math.min(totalConsumed / GOAL_ML, 1);

  // Группируем логи по часам
  const hourlyData = useMemo(() => {
    const data: Record<number, number> = {};
    HOURS.forEach((hour) => {
      data[hour] = 0;
    });

    logs.forEach((log) => {
      const hour = log.timestamp.getHours();
      if (HOURS.includes(hour)) {
        data[hour] += log.amount;
      }
    });

    return data;
  }, [logs]);

  // Максимальное значение для масштабирования
  const maxAmount = Math.max(...Object.values(hourlyData), 1);

  const addWater = async (amount: number) => {
    const newLog: WaterLog = {
      id: Date.now().toString(),
      amount,
      timestamp: new Date(),
    };
    setLogs((prev) => [...prev, newLog]);
    
    // Отправляем данные в сервис достижений
    try {
      const { unlocked } = await achievementService.updateProgress({
        water: {
          amount: amount,
          date: new Date(),
        },
      });
      
      if (unlocked.length > 0) {
        // Показываем уведомление о новых достижениях
        unlocked.forEach(achievement => {
          Alert.alert('🎉 Новое достижение!', 
            `"${achievement.title}"\n\n${achievement.description}`);
        });
      }
    } catch (error) {
      console.error('Error updating achievements:', error);
    }
  };

  const resetLogs = () => {
    Alert.alert(
      'Сбросить данные?',
      'Вы уверены, что хотите сбросить статистику за сегодня?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Сбросить', style: 'destructive', onPress: () => setLogs([]) },
      ]
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Заголовок */}
        <Text style={styles.title}>💧 Вода</Text>

        {/* Прогресс — текст + полоса */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressAmount}>
            {(totalConsumed / 1000).toFixed(1)}л
          </Text>
          <Text style={styles.progressGoal}>из {GOAL_ML / 1000}л</Text>

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

        {/* График */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Ваш график сегодня</Text>
          <View style={styles.chart}>
            {HOURS.map((hour) => {
              const amount = hourlyData[hour];
              const heightPercent = (amount / maxAmount) * 100;
              const opacity = amount > 0 ? 1 : 0.3;
              return (
                <View key={hour} style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(heightPercent, 5), // минимум 5% чтобы был виден
                        backgroundColor: `rgba(76, 175, 80, ${opacity})`,
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>{hour}:00</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Кнопки добавления */}
        <View style={styles.buttonsContainer}>
          {[250, 500, 750, 1000].map((amount) => (
            <TouchableOpacity
              key={amount}
              style={styles.addButton}
              onPress={() => addWater(amount)}
            >
              <Text style={styles.addButtonText}>+{amount} мл</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* История */}
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>История сегодня</Text>
            <TouchableOpacity onPress={resetLogs}>
              <Text style={styles.resetText}>Сбросить</Text>
            </TouchableOpacity>
          </View>

          {logs.length === 0 ? (
            <Text style={styles.emptyHistory}>Пока ничего не выпито</Text>
          ) : (
            logs
              .slice()
              .reverse()
              .map((log) => (
                <View key={log.id} style={styles.historyItem}>
                  <Text style={styles.historyAmount}>{log.amount} мл</Text>
                  <Text style={styles.historyTime}>
                    {formatTime(log.timestamp)}
                  </Text>
                </View>
              ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  progressAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  progressGoal: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  progressBarBackground: {
    height: 12,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  chartContainer: {
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
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingHorizontal: 10,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  bar: {
    width: (width - 80) / 17 - 8, // адаптивная ширина
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 30,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  historyContainer: {
    width: '100%',
    marginTop: 20,
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
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  historyTime: {
    fontSize: 14,
    color: '#666',
  },
  emptyHistory: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
  },
});

export default Water;