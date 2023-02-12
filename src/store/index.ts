import create from "zustand";
import { persist } from "zustand/middleware";
const useStore = create((set, get) => ({
  loginState: false,
  themes: "light",
  language: "hk",
  changeThemes: () =>
    set((state: any) => ({
      themes: state.themes === "light" ? "dark" : "light",
    })),
  changeLanguage: () =>
    set((state: any) => ({ language: state.language === "hk" ? "hk" : "en" })),
  changeLoginState: () =>
    set((state: any) => ({
      loginState: (state.loginState = !state.loginState),
    })),
}));
export default useStore;
