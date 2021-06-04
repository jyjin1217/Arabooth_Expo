import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner'
import { TextButton } from './../Compo/TextButton'

export const QRScan = ({navigation}) => {

    //-------------------변수----------------------

    //QR데이터 : 정보, 퍼미션, 실행여부
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    //-------------------함수----------------------

    //스캔시 호출되는 함수, 수정 필요(데이터 선별)
    const handleBarCodeScanned = ({ type, data }) => {        
        //console.log(`Bar code with type ${type} and data ${data} has been scanned!`); 
        goToAction03(data);
    };

    //다음 페이지 함수, 데이터 넘김
    const goToAction03 = (data) =>{
        setScanned(true);
        navigation.navigate('Action03', {qrData:data});
    }

    //이전 페이지
    const goBackLastPage = () =>{
        setScanned(true);
        navigation.goBack();
    }

    //-------------------UseEffect----------------------

    //페이지 이동시 최초 한번([] 설정) 실행, 퍼미션 검사, 검사에 따라 화면전환(hasPermission이 useState이기 때문에)
    useEffect(() => {
        (async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        })();
    }, []);

    //-------------------카메라 permission 검사----------------------

    //아직 없을 경우
    if (hasPermission === null) {
        return (
            <View style={[{flex:1,alignItems:'center',justifyContent:'center'}]}>
                <Text>Requesting for camera permission</Text>
            </View>
        );
    }

    //거부한 경우
    if (hasPermission === false) {
        return (
            <View style={[{flex:1,alignItems:'center',justifyContent:'center'}]}>
                <Text>No access to camera</Text>
            </View>
        );
    }

    //-------------------커스텀 버튼----------------------
   
    //취소, 이전페이지 버튼 속성
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
        connFunc:goBackLastPage,
        cssStyle: btnCustom,
        title:"스캔취소"
    }

    //avd테스트(다음단계)를 위한 임시 버튼 속성
    const avdTemp = StyleSheet.create({
        touchable:{
            alignItems:'center',
            justifyContent:'center',
            borderRadius:12,
            backgroundColor: "#000000",
            width:"100%",
            height: 30,
        },
        text:{
            color:"#FFFFFF",
            fontWeight:"bold",
            fontSize:20,
            height:27
        }
    });    
    
    //-------------------Render----------------------
    return(
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <BarCodeScanner 
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}>
                </BarCodeScanner>
            </View>
            <View style={styles.bottomContainer}>
                <TextButton info={textBtnInfo} />
                <TouchableOpacity style={avdTemp.touchable} onPress={()=>goToAction03("테스트")}>
                    <Text style={avdTemp.text}>테스트용:다음페이지</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',             
    },
    //--------------------------------
    topContainer:{
        flex:5,
    },   
    bottomContainer:{
        flex:1,
        alignItems:'center',           
        justifyContent:'center', 
        paddingHorizontal:"9%",     
    },
    //--------------------------------
    
    //--------------------------------    
    text03:{
        color:"#000000", 
        fontWeight:"bold"
    },       
});
