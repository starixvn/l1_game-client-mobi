import React from "react";
import Styles from "./ball.module.scss";
const Ball = (props: any) => {
  return (
    <div
      className={`${Styles.ball} relative rounded-full ${props.isLoading || props.isEmpty
        ? Styles["ball-border-gray"]
        : Styles["ball-border-black"]
        }`}
    >
      {props.number != null && (
        <div className={Styles["ball-bg"]}>
          <img
            className={Styles["ball-img"]}
            src={`/images/Ball/ball-${props.color}.png`}
            alt="ball"
          />
          <span className={Styles["ball-number"]}>{props.number}</span>
        </div>
      )}

      {props.isLoading && <div className={Styles.loading}></div>}
    </div>
  );
};

export default Ball;
