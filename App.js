import React, { useEffect } from 'react';
import { BackHandler, Alert, View, Text, Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack'
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
  const naviRef = React.useRef();

  //custom back button 생성
  const customBackButton = () => {
    //console.log(naviRef);//가능한 함수 확인하고 싶을시 실행

    const curRoute = naviRef.current.getCurrentRoute().name;
    switch(curRoute){
      case "Login":
      case "Action05":
        Alert.alert(
          "Exit App",
          "앱을 종료하시겠습니까?",
          [
          { text: "아니오" , onPress: () => null },
          { text: "예" , onPress: () => BackHandler.exitApp() } 
          ],
          { cancelable: false }
        );
      break;
      case "Action01":
        naviRef.current.navigate("Login");
      break;
      case "QRScan":        
      case "Action02":
      case "Action03":
        naviRef.current.goBack();
      break;        
      case "Action04":
        Alert.alert(
          "Exit App",
          "부스를 사용중인 상태입니다.\n용무를 마치시면 앱을 재실행하여 퇴실버튼을 눌러주세요.\n\n앱을 종료하시겠습니까?",
          [
          { text: "아니오" , onPress: () => null },
          { text: "예" , onPress: () => BackHandler.exitApp() } 
          ],
          { cancelable: false }
        );
      break;
      default:break;
    }

    return true; //-> 기본 뒤로가기 동작을 막음(현 상태에서는 stack-navigation pop을 막음)
  }


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
   
  //custom back button 적용
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", customBackButton);
    //return 함수영역 : componentWillMount 역할
    return () => BackHandler.addEventListener("hardwareBackPress", customBackButton);
  }, []);


  return (
    
    <NavigationContainer ref={naviRef}>
      <Stack.Navigator screenOptions={{
        headerTitle:false,
        headerBackTitle:false,        
        headerTransparent:true,
        headerLeft:() => (
          <HeaderBackButton onPress={()=>customBackButton()} />
        ),
        headerShown:false //ios 빌드시에는 주석처리 필요
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

