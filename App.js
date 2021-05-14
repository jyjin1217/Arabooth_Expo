//import { StatusBar } from 'expo-status-bar';
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
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here
        //-----------------------------------------------

        //-----------------------------------------------
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        //headerTitle:"",
        //headerShown:false
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

