import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { TextButton } from './../Compo/TextButton'
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Login = ({navigation}) => {

    /* 핸드폰 내에 저장하기(json) */
    const storeJsonData = async (key, value) => {
        try {
            let jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
          return false;
        }
        return true;
    }
    /* 핸드폰 내에 저장 데이터 불러오기(json) */
    const getJsonData = async (key) => {
        try {
            let jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
        }
    }

    //페이지 오픈시 최초 한번([] 설정) 실행, 
    useEffect(() => {        
        (async () => {
            
            let autoLoginJson = await getJsonData('autoLogin');

            if(autoLoginJson){
                
            }
            //자동로그인 세팅이라면
            if(autoLoginJson.isAuto){
                //저장된 Id,password 확인/세팅
                let loginJson = await getJsonData('login');
                if(loginJson){                
                    setEmailStr(loginJson.email);                
                    setRealPw(loginJson.pw);

                    let curPw = "";
                    for(let i = 0; i < loginJson.pw.length; i++)
                        curPw += "*";                    
                    setPwStr(curPw);
                }                
            }

            //자동로그인 체크 Display 변경
            if(autoLoginJson.isAuto)
                setAutoLoginDisplay('flex');
            else
                setAutoLoginDisplay('none');
        })();
    }, []);

    //계정 정보, 수정필요
    const [emailStr, setEmailStr] = useState("Arabooth@work&all.com");    
    const [realPw, setRealPw] = useState("1234");
    const [pwStr, setPwStr] = useState("****");
    const [isAutoLogin, setAutoLogin] = useState(true);
    const [autoLoginDisplay, setAutoLoginDisplay] = useState('none');

    //비밀번호 변경, (*) 작업
    const changePwStr = (value) => {
        if(realPw.length < value.length){
            setPwStr(pwStr + '*');
            setRealPw(realPw + value[value.length - 1]);
        }            
        else if (realPw.length > value.length){
            setPwStr(pwStr.slice(0, pwStr.length - 1));
            setRealPw(realPw.slice(0, realPw.length - 1));
        }                
    }

    //autoLogin 변경 함수
    const changeAutoLogin = () => {

        //useState를 통한 변경은 즉시 반영이 안되기 때문에 지역변수로 다음 체킹
        let curSelect = !isAutoLogin;
        setAutoLogin(!isAutoLogin);

        if(curSelect)
            setAutoLoginDisplay('flex');
        else
            setAutoLoginDisplay('none');
    }


    //다음 페이지 이동 함수, Local 데이터 저장
    const checkLogin = async () =>{

        const autoLoginJosn = {
            isAuto:isAutoLogin
        }
        await storeJsonData('autoLogin', autoLoginJosn);

        const loginJson = {
            email:emailStr,
            pw:realPw
        }
        await storeJsonData('login', loginJson);

        navigation.navigate('Action01');
    }
    
    //다음 페이지 버튼 속성
    const btnCustom = StyleSheet.create({
        touchable:{
            alignItems:'center',
            justifyContent:'center',
            borderRadius:12,
            backgroundColor: "#00C4CC",
            width:"100%",
            height: 64,
        },
        text:{
            color:"#FFFFFF",
            fontWeight:"bold",
            fontSize:20,
        }
    });    
    const textBtnInfo = {
        connFunc:checkLogin,
        cssStyle: btnCustom,
        title:"로그인"
    }
   
    return(
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.imageContainer}>
                    <Image style={styles.logo} source={require('./../assets/drawable-xxxhdpi/compo7-1.png')}></Image>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.text01}>YOUR EMAIL</Text>
                    <TextInput style={styles.inputStyle} value={emailStr} onChangeText={text => setEmailStr(text)}></TextInput>
                    <Text style={styles.text01}>PASSWORD</Text>
                    <TextInput style={styles.inputStyle} value={pwStr} onChangeText={text => changePwStr(text)}></TextInput>
                    <TouchableOpacity style={[{flexDirection:"row",alignItems:"center"}]} onPress={()=>changeAutoLogin()}>
                        <ImageBackground style={styles.checkBox} source={require('./../assets/drawable-xxxhdpi/icon-toggle-check_box_off_24px.png')}>
                            <Image style={[styles.checkBox, {display:autoLoginDisplay}]} source={require('./../assets/drawable-xxxhdpi/icon-toggle-check_box_24px.png')}></Image>
                        </ImageBackground>
                        <Text style={styles.text02}>자동로그인</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <TextButton info={textBtnInfo} />
                <Image style={styles.worknAll} source={require('./../assets/drawable-xxxhdpi/araworks_logo-1.png')}></Image>
            </View>            
                              
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#093A6A',  
      paddingHorizontal:"9%",    
    },
    //--------------------------------
    topContainer:{
        flex:5
    },   
    bottomContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    //--------------------------------
    imageContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    infoContainer:{
        flex: 1,
        justifyContent: 'center',
    },
    //--------------------------------
    logo:{
        resizeMode:"contain",
        width: "45%",
        height: "30%"
    },    
    inputStyle:{
        backgroundColor:"#FFFFFF66",
        borderRadius:6,
        height:49,
        marginBottom:2,
    },
    checkBox:{
        resizeMode:"contain",
        width: 24,
        height: 24
    },
    worknAll:{
        resizeMode:"contain",
        width: 82,
        height: 16,
        position:'absolute',
        bottom:1
    },
    //--------------------------------
    text01:{
        color:"#FFFFFFC4",
        fontSize:14,
        marginBottom:1
    },
    text02:{
        color:"#FFFFFF",
        fontSize:12,
        
    },    
    
});