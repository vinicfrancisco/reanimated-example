import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import Animations from './screens/Animations';
import Home from './screens/Home';
import Profile from './screens/Profile';
import TodoList from './screens/TodoList';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      {/* <GestureHandlerRootView> */}
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Animations" component={Animations} />
        <Stack.Screen name="TodoList" component={TodoList} />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
      {/* </GestureHandlerRootView> */}
    </NavigationContainer>
  );
}

export default gestureHandlerRootHOC(App);
