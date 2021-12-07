import React from 'react';
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

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const Test = () => {
    return (
      <View>
        <Text>yeet</Text>
      </View>
    );
  };
  return (
    // <SafeAreaView>
    //   <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Login">
        <Drawer.Screen name="Login" component={Login} />
        <Drawer.Screen name="test" component={Matches} />
      </Drawer.Navigator>
    </NavigationContainer>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default App;
