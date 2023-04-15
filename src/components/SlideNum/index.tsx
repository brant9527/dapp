// import React, { useState, useEffect, useRef } from "react";
// import style from "./index.module.scss";
// function Slider(props: any) {
//   const [value, setValue] = useState(props.value);
//   const sliderRef = useRef<any>(null);

//   useEffect(() => {
//     // 在这里可以执行一些操作，比如发送请求、更新页面等
//     console.log(`当前值：${value}`);
//   }, [value]);

//   function handleMouseDown(e: any) {
//     console.log('实现呢')
//     e.preventDefault();
//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);
//   }

//   function handleMouseMove(e: any) {
//     console.log(e.target.value);
//     const slider = sliderRef.current;
//     const rect = slider.getBoundingClientRect();
//     const min = 0;
//     const max = rect.width - 20;
//     let x = e.clientX - rect.left - 10;
//     if (x < min) {
//       x = min;
//     } else if (x > max) {
//       x = max;
//     }
//     const newValue = Math.round((x / max) * 100);
//     setValue(newValue);
//   }

//   function handleMouseUp() {
//     console.log('去下了')
//     document.removeEventListener("mousemove", handleMouseMove);
//     document.removeEventListener("mouseup", handleMouseUp);
//     props.onChange(value);
//   }

//   return (
//     <div className={style.root}>
//       <div
//         className="sliderStyle"
//         ref={sliderRef}
//         onMouseDown={handleMouseDown}
//       >
//         <div className="thumbStyle" onMouseDown={handleMouseDown}></div>
//       </div>
//       <p>当前值：{value}</p>
//     </div>
//   );
// }

// export default Slider;
import React, { useState, useRef, memo } from "react";
import style from "./index.module.scss";

const Slider = function (props: any) {
  const { onChange, defaultVal, max = 200 } = props;
  const [value, setValue] = useState(defaultVal || 1);
  const inputRef = useRef<any>(null);

  function handleInputChange(e: any) {
    const value = inputRef.current.value;
    setValue(value);
    onChange(value);
    e.preventDefault();

    e.stopPropagation();
  }

  return (
    <div className={style.root}>
      <input
        type="range"
        min="1"
        max={max}
        value={value}
        ref={inputRef}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default memo(Slider);
