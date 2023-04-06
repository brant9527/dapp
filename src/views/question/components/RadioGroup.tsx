import React, { useState, memo } from "react";
import style from "./index.module.scss";
function RadioButtonGroup({ options, onChange, index, type = "radio" }: any) {
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const [checkedItems, setCheckedItems] = useState<any>({});

  const handleOptionChange = (event: any) => {
    const newValue = event.target.value;
    const checkVal = {
      ...checkedItems,
      [newValue]: event.target.checked,
    }
    if (type != "radio") {
      setCheckedItems(checkVal);
    } else {
      setSelectedValue(newValue);
    }

    onChange(type != "radio" ? checkVal : newValue, index);
  };

  return (
    <div className={style.root}>
      {options.map((option: any, idx: any) => (
        <div key={index + "" + idx} className="input-item">
          <input
            type={type === "radio" ? "radio" : "checkbox"}
            name={"radio-group" + index}
            value={index + "" + idx}
            id={index + "" + idx}
            defaultChecked={
              type === "radio"
                ? selectedValue === index + "" + idx
                : checkedItems[index + "" + idx]
            }
            onChange={(e) => handleOptionChange(e)}
          />

          <label htmlFor={index + "" + idx}>{option}</label>
        </div>
      ))}
    </div>
  );
}
export default memo(RadioButtonGroup);
