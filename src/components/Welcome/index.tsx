import {
  forwardRef,
  useImperativeHandle,
  useCallback,
  useEffect,
  useRef,
  useState,
  memo,
} from "react";
import welcome from '@/assets/welcome.gif'
import style from "./index.module.scss";

const CountDialog = forwardRef((props, ref) => {
  const [showDialog, setShowDialog] = useState(true);

  const startCount = useCallback(() => {
    setTimeout(() => {
      setShowDialog(false);
    }, 3000);
  }, []);
  useEffect(() => {
    startCount();
  }, []);
  return (
    <div className={style.root}>
      {showDialog && (
        <div className="welcome-gif">
          <img src={welcome} />
        </div>
      )}
    </div>
  );
});

export default memo(CountDialog);
