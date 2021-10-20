import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Modal } from 'react-native';
import { TextButton } from './../Compo/TextButton';
import { storeJsonData, getJsonData } from './../Compo/storageSelf';
import * as awsRequest from './../Requests/AwsRequest';
import * as commonFunc from './../Compo/commonFunc';
import { getAdjustSizeByWidth } from './../Compo/commonFunc';

export const Action04 = ({navigation, route}) => {

    //-------------------변수----------------------

    //스캔으로 받아온 데이터
    const {qrData} = route.params;
    
    //입실시점 시간 체크
    const [curDate, setCurDate] = useState({
        year:"0000",
        month:"00",
        day:"00",
        hour:"00",
        minute:"00",
        apm:"00"
    });

    //현재 시간, 퇴실 시간 체크용
    const [now, setNow] = useState(new Date());
    const [apm, setApm] = useState("");
    const [nowHour, setNowHour] = useState(0);

    //Modal 컨트롤
    const [modalVisible, setModalVisible] = useState(false);

    //-------------------함수----------------------

    //다음 페이지 함수, 데이터 넘김(qr, date)
    const goToAction05 = async () =>{
        //Modal 종료
        setModalVisible(false);

        //Request : iot close 요청
        let res1 = await awsRequest.lambda_SetDeviceState(qrData,"on");
        if (res1 == false) return;
        
        //퇴실시, Log 저장
        await awsRequest.lambda_SaveLog(true);

        //퇴실시, 저장된 데이터 사용종료 처리
        let usingDataJson = {
            isUsing:false,
            startDate:null,
            boothName:null,
            startUTCmsec:null
        }
        await storeJsonData('CurUser', usingDataJson);        

        navigation.navigate('Action05', {qrData:qrData,sDate:curDate});
    }

    //Modal 오픈 함수
    const openModal = () => { 
        setNow(new Date());
        setApm((now.getHours() >= 12) ? "PM" : "AM");
        setNowHour((now.getHours() >= 12) ? now.getHours() - 12 : now.getHours());
        setModalVisible(true);
    }

    //Modal 종료 함수
    const exitModal = () => { setModalVisible(false); }

    //-------------------UseEffect----------------------

    //페이지 오픈시 최초 한번([] 설정) 실행, 최초사용/입실/앱재시작 구분
    useEffect(() => {   

        (async () => {

            let curUser = await getJsonData('CurUser');

            let isNew = true;
            if (curUser.hasOwnProperty('isUsing')) {
                if (curUser.isUsing) isNew = false;
            }

            let dateStr;
            if (isNew) dateStr = commonFunc.getCurDate_CustomStr();
            else dateStr = curUser.startDate;

            if (isNew) {
                let usingDataJson = {
                    isUsing:true,
                    boothName:qrData,
                    startDate:dateStr,
                    startUTCmsec:Date.now()
                }
                await storeJsonData('CurUser', usingDataJson);
                await awsRequest.lambda_SaveLog(false);
            }
            
            let dateArr = dateStr.split('.');
            let startHour = (Number(dateArr[3]) >= 12) ? Number(dateArr[3]) - 12 : Number(dateArr[3]);
            setCurDate({
                year:dateArr[0],
                month:dateArr[1],
                day:dateArr[2],
                hour:commonFunc.numToZeroStr(startHour),
                minute:dateArr[4],
                apm:(Number(dateArr[3]) >= 12) ? "PM" : "AM"
            });

            if (isNew) {
                setTimeout(async ()=>{
                    await awsRequest.lambda_SetDeviceState(qrData,"on");
                }, 3000);
            }

        })();

    }, []);

    //-------------------커스텀 버튼----------------------
   
    //모달 종료 버튼 속성
    const modalExit = StyleSheet.create({
        touchable:{
            alignItems:'center',
            justifyContent:'center',
            backgroundColor: "#000000",
            width:"100%",
            height: "100%",
            borderBottomRightRadius:getAdjustSizeByWidth(12)
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
            borderBottomLeftRadius:getAdjustSizeByWidth(12)
        },
        text:{
            color:"#FFFFFF",
            fontWeight:"bold",
            fontSize:getAdjustSizeByWidth(18),
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
            borderRadius:getAdjustSizeByWidth(12),
            backgroundColor: "#ff7856",
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
        connFunc:openModal,
        cssStyle: btnCustom,
        title:"퇴실하기"
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
                            <Text style={styles.modal_text1}>정말 퇴실 하시겠습니까?</Text>
                            <Text style={styles.modal_text2}>
                                퇴실시간 : &nbsp;
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
                    <Text style={styles.text1}>Open</Text>
                </View>
                <View style={styles.top02}>
                    <Image style={styles.img01} source={require('./../assets/drawable-xxxhdpi/compo11-1.png')}></Image>
                    <Text></Text>
                    <Text style={styles.text2}>입실이 승인되었습니다</Text>
                    <Text style={styles.text3}>스마트부스 문을 열고 입실하세요!</Text>
                </View>
                <View style={styles.top03}>
                    <View style={styles.top03_1}>
                        <View style={styles.box01}>
                            <Text numberOfLines={1} ellipsizeMode="middle" style={styles.text4}>{qrData}</Text>
                        </View>
                        <View style={styles.box02}>
                            <View style={styles.boxArea04}><Text style={styles.text5}>입실시간</Text></View>
                            <View style={styles.boxArea05}>
                                <Text style={styles.text6}>
                                    {curDate.year}. {curDate.month}. {curDate.day}
                                </Text>
                            </View>
                            <View style={styles.boxArea03}>
                                <Text style={styles.text6}>
                                    {curDate.apm} {curDate.hour}:{curDate.minute}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.box03}>
                            <View style={styles.boxArea01}><Text style={styles.text7}>퇴실시간</Text></View>
                            <View style={styles.boxArea02}><Text style={styles.text8}>-</Text></View>
                            <View style={styles.boxArea03}><Text style={styles.text8}>-</Text></View>
                        </View>
                    </View>
                    <View style={styles.top03_2}>
                        <Text style={styles.text9}>사용 종료 후</Text>
                        <View style={[{flexDirection:'row'}]}>
                            <Text style={styles.text9}>반드시 아래 </Text>
                            <Text style={styles.text10}>퇴실하기</Text>
                            <Text style={styles.text9}> 버튼을 눌러주세요!</Text>
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
        flex:3.5,
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
        width:getAdjustSizeByWidth(27),
        height:getAdjustSizeByWidth(37)
    },
    box01:{        
        alignItems:'center',
        justifyContent:'center',
        borderWidth: getAdjustSizeByWidth(1),
        borderColor:"#c0c0c0",
        borderRadius:getAdjustSizeByWidth(6),
        backgroundColor: "#fbfbfb",
        width:"100%",
        height: getAdjustSizeByWidth(43),
        marginBottom:getAdjustSizeByWidth(10),
    },
    box02:{    
        borderWidth: getAdjustSizeByWidth(2),
        borderColor:"#00c4cc",
        borderRadius:getAdjustSizeByWidth(6),
        backgroundColor: "#ffffff",
        width:"100%",
        height: getAdjustSizeByWidth(43),
        marginBottom:getAdjustSizeByWidth(10),
        flexDirection:"row"
    },
    box03:{    
        borderWidth: getAdjustSizeByWidth(1),
        borderColor:"#c0c0c0",
        borderRadius:getAdjustSizeByWidth(6),
        backgroundColor: "#ffffff",
        width:"100%",
        height: getAdjustSizeByWidth(43),
        marginBottom:getAdjustSizeByWidth(10),
        flexDirection:"row"
    },
    //--------------------------------  
    boxArea01:{
        flex:1,
        borderRightWidth:getAdjustSizeByWidth(1),
        borderColor:"#c0c0c0",
        alignItems:'center',
        justifyContent:'center',
    },
    boxArea02:{
        flex:1.2,
        borderRightWidth:getAdjustSizeByWidth(1),
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
        borderRightWidth:getAdjustSizeByWidth(2),
        borderColor:"#00c4cc",
        alignItems:'center',
        justifyContent:'center',
    },
    //--------------------------------
    text1:{
        color:"#00c4cc",
        fontSize:getAdjustSizeByWidth(45)
    },
    text2:{
        color:"#00c4cc",
        fontSize:getAdjustSizeByWidth(28),
        fontWeight:"bold"
    },
    text3:{
        color:"#000000",
        fontSize:getAdjustSizeByWidth(24)
    },
    text4:{
        color:'#000000',
        fontSize:getAdjustSizeByWidth(18),
        paddingHorizontal:"5%"
    },
    text5:{
        color:'#000000',
        fontSize:getAdjustSizeByWidth(18),
        fontWeight:"bold"
    },
    text6:{
        color:'#979797',
        fontSize:getAdjustSizeByWidth(18)
    },
    text7:{
        color:'#979797',
        fontSize:getAdjustSizeByWidth(18),
        fontWeight:"bold"
    },
    text8:{
        color:'#c0c0c0',
        fontSize:getAdjustSizeByWidth(18)
    },
    text9:{
        color:'#ff7856',
        fontSize:getAdjustSizeByWidth(18)
    },
    text10:{
        color:'#ff7856',
        fontSize:getAdjustSizeByWidth(18),
        fontWeight:"bold"
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
        height:getAdjustSizeByWidth(222),
        borderRadius:getAdjustSizeByWidth(12),
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
        width:getAdjustSizeByWidth(36),
        height:getAdjustSizeByWidth(36)
    },
    modal_text1:{
        color:"#000000",
        fontSize:getAdjustSizeByWidth(20),
        fontWeight:"bold"
    },
    modal_text2:{
        color:"#a0a0a0",
        fontSize:getAdjustSizeByWidth(18)
    },
});