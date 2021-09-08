import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ImageBackground, Modal } from 'react-native';
import { TextButton } from './../Compo/TextButton';
import * as awsRequest from './../Requests/AwsRequest';
import { storeJsonData, getJsonData } from './../Compo/storageSelf';
import { getAdjustSizeByWidth } from './../Compo/commonFunc'


export const Login = ({navigation}) => {

    //-------------------변수----------------------

    //로그인 정보 입력 변수
    const [idStr, setIdStr] = useState("Arabooth@work&all.com");    
    const [realPw, setRealPw] = useState("1234");
    const [pwStr, setPwStr] = useState("****");
    const [isAutoLogin, setAutoLogin] = useState(true);
    const [autoLoginDisplay, setAutoLoginDisplay] = useState('none');

    //기존 사용자 정보 변수(로그인 체크시/Modal 이용)
    const [lastId, setLastId] = useState("");
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
        let res1 = await awsRequest.lambda_LoginCheck(idStr, realPw);        
        if (res1 == false) return;

        //데이터 임시 저장 후 세이브시 사용, useState때문인지 변수에 담으면 지워지기에 storage 저장
        let curLoginInfo = {
            tempLogin:res1
        }
        await storeJsonData('TempData', curLoginInfo);

        //사용중이던 부스가 있다면
        if(lastIsUse) {
            if(lastId == idStr) {
                //기존 유저 로그인이라면 사용 중 페이지로 연결
                saveAndNextPage('Action04', {qrData:lastBooth}); 
            }
            else {
                //다른 유저로 로그인이라면 modal open
                openModal();
            }
            return;
        }
        
        //사용했던 데이터가 없거나, 사용중이 아닌 경우 아래 진행
        //첫번째 안내화면 노출 설정
        let setting = await getJsonData('Setting');
        let isNew = false;
        if (setting == null) isNew = true;
        else {
            if (!setting.hasOwnProperty('watchFirstPage')) isNew = true;
        }

        if(isNew || (lastId != idStr)) { //최초 혹은 사용자 변경시 첫페이지 노출
            let newSetting = {
                watchFirstPage:false
            };
            await storeJsonData('Setting', newSetting);
            setting = await getJsonData('Setting');
        }        

        if(setting.watchFirstPage) saveAndNextPage('Action02', null);
        else saveAndNextPage('Action01', null);
    }

    //다음 페이지 이동, 사용자 저장
    const saveAndNextPage = async (stackName, nextPageData) => {
        let settingJson = {
            autoLogin:isAutoLogin
        }
        await storeJsonData('Setting', settingJson);

        let tempData = await getJsonData('TempData');
        //데이터가 없는 경우가 있고, ""로 저장되어있다.
        //추후 데이터 표시영역에서 활용하기 위해 정보 변경
        let userCompany = (tempData.tempLogin['company'] == "") ? "무소속" : tempData.tempLogin['company'];
        let userName = (tempData.tempLogin['name'] == "") ? "사용자" : tempData.tempLogin['name'];
        let userPhone = (tempData.tempLogin['phone'] == "") ? "010xxxxxxxx" : tempData.tempLogin['phone'];

        let curUserJson = {
            id:idStr,
            pw:realPw,
            company:userCompany,
            name:userName,
            phone:userPhone
        }
        await storeJsonData('CurUser', curUserJson);

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

        //사용자 변경됌 >> 첫페이지 노출 초기화
        let newSetting = {
            watchFirstPage:false
        }
        await storeJsonData('Setting', newSetting);

        //사용중 부스 데이터 변경
        let curUserJson = {
            isUsing:false,
            boothName:null,
            startDate:null
        }
        await storeJsonData('CurUser', curUserJson);

        //로그인
        saveAndNextPage('Action01', null);
    }

    //-------------------UseEffect----------------------
    //페이지 오픈시 최초 한번([] 설정) 실행, 
    useEffect(() => {        

        (async () => {    

            let settingJson = await getJsonData('Setting');
            let curUserJson = await getJsonData('CurUser');
            
            if(curUserJson) {
                //이전 사용중이던 정보 저장, 로그인 체킹 및 Modal에서 이용하게 됌
                setLastId(curUserJson.id);
                setLastName(curUserJson.name);
                setLastIsUse(curUserJson.isUsing);
                setLastBooth(curUserJson.boothName);

                if(settingJson) {
                    //자동로그인 세팅이라면
                    if(settingJson.autoLogin) {
                        //저장된 Id,password 확인/세팅
                        setIdStr(curUserJson.id);                
                        setRealPw(curUserJson.pw);

                        let curPw = "";
                        for(let i = 0; i < curUserJson.pw.length; i++)
                            curPw += "*";                    
                        setPwStr(curPw);

                        //체크 Display 변경
                        setAutoLoginDisplay('flex');
                    }
                    else {
                        //체크 Display 변경
                        setAutoLoginDisplay('none');
                    }
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
            borderRadius:getAdjustSizeByWidth(12),
            backgroundColor: "#00C4CC",
            width:"100%",
            height: getAdjustSizeByWidth(64),
        },
        text:{
            color:"#FFFFFF",
            fontWeight:"bold",
            fontSize:getAdjustSizeByWidth(20),
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
            borderBottomRightRadius:getAdjustSizeByWidth(11)
        },
        text:{
            color:"#FFFFFF",
            fontWeight:"bold",
            fontSize:getAdjustSizeByWidth(18),
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
            borderBottomLeftRadius:getAdjustSizeByWidth(11)
        },
        text:{
            color:"#FFFFFF",
            fontWeight:"bold",
            fontSize:getAdjustSizeByWidth(18),
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
                            <Text style={styles.modal_text1}>사용중인 부스가 있습니다</Text>                           
                            <Text></Text>
                            <View style={[{flexDirection:'row'}]}>
                                <Text style={styles.modal_text2}>사용자&nbsp;</Text>
                                <Text style={styles.modal_text3}>{lastName}</Text>
                                <Text style={styles.modal_text2}>&nbsp;이</Text>
                            </View>
                            <Text numberOfLines={1} ellipsizeMode="middle" style={styles.modal_text4}>{lastBooth}</Text>
                            <Text style={styles.modal_text2}>부스를 사용 중입니다</Text>
                            <Text></Text>
                            <Text style={styles.modal_text2}>로그인을 계속 진행하시면</Text>
                            <Text style={styles.modal_text2}>해당 부스는 사용종료 처리됩니다</Text>
                            <Text></Text>
                            <Text style={styles.modal_text2}>로그인 하시겠습니까?</Text>
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
                    <TextInput style={styles.inputStyle} value={idStr} onChangeText={text => setIdStr(text)}></TextInput>
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
        borderRadius:getAdjustSizeByWidth(6),
        height:getAdjustSizeByWidth(49),
        marginBottom:getAdjustSizeByWidth(5),
        paddingLeft:getAdjustSizeByWidth(10)
    },
    checkBox:{
        resizeMode:"contain",
        width: getAdjustSizeByWidth(24),
        height: getAdjustSizeByWidth(24)
    },
    worknAll:{
        resizeMode:"contain",
        //width: 82,
        height: getAdjustSizeByWidth(16),
        position:'absolute',
        bottom:getAdjustSizeByWidth(18)
    },
    //--------------------------------
    text01:{
        color:"#FFFFFFC4",
        fontSize:getAdjustSizeByWidth(14),
        marginBottom:getAdjustSizeByWidth(3)
    },
    text02:{
        color:"#FFFFFF",
        fontSize:getAdjustSizeByWidth(12),        
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
        borderRadius:getAdjustSizeByWidth(12),
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
        width:getAdjustSizeByWidth(36),
        height:getAdjustSizeByWidth(36)
    },
    modal_text1:{
        color:"#000000",
        fontSize:getAdjustSizeByWidth(20),
        fontWeight:"bold"
    },
    modal_text2:{
        color:"#606060",
        fontSize:getAdjustSizeByWidth(18)
    },
    modal_text3:{
        color:"#000000",
        fontSize:getAdjustSizeByWidth(18),
        fontWeight:"bold"
    },   
    modal_text4:{
        color:"#000000",
        fontSize:getAdjustSizeByWidth(18),
        fontWeight:"bold",
        paddingHorizontal:"5%"
    }, 
});