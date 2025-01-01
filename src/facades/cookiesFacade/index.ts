import Cookies from "js-cookie";

class CookiesFacade {
  static saveToken(token: string): void {
    if (token.length && token[0] == '"') {
      token = token.slice(1, -1);
    }
    Cookies.set("token", token, { expires: 1 });
  }
  static removeToken(): void {
    Cookies.remove("token");
  }
  static readToken(): string | null {
    const token = Cookies.get("token");
    return token;
  }
}

export default CookiesFacade;
