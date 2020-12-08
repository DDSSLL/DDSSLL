// import routes from '../router/routes'

// 存放数据
export default {
    // 版本号
    versionNumber: '0.1.2',
    // 账户信息
    user: {},
    //导航显示状态
    navHide: true,
    //当前设备
    ActiveDevice: null,
    //背包锁状态
    paramLockAck:null,
    paramLock:null,
    //设备列表显示类型
    deviceTypeSelect:1,
    //设备定时器ID
    DeviceTimer:null,
    //图表定时器ID
    ChartTimer:null,
    //当前登录设备型号
    ActiveDeviceType:null,
    //图表样式
    cardLineStyle:'old',
    chartCardView : {
        "eth0": "",
        "sim1": "",
        "sim2": "",
        "sim3": "",
        "sim4": "",
        "sim5": "",
        "sim6": "",
        "usb-5g1": "",
        "usb-5g2": "",
        "usb-lan": "",
        "usb-lan2": "",
        "wifi": ""
      },
}
