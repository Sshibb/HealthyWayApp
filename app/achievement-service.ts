// ../achievement-service.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Achievement {
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

export interface ActivityData {
  water?: {
    amount: number;
    date: Date;
  };
  sleep?: {
    duration: number;
    date: Date;
  };
  sport?: {
    duration: number;
    date: Date;
  };
  mood?: {
    level: number;
    date: Date;
  };
}

class AchievementService {
  private achievements: Achievement[] = [];
  private readonly STORAGE_KEY = 'achievements_data';

  // Инициализация достижений
  initializeAchievements(): Achievement[] {
    return [
      // Вода
      {
        id: 'water-1',
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
        id: 'water-2',
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
        id: 'water-3',
        title: 'Гидратация',
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
        id: 'sleep-1',
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
        id: 'sleep-2',
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

      // Спорт
      {
        id: 'sport-1',
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
        id: 'sport-2',
        title: 'Активная неделя',
        description: 'Занимайтесь спортом 3 дня в неделю',
        icon: '💪',
        category: 'sport',
        requirement: '3 тренировки за неделю',
        progress: 0,
        target: 3,
        completed: false,
        rarity: 'rare',
      },

      // Настроение
      {
        id: 'mood-1',
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
    ];
  }

  // Загрузка достижений из хранилища
  async loadAchievements(): Promise<Achievement[]> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.achievements = JSON.parse(stored);
      } else {
        this.achievements = this.initializeAchievements();
        await this.saveAchievements();
      }
      return this.achievements;
    } catch (error) {
      console.error('Error loading achievements:', error);
      this.achievements = this.initializeAchievements();
      return this.achievements;
    }
  }

  // Сохранение достижений
  async saveAchievements(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.achievements));
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  }

  // Обновление прогресса достижений на основе активности
  async updateProgress(activityData: ActivityData): Promise<{updated: Achievement[], unlocked: Achievement[]}> {
    const updated: Achievement[] = [];
    const unlocked: Achievement[] = [];

    for (const achievement of this.achievements) {
      const oldProgress = achievement.progress;
      const wasCompleted = achievement.completed;

      // Обновляем прогресс в зависимости от категории
      switch (achievement.category) {
        case 'water':
          if (activityData.water) {
            achievement.progress += activityData.water.amount;
          }
          break;

        case 'sleep':
          if (activityData.sleep) {
            if (achievement.id === 'sleep-1') {
              achievement.progress = 1; // Просто запись сна
            } else if (achievement.id === 'sleep-2' && activityData.sleep.duration >= 8) {
              achievement.progress = Math.max(achievement.progress, activityData.sleep.duration);
            }
          }
          break;

        case 'sport':
          if (activityData.sport) {
            if (achievement.id === 'sport-1') {
              achievement.progress = 1; // Просто факт тренировки
            } else if (achievement.id === 'sport-2') {
              achievement.progress += 1; // Количество тренировок
            }
          }
          break;

        case 'mood':
          if (activityData.mood) {
            achievement.progress = 1; // Просто запись настроения
          }
          break;
      }

      // Проверяем завершение
      if (!wasCompleted && achievement.progress >= achievement.target) {
        achievement.completed = true;
        achievement.dateCompleted = new Date();
        unlocked.push(achievement);
      }

      if (oldProgress !== achievement.progress) {
        updated.push(achievement);
      }
    }

    if (updated.length > 0) {
      await this.saveAchievements();
    }

    return { updated, unlocked };
  }

  // Получение всех достижений
  getAchievements(): Achievement[] {
    return this.achievements;
  }

  // Сброс прогресса (для тестирования)
  async resetProgress(): Promise<void> {
    this.achievements = this.initializeAchievements();
    await this.saveAchievements();
  }
}

export const achievementService = new AchievementService();