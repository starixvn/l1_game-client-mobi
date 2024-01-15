import React from "react";
import {
  Stage,
  Container,
  AnimatedSprite,
  useApp,
  useTick,
  Sprite,
} from "@pixi/react";
import Style from "./animated-bingo.module.scss";

const [width, height] = [500, 500];

const images = [
  "/images/animated-bingo/star-01.png",
  "/images/animated-bingo/star-02.png",
  "/images/animated-bingo/star-03.png",
  "/images/animated-bingo/star-04.png",
  "/images/animated-bingo/star-05.png",
  "/images/animated-bingo/star-06.png",
  "/images/animated-bingo/star-07.png",
];

const spriteshet = "/images/animated-bingo/animated-bingo.json";

const AnimatedBingo = () => {
  const [playAnim, setPlayAnim] = React.useState(false);
  console.log(playAnim);

  return (
    <div>
      <Stage width={200} height={200} options={{ backgroundAlpha: 0 }}>
        <Container position={[150, 150]}>
          <AnimatedSprite
            anchor={0.5}
            images={images}
            autoUpdate
            isPlaying={playAnim}
            initialFrame={0}
            animationSpeed={0.2}
            loop={false}
          />
        </Container>
      </Stage>
      <button className="button text-white" onClick={() => setPlayAnim(true)}>
        Play
      </button>
    </div>
  );
};

export default AnimatedBingo;
