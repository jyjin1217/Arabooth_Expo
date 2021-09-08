import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { TextButton } from './../Compo/TextButton';
import * as commonFunc from './../Compo/commonFunc';
import { getAdjustSizeByWidth } from './../Compo/commonFunc';

export const Action05 = ({navigation, route}) => { 

    //-------------------변수----------------------

    //qr, 입실시점 데이터
    const {qrData, sDate} = route.params;

    //퇴실 시간
    const [endDate, setEndDate] = useState({
        year:"0000",
        month:"00",
        day:"00",
        hour:"00",
        minute:"00",
        apm:"00"
    });

    //-------------------함수----------------------

    //다음 페이지 함수
    const goToAction02 = () =>{
        navigation.navigate('Action02');
    }

    //-------------------UseEffect----------------------
    useEffect(() => {   

        let dateStr = commonFunc.getCurDate_CustomStr();
        let dateArr = dateStr.split('.');
        let startHour = (Number(dateArr[3]) >= 12) ? Number(dateArr[3]) - 12 : Number(dateArr[3]);
        setEndDate({
            year:dateArr[0],
            month:dateArr[1],
            day:dateArr[2],
            hour:commonFunc.numToZeroStr(startHour),
            minute:dateArr[4],
            apm:(Number(dateArr[3]) >= 12) ? "PM" : "AM"
        });

    }, []);

    //-------------------커스텀 버튼----------------------  
    
    //다음 페이지 버튼 속성
    const btnCustom = StyleSheet.create({
        touchable:{
            alignItems:'center',
            justifyContent:'center',
            borderRadius:getAdjustSizeByWidth(12),
            backgroundColor: "#000000",
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
        connFunc:goToAction02,
        cssStyle: btnCustom,
        title:"처음으로"
    }

    //-------------------Render----------------------
    return(
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.top01}>
                    <Text style={styles.text1}>Closed</Text>
                </View>
                <View style={styles.top02}>
                    <Image style={styles.img01} source={require('./../assets/drawable-xxxhdpi/compo12-1.png')}></Image>
                    <Text></Text>
                    <Text style={styles.text2}>퇴실이 완료되었습니다</Text>
                    <Text style={styles.text3}>이용해 주셔서 감사합니다</Text>
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
                                    {sDate.year}. {sDate.month}. {sDate.day}
                                </Text>
                            </View>
                            <View style={styles.boxArea03}>
                                <Text style={styles.text6}>
                                    {sDate.apm} {sDate.hour}:{sDate.minute}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.box03}>
                            <View style={styles.boxArea01}><Text style={styles.text5}>퇴실시간</Text></View>
                            <View style={styles.boxArea02}>
                                <Text style={styles.text6}>
                                    {endDate.year}. {endDate.month}. {endDate.day}
                                </Text>
                            </View>
                            <View style={styles.boxArea03}>
                                <Text style={styles.text6}>
                                    {endDate.apm} {endDate.hour}:{endDate.minute}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.top03_2}>
                        <Text style={styles.text7}>소지품을 두고 나오지 않도록 주의해주세요!</Text>
                        <Text style={styles.text7}>다음 사람을 위해 청결한 마무리 에티켓을 지켜주세요!</Text>
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
        borderWidth: getAdjustSizeByWidth(2),
        borderColor:"#ff7856",
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
        borderRightWidth:getAdjustSizeByWidth(2),
        borderColor:"#ff7856",
        alignItems:'center',
        justifyContent:'center',
    },
    boxArea02:{
        flex:1.2,
        borderRightWidth:getAdjustSizeByWidth(2),
        borderColor:"#ff7856",
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
        borderRightWidth:getAdjustSizeByWidth(2),
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
        color:"#ff7856",
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
        fontSize:getAdjustSizeByWidth(14)
    },
});