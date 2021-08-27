import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ImageBackground, Modal } from 'react-native';
import { TextButton } from './../Compo/TextButton';
import * as awsRequest from './../Requests/AwsRequest';
import { storeJsonData, getJsonData } from './../Compo/storageSelf';

export const Login = ({navigation}) => {
        
    //-------------------변수----------------------

    //로그인 정보 입력 변수
    const [emailStr, setEmailStr] = useState("Arabooth@work&all.com");    
    const [realPw, setRealPw] = useState("1234");
    const [pwStr, setPwStr] = useState("****");
    const [isAutoLogin, setAutoLogin] = useState(true);
    const [autoLoginDisplay, setAutoLoginDisplay] = useState('none');

    //기존 사용자 정보 변수(로그인 체크시/Modal 이용)
    const [lastEmail, setLastEmail] = useState("");
    const [lastName, setLastName] = useState("");
    const [lastIsUse, setLastIsUse] = useState(false);
    const [lastBooth, setLastBooth] = useState("");

    //모달 컨트롤
    const [modalVisible, setModalVisible] = useState(false);    
    
    //-------------------함수----------------------

    //입력에 따른 비밀번호 변경, (*) 표시 작업
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

    //autoLogin Display 변경
    const changeAutoLogin = () => {
        //useState를 통한 변경은 즉시 반영이 안되기 때문에 지역변수로 담아 체킹
        let curSelect = !isAutoLogin;
        setAutoLogin(!isAutoLogin);

        if(curSelect)
            setAutoLoginDisplay('flex');
        else
            setAutoLoginDisplay('none');
    }

    //로그인 정보 검사
    const checkLogin = async () =>{

        //로그인 정보 유효성 request     
        let res1 = await awsRequest.lambda_LoginCheck(emailStr, realPw);        
        if (res1 == false) return;

        //데이터 임시 저장 후 세이브시 사용, useState때문인지 변수에 담으면 지워지기에 storage 저장
        let attemptUser = {
            info:res1
        }
        await storeJsonData('attemptUser', attemptUser);

        //사용중이던 부스가 있다면
        if(lastIsUse) {
            if(lastEmail == emailStr) {
                //기존 유저 로그인이라면 사용 중 페이지로 연결
                saveAndNextPage('Action04', {qrData:lastBooth}); 
            }
            else {
                //다른 유저로 로그인이라면 modal open
                openModal();
            }
            return;
        }
        
        //사용했던 데이터가 없거나, 사용중이 아닌 경우
        let setting = await getJsonData('Setting');
        if(setting == null) {
            setting = {
                watchFirstPage:false
            };
            await storeJsonData('Setting', setting);
        }        

        if(setting.watchFirstPage) saveAndNextPage('Action02', null);
        else saveAndNextPage('Action01', null);
    }

    //다음 페이지 이동, 사용자 저장
    const saveAndNextPage = async (stackName, nextPageData) => {
        let autoLoginJosn = {
            isAuto:isAutoLogin
        }
        await storeJsonData('autoLogin', autoLoginJosn);

        let attemptUser = await getJsonData('attemptUser');
        //데이터가 없을 경우 ""로 저장되어있다.
        //추후 데이터 표시영역에서 활용하기 위해 정보 변경
        let userCompany = attemptUser.info['company'];
        if (userCompany == "") userCompany = "무소속";
        let userName = attemptUser.info['name'];
        if (userName == "") userName = "???";
        let userPhone = attemptUser.info['phone'];
        if (userPhone == "") userPhone = "000xxxxxxxx";

        let loginJson = {
            email:emailStr,
            pw:realPw,
            company:userCompany,
            name:userName,
            phone:userPhone
        }
        await storeJsonData('login', loginJson);

        if(nextPageData == null)
            navigation.navigate(stackName);
        else
            navigation.navigate(stackName, nextPageData);
    }

    //Modal 오픈
    const openModal = () => { setModalVisible(true); }
    //Modal 종료
    const exitModal = () => { setModalVisible(false); }

    //Modal 로그인(사용자 변경 + 사용중 부스)
    const userChangeLogin = async () => {
        //모달 종료
        setModalVisible(false);

        //기존 사용자의 부스 이용 종료처리
        //Request : iot close 요청
        let res1 = await awsRequest.lambda_SetDeviceState(lastBooth,"on");
        if (res1 == false) return;

        //퇴실시, Log 저장
        await awsRequest.lambda_SaveLog(true);

        //사용중 부스 데이터 변경
        let usingDataJson = {
            isUse:false,
            startTime:null,
            boothName:null,
            sDate:null
        }
        await storeJsonData('isUsing', usingDataJson);

        //로그인
        saveAndNextPage('Action01', null);
    }

    //-------------------UseEffect----------------------
    //페이지 오픈시 최초 한번([] 설정) 실행, 
    useEffect(() => {        
        (async () => {            
            let autoLoginJson = await getJsonData('autoLogin');
            let loginJson = await getJsonData('login');
            let usingData = await getJsonData('isUsing');

            if(loginJson && usingData) {
                //이전 사용중이던 정보 저장, 로그인 체킹 및 Modal에서 이용하게 됌
                setLastEmail(loginJson.email);
                setLastName(loginJson.name);
                setLastIsUse(usingData.isUse);
                setLastBooth(usingData.boothName);
            }

            if(autoLoginJson && loginJson){
                //자동로그인 세팅이라면
                if(autoLoginJson.isAuto){
                    //저장된 Id,password 확인/세팅                    
                    if(loginJson){                
                        setEmailStr(loginJson.email);                
                        setRealPw(loginJson.pw);

                        let curPw = "";
                        for(let i = 0; i < loginJson.pw.length; i++)
                            curPw += "*";                    
                        setPwStr(curPw);
                    }
                    
                    //체크 Display 변경
                    setAutoLoginDisplay('flex');
                }
                else {
                    //체크 Display 변경
                    setAutoLoginDisplay('none');
                }                
            }
            
        })();
    }, []);

    //-------------------커스텀 버튼----------------------
    //connFunc에 연결되는 함수가 위쪽에 선언되어있어야 작동한다...왜?;;

    //로그인 버튼 속성
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

    //모달 종료 버튼 속성
    const modalExit = StyleSheet.create({
        touchable:{
            alignItems:'center',
            justifyContent:'center',
            backgroundColor: "#000000",
            width:"100%",
            height: "100%",
            borderBottomRightRadius:12
        },
        text:{
            color:"#FFFFFF",
            fontWeight:"bold",
            fontSize:18,
        }
    });    
    const modalExitInfo = {
        connFunc:exitModal,
        cssStyle: modalExit,
        title:"아니오"
    }

    //모달 다음 버튼 속성
    const modalNext = StyleSheet.create({
        touchable:{
            alignItems:'center',
            justifyContent:'center',
            backgroundColor: "#ff7856",
            width:"100%",
            height: "100%",
            borderBottomLeftRadius:12
        },
        text:{
            color:"#FFFFFF",
            fontWeight:"bold",
            fontSize:18,
        }
    });    
    const modalNextInfo = {
        connFunc:userChangeLogin,
        cssStyle: modalNext,
        title:"예"
    }

    //-------------------Render----------------------
    return(
        <View style={styles.container}>

            <Modal visible={modalVisible} onRequestClose={()=>setModalVisible(false)} transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalBox}>
                        <View style={styles.modalBox_1}>
                            <Image style={styles.modal_img} source={require('./../assets/drawable-xxxhdpi/icon-alert-error_24px.png')}></Image>
                            <Text></Text>
                            <Text style={[{color:"#000000",fontSize:20,fontWeight:"bold"}]}>사용중인 부스가 있습니다</Text>                           
                            <Text></Text>
                            <View style={[{flexDirection:'row'}]}>
                                <Text style={[{color:"#606060",fontSize:18}]}>사용자&nbsp;</Text>
                                <Text style={[{color:"#000000",fontSize:18,fontWeight:"bold"}]}>{lastName}</Text>
                                <Text style={[{color:"#606060",fontSize:18}]}>&nbsp;이</Text>
                            </View>
                            <Text numberOfLines={1} ellipsizeMode="middle" style={[{color:"#000000",fontSize:18,fontWeight:"bold",paddingHorizontal:"5%"}]}>{lastBooth}</Text>
                            <Text style={[{color:"#606060",fontSize:18}]}>부스를 사용 중입니다</Text>
                            <Text></Text>
                            <Text style={[{color:"#606060",fontSize:18}]}>로그인을 계속 진행하시면</Text>
                            <Text style={[{color:"#606060",fontSize:18}]}>해당 부스는 사용종료 처리됩니다</Text>
                            <Text></Text>
                            <Text style={[{color:"#606060",fontSize:18}]}>로그인 하시겠습니까?</Text>
                        </View>
                        <View style={styles.modalBox_2}>
                            <View style={styles.modalBox_2_1}><TextButton info={modalNextInfo} /></View>
                            <View style={styles.modalBox_2_1}><TextButton info={modalExitInfo} /></View>
                        </View>
                    </View>
                </View>
            </Modal>

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
        flex:3.5
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
        marginBottom:5,
        paddingLeft:10
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
        bottom:18
    },
    //--------------------------------
    text01:{
        color:"#FFFFFFC4",
        fontSize:14,
        marginBottom:3
    },
    text02:{
        color:"#FFFFFF",
        fontSize:12,
        
    },    
    //--------------------------------
    modalContainer:{
        flex:1,        
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:"#093a6a80",
        paddingHorizontal:"9%"
    },
    modalBox:{
        width:"100%",
        height:"65%",
        borderRadius:12,
        backgroundColor:'#ffffff',
    },
    modalBox_1:{
        flex:4.5,  
        alignItems:'center',
        justifyContent:'center',
    },
    modalBox_2:{
        flex:1,
        flexDirection:"row"
    },
    modalBox_2_1:{
        flex:1,
    },
    //--------------------------------
    modal_img:{
        resizeMode:"contain",
        width:36,
        height:36
    },
    
});