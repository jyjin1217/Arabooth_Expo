import { Dimensions } from "react-native"
// import { RFValue, RFPercentage } from "react-native-responsive-fontsize";

export const numToZeroStr = (number) => {
    let str = String(number);
    if(number < 10) str = '0' + str;
    return str;
}

export const getCurDate_CustomStr = () => {
    let date = new Date();
    let str = numToZeroStr(date.getFullYear()) + '.';
    str += numToZeroStr(date.getMonth() + 1) + '.';
    str += numToZeroStr(date.getDate()) + '.';
    str += numToZeroStr(date.getHours()) + '.';
    str += numToZeroStr(date.getMinutes()) + '.';
    str += numToZeroStr(date.getSeconds());
    return str;
}

//test emulator(기준값) - width: 411.4 , height: 683.4
const w = Dimensions.get('window').width;
const wRatio = parseInt(w) / 411;
export const getAdjustSizeByWidth = (num) => {  
    return num * wRatio;
    //return RFValue(num, 680);
}