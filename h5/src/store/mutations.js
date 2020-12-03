import * as types from './mutation-types'

// 改变state数据
export default {
	// 用户信息
	[types.SET_USER]: (state, datas) => {
		if (datas) state.user = datas;
		else state.user = {};
	},
    // 设置导航状态
    [types.SET_NAV_STATUS]: (state, datas) => {
        state.navHide = datas
    },
    // 设置当前设备
    [types.SET_ACTIVE_DEVICE]: (state, datas) => {
        state.ActiveDevice = datas
    },
    // 设置设备定时器
    [types.SET_DEVICE_TIMER]: (state, datas) => {
        state.DeviceTimer = datas;
    },
    // 设置图表定时器
    [types.SET_CHART_TIMER]: (state, datas) => {
        state.ChartTimer = datas;
    },
    // 清空定时器ID池
    [types.SET_TIMER_CLEAR]: (state, datas) => {
        state.DeviceTimer = null;
        state.ChartTimer = null;
    },
    // 设置当前设备状态
    [types.SET_ACTIVE_DEVICE_TYPE]: (state, datas) => {
        state.ActiveDeviceType = datas
    },
    // 设置网卡图颜色样式
    [types.SET_CHART_STYLE]: (state, datas) => {
        state.cardLineStyle = datas
    },
    // 设置设备列表显示类型
    [types.SET_DEVICE_TYPE_SELECT]: (state, datas) => {
        state.deviceTypeSelect = datas
        console.log("state.deviceTypeSelect:"+state.deviceTypeSelect)
    },
}
