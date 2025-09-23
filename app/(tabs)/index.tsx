import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Text,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return ( 
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Health tracker</Text>
        <Text style={styles.SubTitle}>Health is a key of good life</Text>

        {/* Первая рамка */}
        <Link href="/water" asChild>
          <TouchableOpacity style={styles.emptySection} activeOpacity={0.8}>
            <Text style={styles.section1Title}>💧</Text>
          </TouchableOpacity>
        </Link>

        {/* Вторая */}
        <Link href="/sleep" asChild>
          <TouchableOpacity style={styles.emptySection} activeOpacity={0.8}>
            <Text style={styles.section1Title}>💤</Text>
          </TouchableOpacity>
        </Link>

        {/* Третья */}
        <Link href="/mood" asChild>
          <TouchableOpacity style={styles.emptySection} activeOpacity={0.8}>
            <Text style={styles.section1Title}>😌</Text>
          </TouchableOpacity>
        </Link>

        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000ff', 
    marginBottom: 5,
    marginTop: 70,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', 
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  SubTitle: {
    fontSize: 20,
    color: 'grey',
    marginBottom: 30, 
  },
  emptySection: {
    width: '110%',
    height: 150, 
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 50,
    marginTop: 80,
    backgroundColor: '#ffffff', 
  },
  section1Title: {
    fontSize: 60,
    marginTop: 25
  },
  innerSection: {
    width: '100%',
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#add8e6',
    marginBottom: 16,
  },
});