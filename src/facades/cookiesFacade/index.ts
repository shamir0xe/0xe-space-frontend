import Cookies from "js-cookie";

// Matches the server's maximum token lifetime (AUTH_TOKEN_MAX_TTL).
const TOKEN_DAYS = 30;

class CookiesFacade {
  static saveToken(token: string): void {
    if (token.length && token[0] == '"') {
      token = token.slice(1, -1);
    }
    Cookies.set("token", token, {
      expires: TOKEN_DAYS,
      sameSite: "strict",
      secure: window.location.protocol === "https:",
    });
  }
  static removeToken(): void {
    Cookies.remove("token");
  }
  static readToken(): string | null {
    const token = Cookies.get("token");
    if (!token) return null;
    return token;
  }
}

export default CookiesFacade;
