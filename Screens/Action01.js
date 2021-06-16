import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { TextButton } from './../Compo/TextButton'

export const Action01 = ({navigation}) => {

    //-------------------변수----------------------


    //-------------------함수----------------------

    //다음 페이지
    const goToAction02 = () =>{
        navigation.navigate('Action02');
    }

    //-------------------UseEffect----------------------


    //-------------------커스텀 버튼----------------------    

    //다음 페이지 버튼 속성
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
        connFunc:goToAction02,
        cssStyle: btnCustom,
        title:"다음"
    }

    //-------------------Render----------------------
    return(
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.top01}>
                    <Text style={styles.text01}>Welcome!</Text>
                </View>
                <View style={styles.top02}>
                    <Image style={styles.img01} source={require('./../assets/drawable-xxxhdpi/compo8-1.png')}></Image>
                </View>
                <View style={styles.top03}>
                    <Text style={styles.text02}>아라스마트부스는</Text>
                    <Text style={styles.text02}>워크앤올 입주사 고객을 위한</Text>
                    <View style={[{flexDirection:'row'}]}>
                        <Text style={styles.text03}>프라이빗 워크스페이스</Text>
                        <Text style={styles.text02}>입니다.</Text>
                    </View>
                    <Text></Text>
                    <Text style={styles.text02}>방음이 필요한 통화, 원격회의</Text>
                    <Text style={styles.text02}>보안이 필요한 작업 등을</Text>
                    <Text style={styles.text02}>아라스마트부스에서</Text>
                    <Text style={styles.text02}>편리하게 이용해보세요</Text>
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
        justifyContent:'center'
    },
    top03:{
        flex:2,
        alignItems:'center',
        justifyContent:'center'
    },
    //--------------------------------
    img01:{
        resizeMode:"contain",
        width:"100%",
        height:"80%"
    },
    //--------------------------------
    text01:{
        color:"#00c4cc", 
        fontSize:45,
    },
    text02:{
        color:"#787878",
        fontSize:20,
    },
    text03:{
        color:"#000000", 
        fontSize:20,
        fontWeight:"bold"
    },   
    
});