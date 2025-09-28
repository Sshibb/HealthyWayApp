// app/achievements.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { achievementsService, Achievement } from '../achievements-service';

const { width } = Dimensions.get('window');

export default function AchievementsScreen() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    const loadedAchievements = await achievementsService.loadAchievements();
    setAchievements(loadedAchievements);
    setUnlockedCount(loadedAchievements.filter(a => a.unlocked).length);
    setTotalCount(loadedAchievements.length);
  };

  const resetAchievements = () => {
    Alert.alert(
      'Сбросить достижения?',
      'Все ваши достижения будут сброшены. Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Сбросить',
          style: 'destructive',
          onPress: async () => {
            const resetAchievements = await achievementsService.resetAchievements();
            setAchievements(resetAchievements);
            setUnlockedCount(0);
            Alert.alert('✅ Сброшено', 'Все достижения сброшены');
          },
        },
      ]
    );
  };

  const categories = [
    { id: 'all', name: 'Все', icon: '🏆', color: '#FFD700' },
    { id: 'health', name: 'Здоровье', icon: '💚', color: '#4CAF50' },
    { id: 'fitness', name: 'Фитнес', icon: '💪', color: '#FF5722' },
    { id: 'mind', name: 'Разум', icon: '🧠', color: '#9C27B0' },
  ];

  const filteredAchievements = activeCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === activeCategory);

  const unlockedInCategory = filteredAchievements.filter(a => a.unlocked).length;
  const totalInCategory = filteredAchievements.length;
  const progressInCategory = totalInCategory > 0 ? (unlockedInCategory / totalInCategory) * 100 : 0;

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => (
    <View style={[
      styles.achievementCard,
      achievement.unlocked ? styles.unlockedCard : styles.lockedCard
    ]}>
      <View style={styles.achievementHeader}>
        <View style={[
          styles.achievementIconContainer,
          { backgroundColor: achievement.unlocked ? getCategoryColor(achievement.category) : '#f0f0f0' }
        ]}>
          <Text style={[
            styles.achievementIcon,
            !achievement.unlocked && styles.lockedIcon
          ]}>
            {achievement.icon}
          </Text>
          {achievement.unlocked && (
            <View style={styles.unlockedBadge}>
              <Ionicons name="checkmark" size={12} color="#fff" />
            </View>
          )}
        </View>
        
        <View style={styles.achievementInfo}>
          <Text style={[
            styles.achievementTitle,
            achievement.unlocked ? styles.unlockedText : styles.lockedText
          ]}>
            {achievement.title}
          </Text>
          <Text style={styles.achievementDescription}>
            {achievement.description}
          </Text>
          
          {achievement.unlocked && achievement.unlockedAt && (
            <View style={styles.unlockedInfo}>
              <Ionicons name="time-outline" size={12} color="#4CAF50" />
              <Text style={styles.unlockedDate}>
                {achievement.unlockedAt.toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.achievementStatus}>
          {achievement.unlocked ? (
            <Ionicons name="lock-open" size={24} color="#4CAF50" />
          ) : (
            <Ionicons name="lock-closed" size={24} color="#ccc" />
          )}
        </View>
      </View>

      {/* Прогресс для незаблокированных достижений */}
      {!achievement.unlocked && (
        <View style={styles.progressHint}>
          <Text style={styles.progressHintText}>
            {getProgressHint(achievement)}
          </Text>
        </View>
      )}
    </View>
  );

  const getCategoryColor = (category: string) => {
    const categoryObj = categories.find(c => c.id === category);
    return categoryObj ? categoryObj.color : '#666';
  };

  const getProgressHint = (achievement: Achievement) => {
    switch (achievement.id) {
      case 'first_sleep':
        return 'Проспите 8 часов за одну ночь';
      case 'first_water':
        return 'Выпейте 2 литра воды за день';
      case 'first_workout':
        return 'Завершите любую тренировку';
      case 'first_mood':
        return 'Запишите свое настроение';
      case 'weekly_goal':
        return 'Занимайтесь 150 минут в неделю';
      case 'perfect_week_sleep':
        return 'Спите 7+ часов 7 дней подряд';
      case 'hydration_master':
        return 'Пейте 2+ литра воды 5 дней подряд';
      case 'marathon':
        return 'Пробегите 50+ км в сумме';
      case 'streak_7':
        return 'Тренируйтесь 7 дней подряд';
      case 'positive_week':
        return 'Оценивайте настроение на 4+ 7 дней подряд';
      case 'mindful_month':
        return 'Отслеживайте настроение 30 дней';
      case 'happy_day':
        return 'Оцените настроение на 5/5';
      default:
        return 'Продолжайте заниматься!';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Заголовок */}
        <View style={styles.header}>
          <View style={styles.headerMain}>
            <Ionicons name="trophy" size={36} color="#FFD700" />
            <View style={styles.headerText}>
              <Text style={styles.title}>Достижения</Text>
              <Text style={styles.subtitle}>
                {unlockedCount} из {totalCount} разблокировано
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={resetAchievements}
          >
            <Ionicons name="refresh" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Общий прогресс */}
        <View style={styles.overallProgress}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressPercent}>
              {Math.round((unlockedCount / totalCount) * 100)}%
            </Text>
            <Text style={styles.progressLabel}>Общий прогресс</Text>
          </View>
          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{unlockedCount}</Text>
              <Text style={styles.statLabel}>Получено</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalCount - unlockedCount}</Text>
              <Text style={styles.statLabel}>Осталось</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalCount}</Text>
              <Text style={styles.statLabel}>Всего</Text>
            </View>
          </View>
        </View>

        {/* Категории */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Категории</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  activeCategory === category.id && styles.categoryButtonActive,
                  { borderColor: category.color }
                ]}
                onPress={() => setActiveCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryName,
                  activeCategory === category.id && { color: category.color }
                ]}>
                  {category.name}
                </Text>
                <Text style={styles.categoryCount}>
                  {achievements.filter(a => a.category === category.id && a.unlocked).length}/
                  {achievements.filter(a => a.category === category.id).length}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Прогресс категории */}
        {activeCategory !== 'all' && (
          <View style={styles.categoryProgress}>
            <View style={styles.categoryProgressHeader}>
              <Text style={styles.categoryProgressTitle}>
                {categories.find(c => c.id === activeCategory)?.name}
              </Text>
              <Text style={styles.categoryProgressStats}>
                {unlockedInCategory} из {totalInCategory}
              </Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { 
                    width: `${progressInCategory}%`,
                    backgroundColor: getCategoryColor(activeCategory)
                  }
                ]}
              />
            </View>
          </View>
        )}

        {/* Список достижений */}
        <View style={styles.achievementsList}>
          {filteredAchievements.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="trophy-outline" size={64} color="#ccc" />
              <Text style={styles.emptyStateTitle}>Нет достижений</Text>
              <Text style={styles.emptyStateText}>
                {activeCategory === 'all' 
                  ? 'Начните использовать приложение, чтобы получать достижения!'
                  : `В категории "${categories.find(c => c.id === activeCategory)?.name}" пока нет достижений`
                }
              </Text>
            </View>
          ) : (
            filteredAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
              />
            ))
          )}
        </View>

        {/* Кнопка назад */}
        <Link href="/" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
            <Text style={styles.backButtonText}>На главную</Text>
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
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  resetButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  overallProgress: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  progressCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF9C4',
    marginRight: 20,
  },
  progressPercent: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  progressStats: {
    flex: 1,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingRight: 20,
  },
  categoryButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 12,
    minWidth: 100,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  categoryButtonActive: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#666',
  },
  categoryProgress: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryProgressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  categoryProgressStats: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  achievementsList: {
    gap: 12,
    marginBottom: 24,
  },
  achievementCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  unlockedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  lockedCard: {
    opacity: 0.8,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  achievementIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  achievementIcon: {
    fontSize: 24,
  },
  lockedIcon: {
    opacity: 0.5,
  },
  unlockedBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  unlockedText: {
    color: '#333',
  },
  lockedText: {
    color: '#999',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  unlockedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unlockedDate: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  achievementStatus: {
    padding: 4,
  },
  progressHint: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  progressHintText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#6200EE',
    padding: 16,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});