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
}
