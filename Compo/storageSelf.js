import AsyncStorage from '@react-native-async-storage/async-storage';


/* 핸드폰 내에 저장하기(json) */
export const storeJsonData = async (key, value) => {
    try {
        let jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.log(e);
        return false;
    }
    return true;
}

/* 핸드폰 내에 저장 데이터 불러오기(json) */
export const getJsonData = async (key) => {

    let jsonValue = null;
    try {
        jsonValue = await AsyncStorage.getItem(key);        
    } catch(e) {
        console.log(e);
    }
    return jsonValue != null ? JSON.parse(jsonValue) : null;
}



/*
@ 키/사용처 메모

autoLogin : Login.js(save/load)
login : Login.js(save/load)
isUsing : Action04.js(save/load)

*/