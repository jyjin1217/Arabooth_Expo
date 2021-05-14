import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Modal } from 'react-native';
import { TextButton } from './../Compo/TextButton'
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Action04 = ({navigation, route}) => {
    //이전 페이지에서 받아온 데이터
    const {qrData} = route.params;
    
    //입실시점, 추가 수정 필요
    let started = new Date();
    let startedApm = (started.getHours() > 12) ? "PM" : "AM";
    let startHour = (started.getHours() > 12) ? started.getHours() - 12 : started.getHours();    
    // const [curDate, setCurDate] = useState({
    //     year:started.getFullYear(),
    //     month:(started.getMonth() + 1 < 10) ? "0" + (started.getMonth() + 1) : started.getMonth() + 1,
    //     day:(started.getDate() < 10) ? "0" + started.getDate() : started.getDate(),
    //     hour:(startHour < 10) ? "0" + startHour : startHour,
    //     minute:(started.getMinutes() < 10) ? "0" + started.getMinutes() : started.getMinutes(),
    //     apm:startedApm
    // });
    
    let curDate = {
        year:started.getFullYear(),
        month:(started.getMonth() + 1 < 10) ? "0" + (started.getMonth() + 1) : started.getMonth() + 1,
        day:(started.getDate() < 10) ? "0" + started.getDate() : started.getDate(),
        hour:(startHour < 10) ? "0" + startHour : startHour,
        minute:(started.getMinutes() < 10) ? "0" + started.getMinutes() : started.getMinutes(),
        apm:startedApm
    }

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

    const settingCurDate = async () =>{        
        let usingData = await getJsonData('isUsing');
            
        if(usingData){                
            if(usingData.isUse){
                console.log("-------------1--------------");
                console.log(curDate);
                //앱재시작시, 저장된 시작시간으로 변경
                //qrData(부스이름)은 로그인페이지에서 이동시 전달

                curDate.year = usingData.startTime.year;
                curDate.month = usingData.startTime.month;
                curDate.day = usingData.startTime.day;
                curDate.hour = usingData.startTime.hour;
                curDate.minute = usingData.startTime.minute;
                curDate.apm = usingData.startTime.apm;

                console.log("-------------2--------------");
                console.log(curDate);
            }
            else {
                //입실시, 현재 시간을 저장
                let usingDataJson = {
                    isUse:true,
                    startTime:curDate,
                    boothName:qrData
                }
                await storeJsonData('isUsing', usingDataJson);
            }
        }
        else{
            //최초사용시
            let usingDataJson = {
                isUse:true,
                startTime:curDate,
                boothName:qrData
            }
            await storeJsonData('isUsing', usingDataJson);
        }
    }
    settingCurDate();


    //페이지 오픈시 최초 한번([] 설정) 실행, 경우 최초사용/입실/앱재시작 구분
    // useEffect(() => {        
    //     (async () => {
                        
            
    //     })();
    // }, []);

  
    //다음 페이지 함수, 데이터 넘김(qr, date), 수정 필요
    const goToAction05 = () =>{
        setModalVisible(false);
        navigation.navigate('Action05', {qrData:qrData,sDate:curDate});
    }

    //현재 시간, 퇴실 시간 체크용
    const [now, setNow] = useState(new Date());
    const [apm, setApm] = useState("");
    const [nowHour, setNowHour] = useState(0);

    //모달 컨트롤
    const [modalVisible, setModalVisible] = useState(false);
    
    //모달 오픈 함수
    const openModal = () => { 
        setNow(new Date());
        setApm((now.getHours() > 12) ? "PM" : "AM");
        setNowHour((now.getHours() > 12) ? now.getHours() - 12 : now.getHours());
        setModalVisible(true);
    }
    //모달 종료 함수
    const exitModal = () => { setModalVisible(false); }

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
        connFunc:goToAction05,
        cssStyle: modalNext,
        title:"예"
    }

    //퇴실하기(모달오픈) 버튼 속성
    const btnCustom = StyleSheet.create({
        touchable:{
            alignItems:'center',
            justifyContent:'center',
            borderRadius:12,
            backgroundColor: "#ff7856",
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
        connFunc:openModal,
        cssStyle: btnCustom,
        title:"퇴실하기"
    }

    return(
        <View style={styles.container}>

            <Modal visible={modalVisible} onRequestClose={()=>setModalVisible(false)} transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalBox}>
                        <View style={styles.modalBox_1}>
                            <Image style={styles.modal_img} source={require('./../assets/drawable-xxxhdpi/icon-alert-error_24px.png')}></Image>
                            <Text></Text>
                            <Text style={[{color:"#000000",fontSize:20,fontWeight:"bold"}]}>정말 퇴실 하시겠습니까?</Text>
                            <Text style={[{color:"#c0c0c0",fontSize:18}]}>
                                퇴실시간&nbsp;
                                {now.getFullYear()}.&nbsp;
                                {(now.getMonth() + 1 < 10) ? "0" + (now.getMonth() + 1) : now.getMonth() + 1}.&nbsp;
                                {(now.getDate() < 10) ? "0" + now.getDate() : now.getDate()}&nbsp;
                                {apm}&nbsp;
                                {(nowHour < 10) ? "0" + nowHour : nowHour}:
                                {(now.getMinutes() < 10) ? "0" + now.getMinutes() : now.getMinutes()}
                            </Text>
                        </View>
                        <View style={styles.modalBox_2}>
                            <View style={styles.modalBox_2_1}><TextButton info={modalNextInfo} /></View>
                            <View style={styles.modalBox_2_1}><TextButton info={modalExitInfo} /></View>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.topContainer}>
                <View style={styles.top01}>
                    <Text style={[{color:"#00c4cc",fontSize:45}]}>Open</Text>
                </View>
                <View style={styles.top02}>
                    <Image style={styles.img01} source={require('./../assets/drawable-xxxhdpi/compo11-1.png')}></Image>
                    <Text></Text>
                    <Text style={[{color:"#00c4cc",fontSize:28,fontWeight:"bold"}]}>입실이 승인되었습니다</Text>
                    <Text style={[{color:"#000000",fontSize:24,}]}>스마트부스 문을 열고 입실하세요!</Text>
                </View>
                <View style={styles.top03}>
                    <View style={styles.top03_1}>
                        <View style={styles.box01}><Text style={[{color:'#000000',fontSize:18}]}>{qrData}</Text></View>
                        <View style={styles.box02}>
                            <View style={styles.boxArea04}><Text style={[{color:'#000000',fontSize:18, fontWeight:"bold"}]}>입실시간</Text></View>
                            <View style={styles.boxArea05}>
                                <Text style={[{color:'#979797',fontSize:18}]}>
                                    {curDate.year}. {curDate.month}. {curDate.day}
                                </Text>
                            </View>
                            <View style={styles.boxArea03}>
                                <Text style={[{color:'#979797',fontSize:18}]}>
                                    {curDate.apm} {curDate.hour}:{curDate.minute}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.box03}>
                            <View style={styles.boxArea01}><Text style={[{color:'#979797',fontSize:18, fontWeight:"bold"}]}>퇴실시간</Text></View>
                            <View style={styles.boxArea02}><Text style={[{color:'#c0c0c0',fontSize:18}]}>-</Text></View>
                            <View style={styles.boxArea03}><Text style={[{color:'#c0c0c0',fontSize:18}]}>-</Text></View>
                        </View>
                    </View>
                    <View style={styles.top03_2}>
                        <Text style={[{color:'#ff7856',fontSize:18}]}>사용 종료 후</Text>
                        <View style={[{flexDirection:'row'}]}>
                            <Text style={[{color:'#ff7856',fontSize:18}]}>반드시 아래 </Text>
                            <Text style={[{color:'#ff7856',fontSize:18,fontWeight:"bold"}]}>퇴실하기</Text>
                            <Text style={[{color:'#ff7856',fontSize:18}]}> 버튼을 눌러주세요!</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <TextButton info={textBtnInfo} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',   
        paddingHorizontal:"9%",   
    },
    //--------------------------------
    topContainer:{
        flex:5,
    },   
    bottomContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'    
    },
    //--------------------------------
    top01:{
        flex:1,
        alignItems:'center',
        justifyContent:'flex-end'
    },
    top02:{
        flex:2,
        alignItems:'center',
        justifyContent:'center'
    },
    top03:{
        flex:2,
    },
    //--------------------------------
    top03_1:{
        flex:3,
        alignItems:'center',
        justifyContent:'center'
    },
    top03_2:{
        flex:1,
        alignItems:'center',
        justifyContent:'flex-end'
    },    
    //--------------------------------
    img01:{
        resizeMode:"contain",
        width:27,
        height:37
    },
    box01:{        
        alignItems:'center',
        justifyContent:'center',
        borderWidth: 1,
        borderColor:"#c0c0c0",
        borderRadius:6,
        backgroundColor: "#fbfbfb",
        width:"100%",
        height: 43,
        marginBottom:10,
    },
    box02:{    
        borderWidth: 2,
        borderColor:"#00c4cc",
        borderRadius:6,
        backgroundColor: "#ffffff",
        width:"100%",
        height: 43,
        marginBottom:10,
        flexDirection:"row"
    },
    box03:{    
        borderWidth: 1,
        borderColor:"#c0c0c0",
        borderRadius:6,
        backgroundColor: "#ffffff",
        width:"100%",
        height: 43,
        marginBottom:10,
        flexDirection:"row"
    },
    //--------------------------------  
    boxArea01:{
        flex:1,
        borderRightWidth:1,
        borderColor:"#c0c0c0",
        alignItems:'center',
        justifyContent:'center',
    },
    boxArea02:{
        flex:1.2,
        borderRightWidth:1,
        borderColor:"#c0c0c0",
        alignItems:'center',
        justifyContent:'center',
    },
    boxArea03:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    boxArea04:{
        flex:1,
        borderRightWidth:2,
        borderColor:"#00c4cc",
        alignItems:'center',
        justifyContent:'center',
    },
    boxArea05:{
        flex:1.2,
        borderRightWidth:2,
        borderColor:"#00c4cc",
        alignItems:'center',
        justifyContent:'center',
    },
    //--------------------------------

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
        height:222,
        borderRadius:12,
        backgroundColor:'#ffffff'
    },
    modalBox_1:{
        flex:2.5,
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