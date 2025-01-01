import Cookies from "js-cookie";

class AuthContext {
	static saveToken(token: string): void {
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

export default AuthContext;
