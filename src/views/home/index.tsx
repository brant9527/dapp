import "./index.scss";
import user from "@/assets/user.png";
import search from "@/assets/search.png";
import msg from "@/assets/msg.png";
import chat from "@/assets/chat.png";
import theme from "@/assets/yueliang.png";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { changeState as themeHandle } from "@/store/reducer/theme";
// import MenuList from "@/components/MenuLeft";
function App() {
  const [themes, setThemes] = useState(
    window.localStorage.getItem("themes") || "light"
  );

  const onChangeTheme = useCallback(() => {
    if (themes === "light") {
      setThemes("dark");
    } else {
      setThemes("light");
    }
    window.localStorage.setItem("themes", themes);
    window.document.documentElement.setAttribute("data-theme", themes); // 给根节点设置data-theme属性，切换主题色就是修改data-theme的值
  }, [themes, setThemes]);
  const openMenu = () => {
    // MenuList.open();
  };
  return (
    <div className="home-wrap">
      <div className="home-top">
        <div className="left">
          <img src={user} onClick={openMenu} />
          <div className="input-bg">
            <img src={search} />
            <span className="text">搜索</span>
          </div>
        </div>
        <div className="right">
          <div className="msg">
            <img src={msg} />
            <div className="tip-num">19</div>
          </div>
          <img src={theme} className="theme" onClick={onChangeTheme} />
          <img src={chat} className="chat" />
        </div>
      </div>
    </div>
  );
}

export default App;
