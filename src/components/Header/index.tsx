import { ReactNode } from "react";

type HeaderProps = {
  children?: ReactNode;
  className?: string;
  bgColor?: string;
};

const Header = ({ children, className, bgColor }: HeaderProps): JSX.Element => {
  return (
    <header
      className={`w-full h-12 sticky top-0 right-0 z-10 bg-transparent ${className}`}
    >
      <div className={`absolute w-full h-full top-0 opacity-50 ${bgColor}`} />
      <div className="absolute w-full h-full top-0 backdrop-blur-sm" />
      {children}
    </header>
  );
};

export default Header;
