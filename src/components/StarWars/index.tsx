import { ReactNode, useEffect, useRef, useState } from "react";
import "./index.css";
import cfg from "@/configs/starwars";

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
    <div className="releative sw-wrapper w-full h-full" ref={wrapperRef}>
      <div className="w-full releative starwars">
        <div className="absolute sw-content">{children}</div>
      </div>
    </div>
  );
};

export default StarWars;
