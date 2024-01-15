"use client";
import React, { useState } from "react";
import Styles from "./top-info.module.scss";

const TopInfo = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-center text-white px-3 h-8">
      <div className={`${Styles["round-id"]} flex-1`}>#2345</div>
      <div className={`${Styles["countdown-timer"]} flex-1 text-center`} >00:30</div>
      <div className={`${Styles["button-group"]}  flex flex-1`} >
        <div className={`${Styles["icon-button"]}  ${Styles["button-volume"]}  `} >
          <span className={`${Styles["icon-sound-on"]} `}></span>
        </div>
        <div className={`${Styles["icon-button"]}  ${Styles["icon-button button-guide"]}  `} >
          <span className={`${Styles["icon-guide"]} `}></span>
        </div>
        <div className={`${Styles["icon-button"]}  ${Styles["icon-button button-home"]}  `}>
          <span className={`${Styles["icon-home"]} `}></span>
        </div>
      </div>
    </div>
  );
};

export default TopInfo;
