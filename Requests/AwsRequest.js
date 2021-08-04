import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getJsonData } from './../Compo/storageSelf';

export const server_IotRequest = async (boothName, operation) => {

    if (boothName == "테스트") return true;

    let result;
    let patchMsg = boothName + " " + operation;

    //let response = await fetch('http://10.0.2.2:5000/userMessage/' + patchMsg,{method:'POST'});        
    let response = await fetch('http://arabooth-env.eba-28bbr78h.ap-northeast-2.elasticbeanstalk.com/userMessage/' + patchMsg,{method:'POST'});    
    let rJson = await response.json();        

    //Request 실패시
    if (rJson.hasOwnProperty('msg')){        
        switch(rJson['msg']){
            case 'Failed':                
                switch(rJson['detail']){
                    case 'WrongMessage':                            
                    case 'NoneMatch':
                        Alert.alert(
                            "Wrong message sent",
                            "App will be initailized. Please try again",
                            [
                                { text: "OK" , onPress: () => { AsyncStorage.clear(); } } 
                            ],
                            { cancelable: false }
                        );
                        break;
                    case 'RequestFail':
                        Alert.alert(
                            "Request Fail",
                            "Please try again after few seconds later",
                            [
                                { text: "OK" } 
                            ],
                            { cancelable: false }
                        );
                        break;
                    default:break;
                }     
                
                result = false;
                break;
            default: result = rJson; break;
        }
    }

    return result;
}

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

    let loginJson = await getJsonData('login');
    let usingJson = await getJsonData('isUsing');

    let endStr = "occupied";
    let interval = "progressing";

    if (isEnd) {
        let endTime = new Date();
        endStr = endTime.getFullYear() + '.' + (endTime.getMonth() + 1) + '.' + endTime.getDate() + '.' + endTime.getHours() + '.' + endTime.getMinutes() + '.' + endTime.getSeconds();

        interval = parseInt((Date.now() - usingJson.sNow) / 1000);
        if (interval == 0) interval = 1; //AWS에(?), 서버에(?), 0으로 리퀘스트를 보내면 데이터가 없는 걸로 판단된다. 뭐.. 맞긴하지..
    }

    let logData ={
        boothName:usingJson.boothName,
        startDate:usingJson.sDate,
        endDate:endStr,
        user:loginJson.name,
        company:loginJson.company,
        duration:interval
    }

    let result;
    let response = await fetch('https://a3df8nbpa2.execute-api.ap-northeast-2.amazonaws.com/v1/log', {
        method:'POST',
        body:JSON.stringify(logData)
    });
    let rJson = await response.json();

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
