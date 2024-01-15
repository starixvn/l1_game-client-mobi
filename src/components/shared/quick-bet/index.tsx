"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Styles from "./quick-bet.module.scss";

export default function QuickBet() {
  const [toggle, setToggle] = useState<boolean>(false);

  return (
    <div className="flex items-center justify-center gap-2">
      <div className={`${Styles["one-click-bet"]}`}>Quick bet</div>
      <div
        onClick={() => setToggle(!toggle)}
        className={`switch flex  cursor-pointer rounded-full border bg-black ${toggle ? "justify-end switch-on" : "justify-start switch-off"
          }`}
      >
        <motion.div
          className="toggle-background rounded-full"
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
        ></motion.div>
      </div>
    </div>
  );
}
