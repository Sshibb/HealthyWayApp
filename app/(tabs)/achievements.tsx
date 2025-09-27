import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { achievementService, Achievement } from '../achievement-service';

const [achievements, setAchievements] = useState<Achievement[]>([]);

useEffect(() => {
  const loadAchievements = async () => {
    const loaded = await achievementService.loadAchievements();
    setAchievements(loaded);
  };
  
  loadAchievements();
}, []);

// Типы для достижений
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'water' | 'sleep' | 'sport' | 'mood' | 'streak' | 'general';
  requirement: string;
  progress: number;
  target: number;
  completed: boolean;
  dateCompleted?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'uncompleted'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | Achievement['category']>('all');

  // Инициализация достижений
  useEffect(() => {
    const initialAchievements: Achievement[] = [
      // Вода
      {
        id: '1',
        title: 'Первая капля',
        description: 'Выпейте первый стакан воды',
        icon: '💧',
        category: 'water',
        requirement: 'Выпить 250 мл воды',
        progress: 0,
        target: 250,
        completed: false,
        rarity: 'common',
      },
      {
        id: '2',
        title: 'Водохлёб',
        description: 'Выпейте 2 литра воды за день',
        icon: '🌊',
        category: 'water',
        requirement: 'Выпить 2000 мл воды за день',
        progress: 0,
        target: 2000,
        completed: false,
        rarity: 'rare',
      },
      {
        id: '3',
        title: 'Морской котик',
        description: 'Выпейте 10 литров воды за неделю',
        icon: '🦭',
        category: 'water',
        requirement: 'Выпить 10000 мл воды за неделю',
        progress: 0,
        target: 10000,
        completed: false,
        rarity: 'epic',
      },

      // Сон
      {
        id: '4',
        title: 'Первая ночь',
        description: 'Запишите первый сон',
        icon: '🌙',
        category: 'sleep',
        requirement: 'Записать 1 ночь сна',
        progress: 0,
        target: 1,
        completed: false,
        rarity: 'common',
      },
      {
        id: '5',
        title: 'Здоровый сон',
        description: 'Проспите 8 часов за ночь',
        icon: '😴',
        category: 'sleep',
        requirement: 'Проспать 8 часов за одну ночь',
        progress: 0,
        target: 8,
        completed: false,
        rarity: 'rare',
      },
      {
        id: '6',
        title: 'Мастер сна',
        description: 'Спите 8+ часов 7 ночей подряд',
        icon: '🛌',
        category: 'sleep',
        requirement: '7 ночей с 8+ часами сна',
        progress: 0,
        target: 7,
        completed: false,
        rarity: 'legendary',
      },

      // Спорт
      {
        id: '7',
        title: 'Первая тренировка',
        description: 'Завершите первую тренировку',
        icon: '🏃',
        category: 'sport',
        requirement: 'Завершить 1 тренировку',
        progress: 0,
        target: 1,
        completed: false,
        rarity: 'common',
      },
      {
        id: '8',
        title: 'Активная неделя',
        description: 'Занимайтесь спортом 5 дней в неделю',
        icon: '💪',
        category: 'sport',
        requirement: '5 тренировок за неделю',
        progress: 0,
        target: 5,
        completed: false,
        rarity: 'rare',
      },
      {
        id: '9',
        title: 'Железный человек',
        description: 'Занимайтесь спортом 30 дней подряд',
        icon: '🏆',
        category: 'sport',
        requirement: '30 дней подряд с тренировками',
        progress: 0,
        target: 30,
        completed: false,
        rarity: 'legendary',
      },

      // Настроение
      {
        id: '10',
        title: 'Первая запись',
        description: 'Запишите своё настроение впервые',
        icon: '😊',
        category: 'mood',
        requirement: 'Сделать 1 запись настроения',
        progress: 0,
        target: 1,
        completed: false,
        rarity: 'common',
      },
      {
        id: '11',
        title: 'Позитивный настрой',
        description: 'Имейте высокое настроение 5 дней подряд',
        icon: '🌈',
        category: 'mood',
        requirement: '5 дней с настроением 4+',
        progress: 0,
        target: 5,
        completed: false,
        rarity: 'epic',
      },

      // Серии
      {
        id: '12',
        title: 'Новичок',
        description: 'Используйте приложение 3 дня подряд',
        icon: '⭐',
        category: 'streak',
        requirement: '3 дня подряд использования',
        progress: 0,
        target: 3,
        completed: false,
        rarity: 'common',
      },
      {
        id: '13',
        title: 'Постоянный клиент',
        description: 'Используйте приложение 30 дней подряд',
        icon: '🔥',
        category: 'streak',
        requirement: '30 дней подряд использования',
        progress: 0,
        target: 30,
        completed: false,
        rarity: 'epic',
      },

      // Общие
      {
        id: '14',
        title: 'Мультитаскер',
        description: 'Заполните все трекеры за один день',
        icon: '🎯',
        category: 'general',
        requirement: 'Вода, сон, спорт и настроение за день',
        progress: 0,
        target: 4,
        completed: false,
        rarity: 'rare',
      },
      {
        id: '15',
        title: 'Мастер здоровья',
        description: 'Получите все достижения',
        icon: '👑',
        category: 'general',
        requirement: 'Получить все остальные достижения',
        progress: 0,
        target: 14,
        completed: false,
        rarity: 'legendary',
      },
    ];

    // Загрузка прогресса из локального хранилища (заглушка)
    const savedProgress = {}; // Здесь будет логика загрузки
    setAchievements(initialAchievements);
  }, []);

  // Фильтрация достижений
  const filteredAchievements = achievements.filter(achievement => {
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' && achievement.completed) ||
      (filter === 'uncompleted' && !achievement.completed);
    
    const matchesCategory = categoryFilter === 'all' || achievement.category === categoryFilter;
    
    return matchesFilter && matchesCategory;
  });

  // Получение цвета редкости
  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return '#757575';
      case 'rare': return '#2196F3';
      case 'epic': return '#9C27B0';
      case 'legendary': return '#FF9800';
      default: return '#757575';
    }
  };

  // Получение иконки категории
  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'water': return '💧';
      case 'sleep': return '😴';
      case 'sport': return '💪';
      case 'mood': return '😊';
      case 'streak': return '🔥';
      case 'general': return '⭐';
      default: return '⭐';
    }
  };

  // Заглушка для тестирования - разблокировка достижения
  const unlockAchievement = (id: string) => {
    setAchievements(prev => prev.map(ach => 
      ach.id === id 
        ? { ...ach, completed: true, dateCompleted: new Date() }
        : ach
    ));
    Alert.alert('🎉 Поздравляем!', 'Вы получили новое достижение!');
  };

  // Статистика
  const completedCount = achievements.filter(a => a.completed).length;
  const totalCount = achievements.length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Ionicons name="trophy" size={36} color="#FFD700" />
          <Text style={styles.title}>Достижения</Text>
        </View>

        {/* Прогресс */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Ваш прогресс</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercent}>{completionPercent}%</Text>
            </View>
            <View style={styles.progressStats}>
              <Text style={styles.progressText}>
                <Text style={styles.progressNumber}>{completedCount}</Text> из <Text style={styles.progressNumber}>{totalCount}</Text>
              </Text>
              <Text style={styles.progressSubtext}>достижений получено</Text>
            </View>
          </View>
        </View>

        {/* Фильтры */}
        <View style={styles.filtersCard}>
          <Text style={styles.filtersTitle}>Фильтры</Text>
          
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Статус:</Text>
            {(['all', 'completed', 'uncompleted'] as const).map(status => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  filter === status && styles.filterButtonActive,
                ]}
                onPress={() => setFilter(status)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filter === status && styles.filterButtonTextActive,
                ]}>
                  {status === 'all' ? 'Все' : status === 'completed' ? 'Полученные' : 'Не полученные'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Категория:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryFilters}>
                {(['all', 'water', 'sleep', 'sport', 'mood', 'streak', 'general'] as const).map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      categoryFilter === category && styles.categoryButtonActive,
                    ]}
                    onPress={() => setCategoryFilter(category)}
                  >
                    <Text style={[
                      styles.categoryButtonText,
                      categoryFilter === category && styles.categoryButtonTextActive,
                    ]}>
                      {category === 'all' ? 'Все' : getCategoryIcon(category)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Список достижений */}
        <View style={styles.achievementsList}>
          {filteredAchievements.length === 0 ? (
            <Text style={styles.emptyText}>Нет достижений по выбранным фильтрам</Text>
          ) : (
            filteredAchievements.map(achievement => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  achievement.completed && styles.achievementCardCompleted,
                  { borderLeftColor: getRarityColor(achievement.rarity) },
                ]}
              >
                <View style={styles.achievementHeader}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                    <View style={styles.achievementMeta}>
                      <Text style={styles.achievementRarity} style={{ color: getRarityColor(achievement.rarity) }}>
                        {achievement.rarity === 'common' ? 'Обычное' :
                         achievement.rarity === 'rare' ? 'Редкое' :
                         achievement.rarity === 'epic' ? 'Эпическое' : 'Легендарное'}
                      </Text>
                      <Text style={styles.achievementCategory}>
                        {getCategoryIcon(achievement.category)} {achievement.category}
                      </Text>
                    </View>
                  </View>
                  {achievement.completed ? (
                    <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
                  ) : (
                    <Ionicons name="lock-closed" size={32} color="#ccc" />
                  )}
                </View>

                <View style={styles.achievementProgress}>
                  <Text style={styles.achievementRequirement}>{achievement.requirement}</Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%`,
                          backgroundColor: getRarityColor(achievement.rarity),
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {achievement.completed ? 'Получено' : `${achievement.progress}/${achievement.target}`}
                  </Text>
                </View>

                {achievement.completed && achievement.dateCompleted && (
                  <Text style={styles.completionDate}>
                    Получено: {achievement.dateCompleted.toLocaleDateString('ru-RU')}
                  </Text>
                )}

                {/* Кнопка для тестирования (убрать в продакшене) */}
                {!achievement.completed && __DEV__ && (
                  <TouchableOpacity
                    style={styles.testButton}
                    onPress={() => unlockAchievement(achievement.id)}
                  >
                    <Text style={styles.testButtonText}>Тест: разблокировать</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  progressCard: {
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
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercent: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressStats: {
    flex: 1,
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  progressNumber: {
    color: '#6200EE',
  },
  progressSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  filtersCard: {
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
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  filterRow: {
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#6200EE',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  categoryFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  categoryButtonActive: {
    backgroundColor: '#6200EE',
  },
  categoryButtonText: {
    fontSize: 16,
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  achievementsList: {
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
  achievementCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  achievementCardCompleted: {
    opacity: 0.9,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  achievementIcon: {
    fontSize: 40,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  achievementMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  achievementRarity: {
    fontSize: 12,
    fontWeight: '500',
  },
  achievementCategory: {
    fontSize: 12,
    color: '#999',
  },
  achievementProgress: {
    marginTop: 8,
  },
  achievementRequirement: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  completionDate: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 8,
    fontStyle: 'italic',
  },
  testButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#ffeb3b',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  testButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
});

export default Achievements;