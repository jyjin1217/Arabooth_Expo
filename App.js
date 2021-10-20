import React, { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack'
import * as SplashScreen from 'expo-splash-screen';
import Constants from 'expo-constants';
import { Login } from './Screens/Login'
import { Action01 } from './Screens/Action01'
import { Action02 } from './Screens/Action02'
import { QRScan } from './Screens/QRScan'
import { Action03 } from './Screens/Action03'
import { Action04 } from './Screens/Action04'
import { Action05 } from './Screens/Action05'
import * as storage from './Compo/storageSelf'
import { lambda_checkVersion } from './Requests/AwsRequest'
import * as Device from 'expo-device'
import * as WebBrowser from 'expo-web-browser'

export default App = () => {

  //stack navigatin 생성
  const Stack = createStackNavigator();
  const naviRef = React.useRef();

  //custom back button 생성
  const customBackButton = () => {
    //console.log(naviRef);//실행가능한 함수 목록 확인하고 싶을시 실행

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
      case "Action02":
        naviRef.current.navigate("Login");
      break;
      case "QRScan": 
        naviRef.current.goBack();
      break;
      case "Action03":
        naviRef.current.navigate("Action02");
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

  const AsyncAlert = async () => new Promise((resolve) => {
    Alert.alert(
      "App Update",
      "새로운 버전이 존재합니다.\n앱을 업데이트 후 사용을 부탁드립니다.",
      [
        { text: "OK" , onPress: () => resolve('YES') } 
      ],
      { cancelable: false }
    );
  })


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

  //version 관리
  useEffect(() => {
    let version = Constants.manifest.version;

    //내부 저장 변경, 추후 삭제
    let verStr = version.split('.');
    if(verStr[0] == "1" && verStr[1] == "0" && Number(verStr[2]) <= 7){      

      (async () => {
        
        let tem1 = await storage.getJsonData("autoLogin");
        if(tem1 != null) {
          let newSetting = {
            autoLogin:tem1.isAuto
          }
          await storage.storeJsonData("Setting", newSetting);
          await storage.deleteData("autoLogin");
        }

        let tem2 = await storage.getJsonData("login");
        if(tem2 != null) {
          let newCurUser = {
            id:tem2.email,
            pw:tem2.pw,
            company:tem2.company,
            name:tem2.name,
            phone:tem2.phone
          }
          await storage.storeJsonData("CurUser", newCurUser);
          await storage.deleteData("login");
        }

        let tem3 = await storage.getJsonData("isUsing");
        if (tem3 != null) {
          let newCurUser = {
            isUsing:tem3.isUse,
            boothName:tem3.boothName,
            startDate:tem3.startTime,
            startUTCmsec:tem3.sNow
          }
          await storage.storeJsonData("CurUser", newCurUser);
          await storage.deleteData("isUsing");
        }

        let tem4 = await storage.getJsonData("attemptUser");
        if (tem4 != null) {
          await storage.deleteData("attemptUser");
        }
        
      })();
      
    }
    
    //version 체크 및 업데이트 요청
    (async () => {

      let isLastVersion = await lambda_checkVersion(version);
      if (isLastVersion == false) {

        await AsyncAlert();

        BackHandler.exitApp();
        if (Device.brand == "Apple") {}
        else await WebBrowser.openBrowserAsync("https://play.google.com/store/apps/details?id=com.mocha.Arabooth");

      }

    })();

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
        //headerShown:false //ios 빌드시에는 주석처리 필요
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

