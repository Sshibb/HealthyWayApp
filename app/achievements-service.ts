// services/achievements-service.ts
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  type: 'sleep' | 'water' | 'mood' | 'workout' | 'streak' | 'milestone' | 'nutrition';
  condition: number;
  category: 'health' | 'fitness' | 'mind' | 'dedication' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

class AchievementsService {
  private achievements: Achievement[] = [
    // === ЗДОРОВЬЕ ===
    {
      id: 'first_sleep',
      title: 'Хороший сон',
      description: 'Впервые проспали 8 часов',
      icon: '🌙',
      unlocked: false,
      type: 'sleep',
      condition: 8,
      category: 'health',
      rarity: 'common'
    },
    {
      id: 'first_water',
      title: 'Водохлёб',
      description: 'Впервые выпили 2 литра воды за день',
      icon: '💧',
      unlocked: false,
      type: 'water',
      condition: 2000,
      category: 'health',
      rarity: 'common'
    },
    {
      id: 'perfect_week_sleep',
      title: 'Высыпающаяся неделя',
      description: '7 дней подряд спали 7+ часов',
      icon: '⭐',
      unlocked: false,
      type: 'sleep',
      condition: 7,
      category: 'health',
      rarity: 'rare'
    },
    {
      id: 'hydration_master',
      title: 'Мастер гидратации',
      description: '5 дней подряд пили 2+ литра воды',
      icon: '🏆',
      unlocked: false,
      type: 'water',
      condition: 5,
      category: 'health',
      rarity: 'rare'
    },
    {
      id: 'sleep_expert',
      title: 'Эксперт сна',
      description: '100 часов качественного сна',
      icon: '😴',
      unlocked: false,
      type: 'sleep',
      condition: 100,
      category: 'health',
      rarity: 'epic'
    },
    {
      id: 'water_expert',
      title: 'Водный эксперт',
      description: 'Выпили 100 литров воды',
      icon: '🌊',
      unlocked: false,
      type: 'water',
      condition: 100,
      category: 'health',
      rarity: 'epic'
    },
    {
      id: 'sleep_marathon',
      title: 'Марафон сна',
      description: '30 дней подряд с отслеживанием сна',
      icon: '🌛',
      unlocked: false,
      type: 'sleep',
      condition: 30,
      category: 'health',
      rarity: 'legendary'
    },

    // === ФИТНЕС ===
    {
      id: 'first_workout',
      title: 'Спортивный старт',
      description: 'Завершили первую тренировку',
      icon: '💪',
      unlocked: false,
      type: 'workout',
      condition: 1,
      category: 'fitness',
      rarity: 'common'
    },
    {
      id: 'weekly_goal',
      title: 'Активная неделя',
      description: 'Выполнили недельную норму тренировок (150 минут)',
      icon: '🚀',
      unlocked: false,
      type: 'workout',
      condition: 150,
      category: 'fitness',
      rarity: 'common'
    },
    {
      id: 'marathon',
      title: 'Марафонец',
      description: 'Пробежали 50+ км в сумме',
      icon: '🏃‍♂️',
      unlocked: false,
      type: 'workout',
      condition: 50,
      category: 'fitness',
      rarity: 'rare'
    },
    {
      id: 'streak_7',
      title: 'Непрерывность',
      description: '7 дней подряд с тренировками',
      icon: '🔥',
      unlocked: false,
      type: 'workout',
      condition: 7,
      category: 'fitness',
      rarity: 'rare'
    },
    {
      id: 'iron_man',
      title: 'Железный человек',
      description: '10 различных типов тренировок',
      icon: '🦾',
      unlocked: false,
      type: 'workout',
      condition: 10,
      category: 'fitness',
      rarity: 'epic'
    },
    {
      id: 'fitness_pro',
      title: 'Фитнес-профи',
      description: '100 тренировок завершено',
      icon: '🏅',
      unlocked: false,
      type: 'workout',
      condition: 100,
      category: 'fitness',
      rarity: 'epic'
    },
    {
      id: 'early_bird',
      title: 'Ранняя пташка',
      description: 'Тренировка до 7 утра',
      icon: '🌅',
      unlocked: false,
      type: 'workout',
      condition: 1,
      category: 'fitness',
      rarity: 'rare'
    },
    {
      id: 'night_owl',
      title: 'Ночная сова',
      description: 'Тренировка после 10 вечера',
      icon: '🌃',
      unlocked: false,
      type: 'workout',
      condition: 1,
      category: 'fitness',
      rarity: 'rare'
    },

    // === РАЗУМ И НАСТРОЕНИЕ ===
    {
      id: 'first_mood',
      title: 'Эмоциональный старт',
      description: 'Впервые записали настроение',
      icon: '😊',
      unlocked: false,
      type: 'mood',
      condition: 1,
      category: 'mind',
      rarity: 'common'
    },
    {
      id: 'positive_week',
      title: 'Позитивная неделя',
      description: '7 дней подряд с настроением 4+ из 5',
      icon: '🌈',
      unlocked: false,
      type: 'mood',
      condition: 7,
      category: 'mind',
      rarity: 'rare'
    },
    {
      id: 'mindful_month',
      title: 'Осознанный месяц',
      description: '30 дней отслеживания настроения',
      icon: '🧠',
      unlocked: false,
      type: 'mood',
      condition: 30,
      category: 'mind',
      rarity: 'epic'
    },
    {
      id: 'happy_day',
      title: 'День счастья',
      description: 'Настроение 5/5 весь день',
      icon: '😍',
      unlocked: false,
      type: 'mood',
      condition: 5,
      category: 'mind',
      rarity: 'common'
    },
    {
      id: 'emotional_explorer',
      title: 'Исследователь эмоций',
      description: 'Использовали все 5 уровней настроения',
      icon: '🎭',
      unlocked: false,
      type: 'mood',
      condition: 5,
      category: 'mind',
      rarity: 'rare'
    },
    {
      id: 'zen_master',
      title: 'Мастер дзен',
      description: '50 дней медитации/йоги',
      icon: '☯️',
      unlocked: false,
      type: 'workout',
      condition: 50,
      category: 'mind',
      rarity: 'epic'
    },
    {
  id: 'first_nutrition',
  title: 'Пищевой детектив',
  description: 'Впервые записали прием пищи',
  icon: '🍽️',
  unlocked: false,
  type: 'nutrition',
  condition: 1,
  category: 'health',
  rarity: 'common'
},
{
  id: 'balanced_day',
  title: 'Сбалансированный день',
  description: 'Потребление калорий в пределах цели ±10%',
  icon: '⚖️',
  unlocked: false,
  type: 'nutrition',
  condition: 1,
  category: 'health',
  rarity: 'rare'
},
{
  id: 'protein_pro',
  title: 'Белковый профи',
  description: '7 дней подряд выполняли норму по белкам',
  icon: '🥩',
  unlocked: false,
  type: 'nutrition',
  condition: 7,
  category: 'health',
  rarity: 'epic'
},
{
  id: 'meal_prep_master',
  title: 'Мастер приготовления',
  description: 'Записали 100 различных продуктов',
  icon: '👨‍🍳',
  unlocked: false,
  type: 'nutrition',
  condition: 100,
  category: 'health',
  rarity: 'legendary'
},

    

    // === ПРЕДАННОСТЬ И СТРИКИ ===
    {
      id: 'week_streak',
      title: 'Неделя привычки',
      description: '7 дней подряд использования приложения',
      icon: '📅',
      unlocked: false,
      type: 'streak',
      condition: 7,
      category: 'dedication',
      rarity: 'common'
    },
    {
      id: 'month_streak',
      title: 'Месяц привычки',
      description: '30 дней подряд использования приложения',
      icon: '📆',
      unlocked: false,
      type: 'streak',
      condition: 30,
      category: 'dedication',
      rarity: 'rare'
    },
    {
      id: 'triple_streak',
      title: 'Тройная угроза',
      description: 'Треккинг сна, воды и настроения 7 дней подряд',
      icon: '🎯',
      unlocked: false,
      type: 'streak',
      condition: 7,
      category: 'dedication',
      rarity: 'epic'
    },
    {
      id: 'perfect_day',
      title: 'Идеальный день',
      description: 'Сон 8ч + вода 2л + тренировка + настроение 4+',
      icon: '👑',
      unlocked: false,
      type: 'streak',
      condition: 1,
      category: 'dedication',
      rarity: 'legendary'
    },
    {
      id: 'health_guru',
      title: 'Гуру здоровья',
      description: '100 дней использования приложения',
      icon: '🎓',
      unlocked: false,
      type: 'streak',
      condition: 100,
      category: 'dedication',
      rarity: 'legendary'
    },

    // === ОСОБЫЕ ДОСТИЖЕНИЯ ===
    {
      id: 'first_achievement',
      title: 'Первое достижение',
      description: 'Получили первое достижение',
      icon: '🎉',
      unlocked: false,
      type: 'milestone',
      condition: 1,
      category: 'special',
      rarity: 'common'
    },
    {
      id: 'halfway_there',
      title: 'На полпути',
      description: 'Разблокировали 50% достижений',
      icon: '🎪',
      unlocked: false,
      type: 'milestone',
      condition: 50,
      category: 'special',
      rarity: 'epic'
    },
    {
      id: 'completionist',
      title: 'Завершитель',
      description: 'Разблокировали все достижения',
      icon: '🏆',
      unlocked: false,
      type: 'milestone',
      condition: 100,
      category: 'special',
      rarity: 'legendary'
    },
    {
      id: 'weekend_warrior',
      title: 'Воитель выходного дня',
      description: 'Тренировки только по выходным 4 недели подряд',
      icon: '🎪',
      unlocked: false,
      type: 'workout',
      condition: 4,
      category: 'special',
      rarity: 'rare'
    },
    {
      id: 'four_seasons',
      title: 'Четыре сезона',
      description: 'Использование приложения 90 дней подряд',
      icon: '🍂',
      unlocked: false,
      type: 'streak',
      condition: 90,
      category: 'special',
      rarity: 'legendary'
    },
    {
      id: 'early_adopter',
      title: 'Ранний последователь',
      description: 'Использование приложения с первого дня',
      icon: '🚀',
      unlocked: false,
      type: 'milestone',
      condition: 1,
      category: 'special',
      rarity: 'legendary'
    }
  ];

