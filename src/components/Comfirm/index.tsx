import React, { useState, forwardRef, useImperativeHandle, memo } from "react";
import style from "./index.module.scss";
const ConfirmDialog = forwardRef(
  ({ content = "", children,onConfirm, cancel = false }: any, ref) => {
    const [showDialog, setShowDialog] = useState(false);

    const handleConfirm = () => {
      onConfirm();
      setShowDialog(false);
    };
    useImperativeHandle(ref, () => {
      return {
        open: () => setShowDialog(true),
      };
    });
    return (
      <div className={style.root}>
        {showDialog && (
          <div className="comfirm-wrap">
            <div className="content">{children}</div>
            <div className="foot">
              <div className="comfirm-btn comfirm-btn-ok" onClick={handleConfirm}>
                确认
              </div>
              {cancel && (
                <div
                  className="comfirm-btn comfirm-btn-cancel"
                  onClick={() => setShowDialog(false)}
                >
                  取消
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default memo(ConfirmDialog);
