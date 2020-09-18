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
}
