import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextButton } from './../Compo/TextButton'

export const Action03 = ({navigation, route}) => {

    //이전 페이지에서 받아온 데이터
    const {qrData} = route.params;    

    //다음페이지 함수, 데이터 넘김
    const goToAction04 = async () =>{
        //let response = await fetch('http://10.0.2.2:5000/userMessage/' + qrData,{method:'POST'});
        let response = await fetch('http://arabooth-env.eba-28bbr78h.ap-northeast-2.elasticbeanstalk.com/userMessage/' + qrData,{method:'POST'});
        let rJson = await response.json();
        console.log(rJson);
        console.log(rJson.msg);
        navigation.navigate('Action04', {qrData:qrData});     
    }

    //취소가 있어야지 않을까..? 보류
    // const goToAction01 = () =>{
    //     navigation.navigate('Action01');
    // }

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

    return(
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.top01}>
                    <Text style={styles.text01}>Hello</Text>
                </View>
                <View style={styles.top02}>
                    <Text style={styles.text05}>워크앤올</Text>
                    <View style={[{flexDirection:'row'}]}>
                        <Text style={styles.text05}>아라부스</Text>
                        <Text style={styles.text04}> 고객님</Text>
                    </View>
                    <Text style={styles.text04}>인증되었습니다</Text>
                </View>
                <View style={styles.top03}>
                    
                    <View style={[{flexDirection:'row'}]}>
                        <Text style={styles.text03}>{qrData} 부스</Text>
                        <Text style={styles.text02}>를</Text>
                    </View>
                    <Text style={styles.text02}>이용하시겠습니까?</Text>
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