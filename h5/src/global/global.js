//项目公共方法或常量
//代码中使用 this.$global.xxx 来访问方法或常量
function getCurrentTime() {
    var date = new Date();
    var year = '' + date.getFullYear();
    var month = '' + (date.getMonth() + 1);
    var day = '' + date.getDate();
    var hours = '' + date.getHours();
    var minutes = '' + date.getMinutes();
    var seconds = date.getSeconds();
    if (month.length === 1) {
        month = '0' + month;
    }
    if (day.length === 1) {
        day = '0' + day;
    }
    if (hours.length === 1) {
        hours = '0' + hours;
    }
    if (minutes.length === 1) {
        minutes = '0' + minutes;
    }
    if (seconds.length === 1) {
        seconds = '0' + seconds;
    }
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}


window.cardIdArr = ['eth0', 'lte1', 'lte2', 'lte3', 'lte4', 'lte5',
    'lte6', 'usb-lan', 'usb-5g1', 'usb-5g2', 'wifi'
];
window.xSplit = 300;
window.ADMIN = '1'; //管理员用户组
window.ADVANCE = '2'; //高级用户组
window.NORMAL = '3'; //普通用户组
window.PREFIX = '001'; //德力前缀
window.SUPER = '001-admin'; //超级管理员
window.colorGV = {
    '上传速率':'#FFFF00',
    '下载速率': '#22aadd',
    '传输丢包': '#f1a1ff',
    '业务丢包': '#f5222d',

    'SIM1↑':'#fa8c16',
    'SIM1↓':'#ffc069',
    'SIM1传输丢包':'#ffe7ba',
    'SIM1业务丢包':'#ffa940',

    'SIM2↑':'#a0d911',
    'SIM2↓':'#7cb305',
    'SIM2传输丢包':'#f4ffb8',
    'SIM2业务丢包':'#bae637',

    'SIM3↑':'#1890ff',
    'SIM3↓':'#096dd9',
    'SIM3传输丢包':'#bae7ff',
    'SIM3业务丢包':'#40a9ff',

    'SIM4↑':'#eb2f96',
    'SIM4↓':'#c41d7f',
    'SIM4传输丢包':'#ffd6e7',
    'SIM4业务丢包':'#f759ab',

    'SIM5↑':'#fa541c',
    'SIM5↓':'#d4380d',
    'SIM5传输丢包':'#ffd8bf',
    'SIM5业务丢包':'#ff7a45',

    'SIM6↑':'#fadb14',
    'SIM6↓':'#d4b106',
    'SIM6传输丢包':'#ffffb8',
    'SIM6业务丢包':'#ffec3d',

    'ETH0↑':'#13c2c2',
    'ETH0↓':'#08979c',
    'ETH0传输丢包':'#b5f5ec',
    'ETH0业务丢包':'#36cfc9',

    'USB-5G1↑':'#722ed1',
    'USB-5G1↓':'#531dab',
    'USB-5G1传输丢包':'#efdbff',
    'USB-5G1业务丢包':'#9254de',

    'USB-5G2↑':'#f5222d',
    'USB-5G2↓':'#cf1322',
    'USB-5G2传输丢包':'#ffccc7',
    'USB-5G2业务丢包':'#ff4d4f',

    'USB-LAN↑':'#faad14',
    'USB-LAN↓':'#d48806',
    'USB-LAN传输丢包':'#fff1b8',
    'USB-LAN业务丢包':'#ffc53d',

    'USB-LAN2↑':'#52c41a',
    'USB-LAN2↓':'#389e0d',
    'USB-LAN2传输丢包':'#d9f7be',
    'USB-LAN2业务丢包':'#73d13d',

    'WIFI↑':'#2f54eb',
    'WIFI↓':'#1d39c4',
    'WIFI传输丢包':'#d6e4ff',
    'WIFI业务丢包':'#597ef7'
};
window.colorObj = {
    "上传速率":'totalUp', "下载速率":'totalDown', "传输丢包":'TotalLossDev', "业务丢包":'TotalLossRcv',
    "SIM1↑":'SIM1Up',"SIM1↓":'SIM1Down',"SIM1传输丢包":'SIM1LossDev',"SIM1业务丢包":'SIM1LossRcv',
    "SIM2↑":'SIM2Up',"SIM2↓":'SIM2Down',"SIM2传输丢包":'SIM2LossDev',"SIM2业务丢包":'SIM2LossRcv',
    "SIM3↑":'SIM3Up',"SIM3↓":'SIM3Down',"SIM3传输丢包":'SIM3LossDev',"SIM3业务丢包":'SIM3LossRcv',
    "SIM4↑":'SIM4Up',"SIM4↓":'SIM4Down',"SIM4传输丢包":'SIM4LossDev',"SIM4业务丢包":'SIM4LossRcv',
    "SIM5↑":'SIM5Up',"SIM5↓":'SIM5Down',"SIM5传输丢包":'SIM5LossDev',"SIM5业务丢包":'SIM5LossRcv',
    "SIM6↑":'SIM6Up',"SIM6↓":'SIM6Down',"SIM6传输丢包":'SIM6LossDev',"SIM6业务丢包":'SIM6LossRcv',
    "ETH0↑":'ETH0Up',"ETH0↓":'ETH0Down',"ETH0传输丢包":'ETH0LossDev',"ETH0业务丢包":'ETH0LossRcv',
    "WIFI↑":'WIFIUp',"WIFI↓":'WIFIDown',"WIFI传输丢包":'WIFILossDev',"WIFI业务丢包":'WIFILossRcv',
    "USB-5G1↑":'USB-5G1Up',  "USB-5G1↓":'USB-5G1Down',  "USB-5G1传输丢包":'USB-5G1LossDev',  "USB-5G1业务丢包":'USB-5G1LossRcv',
    "USB-5G2↑":'USB-5G2Up',  "USB-5G2↓":'USB-5G2Down',  "USB-5G2传输丢包":'USB-5G2LossDev',  "USB-5G2业务丢包":'USB-5G2LossRcv',
    "USB-LAN↑":'USB-LANUp',  "USB-LAN↓":'USB-LANDown',  "USB-LAN传输丢包":'USB-LANLossDev',  "USB-LAN业务丢包":'USB-LANLossRcv',
    "USB-LAN2↑":'USB-LAN2Up',"USB-LAN2↓":'USB-LAN2Down',"USB-LAN2传输丢包":'USB-LAN2LossDev',"USB-LAN2业务丢包":'USB-LAN2LossRcv'
};
export default {
    getCurrentTime
}