import React, { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native'
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
    //Splash screen 지속시간 설정
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

  useEffect(() => {
    //Back Button customize
    const backAction = () => {
      Alert.alert(
          "Exit App",
          "앱을 종료하시겠습니까?",
          [
            { text: "아니오" , onPress: () => null },
            { text: "예" , onPress: () => BackHandler.exitApp() } 
          ],
          { cancelable: false }
      );
      
      //return true -> 기본 뒤로가기 동작을 막음(현 상태에서는 stack-navigation pop을 막음)
      return true;
    }

    BackHandler.addEventListener("hardwareBackPress", backAction)

    //return 함수영역 : componentWillMount 역할
    return () => BackHandler.addEventListener("hardwareBackPress", backAction);
  }, [])


 
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

