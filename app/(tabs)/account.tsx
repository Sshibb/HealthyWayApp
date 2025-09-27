import React, { useState } from 'react';
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

// Локальное состояние профиля (пока без бэкенда)
const Account: React.FC = () => {
  const [user, setUser] = useState({
    name: 'Олег Шибаев',
    email: 'oleg@example.com',
    avatar: 'https://via.placeholder.com/150',
    joinDate: '12 января 2024',
    streak: 15, // дней подряд
    totalWater: 320, // литров всего
    totalSleep: 120, // ночей
    totalMoodLogs: 45, // записей настроения
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);

  // Переключение режима редактирования
  const toggleEdit = () => {
    if (isEditing) {
      // Сохраняем изменения
      setUser((prev) => ({ ...prev, name: editedName }));
      Alert.alert('✅ Успешно', 'Имя обновлено!');
    }
    setIsEditing(!isEditing);
  };

  // Заглушка для смены аватара
  const changeAvatar = () => {
    Alert.alert('📷 Смена аватара', 'Функция будет доступна в следующем обновлении');
  };

  // Заглушка для выхода
  const handleLogout = () => {
    Alert.alert(
      '🚪 Выйти из аккаунта',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Выйти', style: 'destructive' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Шапка профиля */}
        <View style={styles.header}>
          <TouchableOpacity onPress={changeAvatar}>
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
                />
                <TouchableOpacity onPress={toggleEdit} style={styles.saveButton}>
                  <Ionicons name="checkmark" size={20} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.name}>{user.name}</Text>
                <TouchableOpacity onPress={toggleEdit}>
                  <Text style={styles.editText}>✏️ Редактировать</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Email и дата регистрации */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="mail" size={20} color="#666" />
            <Text style={styles.infoText}>{user.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={20} color="#666" />
            <Text style={styles.infoText}>В приложении с {user.joinDate}</Text>
          </View>
        </View>

        {/* Статистика */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📊 Ваша статистика</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="flame" size={24} color="#FF5722" />
              <Text style={styles.statNumber}>{user.streak}</Text>
              <Text style={styles.statLabel}>дней подряд</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="water" size={24} color="#2196F3" />
              <Text style={styles.statNumber}>{user.totalWater}</Text>
              <Text style={styles.statLabel}>л воды</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="bed" size={24} color="#9C27B0" />
              <Text style={styles.statNumber}>{user.totalSleep}</Text>
              <Text style={styles.statLabel}>ночей</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="happy" size={24} color="#FF9800" />
              <Text style={styles.statNumber}>{user.totalMoodLogs}</Text>
              <Text style={styles.statLabel}>записей</Text>
            </View>
          </View>
        </View>

        {/* Настройки */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>⚙️ Настройки</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Уведомления</Text>
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Тема (светлая/тёмная)</Text>
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Резервное копирование</Text>
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>О приложении</Text>
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </TouchableOpacity>
        </View>

        {/* Кнопка выхода */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Выйти из аккаунта</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Импорт TextInput отдельно
import { TextInput } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  editText: {
    fontSize: 16,
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
  },
  saveButton: {
    padding: 8,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
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
  statsSection: {
    width: '100%',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  settingsSection: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#f44336',
    borderRadius: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Account;