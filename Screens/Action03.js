import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextButton } from './../Compo/TextButton';
import { getJsonData } from './../Compo/storageSelf';
import * as awsRequest from './../Requests/AwsRequest';

export const Action03 = ({navigation, route}) => {

    //-------------------변수----------------------

    //스캔으로 받아온 데이터
    const {qrData} = route.params;    

    //고객정보
    const [userCompany, setUserCompany] = useState("워크앤올");    
    const [userName, setUserName] = useState("아라부스");

    //-------------------함수----------------------

    //다음페이지 함수
    const goToAction04 = async () =>{
        //Request : iot open 요청
        let res1 = await awsRequest.server_IotRequest(qrData,"off");
        if (res1 == false) return;
        
        navigation.navigate('Action04', {qrData:qrData});     
    }

    //취소가 있어야지 않을까..? 보류
    // const goToAction01 = () =>{
    //     navigation.navigate('Action01');
    // }

    //-------------------UseEffect----------------------
    useEffect(() => {        
        (async () => {            
            let loginJson = await getJsonData('login');
            setUserCompany(loginJson['company']);
            setUserName(loginJson['name']);            
        })();
    }, []);

    //-------------------커스텀 버튼----------------------

    //다음페이지 버튼 속성
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
        connFunc:goToAction04,
        cssStyle: btnCustom,
        title:"입실하기"
    }

    //-------------------Render----------------------
    return(
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.top01}>
                    <Text style={styles.text01}>Hello</Text>
                </View>
                <View style={styles.top02}>
                    <Text style={styles.text05}>{userCompany}</Text>
                    <Text style={styles.text05}>{userName}</Text>                    
                    <Text style={styles.text04}>고객님 인증되었습니다</Text>
                </View>
                <View style={styles.top03}>  
                    <Text numberOfLines={1} ellipsizeMode="middle" style={styles.text03}>{qrData}</Text> 
                    <Text style={styles.text02}>부스를 이용하시겠습니까?</Text>
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
        alignItems:'center',
    },
    //--------------------------------
    text01:{
        color:"#00c4cc", 
        fontSize:45,
    },
    text02:{
        color:"#a2a2a2",
        fontSize:24,
    },
    text03:{
        color:"#000000", 
        fontSize:24,
        fontWeight:"bold"
    }, 
    text04:{
        color:"#000000",
        fontSize:28,
    },
    text05:{
        color:"#000000", 
        fontSize:28,
        fontWeight:"bold"
    },

});