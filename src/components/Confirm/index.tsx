import React, { useState, forwardRef, useImperativeHandle, memo } from "react";
import style from "./index.module.scss";
import { useTranslation } from "react-i18next";

const ConfirmDialog = forwardRef(
  ({ content = "", children, onConfirm, cancel = false }: any, ref) => {
    const [showDialog, setShowDialog] = useState(false);
    const { t } = useTranslation();
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
          <div className="confirm-wrap">
            <div className="content">{children}</div>
            <div className="foot">
              {cancel && (
                <div
                  className="confirm-btn confirm-btn-cancel"
                  onClick={() => setShowDialog(false)}
                >
                  {t("common.cancel")}
                </div>
              )}
              <div
                className="confirm-btn confirm-btn-ok"
                onClick={handleConfirm}
              >
                {t("common.sure")}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default memo(ConfirmDialog);
