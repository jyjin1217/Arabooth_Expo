import React from 'react'
import { Text, TouchableOpacity } from 'react-native';

/*
사용법

const checkLogin = () =>{    
}

const btnCustom = StyleSheet.create({
    touchable:{
    },
    text:{
    }
});

const textBtnInfo = {
    connFunc:checkLogin,
    cssStyle: btnCustom,
    title:"로그인"
}

<TextButton info={textBtnInfo} />

*/

export const TextButton = ({info}) =>{
    const {connFunc, cssStyle, title} = info;

    return(
        <TouchableOpacity style={cssStyle.touchable} onPress={()=>connFunc()}>
            <Text style={cssStyle.text}>{title}</Text>
        </TouchableOpacity>       
    );
}

