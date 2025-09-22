import { SafeAreaView } from 'react-native-safe-area-context';
import { 
      Text,
      StyleSheet,
      ScrollView,



} from 'react-native'

export default function HomeScreen() {

  <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>💧 Вода</Text>
          </ScrollView>
          </SafeAreaView>
}

const styles = StyleSheet.create({

   title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffffff',
    marginBottom: 30,
   },

    container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    },
  
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  }
)
