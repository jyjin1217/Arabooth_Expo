import { Alert } from 'react-native';
import { getJsonData } from './../Compo/storageSelf';
import * as commonFunc from './../Compo/commonFunc';

//Deprecated
// export const server_IotRequest = async (boothName, operation) => {

//     if (boothName == "테스트") return true;

//     let result;
//     let patchMsg = boothName + " " + operation;

//     //let response = await fetch('http://10.0.2.2:5000/userMessage/' + patchMsg,{method:'POST'});        
//     let response = await fetch('http://arabooth-env.eba-28bbr78h.ap-northeast-2.elasticbeanstalk.com/userMessage/' + patchMsg,{method:'POST'});    
//     let rJson = await response.json();        

//     //Request 실패시
//     if (rJson.hasOwnProperty('msg')){        
//         switch(rJson['msg']){
//             case 'Failed':                
//                 switch(rJson['detail']){
//                     case 'WrongMessage':                            
//                     case 'NoneMatch':
//                         Alert.alert(
//                             "Wrong message sent",
//                             "App will be initailized. Please try again",
//                             [
//                                 { text: "OK" , onPress: () => { AsyncStorage.clear(); } } 
//                             ],
//                             { cancelable: false }
//                         );
//                         break;
//                     case 'RequestFail':
//                         Alert.alert(
//                             "Request Fail",
//                             "Please try again after few seconds later",
//                             [
//                                 { text: "OK" } 
//                             ],
//                             { cancelable: false }
//                         );
//                         break;
//                     default:break;
//                 }     
                
//                 result = false;
//                 break;
//             default: result = rJson; break;
//         }
//     }

//     return result;
// }

export const lambda_LoginCheck = async (email, password) => {
    let result;

    let response = await fetch('https://a3df8nbpa2.execute-api.ap-northeast-2.amazonaws.com/v1/conndb/' + email + '?pw=' + password, {method:'GET'});
    let rJson = await response.json();

    //로그인 실패시
    if (rJson.hasOwnProperty('Error')){
        Alert.alert(
            "Request Fail",
            rJson['Error'],
            [
                { text: "OK" } 
            ],
            { cancelable: false }
        );
        result = false; 
    }
    else
        result = rJson;

    return result;
}

export const lambda_SaveLog = async (isEnd) => {    

    let curUser = await getJsonData('CurUser');
    if(curUser.boothName == "테스트") return true;

    let endStr = "occupied";
    let interval = "progressing";

    if (isEnd) {
        endStr = commonFunc.getCurDate_CustomStr();
        interval = parseInt((Date.now() - curUser.startUTCmsec) / 1000);
        if (interval == 0) interval = 1; //AWS에(?), 서버에(?), 0으로 리퀘스트를 보내면 데이터가 없는 걸로 판단된다. 뭐.. 맞긴하지..
    }

    let logData ={
        boothName:curUser.boothName,
        startDate:curUser.startDate,
        endDate:endStr,
        user:curUser.name,
        company:curUser.company,
        duration:interval
    }

    let result = true;
    let response = await fetch('https://a3df8nbpa2.execute-api.ap-northeast-2.amazonaws.com/v1/log', {
        method:'POST',
        body:JSON.stringify(logData)
    });
    let rJson = await response.json();

    if (rJson.hasOwnProperty('Error')){ 
        result = false;  
        Alert.alert(
            "Request Fail",
            rJson['Error'],
            [
                { text: "OK" } 
            ],
            { cancelable: false }
        );                
    }

    return result;
}

export const lambda_SetDeviceState = async (boothName, changeState) => {
    if (boothName == "테스트") return true;
    
    let requestDate = {
        booth:boothName,
        state:changeState
    };
    let response = await fetch('https://a3df8nbpa2.execute-api.ap-northeast-2.amazonaws.com/v1/iot',{
        method:'POST',
        body:JSON.stringify(requestDate)
    });
    let rJson = await response.json();

    let result = true;
    if (rJson.hasOwnProperty('Error')){
        if (changeState == "off") result = false; //입장시에만 체크, 종료시에는 일단 진행될 수 있도록..
        Alert.alert(
            "Request Fail",
            rJson.Error,
            [
                { text: "OK" } 
            ],
            { cancelable: false }
        );        
    }
    
    return result;
}

export const lambda_checkVersion = async (curVersion) => {

    let response = await fetch('https://a3df8nbpa2.execute-api.ap-northeast-2.amazonaws.com/v1/version?AppName=Arabooth', {
        method:'POST'
    });
    let rJson = await response.json();

    let result = true;
    if (rJson.hasOwnProperty('Error')) {
        result = false;
        Alert.alert(
            "Request Fail",
            rJson.Error,
            [
                { text:"OK" }
            ],
            { cancelable: false }
        );
    }

    if (result) {
        if (rJson['Version'] != curVersion) result = false;
    }
    
    return result;
}