import { ReactNode, useEffect, useRef } from "react";
import "./index.css";
import cfg from "@/configs/starwars";
import Button from "../Button";
import TypeSetterMediator from "@/mediators/TypeSetterMediator";

type StarWarsType = {
  title: string;
  children: ReactNode;
};

const StarWars = ({ title, children }: StarWarsType): JSX.Element => {
  console.log(title);
  const starsCount = cfg.starsCount;
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      Array.from({ length: starsCount }, () => {
        const x = Math.floor(wrapper.clientWidth * Math.random());
        const y = Math.floor(wrapper.clientHeight * Math.random());
        let star = document.createElement("div");
        star.className = "absolute bg-white w-[1px] h-[1px] z-10";
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        wrapper.append(star);
      });
    }
  }, []);

  return (
    <div className="relative sw-wrapper w-full h-full" ref={wrapperRef}>
      <div className="w-full releative starwars">
        <div className="absolute sw-content">{children}</div>
      </div>
      <div className="postfix absolute z-10 top-1/2 -left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <p className="text-center border rounded-xl bg-neutral-900 p-5">
          type or tap{" "}
          <strong>
            <Button onMouseDown={() => TypeSetterMediator.enter("help")}>
              help
            </Button>
          </strong>{" "}
          for more info, or{" "}
          <Button onMouseDown={() => TypeSetterMediator.enter("cv")}>
            <strong>cv</strong>
          </Button>{" "}
          for seeing my resume ^^
        </p>
      </div>
    </div>
  );
};

export default StarWars;
