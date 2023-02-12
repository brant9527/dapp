import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit'

// 初始状态类型
interface LoginState {
  value: boolean;
}

// 定义一个初始状态
const initialState: LoginState = {
  value: false,
} as LoginState;

// 固定格式，创建 slice 对象
const loginSlice = createSlice({
  name: "todo",
  initialState,
  // 相当于原来reducer中的case
  reducers: {
    // 后面文中我们将这类函数称之为 case
    changeState: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

// 官方推荐使用 ES6 解构和导出语法
// 提取action creator 对象与reducer函数
const { reducer, actions } = loginSlice;
// 提取并导出根据reducers命名的 action creator 函数
export const { changeState } = actions;
// 导出 reducer 函数
export default reducer;
