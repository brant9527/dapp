import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// 初始状态类型
interface ThemeState {
  value: string;
}

// 定义一个初始状态
const initialState: ThemeState = {
  value: "light",
} as ThemeState;

// 固定格式，创建 slice 对象
const loginSlice = createSlice({
  name: "theme",
  initialState,
  // 相当于原来reducer中的case
  reducers: {
    // 后面文中我们将这类函数称之为 case
    changeState: (state, action: PayloadAction<string>) => {
      console.log(state, action.payload);
      if (state.value === "light") {
        state.value = "dark";
      } else {
        state.value = "light";
      }
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
