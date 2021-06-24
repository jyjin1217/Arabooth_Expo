import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import * as SplashScreen from 'expo-splash-screen';
import { Login } from './Screens/Login'
import { Action01 } from './Screens/Action01'
import { Action02 } from './Screens/Action02'
import { QRScan } from './Screens/QRScan'
import { Action03 } from './Screens/Action03'
import { Action04 } from './Screens/Action04'
import { Action05 } from './Screens/Action05'


export default App = () => {

  //stack navigatin 생성
  const Stack = createStackNavigator();

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        //headerTitle:"",
        headerShown:false
      }}>
        <Stack.Screen name="Login" component={Login}></Stack.Screen>
        <Stack.Screen name="Action01" component={Action01}></Stack.Screen>
        <Stack.Screen name="Action02" component={Action02}></Stack.Screen>
        <Stack.Screen name="QRScan" component={QRScan}></Stack.Screen>
        <Stack.Screen name="Action03" component={Action03}></Stack.Screen>
        <Stack.Screen name="Action04" component={Action04}></Stack.Screen>
        <Stack.Screen name="Action05" component={Action05}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

