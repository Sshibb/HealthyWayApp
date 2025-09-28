import React, { useState } from 'react';
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
import { achievementsService } from './achievements-service';

// Типы
interface WaterLog {
  id: string;
  amount: number;
  timestamp: Date;
}

const GOAL_ML = 2000; // Цель — 2 литра в день

const Water: React.FC = () => {
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const totalConsumed = logs.reduce((sum, log) => sum + log.amount, 0);
  const progress = Math.min(totalConsumed / GOAL_ML, 1);

  const addWater = async (amount: number) => {
    const newLog: WaterLog = {
      id: Date.now().toString(),
      amount,
      timestamp: new Date(),
    };
    
    const newTotal = totalConsumed + amount;
    setLogs((prev) => [...prev, newLog]);

    // Проверка достижений
    try {
      const currentAchievements = await achievementsService.loadAchievements();
      const updatedAchievements = achievementsService.checkWaterAchievement(
        newTotal, 
        currentAchievements
      );
      await achievementsService.saveAchievements(updatedAchievements);
      
      // Показать уведомление о достижении, если разблокировано
      if (newTotal >= 2000) {
        const waterAchievement = updatedAchievements.find(a => a.id === 'first_water' && a.unlocked);
        const wasJustUnlocked = currentAchievements.find(a => a.id === 'first_water')?.unlocked === false;
        
        if (waterAchievement && wasJustUnlocked) {
          Alert.alert(
            '🎉 Поздравляем!', 
            'Вы получили достижение "Водохлёб"!\n\nВпервые выпили 2 литра воды за день',
            [{ text: 'Отлично!', style: 'default' }]
          );
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
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

  // Получить цвет прогресс-бара в зависимости от потребления воды
  const getProgressBarColor = () => {
    if (totalConsumed >= 2000) return '#4CAF50'; // Цель достигнута
    if (totalConsumed >= 1500) return '#8BC34A'; // Близко к цели
    if (totalConsumed >= 1000) return '#FFC107'; // Среднее потребление
    return '#FF9800'; // Нужно больше воды
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
                { 
                  width: `${progress * 100}%`,
                  backgroundColor: getProgressBarColor()
                },
              ]}
            />
          </View>

          {/* Подсказка про достижение */}
          {totalConsumed < 2000 && (
            <View style={styles.achievementHint}>
              <Text style={styles.achievementHintText}>
                🏆 Выпейте 2 литра для получения достижения!
              </Text>
            </View>
          )}

          {/* Бейдж достижения */}
          {totalConsumed >= 2000 && (
            <View style={styles.achievementUnlocked}>
              <Text style={styles.achievementUnlockedText}>🎉 Достижение разблокировано!</Text>
            </View>
          )}
        </View>

        {/* Кнопки добавления */}
        <View style={styles.buttonsContainer}>
          {[250, 500, 750, 1000].map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.addButton,
                totalConsumed + amount >= 2000 && styles.achievementButton
              ]}
              onPress={() => addWater(amount)}
            >
              <Text style={styles.addButtonText}>+{amount} мл</Text>
              {totalConsumed + amount >= 2000 && totalConsumed < 2000 && (
                <Text style={styles.achievementBadge}>🏆</Text>
              )}
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
              .map((log) => {
                const cumulativeAmount = logs
                  .filter(l => l.timestamp <= log.timestamp)
                  .reduce((sum, l) => sum + l.amount, 0);
                
                return (
                  <View key={log.id} style={[
                    styles.historyItem,
                    cumulativeAmount >= 2000 && styles.achievementHistoryItem
                  ]}>
                    <View style={styles.historyContent}>
                      <Text style={styles.historyAmount}>{log.amount} мл</Text>
                      <Text style={styles.historyTime}>
                        {formatTime(log.timestamp)}
                      </Text>
                      {cumulativeAmount >= 2000 && (
                        <View style={styles.achievementIndicator}>
                          <Text style={styles.achievementIndicatorText}>🏆 2л достигнуто!</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.cumulativeText}>
                      Всего: {(cumulativeAmount / 1000).toFixed(1)}л
                    </Text>
                  </View>
                );
              })
          )}
        </View>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 30,
    width: '100%',
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
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  achievementHint: {
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  achievementHintText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
    textAlign: 'center',
  },
  achievementUnlocked: {
    padding: 12,
    backgroundColor: '#C8E6C9',
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  achievementUnlockedText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
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
    position: 'relative',
  },
  achievementButton: {
    backgroundColor: '#2196F3',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  achievementBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    fontSize: 16,
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
  achievementHistoryItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  historyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  achievementIndicator: {
    marginTop: 8,
    padding: 4,
    backgroundColor: '#FFD700',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  achievementIndicatorText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  cumulativeText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    textAlign: 'right',
  },
  emptyHistory: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
  },
});

export default Water;