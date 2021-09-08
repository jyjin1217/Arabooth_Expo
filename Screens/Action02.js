import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { TextButton } from './../Compo/TextButton'
import { getAdjustSizeByWidth } from './../Compo/commonFunc'

export const Action02 = ({navigation}) => {

    //-------------------변수----------------------

    //-------------------함수----------------------

    //다음 페이지
    const goToQRScan = () =>{
        navigation.navigate('QRScan');
    }

    //-------------------UseEffect----------------------

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
        connFunc:goToQRScan,
        cssStyle: btnCustom,
        title:"스캔하기"
    }
   

    //-------------------Render----------------------
    return(
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.top01}>
                    <Text style={styles.text01}>QRScan</Text>
                </View>
                <View style={styles.top02}>
                    <Image style={styles.img01} source={require('./../assets/drawable-xxxhdpi/compo10-1.png')}></Image>
                    <TouchableOpacity onPress={()=>goToQRScan()}>
                        <Image style={styles.img02} source={require('./../assets/drawable-xxxhdpi/compo9-1.png')}></Image>
                    </TouchableOpacity>                    
                </View>
                <View style={styles.top03}>
                    <Text style={styles.text02}>이용자 확인을 위해 스마트부스에</Text>
                    <View style={[{flexDirection:'row'}]}>
                        <Text style={styles.text02}>부착된 </Text>
                        <Text style={styles.text03}>QR코드</Text>
                        <Text style={styles.text02}>를 스캔 해주세요</Text>
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
        alignItems:'center',
    },
    //--------------------------------
    img01:{
        resizeMode:"contain",
        width:getAdjustSizeByWidth(41),
        height:getAdjustSizeByWidth(35)
    },
    img02:{
        resizeMode:"contain",
        width:getAdjustSizeByWidth(134),
        height:getAdjustSizeByWidth(132)
    },
    //--------------------------------
    text01:{
        color:"#00c4cc", 
        fontSize:getAdjustSizeByWidth(45),
    },
    text02:{
        color:"#979797",
        fontSize:getAdjustSizeByWidth(24),
    },
    text03:{
        color:"#000000", 
        fontSize:getAdjustSizeByWidth(24),
        fontWeight:"bold"
    }, 
    
});

