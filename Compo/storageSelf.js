import AsyncStorage from '@react-native-async-storage/async-storage';


/* 핸드폰 내에 저장하기(json) */
export const storeJsonData = async (key, jsonObj) => {
    try {
        let jsonStr = JSON.stringify(jsonObj);

        let isKey = await getJsonData(key)
        if (isKey != null) await AsyncStorage.mergeItem(key, jsonStr);
        else await AsyncStorage.setItem(key, jsonStr);

    } catch (e) {
        console.log(e);
        return false;
    }
    return true;
}

/* 핸드폰 내에 저장 데이터 불러오기(json) */
export const getJsonData = async (key) => {
    let jsonStr = null;
    try {
        jsonStr = await AsyncStorage.getItem(key);        
    } catch(e) {
        console.log(e);
    }
    return (jsonStr != null) ? JSON.parse(jsonStr) : null;
}

/* 데이터 삭제 */
export const deleteData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch(e) {
        console.log(e);
    }
}


/*
@ 키/내부데이터 메모
Setting = {
    watchFirstPage: bool,
    autoLogin : bool,
    isCameraGranted : bool
}

TempData = {
    tempLogin : json
}

CurUser = {
    id: string,
    pw: string,
    company: string,
    name: string,
    phone: string,

    isUsing: bool,
    boothName: string,
    startDate: string,
    startUTCmsec: number
}

//----------1.0.6 이전------------------
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

//최초 저장 : Login.js
Setting = {
    watchFirstPage: bool
}

*/