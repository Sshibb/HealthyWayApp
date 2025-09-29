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
  const [activeFilter, setActiveFilter] = useState<'all' | 'common' | 'rare' | 'epic' | 'legendary'>('all');
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
    { id: 'dedication', name: 'Преданность', icon: '🔥', color: '#FF9800' },
    { id: 'special', name: 'Особые', icon: '🎪', color: '#E91E63' },
  ];

  const rarityFilters = [
    { id: 'all', name: 'Все', color: '#666' },
    { id: 'common', name: 'Обычные', color: '#6B7280' },
    { id: 'rare', name: 'Редкие', color: '#3B82F6' },
    { id: 'epic', name: 'Эпические', color: '#8B5CF6' },
    { id: 'legendary', name: 'Легендарные', color: '#F59E0B' },
  ];

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = activeCategory === 'all' || achievement.category === activeCategory;
    const rarityMatch = activeFilter === 'all' || achievement.rarity === activeFilter;
    return categoryMatch && rarityMatch;
  });

  const unlockedInCategory = filteredAchievements.filter(a => a.unlocked).length;
  const totalInCategory = filteredAchievements.length;
  const progressInCategory = totalInCategory > 0 ? (unlockedInCategory / totalInCategory) * 100 : 0;

  const getCategoryColor = (category: string) => {
    const categoryObj = categories.find(c => c.id === category);
    return categoryObj ? categoryObj.color : '#666';
  };

  const getProgressHint = (achievement: Achievement) => {
    switch (achievement.id) {
      // Здоровье
      case 'first_sleep':
        return 'Проспите 8 часов за одну ночь';
      case 'first_water':
        return 'Выпейте 2 литра воды за день';
      case 'perfect_week_sleep':
        return 'Спите 7+ часов 7 дней подряд';
      case 'hydration_master':
        return 'Пейте 2+ литра воды 5 дней подряд';
      case 'sleep_expert':
        return 'Наберите 100 часов качественного сна';
      case 'water_expert':
        return 'Выпейте 100 литров воды в сумме';
      case 'sleep_marathon':
        return 'Отслеживайте сон 30 дней подряд';
      
      // Фитнес
      case 'first_workout':
        return 'Завершите любую тренировку';
      case 'weekly_goal':
        return 'Занимайтесь 150 минут в неделю';
      case 'marathon':
        return 'Пробегите 50+ км в сумме';
      case 'streak_7':
        return 'Тренируйтесь 7 дней подряд';
      case 'iron_man':
        return 'Попробуйте 10 различных типов тренировок';
      case 'fitness_pro':
        return 'Завершите 100 тренировок';
      case 'early_bird':
        return 'Потренируйтесь до 7 утра';
      case 'night_owl':
        return 'Потренируйтесь после 10 вечера';
      
      // Разум
      case 'first_mood':
        return 'Запишите свое настроение';
      case 'positive_week':
        return 'Оценивайте настроение на 4+ 7 дней подряд';
      case 'mindful_month':
        return 'Отслеживайте настроение 30 дней';
      case 'happy_day':
        return 'Оцените настроение на 5/5';
      case 'emotional_explorer':
        return 'Используйте все 5 уровней настроения';
      case 'zen_master':
        return 'Занимайтесь йогой/медитацией 50 раз';
      
      // Преданность
      case 'week_streak':
        return 'Используйте приложение 7 дней подряд';
      case 'month_streak':
        return 'Используйте приложение 30 дней подряд';
      case 'triple_streak':
        return 'Отслеживайте сон, воду и настроение 7 дней подряд';
      case 'perfect_day':
        return 'Сон 8ч + вода 2л + тренировка + настроение 4+ за один день';
      case 'health_guru':
        return 'Используйте приложение 100 дней';
      
      // Особые
      case 'first_achievement':
        return 'Получите любое достижение';
      case 'halfway_there':
        return 'Разблокируйте 50% всех достижений';
      case 'completionist':
        return 'Разблокируйте все достижения';
      case 'weekend_warrior':
        return 'Тренируйтесь только по выходным 4 недели подряд';
      case 'four_seasons':
        return 'Используйте приложение 90 дней подряд';
      case 'early_adopter':
        return 'Будьте среди первых пользователей приложения';
      
      default:
        return 'Продолжайте заниматься!';
    }
  };

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
          <View style={styles.achievementTitleRow}>
            <Text style={[
              styles.achievementTitle,
              achievement.unlocked ? styles.unlockedText : styles.lockedText
            ]}>
              {achievement.title}
            </Text>
            <View style={[
              styles.rarityBadge,
              { backgroundColor: achievementsService.getRarityColor(achievement.rarity) }
            ]}>
              <Text style={styles.rarityBadgeText}>
                {achievementsService.getRarityName(achievement.rarity)}
              </Text>
            </View>
          </View>
          
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
          <Ionicons name="bulb-outline" size={14} color="#FFD700" />
          <Text style={styles.progressHintText}>
            {getProgressHint(achievement)}
          </Text>
        </View>
      )}
    </View>
  );

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

        {/* Фильтры редкости */}
        <View style={styles.raritySection}>
          <Text style={styles.sectionTitle}>Редкость</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rarityContainer}
          >
            {rarityFilters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.rarityButton,
                  activeFilter === filter.id && styles.rarityButtonActive,
                  { backgroundColor: filter.color + '20', borderColor: filter.color }
                ]}
                onPress={() => setActiveFilter(filter.id as any)}
              >
                <Text style={[
                  styles.rarityText,
                  activeFilter === filter.id && { color: filter.color, fontWeight: '600' }
                ]}>
                  {filter.name}
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

        {/* Статистика фильтров */}
        <View style={styles.filterStats}>
          <Text style={styles.filterStatsText}>
            Показано: {filteredAchievements.length} достижений
            {unlockedInCategory > 0 && ` (${unlockedInCategory} разблокировано)`}
          </Text>
        </View>

        {/* Список достижений */}
        <View style={styles.achievementsList}>
          {filteredAchievements.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color="#ccc" />
              <Text style={styles.emptyStateTitle}>Достижения не найдены</Text>
              <Text style={styles.emptyStateText}>
                Попробуйте изменить фильтры или категорию
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
    marginBottom: 20,
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
  raritySection: {
    marginBottom: 20,
  },
  rarityContainer: {
    paddingRight: 20,
  },
  rarityButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 8,
  },
  rarityButtonActive: {
    borderWidth: 3,
  },
  rarityText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  categoryProgress: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
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
  filterStats: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  filterStatsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
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
    alignItems: 'flex-start',
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
  achievementTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  unlockedText: {
    color: '#333',
  },
  lockedText: {
    color: '#999',
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rarityBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressHintText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 20,
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