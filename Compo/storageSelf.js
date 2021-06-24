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
@ 키/내부데이터 메모

//최초 저장: Login.js
autoLogin = {
    isAuto: bool
}

//최초 저장: Login.js
login = {
    email: string,
    pw: string,
    company: string,
    name: string,
    phone: string
}

//최초 저장: Action04.js
isUsing = {
    isUse: bool,
    startTime: json,
    boothName: string,
    sDate: string,
    sNow: number
}

//최초 저장: Login.js
attemptUser = {
    info: json
}

*/