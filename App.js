import React, {useState, useMemo} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Login from './views/Login';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Matches from './views/Maches';
import Context from './Context';

const Stack = createNativeStackNavigator();
// const Drawer = createDrawerNavigator();
const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [user, setUser] = useState({username: 'pog', token: 'champ'});

  const value = useMemo(() => ({user, setUser}), [user]);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    // <SafeAreaView>
    //   <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

    <Context.Provider value={value}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Matches" component={Matches} />
        </Stack.Navigator>
      </NavigationContainer>
    </Context.Provider>

    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default App;
