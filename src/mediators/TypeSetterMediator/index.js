import keys from "@/helpers/terminals/viTerminal/keys";
import cfg from "@/configs/typings";

let keyPress = null;
let inProcess = false;

const TypeSetterMediator = class {
  static initialize = (virtualKeyPress) => {
    keyPress = virtualKeyPress;
  };

  static enter = (command) => {
    if (inProcess) return this;
    console.log(`entering this -${command}-`);
    try {
      this.clear().insertMode().string(command);
    } catch (error) {
      console.log(`error occurred: ${error}`);
    }
  };

  static clear = () => {
    if (!keyPress) {
      console.log("keypress is not defined");
      return this;
    }
    return this.seuquence(keys.ESCAPE, keys.d, keys.d);
  };

  static seuquence = (...sequence) => {
    // console.log(`in the seq: ${sequence}`);
    for (let key of sequence) {
      // console.log(`entering TypeSetterMediator -${key}-`);
      this.press(key);
    }
    return this;
  };

  static insertMode = () => {
    // go to insert mode
    return this.seuquence(keys.ESCAPE, keys.i);
  };

  static press = (key) => {
    try {
      keyPress({ key: key });
    } catch (error) {
      console.log(`something bad happened: ${error}`);
    }
  };

  static string = (string) => {
    // type the string down, letter by letter
    // after entering the whole string, it presses ENTER key
    inProcess = true;
    // console.log(`in the string: ${string}`);
    if (!string || string.trim() === "") {
      inProcess = false;
      this.press(keys.ENTER);
      return;
    }
    this.press(string[0]);
    setTimeout(() => this.string(string.slice(1)), cfg.typeDelay);
  };
};

export default TypeSetterMediator;
