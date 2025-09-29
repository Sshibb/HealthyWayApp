import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { achievementsService } from './achievements-service';
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';

// Типы
interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
  category: string;
}

interface MealLog {
  id: string;
  foodItems: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: Date;
}

interface DailyNutrition {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  goalCalories: number;
  goalProtein: number;
  goalCarbs: number;
  goalFat: number;
}

// База продуктов
const DEFAULT_FOOD_ITEMS: FoodItem[] = [
  // Завтраки
  {
    id: '1',
    name: 'Овсяная каша',
    calories: 150,
    protein: 5,
    carbs: 27,
    fat: 3,
    portion: '100г',
    category: 'breakfast'
  },
  {
    id: '2',
    name: 'Яичница',
    calories: 200,
    protein: 13,
    carbs: 1,
    fat: 15,
    portion: '2 яйца',
    category: 'breakfast'
  },
  {
    id: '3',
    name: 'Творог',
    calories: 120,
    protein: 18,
    carbs: 4,
    fat: 2,
    portion: '100г',
    category: 'breakfast'
  },

  // Обеды
  {
    id: '4',
    name: 'Куриная грудка',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 4,
    portion: '100г',
    category: 'lunch'
  },
  {
    id: '5',
    name: 'Гречка',
    calories: 130,
    protein: 5,
    carbs: 25,
    fat: 1,
    portion: '100г',
    category: 'lunch'
  },
  {
    id: '6',
    name: 'Овощной салат',
    calories: 80,
    protein: 2,
    carbs: 12,
    fat: 3,
    portion: '150г',
    category: 'lunch'
  },

  // Ужины
  {
    id: '7',
    name: 'Лосось',
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    portion: '100г',
    category: 'dinner'
  },
  {
    id: '8',
    name: 'Брокколи',
    calories: 55,
    protein: 4,
    carbs: 11,
    fat: 1,
    portion: '100г',
    category: 'dinner'
  },
  {
    id: '9',
    name: 'Киноа',
    calories: 120,
    protein: 4,
    carbs: 21,
    fat: 2,
    portion: '100г',
    category: 'dinner'
  },

  // Перекусы
  {
    id: '10',
    name: 'Яблоко',
    calories: 52,
    protein: 0,
    carbs: 14,
    fat: 0,
    portion: '1 шт',
    category: 'snack'
  },
  {
    id: '11',
    name: 'Банан',
    calories: 89,
    protein: 1,
    carbs: 23,
    fat: 0,
    portion: '1 шт',
    category: 'snack'
  },
  {
    id: '12',
    name: 'Йогурт греческий',
    calories: 130,
    protein: 11,
    carbs: 8,
    fat: 5,
    portion: '150г',
    category: 'snack'
  },
  {
    id: '13',
    name: 'Орехи грецкие',
    calories: 185,
    protein: 4,
    carbs: 4,
    fat: 18,
    portion: '30г',
    category: 'snack'
  },
  {
    id: '14',
    name: 'Протеиновый батончик',
    calories: 200,
    protein: 20,
    carbs: 15,
    fat: 8,
    portion: '1 шт',
    category: 'snack'
  }
];

