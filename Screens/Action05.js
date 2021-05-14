import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { TextButton } from './../Compo/TextButton'

export const Action05 = ({navigation, route}) => { 
    
    //이전 페이지에서 받아온 데이터
    const {qrData, sDate} = route.params;

    //현재 시간, 퇴실 시간 체크용
    let now = new Date();
    let nowApm = (now.getHours() > 12) ? "PM" : "AM";
    let nowHour = (now.getHours() > 12) ? now.getHours() - 12 : now.getHours();
    let curDate = {
        year:now.getFullYear(),
        month:(now.getMonth() + 1 < 10) ? "0" + (now.getMonth() + 1) : now.getMonth() + 1,
        day:(now.getDate() < 10) ? "0" + now.getDate() : now.getDate(),
        hour:(nowHour < 10) ? "0" + nowHour : nowHour,
        minute:(now.getMinutes() < 10) ? "0" + now.getMinutes() : now.getMinutes(),
        apm:nowApm
    }
  
    //다음 페이지 함수
    const goToAction01 = () =>{
        navigation.navigate('Action01');
    }

    //다음 페이지 버튼 속성
    const btnCustom = StyleSheet.create({
        touchable:{
            alignItems:'center',
            justifyContent:'center',
            borderRadius:12,
            backgroundColor: "#000000",
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
        connFunc:goToAction01,
        cssStyle: btnCustom,
        title:"처음으로"
    }

    return(
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.top01}>
                    <Text style={[{color:"#00c4cc",fontSize:45}]}>Closed</Text>
                </View>
                <View style={styles.top02}>
                    <Image style={styles.img01} source={require('./../assets/drawable-xxxhdpi/compo12-1.png')}></Image>
                    <Text></Text>
                    <Text style={[{color:"#ff7856",fontSize:28,fontWeight:"bold"}]}>퇴실이 완료되었습니다</Text>
                    <Text style={[{color:"#000000",fontSize:24,}]}>이용해 주셔서 감사합니다.</Text>
                </View>
                <View style={styles.top03}>
                    <View style={styles.top03_1}>
                        <View style={styles.box01}><Text style={[{color:'#000000',fontSize:18}]}>{qrData}</Text></View>
                        <View style={styles.box02}>
                            <View style={styles.boxArea04}><Text style={[{color:'#000000',fontSize:18, fontWeight:"bold"}]}>입실시간</Text></View>
                            <View style={styles.boxArea05}>
                                <Text style={[{color:'#979797',fontSize:18}]}>
                                    {sDate.year}. {sDate.month}. {sDate.day}
                                </Text>
                            </View>
                            <View style={styles.boxArea03}>
                                <Text style={[{color:'#979797',fontSize:18}]}>
                                    {sDate.apm} {sDate.hour}:{sDate.minute}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.box03}>
                            <View style={styles.boxArea01}><Text style={[{color:'#000000',fontSize:18, fontWeight:"bold"}]}>퇴실시간</Text></View>
                            <View style={styles.boxArea02}>
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
                    </View>
                    <View style={styles.top03_2}>
                        <Text style={[{color:'#979797',fontSize:14}]}>소지품을 두고 나오지 않도록 주의해주세요!</Text>
                        <Text style={[{color:'#979797',fontSize:14}]}>다음 사람을 위해 청결한 마무리 에티켓을 지켜주세요!</Text>
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
        borderWidth: 2,
        borderColor:"#ff7856",
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
        borderRightWidth:2,
        borderColor:"#ff7856",
        alignItems:'center',
        justifyContent:'center',
    },
    boxArea02:{
        flex:1.2,
        borderRightWidth:2,
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
});