  // Загрузка достижений из AsyncStorage
  async loadAchievements(): Promise<Achievement[]> {
    try {
      // Здесь будет код для загрузки из AsyncStorage
      // Пока возвращаем дефолтные значения
      return [...this.achievements];
    } catch (error) {
      console.error('Error loading achievements:', error);
      return [...this.achievements];
    }
  }

  // Сохранение достижений в AsyncStorage
  async saveAchievements(achievements: Achievement[]): Promise<void> {
    try {
      this.achievements = achievements;
      // Здесь будет код для сохранения в AsyncStorage
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  }

  // Проверка и разблокировка достижений

  checkSleepAchievement(sleepHours: number, totalSleepHours: number, sleepDays: number, achievements: Achievement[]): Achievement[] {
    return achievements.map(achievement => {
      if (achievement.type === 'sleep' && !achievement.unlocked) {
        let shouldUnlock = false;
        
        switch (achievement.id) {
          case 'first_sleep':
            shouldUnlock = sleepHours >= achievement.condition;
            break;
          case 'perfect_week_sleep':
            shouldUnlock = sleepDays >= achievement.condition;
            break;
          case 'sleep_expert':
            shouldUnlock = totalSleepHours >= achievement.condition;
            break;
          default:
            shouldUnlock = false;
        }
        
        if (shouldUnlock) {
          return {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date()
          };
        }
      }
      return achievement;
    });
  }

  checkWaterAchievement(waterAmount: number, totalWater: number, waterDays: number, achievements: Achievement[]): Achievement[] {
    return achievements.map(achievement => {
      if (achievement.type === 'water' && !achievement.unlocked) {
        let shouldUnlock = false;
        
        switch (achievement.id) {
          case 'first_water':
            shouldUnlock = waterAmount >= achievement.condition;
            break;
          case 'hydration_master':
            shouldUnlock = waterDays >= achievement.condition;
            break;
          case 'water_expert':
            shouldUnlock = totalWater >= achievement.condition;
            break;
          default:
            shouldUnlock = false;
        }
        
        if (shouldUnlock) {
          return {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date()
          };
        }
      }
      return achievement;
    });
  }

  checkMoodAchievement(moodLevel: number, moodDays: number, totalMoodEntries: number, achievements: Achievement[]): Achievement[] {
    return achievements.map(achievement => {
      if (achievement.type === 'mood' && !achievement.unlocked) {
        let shouldUnlock = false;
        
        switch (achievement.id) {
          case 'first_mood':
            shouldUnlock = moodLevel > 0;
            break;
          case 'happy_day':
            shouldUnlock = moodLevel >= achievement.condition;
            break;
          case 'positive_week':
            shouldUnlock = moodDays >= achievement.condition;
            break;
          case 'mindful_month':
            shouldUnlock = totalMoodEntries >= achievement.condition;
            break;
          default:
            shouldUnlock = false;
        }
        
        if (shouldUnlock) {
          return {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date()
          };
        }
      }
      return achievement;
    });
  }

  checkWorkoutAchievement(totalWorkouts: number, weeklyMinutes: number, workoutTypes: number, achievements: Achievement[]): Achievement[] {
    return achievements.map(achievement => {
      if (achievement.type === 'workout' && !achievement.unlocked) {
        let shouldUnlock = false;
        
        switch (achievement.id) {
          case 'first_workout':
            shouldUnlock = totalWorkouts >= achievement.condition;
            break;
          case 'weekly_goal':
            shouldUnlock = weeklyMinutes >= achievement.condition;
            break;
          case 'fitness_pro':
            shouldUnlock = totalWorkouts >= achievement.condition;
            break;
          case 'iron_man':
            shouldUnlock = workoutTypes >= achievement.condition;
            break;
          default:
            shouldUnlock = false;
        }
        
        if (shouldUnlock) {
          return {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date()
          };
        }
      }
      return achievement;
    });
  }

  checkStreakAchievement(appDays: number, tripleStreakDays: number, achievements: Achievement[]): Achievement[] {
    return achievements.map(achievement => {
      if (achievement.type === 'streak' && !achievement.unlocked) {
        let shouldUnlock = false;
        
        switch (achievement.id) {
          case 'week_streak':
            shouldUnlock = appDays >= achievement.condition;
            break;
          case 'month_streak':
            shouldUnlock = appDays >= achievement.condition;
            break;
          case 'triple_streak':
            shouldUnlock = tripleStreakDays >= achievement.condition;
            break;
          case 'health_guru':
            shouldUnlock = appDays >= achievement.condition;
            break;
          default:
            shouldUnlock = false;
        }
        
        if (shouldUnlock) {
          return {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date()
          };
        }
      }
      return achievement;
    });
  }

  checkMilestoneAchievement(unlockedCount: number, totalCount: number, achievements: Achievement[]): Achievement[] {
    return achievements.map(achievement => {
      if (achievement.type === 'milestone' && !achievement.unlocked) {
        let shouldUnlock = false;
        
        switch (achievement.id) {
          case 'first_achievement':
            shouldUnlock = unlockedCount >= achievement.condition;
            break;
          case 'halfway_there':
            const progress = (unlockedCount / totalCount) * 100;
            shouldUnlock = progress >= achievement.condition;
            break;
          case 'completionist':
            shouldUnlock = unlockedCount >= totalCount;
            break;
          default:
            shouldUnlock = false;
        }
        
        if (shouldUnlock) {
          return {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date()
          };
        }
      }
      return achievement;
    });
  }

  getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  // Получить достижения по категории
  getAchievementsByCategory(category: string): Achievement[] {
    return this.achievements.filter(achievement => achievement.category === category);
  }

  // Получить достижения по редкости
  getAchievementsByRarity(rarity: string): Achievement[] {
    return this.achievements.filter(achievement => achievement.rarity === rarity);
  }

  // Получить цвет редкости
  getRarityColor(rarity: string): string {
    switch (rarity) {
      case 'common': return '#6B7280';
      case 'rare': return '#3B82F6';
      case 'epic': return '#8B5CF6';
      case 'legendary': return '#F59E0B';
      default: return '#6B7280';
    }
  }

  // Получить название редкости на русском
  getRarityName(rarity: string): string {
    switch (rarity) {
      case 'common': return 'Обычное';
      case 'rare': return 'Редкое';
      case 'epic': return 'Эпическое';
      case 'legendary': return 'Легендарное';
      default: return 'Обычное';
    }
  }

  // Сброс всех достижений (для тестирования)
  async resetAchievements(): Promise<Achievement[]> {
    const resetAchievements = this.achievements.map(achievement => ({
      ...achievement,
      unlocked: false,
      unlockedAt: undefined
    }));
    await this.saveAchievements(resetAchievements);
    return resetAchievements;
  }
}

export const achievementsService = new AchievementsService();