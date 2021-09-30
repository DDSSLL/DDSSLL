import * as types from './mutation-types'
/*import Vue from 'vue'*/

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
        //if(datas){
            state.ActiveDevice = datas;    
            /*Vue.set(state.ActiveDevice,'dev_sn', datas.dev_sn);
            Vue.set(state.ActiveDevice,'dev_name', datas.dev_name);
            Vue.set(state.ActiveDevice,'rcv_sn', datas.rcv_sn);
            Vue.set(state.ActiveDevice,'board_id', datas.board_id);*/
        //}
    },
    // 设置设备定时器
    /*[types.SET_DEVICE_TIMER]: (state, datas) => {
        state.DeviceTimer = datas;
    },*/
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
        state.activedevicetype = datas;
    },
    // 设置网卡图颜色样式
    [types.SET_CHART_STYLE]: (state, datas) => {
        state.cardLineStyle = datas
    },
    // 设置设备列表显示类型
    [types.SET_DEVICE_TYPE_SELECT]: (state, datas) => {
        state.deviceTypeSelect = datas
    },
    //设置设备里诶博爱显示模式
    [types.SET_DEVICE_MODE_SELECT]: (state, datas) => {
        state.deviceModeSelect = datas
    },
    // 设置设备列表显示用户组
    [types.SET_DEVICE_PREFIX_SELECT]: (state, datas) => {
        state.devicePrefixSelect = datas
    },
    [types.SET_PARAM_LOCK_ACK]: (state, datas) => {
        state.paramLockAck = datas
    },
    [types.SET_PARAM_LOCK]: (state, datas) => {
        state.paramLock = datas
    },
    [types.SET_LOCK_USERID]: (state, datas) => {
        state.lockUserId = datas
    },
    // 设置当前设备参数
    [types.SET_DEV_PARAM]: (state, datas) => {
        state.devParam = datas
    },
    // 设置当前接收机参数
    [types.SET_RCV_PARAM]: (state, datas) => {
        state.rcvParam = datas
    },
    /*[types.SET_CHART_CARD_VIEW]: (state, datas) => {
        state.chartCardView = datas
    }*/
}
