import React, { useState, forwardRef, useImperativeHandle, memo } from "react";
import style from "./index.module.scss";
const ConfirmDialog = forwardRef(
  ({ content = "", title, children, onConfirm, cancel = false }: any, ref) => {
    const [showDialog, setShowDialog] = useState(false);

    const handleConfirm = () => {
      onConfirm();
      setShowDialog(false);
    };
    useImperativeHandle(ref, () => {
      return {
        open: () => setShowDialog(true),
        close: () => setShowDialog(false),
      };
    });
    return (
      <div className={style.root}>
        {showDialog && (
          <>
            <div className="mask" ></div>

            <div className="confirm-wrap">
              {title && <div className="title">{title}</div>}
              <span
                className="cross"
                onClick={() => {
                  setShowDialog(false);
                }}
              ></span>

              <div className="content">{children}</div>
            </div>
          </>
        )}
      </div>
    );
  }
);

export default memo(ConfirmDialog);
