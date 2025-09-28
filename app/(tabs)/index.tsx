import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Text,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Типы для данных
interface HealthData {
  water: {
    amount: number;
    goal: number;
    lastUpdate: Date;
  };
  sleep: {
    duration: number;
    goal: number;
    lastUpdate: Date;
  };
  mood: {
    level: number;
    emoji: string;
    lastUpdate: Date;
  };
  workout: {
    type: string;
    duration: number;
    lastUpdate: Date;
  };
}

export default function HomeScreen() {
  const [healthData, setHealthData] = useState<HealthData>({
    water: {
      amount: 0,
      goal: 2000,
      lastUpdate: new Date()
    },
    sleep: {
      duration: 0,
      goal: 8,
      lastUpdate: new Date()
    },
    mood: {
      level: 0,
      emoji: '😐',
      lastUpdate: new Date()
    },
    workout: {
      type: '',
      duration: 0,
      lastUpdate: new Date()
    }
  });

  // Заглушка для загрузки данных (в реальном приложении здесь будет AsyncStorage или API)
  useEffect(() => {
    // Симуляция загруженных данных
    const mockData: HealthData = {
      water: {
        amount: 1250,
        goal: 2000,
        lastUpdate: new Date()
      },
      sleep: {
        duration: 7.5,
        goal: 8,
        lastUpdate: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 часов назад
      },
      mood: {
        level: 4,
        emoji: '🙂',
        lastUpdate: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 часов назад
      },
      workout: {
        type: 'Бег',
        duration: 45,
        lastUpdate: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 день назад
      }
    };
    setHealthData(mockData);
  }, []);

  // Расчет прогресса в процентах
  const getProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  // Форматирование времени
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Только что';
    if (diffHours < 24) return `${diffHours}ч назад`;
    return `${Math.floor(diffHours / 24)}д назад`;
  };

  return ( 
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Шапка */}
        <View style={styles.header}>
          <Text style={styles.title}>Health Tracker</Text>
          <Text style={styles.subtitle}>Ваше здоровье под контролем</Text>
        </View>

        {/* Быстрые действия */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Быстрые действия</Text>
          <View style={styles.actionsGrid}>
            <Link href="/water" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <View style={[styles.actionIcon, { backgroundColor: '#4CAF50' }]}>
                  <Text style={styles.actionEmoji}>💧</Text>
                </View>
                <Text style={styles.actionText}>Вода</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/sleep" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <View style={[styles.actionIcon, { backgroundColor: '#2196F3' }]}>
                  <Text style={styles.actionEmoji}>💤</Text>
                </View>
                <Text style={styles.actionText}>Сон</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/mood" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <View style={[styles.actionIcon, { backgroundColor: '#FF9800' }]}>
                  <Text style={styles.actionEmoji}>😌</Text>
                </View>
                <Text style={styles.actionText}>Настроение</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/workout" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <View style={[styles.actionIcon, { backgroundColor: '#FF5722' }]}>
                  <Text style={styles.actionEmoji}>💪</Text>
                </View>
                <Text style={styles.actionText}>Тренировки</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Последние записи */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Сегодня</Text>
          
          {/* Вода */}
          <Link href="/water" asChild>
            <TouchableOpacity style={styles.healthCard}>
              <View style={styles.healthCardHeader}>
                <View style={styles.healthCardTitle}>
                  <Text style={styles.healthCardEmoji}>💧</Text>
                  <Text style={styles.healthCardName}>Вода</Text>
                </View>
                <Text style={styles.healthCardTime}>
                  {formatTimeAgo(healthData.water.lastUpdate)}
                </Text>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressAmount}>
                    {healthData.water.amount} мл
                  </Text>
                  <Text style={styles.progressGoal}>
                    / {healthData.water.goal} мл
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${getProgress(healthData.water.amount, healthData.water.goal)}%`,
                        backgroundColor: '#4CAF50'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressPercent}>
                  {Math.round(getProgress(healthData.water.amount, healthData.water.goal))}%
                </Text>
              </View>
            </TouchableOpacity>
          </Link>

          {/* Сон */}
          <Link href="/sleep" asChild>
            <TouchableOpacity style={styles.healthCard}>
              <View style={styles.healthCardHeader}>
                <View style={styles.healthCardTitle}>
                  <Text style={styles.healthCardEmoji}>💤</Text>
                  <Text style={styles.healthCardName}>Сон</Text>
                </View>
                <Text style={styles.healthCardTime}>
                  {formatTimeAgo(healthData.sleep.lastUpdate)}
                </Text>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressAmount}>
                    {healthData.sleep.duration}ч
                  </Text>
                  <Text style={styles.progressGoal}>
                    / {healthData.sleep.goal}ч
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${getProgress(healthData.sleep.duration, healthData.sleep.goal)}%`,
                        backgroundColor: '#2196F3'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressPercent}>
                  {Math.round(getProgress(healthData.sleep.duration, healthData.sleep.goal))}%
                </Text>
              </View>
            </TouchableOpacity>
          </Link>

          {/* Настроение */}
          <Link href="/mood" asChild>
            <TouchableOpacity style={styles.healthCard}>
              <View style={styles.healthCardHeader}>
                <View style={styles.healthCardTitle}>
                  <Text style={styles.healthCardEmoji}>{healthData.mood.emoji}</Text>
                  <Text style={styles.healthCardName}>Настроение</Text>
                </View>
                <Text style={styles.healthCardTime}>
                  {formatTimeAgo(healthData.mood.lastUpdate)}
                </Text>
              </View>
              <View style={styles.moodContainer}>
                <Text style={styles.moodText}>
                  {healthData.mood.level > 0 ? 'Записанно сегодня' : 'Еще не записано'}
                </Text>
                <View style={styles.moodLevel}>
                  <Text style={styles.moodLevelText}>
                    {healthData.mood.level > 0 ? `Уровень: ${healthData.mood.level}/5` : 'Оцените настроение'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>

          {/* Тренировки */}
          <Link href="/workout" asChild>
            <TouchableOpacity style={styles.healthCard}>
              <View style={styles.healthCardHeader}>
                <View style={styles.healthCardTitle}>
                  <Text style={styles.healthCardEmoji}>💪</Text>
                  <Text style={styles.healthCardName}>Тренировки</Text>
                </View>
                <Text style={styles.healthCardTime}>
                  {formatTimeAgo(healthData.workout.lastUpdate)}
                </Text>
              </View>
              <View style={styles.workoutContainer}>
                {healthData.workout.duration > 0 ? (
                  <>
                    <Text style={styles.workoutType}>{healthData.workout.type}</Text>
                    <Text style={styles.workoutDuration}>
                      {healthData.workout.duration} минут
                    </Text>
                  </>
                ) : (
                  <Text style={styles.noWorkoutText}>Сегодня еще не было тренировок</Text>
                )}
              </View>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Призыв к действию */}
        <View style={styles.callToAction}>
          <Text style={styles.callToActionTitle}>Готовы к тренировке?</Text>
          <Text style={styles.callToActionSubtitle}>
            Начните прямо сейчас и достигните своих целей!
          </Text>
          <Link href="/workout" asChild>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Начать тренировку</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Кнопка достижений */}
        <Link href="/achievements" asChild>
          <TouchableOpacity style={styles.achievementsButton} activeOpacity={0.8}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.achievementsButtonText}>Мои достижения</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    padding: 8,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  recentSection: {
    marginBottom: 24,
  },
  healthCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  healthCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  healthCardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  healthCardEmoji: {
    fontSize: 20,
  },
  healthCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  healthCardTime: {
    fontSize: 12,
    color: '#666',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressLabels: {
    flexDirection: 'row',
    alignItems: 'baseline',
    minWidth: 100,
  },
  progressAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressGoal: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    minWidth: 40,
    textAlign: 'right',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodText: {
    fontSize: 14,
    color: '#666',
  },
  moodLevel: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  moodLevelText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  workoutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  workoutDuration: {
    fontSize: 14,
    color: '#666',
  },
  noWorkoutText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  callToAction: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  callToActionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  callToActionSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  achievementsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
    marginBottom: 20,
  },
  achievementsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginLeft: 12,
  },
});