const Nutrition: React.FC = () => {
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>(DEFAULT_FOOD_ITEMS);
  const [dailyGoal, setDailyGoal] = useState<DailyNutrition>({
    date: new Date().toISOString().split('T')[0],
    calories: 2000,
    protein: 120,
    carbs: 250,
    fat: 70,
    goalCalories: 2000,
    goalProtein: 120,
    goalCarbs: 250,
    goalFat: 70
  });

  // Модальные окна
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  
  // Данные для форм
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [selectedFoodItems, setSelectedFoodItems] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Данные для кастомной еды
  const [customFoodName, setCustomFoodName] = useState('');
  const [customFoodCalories, setCustomFoodCalories] = useState('');
  const [customFoodProtein, setCustomFoodProtein] = useState('');
  const [customFoodCarbs, setCustomFoodCarbs] = useState('');
  const [customFoodFat, setCustomFoodFat] = useState('');
  const [customFoodPortion, setCustomFoodPortion] = useState('100г');

  // Данные для целей
  const [goalCalories, setGoalCalories] = useState('2000');
  const [goalProtein, setGoalProtein] = useState('120');
  const [goalCarbs, setGoalCarbs] = useState('250');
  const [goalFat, setGoalFat] = useState('70');

  // Сканер штрих-кодов
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [scannedProducts, setScannedProducts] = useState<{[barcode: string]: FoodItem}>({});

  // Фильтрация продуктов
  const filteredFoodItems = foodItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Расчет сегодняшнего потребления
  const todayLogs = mealLogs.filter(log => 
    new Date(log.timestamp).toDateString() === new Date().toDateString()
  );

  const todayNutrition = todayLogs.reduce((acc, log) => ({
    calories: acc.calories + log.totalCalories,
    protein: acc.protein + log.totalProtein,
    carbs: acc.carbs + log.totalCarbs,
    fat: acc.fat + log.totalFat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const caloriesProgress = Math.min((todayNutrition.calories / dailyGoal.goalCalories) * 100, 100);
  const proteinProgress = Math.min((todayNutrition.protein / dailyGoal.goalProtein) * 100, 100);
  const carbsProgress = Math.min((todayNutrition.carbs / dailyGoal.goalCarbs) * 100, 100);
  const fatProgress = Math.min((todayNutrition.fat / dailyGoal.goalFat) * 100, 100);

  // Функция для получения информации о продукте по штрих-коду
  const fetchProductByBarcode = async (barcode: string) => {
    setLoadingProduct(true);
    try {
      // Используем Open Food Facts API
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();

      if (data.status === 1 && data.product) {
        const product = data.product;
        
        // Извлекаем данные о питательной ценности
        const nutriments = product.nutriments || {};
        
        return {
          name: product.product_name || 'Неизвестный продукт',
          calories: Math.round(nutriments['energy-kcal'] || nutriments.energy || 0),
          protein: Math.round(nutriments.proteins || 0),
          carbs: Math.round(nutriments.carbohydrates || 0),
          fat: Math.round(nutriments.fat || 0),
          portion: '100г',
          brand: product.brands || '',
          image: product.image_url || ''
        };
      } else {
        throw new Error('Продукт не найден в базе данных');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      
      // Если не нашли в базе, создаем базовый продукт
      return {
        name: `Продукт ${barcode}`,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        portion: '100г',
        brand: '',
        image: ''
      };
    } finally {
      setLoadingProduct(false);
    }
  };

  // Обработка сканирования штрих-кода
  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    
    try {
      // Проверяем кэш
      if (scannedProducts[data]) {
        const cachedProduct = scannedProducts[data];
        showProductAlert(cachedProduct, data);
        return;
      }

      const productInfo = await fetchProductByBarcode(data);
      
      const newFood: FoodItem = {
        id: `barcode_${Date.now()}`,
        name: productInfo.name,
        calories: productInfo.calories,
        protein: productInfo.protein,
        carbs: productInfo.carbs,
        fat: productInfo.fat,
        portion: productInfo.portion,
        category: 'scanned'
      };

      // Сохраняем в кэш
      setScannedProducts(prev => ({
        ...prev,
        [data]: newFood
      }));

      // Добавляем продукт в общий список
      setFoodItems(prev => [...prev, newFood]);
      
      showProductAlert(newFood, data);
      
    } catch (error) {
      Alert.alert(
        'Продукт не найден',
        'Хотите добавить его вручную?',
        [
          {
            text: 'Добавить вручную',
            onPress: () => {
              setCustomFoodName(`Продукт ${data}`);
              setCustomFoodCalories('');
              setCustomFoodProtein('');
              setCustomFoodCarbs('');
              setCustomFoodFat('');
              setCustomFoodPortion('100г');
              setScannerVisible(false);
              setShowAddFoodModal(true);
            }
          },
          {
            text: 'Отмена',
            style: 'cancel',
            onPress: () => setScannerVisible(false)
          }
        ]
      );
    }
  };

  // Показать алерт с информацией о продукте
  const showProductAlert = (product: FoodItem, barcode: string) => {
    Alert.alert(
      '✅ Продукт найден!',
      `${product.name}\n\nПищевая ценность на 100г:\n• Калории: ${product.calories} ккал\n• Белки: ${product.protein}г\n• Углеводы: ${product.carbs}г\n• Жиры: ${product.fat}г`,
      [
        {
          text: 'Добавить в прием пищи',
          onPress: () => {
            addFoodToMeal(product);
            setScannerVisible(false);
          }
        },
        {
          text: 'Изменить данные',
          onPress: () => {
            setCustomFoodName(product.name);
            setCustomFoodCalories(product.calories.toString());
            setCustomFoodProtein(product.protein.toString());
            setCustomFoodCarbs(product.carbs.toString());
            setCustomFoodFat(product.fat.toString());
            setCustomFoodPortion(product.portion);
            setScannerVisible(false);
            setShowAddFoodModal(true);
          }
        },
        {
          text: 'Просто добавить в базу',
          onPress: () => setScannerVisible(false)
        }
      ]
    );
  };

  // Открытие сканера
  const openScanner = async () => {
  const { status } = await Camera.requestCameraPermissionsAsync(); // ← Camera, а не CameraView
  if (status === 'granted') {
    setScannerVisible(true);
    setScanned(false);
  } else {
    Alert.alert('Ошибка', 'Необходимо разрешение на использование камеры');
  }
};

  // Добавить кастомный продукт
  const addCustomFood = () => {
    if (!customFoodName.trim()) {
      Alert.alert('Ошибка', 'Введите название продукта');
      return;
    }

    const newFood: FoodItem = {
      id: `custom_${Date.now()}`,
      name: customFoodName.trim(),
      calories: parseInt(customFoodCalories) || 0,
      protein: parseInt(customFoodProtein) || 0,
      carbs: parseInt(customFoodCarbs) || 0,
      fat: parseInt(customFoodFat) || 0,
      portion: customFoodPortion,
      category: 'custom'
    };

    setFoodItems(prev => [...prev, newFood]);
    setShowAddFoodModal(false);
    resetCustomFoodForm();
    
    Alert.alert('✅ Успешно', `Продукт "${customFoodName}" добавлен!`);
  };

  const resetCustomFoodForm = () => {
    setCustomFoodName('');
    setCustomFoodCalories('');
    setCustomFoodProtein('');
    setCustomFoodCarbs('');
    setCustomFoodFat('');
    setCustomFoodPortion('100г');
  };

  // Установить новые цели
  const setNewGoals = () => {
    const newGoalCalories = parseInt(goalCalories);
    const newGoalProtein = parseInt(goalProtein);
    const newGoalCarbs = parseInt(goalCarbs);
    const newGoalFat = parseInt(goalFat);

    if (newGoalCalories && newGoalCalories > 0) {
      setDailyGoal(prev => ({
        ...prev,
        goalCalories: newGoalCalories,
        goalProtein: newGoalProtein,
        goalCarbs: newGoalCarbs,
        goalFat: newGoalFat
      }));
      setShowGoalModal(false);
      Alert.alert('✅ Цели обновлены', 'Новые цели по питанию установлены');
    } else {
      Alert.alert('Ошибка', 'Введите корректные значения');
    }
  };

  // Добавить продукт в текущий прием пищи
  const addFoodToMeal = (food: FoodItem) => {
    setSelectedFoodItems(prev => [...prev, food]);
  };

  // Удалить продукт из текущего приема пищи
  const removeFoodFromMeal = (foodId: string) => {
    setSelectedFoodItems(prev => prev.filter(item => item.id !== foodId));
  };

  // Сохранить прием пищи
  const saveMeal = async () => {
    if (selectedFoodItems.length === 0) {
      Alert.alert('Ошибка', 'Добавьте хотя бы один продукт');
      return;
    }

    const totalCalories = selectedFoodItems.reduce((sum, item) => sum + item.calories, 0);
    const totalProtein = selectedFoodItems.reduce((sum, item) => sum + item.protein, 0);
    const totalCarbs = selectedFoodItems.reduce((sum, item) => sum + item.carbs, 0);
    const totalFat = selectedFoodItems.reduce((sum, item) => sum + item.fat, 0);

    const newMeal: MealLog = {
      id: Date.now().toString(),
      foodItems: [...selectedFoodItems],
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      mealType: selectedMealType,
      timestamp: new Date()
    };

    setMealLogs(prev => [newMeal, ...prev]);
    setSelectedFoodItems([]);
    setShowMealModal(false);

    // Проверка достижений
    try {
      const currentAchievements = await achievementsService.loadAchievements();
      
      // Проверка первой записи питания
      if (mealLogs.length === 0) {
        const updatedAchievements = currentAchievements.map(achievement => {
          if (achievement.id === 'first_nutrition' && !achievement.unlocked) {
            return {
              ...achievement,
              unlocked: true,
              unlockedAt: new Date()
            };
          }
          return achievement;
        });
        await achievementsService.saveAchievements(updatedAchievements);
        
        const nutritionAchievement = updatedAchievements.find(a => a.id === 'first_nutrition' && a.unlocked);
        if (nutritionAchievement) {
          Alert.alert(
            '🎉 Поздравляем!', 
            'Вы получили достижение "Пищевой детектив"!\n\nВпервые записали прием пищи',
            [{ text: 'Отлично!', style: 'default' }]
          );
        }
      }

      // Проверка сбалансированного дня
      const todayTotalCalories = todayNutrition.calories + totalCalories;
      if (todayTotalCalories >= dailyGoal.goalCalories * 0.9 && todayTotalCalories <= dailyGoal.goalCalories * 1.1) {
        const updatedAchievements = currentAchievements.map(achievement => {
          if (achievement.id === 'balanced_day' && !achievement.unlocked) {
            return {
              ...achievement,
              unlocked: true,
              unlockedAt: new Date()
            };
          }
          return achievement;
        });
        await achievementsService.saveAchievements(updatedAchievements);
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }

    Alert.alert('✅ Успешно', `Прием пищи "${getMealTypeName(selectedMealType)}" записан!\n${totalCalories} ккал`);
  };

  // Удалить прием пищи
  const deleteMeal = (mealId: string) => {
    Alert.alert(
      'Удалить прием пищи?',
      'Вы уверены, что хотите удалить эту запись?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => setMealLogs(prev => prev.filter(meal => meal.id !== mealId)),
        },
      ]
    );
  };

  // Вспомогательные функции
  const getMealTypeName = (type: string) => {
    const names = {
      breakfast: 'Завтрак',
      lunch: 'Обед',
      dinner: 'Ужин',
      snack: 'Перекус'
    };
    return names[type as keyof typeof names] || type;
  };

  const getMealTypeIcon = (type: string) => {
    const icons = {
      breakfast: '☀️',
      lunch: '🍽️',
      dinner: '🌙',
      snack: '🍎'
    };
    return icons[type as keyof typeof icons] || '🍴';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return '#f44336';
    if (progress >= 90) return '#FF9800';
    return '#4CAF50';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Ionicons name="nutrition" size={36} color="#4CAF50" />
          <Text style={styles.title}>Питание</Text>
        </View>

        {/* Дневной прогресс */}
        <View style={styles.dailyProgress}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Сегодня</Text>
            <TouchableOpacity 
              style={styles.editGoalButton}
              onPress={() => {
                setGoalCalories(dailyGoal.goalCalories.toString());
                setGoalProtein(dailyGoal.goalProtein.toString());
                setGoalCarbs(dailyGoal.goalCarbs.toString());
                setGoalFat(dailyGoal.goalFat.toString());
                setShowGoalModal(true);
              }}
            >
              <Ionicons name="create-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Калории */}
          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <Text style={styles.macroName}>Калории</Text>
              <Text style={styles.macroValue}>
                {todayNutrition.calories} / {dailyGoal.goalCalories} ккал
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${caloriesProgress}%`,
                    backgroundColor: getProgressColor(caloriesProgress)
                  }
                ]} 
              />
            </View>
          </View>

          {/* БЖУ */}
          <View style={styles.macrosGrid}>
            <View style={styles.macroCard}>
              <Text style={[styles.macroAmount, { color: '#2196F3' }]}>
                {todayNutrition.protein}g
              </Text>
              <Text style={styles.macroLabel}>Белки</Text>
              <View style={styles.miniProgress}>
                <View 
                  style={[
                    styles.miniProgressFill,
                    { width: `${proteinProgress}%`, backgroundColor: '#2196F3' }
                  ]} 
                />
              </View>
            </View>

            <View style={styles.macroCard}>
              <Text style={[styles.macroAmount, { color: '#4CAF50' }]}>
                {todayNutrition.carbs}g
              </Text>
              <Text style={styles.macroLabel}>Углеводы</Text>
              <View style={styles.miniProgress}>
                <View 
                  style={[
                    styles.miniProgressFill,
                    { width: `${carbsProgress}%`, backgroundColor: '#4CAF50' }
                  ]} 
                />
              </View>
            </View>

            <View style={styles.macroCard}>
              <Text style={[styles.macroAmount, { color: '#FF9800' }]}>
                {todayNutrition.fat}g
              </Text>
              <Text style={styles.macroLabel}>Жиры</Text>
              <View style={styles.miniProgress}>
                <View 
                  style={[
                    styles.miniProgressFill,
                    { width: `${fatProgress}%`, backgroundColor: '#FF9800' }
                  ]} 
                />
              </View>
            </View>
          </View>
        </View>

        {/* Быстрые действия */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Быстрые действия</Text>
          
          {/* Кнопка сканирования штрих-кода */}
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={openScanner}
            disabled={loadingProduct}
          >
            {loadingProduct ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Ionicons name="barcode" size={24} color="#fff" />
            )}
            <Text style={styles.scanButtonText}>
              {loadingProduct ? 'Поиск продукта...' : 'Сканировать штрих-код'}
            </Text>
          </TouchableOpacity>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                setSelectedMealType('breakfast');
                setShowMealModal(true);
              }}
            >
              <Text style={styles.actionIcon}>☀️</Text>
              <Text style={styles.actionText}>Завтрак</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                setSelectedMealType('lunch');
                setShowMealModal(true);
              }}
            >
              <Text style={styles.actionIcon}>🍽️</Text>
              <Text style={styles.actionText}>Обед</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                setSelectedMealType('dinner');
                setShowMealModal(true);
              }}
            >
              <Text style={styles.actionIcon}>🌙</Text>
              <Text style={styles.actionText}>Ужин</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                setSelectedMealType('snack');
                setShowMealModal(true);
              }}
            >
              <Text style={styles.actionIcon}>🍎</Text>
              <Text style={styles.actionText}>Перекус</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.addCustomButton}
            onPress={() => setShowAddFoodModal(true)}
          >
            <Ionicons name="add-circle" size={20} color="#4CAF50" />
            <Text style={styles.addCustomText}>Добавить свой продукт</Text>
          </TouchableOpacity>
        </View>

        {/* История приемов пищи */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Сегодня</Text>
            {todayLogs.length > 0 && (
              <TouchableOpacity onPress={() => setMealLogs([])}>
                <Text style={styles.resetText}>Очистить</Text>
              </TouchableOpacity>
            )}
          </View>

          {todayLogs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>Еще нет записей о питании</Text>
              <Text style={styles.emptyStateSubtext}>
                Добавьте первый прием пищи!
              </Text>
            </View>
          ) : (
            todayLogs.map((meal) => (
              <View key={meal.id} style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <View style={styles.mealType}>
                    <Text style={styles.mealIcon}>{getMealTypeIcon(meal.mealType)}</Text>
                    <Text style={styles.mealTypeText}>{getMealTypeName(meal.mealType)}</Text>
                  </View>
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealCalories}>{meal.totalCalories} ккал</Text>
                    <Text style={styles.mealTime}>{formatTime(meal.timestamp)}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => deleteMeal(meal.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#f44336" />
                  </TouchableOpacity>
                </View>

                <View style={styles.mealItems}>
                  {meal.foodItems.map((item, index) => (
                    <View key={index} style={styles.foodItem}>
                      <Text style={styles.foodName}>{item.name}</Text>
                      <Text style={styles.foodDetails}>
                        {item.calories} ккал • {item.portion}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.mealMacros}>
                  <Text style={[styles.macroTag, { backgroundColor: '#E3F2FD' }]}>
                    Б: {meal.totalProtein}g
                  </Text>
                  <Text style={[styles.macroTag, { backgroundColor: '#E8F5E8' }]}>
                    У: {meal.totalCarbs}g
                  </Text>
                  <Text style={[styles.macroTag, { backgroundColor: '#FFF3E0' }]}>
                    Ж: {meal.totalFat}g
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Модальное окно добавления своего продукта */}
      <Modal
        visible={showAddFoodModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Добавить свой продукт</Text>
            
            <Text style={styles.modalLabel}>Название продукта</Text>
            <TextInput
              style={styles.textInput}
              value={customFoodName}
              onChangeText={setCustomFoodName}
              placeholder="Например: Куриная грудка"
              placeholderTextColor="#999"
            />

            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionInput}>
                <Text style={styles.modalLabel}>Калории</Text>
                <TextInput
                  style={styles.smallInput}
                  value={customFoodCalories}
                  onChangeText={setCustomFoodCalories}
                  placeholder="150"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.nutritionInput}>
                <Text style={styles.modalLabel}>Белки (г)</Text>
                <TextInput
                  style={styles.smallInput}
                  value={customFoodProtein}
                  onChangeText={setCustomFoodProtein}
                  placeholder="20"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.nutritionInput}>
                <Text style={styles.modalLabel}>Углеводы (г)</Text>
                <TextInput
                  style={styles.smallInput}
                  value={customFoodCarbs}
                  onChangeText={setCustomFoodCarbs}
                  placeholder="10"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.nutritionInput}>
                <Text style={styles.modalLabel}>Жиры (г)</Text>
                <TextInput
                  style={styles.smallInput}
                  value={customFoodFat}
                  onChangeText={setCustomFoodFat}
                  placeholder="5"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <Text style={styles.modalLabel}>Порция</Text>
            <TextInput
              style={styles.textInput}
              value={customFoodPortion}
              onChangeText={setCustomFoodPortion}
              placeholder="100г"
              placeholderTextColor="#999"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddFoodModal(false);
                  resetCustomFoodForm();
                }}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={addCustomFood}
              >
                <Text style={styles.confirmButtonText}>Добавить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модальное окно целей */}
      <Modal
        visible={showGoalModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Цели по питанию</Text>
            
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionInput}>
                <Text style={styles.modalLabel}>Калории</Text>
                <TextInput
                  style={styles.smallInput}
                  value={goalCalories}
                  onChangeText={setGoalCalories}
                  placeholder="2000"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.nutritionInput}>
                <Text style={styles.modalLabel}>Белки (г)</Text>
                <TextInput
                  style={styles.smallInput}
                  value={goalProtein}
                  onChangeText={setGoalProtein}
                  placeholder="120"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.nutritionInput}>
                <Text style={styles.modalLabel}>Углеводы (г)</Text>
                <TextInput
                  style={styles.smallInput}
                  value={goalCarbs}
                  onChangeText={setGoalCarbs}
                  placeholder="250"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.nutritionInput}>
                <Text style={styles.modalLabel}>Жиры (г)</Text>
                <TextInput
                  style={styles.smallInput}
                  value={goalFat}
                  onChangeText={setGoalFat}
                  placeholder="70"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowGoalModal(false)}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={setNewGoals}
              >
                <Text style={styles.confirmButtonText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модальное окно добавления приема пищи */}
      <Modal
        visible={showMealModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.mealModalContent]}>
            <Text style={styles.modalTitle}>
              {getMealTypeName(selectedMealType)} {getMealTypeIcon(selectedMealType)}
            </Text>

            {/* Поиск продуктов */}
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Поиск продуктов..."
              placeholderTextColor="#999"
            />

            {/* Выбранные продукты */}
            {selectedFoodItems.length > 0 && (
              <View style={styles.selectedFoods}>
                <Text style={styles.selectedTitle}>Выбранные продукты:</Text>
                                {selectedFoodItems.map((item) => (
                  <View key={item.id} style={styles.selectedFoodItem}>
                    <Text style={styles.selectedFoodName}>{item.name}</Text>
                    <Text style={styles.selectedFoodDetails}>
                      {item.calories} ккал • {item.portion}
                    </Text>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeFoodFromMeal(item.id)}
                    >
                      <Ionicons name="close" size={16} color="#f44336" />
                    </TouchableOpacity>
                  </View>
                ))}
                <View style={styles.mealTotal}>
                  <Text style={styles.totalText}>
                    Итого: {selectedFoodItems.reduce((sum, item) => sum + item.calories, 0)} ккал
                  </Text>
                </View>
              </View>
            )}

            {/* Список продуктов */}
            <FlatList
              data={filteredFoodItems}
              keyExtractor={(item) => item.id}
              style={styles.foodList}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.foodListItem}
                  onPress={() => addFoodToMeal(item)}
                >
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodListItemName}>{item.name}</Text>
                    <Text style={styles.foodListItemDetails}>
                      {item.calories} ккал • Б: {item.protein}г • У: {item.carbs}г • Ж: {item.fat}г
                    </Text>
                  </View>
                  <Text style={styles.foodPortion}>{item.portion}</Text>
                </TouchableOpacity>
              )}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowMealModal(false);
                  setSelectedFoodItems([]);
                  setSearchQuery('');
                }}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={saveMeal}
                disabled={selectedFoodItems.length === 0}
              >
                <Text style={styles.confirmButtonText}>
                  Сохранить ({selectedFoodItems.reduce((sum, item) => sum + item.calories, 0)} ккал)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модальное окно сканера штрих-кода */}
      <Modal
        visible={scannerVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.scannerContainer}>
          <View style={styles.scannerContent}>
            <Text style={styles.scannerTitle}>Сканируйте штрих-код продукта</Text>
            
            <CameraView
              style={styles.camera}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: [
                  'ean13',
                  'ean8',
                  'upc_a',
                  'upc_e',
                  'code39',
                  'code128'
                ],
              }}
            >
              <View style={styles.scannerOverlay}>
                <View style={styles.scannerFrame} />
                <Text style={styles.scannerText}>
                  Наведите камеру на штрих-код продукта
                </Text>
              </View>
            </CameraView>

            <View style={styles.scannerButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setScannerVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              
              {scanned && (
                <TouchableOpacity 
                  style={[styles.modalButton, styles.scanAgainButton]}
                  onPress={() => setScanned(false)}
                >
                  <Text style={styles.confirmButtonText}>Сканировать еще</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  dailyProgress: {
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
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  editGoalButton: {
    padding: 8,
  },
  macroItem: {
    marginBottom: 16,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  macroValue: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  macroCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  macroAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  miniProgress: {
    width: '100%',
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  quickActions: {
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    marginBottom: 16,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    padding: 12,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  addCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
  },
  addCustomText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  historySection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resetText: {
    color: '#f44336',
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  mealCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mealIcon: {
    fontSize: 20,
  },
  mealTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  mealInfo: {
    alignItems: 'flex-end',
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  mealTime: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    padding: 4,
  },
  mealItems: {
    marginBottom: 12,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  foodName: {
    fontSize: 14,
    color: '#333',
  },
  foodDetails: {
    fontSize: 12,
    color: '#666',
  },
  mealMacros: {
    flexDirection: 'row',
    gap: 8,
  },
  macroTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  // Модальные окна
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  mealModalContent: {
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  nutritionInput: {
    flex: 1,
    minWidth: '45%',
  },
  smallInput: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Стили для модального окна приема пищи
  selectedFoods: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  selectedFoodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectedFoodName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  selectedFoodDetails: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  mealTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#e0e0e0',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  foodList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  foodListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  foodInfo: {
    flex: 1,
  },
  foodListItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  foodListItemDetails: {
    fontSize: 12,
    color: '#666',
  },
  foodPortion: {
    fontSize: 12,
    color: '#999',
  },
  // Стили для сканера
  scannerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  scannerContent: {
    flex: 1,
    padding: 20,
  },
  scannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  camera: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  scannerFrame: {
    width: '80%',
    height: 200,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  scannerText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
  },
  scannerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  scanAgainButton: {
    backgroundColor: '#4CAF50',
  },
});

export default Nutrition;