import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TextInput,
  Switch,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface UserData {
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  streak: number;
  totalWater: number;
  totalSleep: number;
  totalMoodLogs: number;
  totalWorkouts: number;
  totalCalories: number;
  notifications: boolean;
  darkMode: boolean;
  weeklyGoal: number;
}

const Account: React.FC = () => {
  const [user, setUser] = useState<UserData>({
    name: 'Олег Шибаев',
    email: 'oleg@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    joinDate: '12 января 2024',
    streak: 0,
    totalWater: 0,
    totalSleep: 0,
    totalMoodLogs: 0,
    totalWorkouts: 0,
    totalCalories: 0,
    notifications: true,
    darkMode: false,
    weeklyGoal: 150,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [activeTab, setActiveTab] = useState('stats');
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedStat, setSelectedStat] = useState<any>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Загрузка данных пользователя
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('userData');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = async (userData: UserData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // Анимация появления
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleEdit = () => {
    if (isEditing) {
      const updatedUser = { ...user, name: editedName };
      setUser(updatedUser);
      saveUserData(updatedUser);
      Alert.alert('✅ Успешно', 'Имя обновлено!');
    }
    setIsEditing(!isEditing);
  };

  const changeAvatar = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Ошибка', 'Необходимо разрешение на доступ к галерее');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        const updatedUser = { ...user, avatar: result.assets[0].uri };
        setUser(updatedUser);
        saveUserData(updatedUser);
        Alert.alert('✅ Успешно', 'Аватар обновлен!');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось обновить аватар');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      '🚪 Выйти из аккаунта',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Выйти', 
          style: 'destructive',
          onPress: () => {
            // Логика выхода
            Alert.alert('👋', 'До встречи!');
          }
        },
      ]
    );
  };

  const toggleNotification = () => {
    const updatedUser = { ...user, notifications: !user.notifications };
    setUser(updatedUser);
    saveUserData(updatedUser);
  };

  const toggleDarkMode = () => {
    const updatedUser = { ...user, darkMode: !user.darkMode };
    setUser(updatedUser);
    saveUserData(updatedUser);
  };

  const showStatDetails = (stat: any) => {
    setSelectedStat(stat);
    setShowStatsModal(true);
  };

  const getLevel = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return { level: 'Эксперт', color: '#4CAF50' };
    if (percentage >= 60) return { level: 'Продвинутый', color: '#2196F3' };
    if (percentage >= 40) return { level: 'Средний', color: '#FF9800' };
    if (percentage >= 20) return { level: 'Начинающий', color: '#9C27B0' };
    return { level: 'Новичок', color: '#f44336' };
  };

  const statsData = [
    {
      icon: '💧',
      title: 'Вода',
      value: user.totalWater,
      unit: 'л',
      description: 'Всего выпито воды',
      goal: 100,
      color: '#2196F3'
    },
    {
      icon: '😴',
      title: 'Сон',
      value: user.totalSleep,
      unit: 'ночей',
      description: 'Ночей с отслеживанием сна',
      goal: 30,
      color: '#9C27B0'
    },
    {
      icon: '😊',
      title: 'Настроение',
      value: user.totalMoodLogs,
      unit: 'записей',
      description: 'Записей настроения',
      goal: 50,
      color: '#FF9800'
    },
    {
      icon: '💪',
      title: 'Тренировки',
      value: user.totalWorkouts,
      unit: 'тренировок',
      description: 'Завершенных тренировок',
      goal: 25,
      color: '#FF5722'
    },
    {
      icon: '🔥',
      title: 'Калории',
      value: user.totalCalories,
      unit: 'ккал',
      description: 'Всего сожжено калорий',
      goal: 10000,
      color: '#f44336'
    },
    {
      icon: '📅',
      title: 'Стрик',
      value: user.streak,
      unit: 'дней',
      description: 'Дней подряд в приложении',
      goal: 7,
      color: '#4CAF50'
    },
  ];

  const achievements = [
    { icon: '🏆', title: 'Первая тренировка', unlocked: user.totalWorkouts > 0 },
    { icon: '💧', title: 'Водохлёб', unlocked: user.totalWater > 10 },
    { icon: '😴', title: 'Соня', unlocked: user.totalSleep > 5 },
    { icon: '😊', title: 'Оптимист', unlocked: user.totalMoodLogs > 10 },
    { icon: '🔥', title: 'Энерджайзер', unlocked: user.streak > 3 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.scrollContainer, { opacity: fadeAnim }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Шапка профиля */}
          <View style={styles.header}>
            <TouchableOpacity onPress={changeAvatar} style={styles.avatarContainer}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              <View style={styles.editIcon}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            </TouchableOpacity>

            <View style={styles.nameContainer}>
              {isEditing ? (
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={editedName}
                    onChangeText={setEditedName}
                    placeholder="Введите имя"
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity onPress={toggleEdit} style={styles.saveButton}>
                    <Ionicons name="checkmark" size={20} color="#4CAF50" />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <Text style={styles.name}>{user.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>
                      {getLevel(statsData.reduce((acc, stat) => acc + stat.value, 0), 100).level}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={toggleEdit} style={styles.editButton}>
                    <Ionicons name="create-outline" size={16} color="#6200EE" />
                    <Text style={styles.editText}>Редактировать</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {/* Вкладки */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
              onPress={() => setActiveTab('stats')}
            >
              <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
                Статистика
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
              onPress={() => setActiveTab('achievements')}
            >
              <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
                Достижения
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
              onPress={() => setActiveTab('settings')}
            >
              <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
                Настройки
              </Text>
            </TouchableOpacity>
          </View>

          {/* Контент вкладок */}
          {activeTab === 'stats' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>📊 Общая статистика</Text>
              <View style={styles.statsGrid}>
                {statsData.map((stat, index) => {
                  const progress = Math.min((stat.value / stat.goal) * 100, 100);
                  const levelInfo = getLevel(stat.value, stat.goal);
                  
                  return (
                    <TouchableOpacity 
                      key={index}
                      style={[styles.statCard, { borderLeftColor: stat.color }]}
                      onPress={() => showStatDetails(stat)}
                    >
                      <View style={styles.statHeader}>
                        <Text style={styles.statIcon}>{stat.icon}</Text>
                        <Text style={styles.statTitle}>{stat.title}</Text>
                      </View>
                      <Text style={styles.statValue}>
                        {stat.value} {stat.unit}
                      </Text>
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                          <View 
                            style={[
                              styles.progressFill, 
                              { width: `${progress}%`, backgroundColor: stat.color }
                            ]} 
                          />
                        </View>
                        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                      </View>
                      <Text style={[styles.levelText, { color: levelInfo.color }]}>
                        {levelInfo.level}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {activeTab === 'achievements' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>🏆 Достижения</Text>
              <View style={styles.achievementsGrid}>
                {achievements.map((achievement, index) => (
                  <View 
                    key={index}
                    style={[
                      styles.achievementCard,
                      !achievement.unlocked && styles.lockedAchievement
                    ]}
                  >
                    <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                    <Text style={[
                      styles.achievementTitle,
                      !achievement.unlocked && styles.lockedText
                    ]}>
                      {achievement.title}
                    </Text>
                    {achievement.unlocked ? (
                      <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    ) : (
                      <Ionicons name="lock-closed" size={20} color="#ccc" />
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {activeTab === 'settings' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>⚙️ Настройки</Text>
              
              <View style={styles.settingsCard}>
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="notifications" size={24} color="#666" />
                    <View style={styles.settingTexts}>
                      <Text style={styles.settingTitle}>Уведомления</Text>
                      <Text style={styles.settingDescription}>Push-уведомления о напоминаниях</Text>
                    </View>
                  </View>
                  <Switch
                    value={user.notifications}
                    onValueChange={toggleNotification}
                    trackColor={{ false: '#f0f0f0', true: '#4CAF50' }}
                    thumbColor={user.notifications ? '#fff' : '#f4f3f4'}
                  />
                </View>

                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="moon" size={24} color="#666" />
                    <View style={styles.settingTexts}>
                      <Text style={styles.settingTitle}>Тёмная тема</Text>
                      <Text style={styles.settingDescription}>Использовать тёмную тему приложения</Text>
                    </View>
                  </View>
                  <Switch
                    value={user.darkMode}
                    onValueChange={toggleDarkMode}
                    trackColor={{ false: '#f0f0f0', true: '#4CAF50' }}
                    thumbColor={user.darkMode ? '#fff' : '#f4f3f4'}
                  />
                </View>

                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="cloud-upload" size={24} color="#666" />
                    <View style={styles.settingTexts}>
                      <Text style={styles.settingTitle}>Резервное копирование</Text>
                      <Text style={styles.settingDescription}>Создать резервную копию данных</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#aaa" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="information-circle" size={24} color="#666" />
                    <View style={styles.settingTexts}>
                      <Text style={styles.settingTitle}>О приложении</Text>
                      <Text style={styles.settingDescription}>Версия 1.0.0</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#aaa" />
                </TouchableOpacity>
              </View>

              {/* Информация о профиле */}
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Ionicons name="mail" size={20} color="#666" />
                  <Text style={styles.infoText}>{user.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar" size={20} color="#666" />
                  <Text style={styles.infoText}>В приложении с {user.joinDate}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="trophy" size={20} color="#666" />
                  <Text style={styles.infoText}>
                    {achievements.filter(a => a.unlocked).length} из {achievements.length} достижений
                  </Text>
                </View>
              </View>

              {/* Кнопка выхода */}
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#fff" />
                <Text style={styles.logoutText}>Выйти из аккаунта</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </Animated.View>

      {/* Модальное окно деталей статистики */}
      <Modal
        visible={showStatsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowStatsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedStat && (
              <>
                <Text style={styles.modalTitle}>
                  {selectedStat.icon} {selectedStat.title}
                </Text>
                <Text style={styles.modalValue}>
                  {selectedStat.value} {selectedStat.unit}
                </Text>
                <Text style={styles.modalDescription}>
                  {selectedStat.description}
                </Text>
                <View style={styles.modalProgress}>
                  <Text style={styles.modalGoal}>
                    Цель: {selectedStat.goal} {selectedStat.unit}
                  </Text>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${Math.min((selectedStat.value / selectedStat.goal) * 100, 100)}%`,
                          backgroundColor: selectedStat.color
                        }
                      ]} 
                    />
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.modalButton}
                  onPress={() => setShowStatsModal(false)}
                >
                  <Text style={styles.modalButtonText}>Закрыть</Text>
                </TouchableOpacity>
              </>
            )}
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  editIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#6200EE',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nameContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    backgroundColor: '#FFF9C4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ratingText: {
    fontSize: 14,
    color: '#5D4037',
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    backgroundColor: '#F3E5F5',
    borderRadius: 12,
  },
  editText: {
    fontSize: 14,
    color: '#6200EE',
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
    borderBottomWidth: 2,
    borderBottomColor: '#6200EE',
    minWidth: 200,
    padding: 4,
    textAlign: 'center',
  },
  saveButton: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#6200EE',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  tabContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    gap: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 24,
  },
  statTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    minWidth: 35,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  achievementsGrid: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
  },
  lockedAchievement: {
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 24,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  lockedText: {
    color: '#999',
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingTexts: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#f44336',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
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
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalProgress: {
    width: '100%',
    marginBottom: 24,
  },
  modalGoal: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Account;