// services/achievements-service.ts
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  type: 'sleep' | 'water' | 'mood' | 'workout';
  condition: number;
  category: 'health' | 'fitness' | 'mind';
}

class AchievementsService {
  private achievements: Achievement[] = [
    // Здоровье
    {
      id: 'first_sleep',
      title: 'Хороший сон',
      description: 'Впервые проспали 8 часов',
      icon: '🌙',
      unlocked: false,
      type: 'sleep',
      condition: 8,
      category: 'health'
    },
    {
      id: 'first_water',
      title: 'Водохлёб',
      description: 'Впервые выпили 2 литра воды за день',
      icon: '💧',
      unlocked: false,
      type: 'water',
      condition: 2000,
      category: 'health'
    },
    {
      id: 'perfect_week_sleep',
      title: 'Высыпающаяся неделя',
      description: '7 дней подряд спали 7+ часов',
      icon: '⭐',
      unlocked: false,
      type: 'sleep',
      condition: 7,
      category: 'health'
    },
    {
      id: 'hydration_master',
      title: 'Мастер гидратации',
      description: '5 дней подряд пили 2+ литра воды',
      icon: '🏆',
      unlocked: false,
      type: 'water',
      condition: 5,
      category: 'health'
    },

    // Фитнес
    {
      id: 'first_workout',
      title: 'Спортивный старт',
      description: 'Завершили первую тренировку',
      icon: '💪',
      unlocked: false,
      type: 'workout',
      condition: 1,
      category: 'fitness'
    },
    {
      id: 'weekly_goal',
      title: 'Активная неделя',
      description: 'Выполнили недельную норму тренировок (150 минут)',
      icon: '🚀',
      unlocked: false,
      type: 'workout',
      condition: 150,
      category: 'fitness'
    },
    {
      id: 'marathon',
      title: 'Марафонец',
      description: 'Пробежали 50+ км в сумме',
      icon: '🏃‍♂️',
      unlocked: false,
      type: 'workout',
      condition: 50,
      category: 'fitness'
    },
    {
      id: 'streak_7',
      title: 'Непрерывность',
      description: '7 дней подряд с тренировками',
      icon: '🔥',
      unlocked: false,
      type: 'workout',
      condition: 7,
      category: 'fitness'
    },

    // Ментальное здоровье
    {
      id: 'first_mood',
      title: 'Эмоциональный старт',
      description: 'Впервые записали настроение',
      icon: '😊',
      unlocked: false,
      type: 'mood',
      condition: 1,
      category: 'mind'
    },
    {
      id: 'positive_week',
      title: 'Позитивная неделя',
      description: '7 дней подряд с настроением 4+ из 5',
      icon: '🌈',
      unlocked: false,
      type: 'mood',
      condition: 7,
      category: 'mind'
    },
    {
      id: 'mindful_month',
      title: 'Осознанный месяц',
      description: '30 дней отслеживания настроения',
      icon: '🧠',
      unlocked: false,
      type: 'mood',
      condition: 30,
      category: 'mind'
    },
    {
      id: 'happy_day',
      title: 'День счастья',
      description: 'Настроение 5/5 весь день',
      icon: '😍',
      unlocked: false,
      type: 'mood',
      condition: 5,
      category: 'mind'
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
  checkSleepAchievement(sleepHours: number, achievements: Achievement[]): Achievement[] {
    return achievements.map(achievement => {
      if (achievement.type === 'sleep' && !achievement.unlocked && sleepHours >= achievement.condition) {
        return {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date()
        };
      }
      return achievement;
    });
  }

  checkWaterAchievement(waterAmount: number, achievements: Achievement[]): Achievement[] {
    return achievements.map(achievement => {
      if (achievement.type === 'water' && !achievement.unlocked && waterAmount >= achievement.condition) {
        return {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date()
        };
      }
      return achievement;
    });
  }

  checkMoodAchievement(achievements: Achievement[]): Achievement[] {
    return achievements.map(achievement => {
      if (achievement.type === 'mood' && achievement.id === 'first_mood' && !achievement.unlocked) {
        return {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date()
        };
      }
      return achievement;
    });
  }

  checkWorkoutAchievement(totalWorkouts: number, weeklyMinutes: number, achievements: Achievement[]): Achievement[] {
    return achievements.map(achievement => {
      if (achievement.type === 'workout') {
        if (achievement.id === 'first_workout' && !achievement.unlocked && totalWorkouts >= achievement.condition) {
          return {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date()
          };
        }
        if (achievement.id === 'weekly_goal' && !achievement.unlocked && weeklyMinutes >= achievement.condition) {
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