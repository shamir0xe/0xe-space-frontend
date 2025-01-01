import { createContext, ReactNode, useContext, useRef, useState } from "react";

export interface CursorContextType {
  focus: boolean;
  getFocus: () => boolean;
  setFocus: (focus: boolean) => void;
}

const CursorContext = createContext<CursorContextType | null>(null);

type CursorProviderProps = {
  children: ReactNode;
};

export const CursorProvider = ({ children }: CursorProviderProps) => {
  const [stateFocus, setStateFocus] = useState<boolean>(true);
  const focus = useRef<number>(0);
  const setFocus = (deltaFocus: boolean): void => {
    focus.current += deltaFocus ? -1 : +1;
    setStateFocus(focus.current == 0);
  };
  const getFocus = (): boolean => {
    return focus.current == 0;
  };
  return (
    <CursorContext.Provider
      value={{ focus: stateFocus, setFocus: setFocus, getFocus: getFocus }}
    >
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = (): CursorContextType => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error("useCursor must be used within an CursorProvider");
  }
  return context;
};
