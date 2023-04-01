import { useCallback } from "react";
import { createRoot } from "react-dom/client";
import styles from "./index.module.scss";

interface Base {
  className?: string;

  position?: string;
}
interface AProps extends Base {
  duration?: number;
}

const posList = ["L_T", "L_C", "L_B", "C_T", "C_C", "C_B", "R_T", "R_C", "R_B"];

// createContainer,在同一个容器下渲染同一次引入的Message的所有提示框
let containerRoot: any;
const list: string[] = [];
const timerList: any = [];

const createContainer = () => {
  if (containerRoot) {
    return containerRoot;
  }
  const div = document.createElement("div");
  document.body.appendChild(div);
  const container = createRoot(div);

  return container;
};

const addMsg = (args: Base, msg: string) => {
  list.push(msg);

  renderMsgList(args);
};

const removeMsg = (args: Base, id: number) => {
  list.splice(id, 1);
  clearTimeout(timerList[id]);

  timerList.splice(id, 1);

  renderMsgList(args);
};

const renderMsgList = (args: Base) => {
  containerRoot = createContainer();
  containerRoot.render(<MessageTemplate args={args} />);
};

const MessageTemplate = ({ args }: { args: Base }) => {
  // 如果没有传入参数，设置默认值
  const { className = "", position = "C_T" } = args;

  const getPosition = useCallback(() => {
    // 传入正确的位置 或 没有传
    if (posList.includes(position)) {
      return styles[position];
    }
    // 传入错误的位置
    throw new Error("位置错误");
  }, [position]);

  // 点击关闭按钮时执行
  const quit = (index: number) => {
    removeMsg(args, index);
  };

  return (
    <div className={`${styles.toastFix} ${getPosition()}`}>
      {list.length
        ? list.map((item, index) => (
            <div className={`${styles.tMessage} ${className}`} key={index}>
              {item}
              {/* <span onClick={() => quit(index)}></span> */}
            </div>
          ))
        : null}
    </div>
  );
};

export const notice = (
  message: string,
  { duration = 2000, ...args }: AProps
) => {
  addMsg(args, message);
  const timer = setTimeout(() => {
    removeMsg(args, 0);
  }, duration);
  timerList.push(timer);
};

const Message = {
  notice,
};
export default Message;
