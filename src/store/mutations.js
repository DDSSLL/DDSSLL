import * as types from './mutation-types'

// 改变state数据
export default {
	// 用户信息
	[types.SET_USER]: (state, datas) => {
		if (datas) state.user = datas;
		else state.user = {};
	},
    // 设置导航状态
    [types.SET_LOGIN_STATUS]: (state, datas) => {
        state.loginShow = datas
    },   
    // 设置当前激活的tab
    [types.SET_ACTIVE_TAB]: (state, datas) => {
        state.activeTab = datas
    },  
    // 频率Hz
    [types.SET_RANGE_FREQ]: (state, datas) => {
        state.range_Freq = datas
    }, 
    // 衰减器dB
    [types.SET_RANGE_ATT]: (state, datas) => {
        state.range_ATT = datas
    }, 
    // 放大器
    [types.SET_RANGE_AMP]: (state, datas) => {
        state.range_AMP = datas
    }, 
    // 支持的频道类型
    [types.SET_RANGE_CHANNELTYPE]: (state, datas) => {
        state.range_ChannelType = datas
    }, 
    // 采样间隔ms
    [types.SET_RANGE_SAMPINTERVAL]: (state, datas) => {
        state.range_SampInterval = datas
    }, 
    // 采样率
    [types.SET_RANGE_SAMPRATE]: (state, datas) => {
        state.range_SampRate = datas
    }, 
    // 全带、窄带频谱FFT
    [types.SET_RANGE_FFT]: (state, datas) => {
        state.range_FFT = datas
    }, 
    // 频谱图缩放
    [types.SET_RANGE_ZOOM]: (state, datas) => {
        state.range_Zoom = datas
    }, 
    // 频道模式
    [types.SET_RANGE_CHANNELMODE]: (state, datas) => {
        state.range_ChannelMode = datas
    },     
}
