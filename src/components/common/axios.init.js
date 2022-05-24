import axios from 'axios'
import md5 from 'MD5'
import qs from 'qs'

let baseURL = 'http://localhost:8080';
if(process.env.NODE_ENV == 'development'){
    baseURL = 'http://localhost:8080';
}else{
    baseURL = ''
}
// 创建axios实例
const service = axios.create({
    baseURL:baseURL,
    // 请求超时
    timeout: 1000 * 60,
    // 请求头
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    }
})

// 请求拦截器
service.interceptors.request.use(config => {
    //发请求前做的一些处理，数据转化，配置请求头，设置token,设置loading等，根据需求去添加
    // config.data = JSON.stringify(config.data); //数据转化,也可以使用qs转换
    var UserId = config.UserId;
    var Api = config.Api;
    var AppId = config.AppId?config.AppId:"web";
    var SignatureNonce = generateMixed(10);
    var AccessKey = "hr58kfyr1q786luziekv8dg6hmte42dy";
    var date =  new Date();
    var TimeStamp = date.getTime();
    var data = qs.parse(config.data);
    for(let key in data){
        if(data[key] != null && typeof(data[key]) === 'object'){
            //data[key]为数组
            for(let i=0; i<data[key].length; i++){
                data[key][i] = data[key][i].toString(); //数组里的数值全部转为字符串
            }
        } else {
            data[key] = data[key]+''; //转换成字符串
        }
    }
    var body = JSON.stringify(data);
    var stringToSign = UserId+"\n"+
        AccessKey+"\n"+
        SignatureNonce+"\n"+
        TimeStamp+"\n"+
        Api+"\n"+
        AppId+"\n"+
        body;
    var Signature = md5(stringToSign);

    config.headers = {
        'Content-Type':'application/x-www-form-urlencoded', //配置请求头
        "Accept":"application/json; charset=utf-8",
        "UserId":UserId,
        "Signature": Signature,
        "Api":Api,
        "TimeStamp":TimeStamp,
        "SignatureNonce":SignatureNonce,
        "AppId":AppId
    }
    config.method= 'GET';
    return config
}, error => {
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
    //接收到响应数据并成功后的一些共有的处理，关闭loading等

    return response
}, error => {
    /***** 接收到异常响应的处理开始 *****/
    if (error && error.response) {
        // 1.公共错误处理
        // 2.根据响应码具体处理
        switch (error.response.status) {
            case 400:
                error.message = '错误请求'
                Toast(error.message)
                break;
            case 401:
                error.message = '未授权，请重新登录'
                Toast(error.message)
                break;
            case 403:
                error.message = '拒绝访问'
                Toast(error.message)
                break;
            case 404:
                error.message = '请求错误,未找到该资源'
                window.location.href = "/NotFound"
                Toast(error.message)
                break;
            case 405:
                error.message = '请求方法未允许'
                Toast(error.message)
                break;
            case 408:
                error.message = '请求超时'
                Toast(error.message)
                break;
            case 500:
                error.message = '服务器端出错'
                Toast(error.message)
                break;
            case 501:
                error.message = '网络未实现'
                Toast(error.message)
                break;
            case 502:
                error.message = '网络错误'
                Toast(error.message)
                break;
            case 503:
                error.message = '服务不可用'
                Toast(error.message)
                break;
            case 504:
                error.message = '网络超时'
                Toast(error.message)
                break;
            case 505:
                error.message = 'http版本不支持该请求'
                Toast(error.message)
                break;
            default:
                error.message = `连接错误${error.response.status}`
                Toast(error.message)
        }
    } else {
        // 超时处理
        if (JSON.stringify(error).includes('timeout')) {
            //Toast('服务器响应超时，请刷新当前页')
        }
    }

    // Toast(error.message)
    /***** 处理结束 *****/
    //如果不需要错误处理，以上的处理过程都可省略
    return Promise.resolve(error.response)
})


/*生成随机数*/
function generateMixed(n) {
    var chars = ["0","1","2","3","4","5","6","7","8","9",
        "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
        "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    var res = "";
    for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * 61);
        res += chars[id];
    }
    return res;
}

export default service