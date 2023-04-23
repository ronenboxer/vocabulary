import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { Provider } from 'react-redux'
import { store } from './src/redux/index'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { HomePage } from './src/pages/HomePage'
import { MemoryGame } from './src/pages/MemoryGame'
import { QuizPage } from './src/pages/QuizPage'
import { PhraseDetails } from './src/pages/PhraseDetails'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <Provider store={store}>

      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomePage">
          <Stack.Screen
            name="HomePage"
            component={HomePage}
            options={{title:'דף הבית'}}
          />
          <Stack.Screen
            name="PhraseDetails"
            component={PhraseDetails}
            options={{title:'פרטים'}}
          />
          <Stack.Screen
            name="MemoryGame"
            component={MemoryGame}
            options={{title:'משחק זכרון'}}
          />
          <Stack.Screen
            name="QuizPage"
            component={QuizPage}
            options={{title:'שאלות אמריקאיות'}}
          />
        </Stack.Navigator>
      </NavigationContainer>

    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b6b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  margin: {
    marginTop: 80,
  }
})
