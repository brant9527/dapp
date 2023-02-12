// configureStore 简化了之前创建store的配置选项，可以内置多个reducer，并且配置redux-middleware，并且可在其中启用Redux Devtools扩展。
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { Reducer } from "redux";
// 多个Slice的引入；
import loginSlice from "./reducer/login";
import themeSlice from "./reducer/theme";

// persistStore 为redux-persist内置的状态管理仓库；
// persistReducer 为内置的切片管理；
import { persistStore, persistReducer } from "redux-persist";
// storage redux-persist的思想是将要存储的数据通过storage存储在本地localstorage中；
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

// 配置要存储的Slice；
const persistConfig = {
  key: "root",
  storage: storage,
  stateReconciler: autoMergeLevel2,
};

const allReducers = combineReducers({
  // 通过page404 找404 模块的reducer
  loginSlice: loginSlice,
  themeSlice
});
const myPersistReducer = persistReducer(persistConfig, allReducers as Reducer);

export const store = configureStore({
  // 通过configureStore可内置reducer & middleware

  reducer: myPersistReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch

// *** store对象 && 包裹store的persistStore都需导出，并在index.tsx中引入；
