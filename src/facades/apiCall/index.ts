import User from "@/models/user";
import CookiesFacade from "../cookiesFacade";
import Post from "@/models/post";
import postDTO from "@/models/dtos/postDTO";

class APICall {
  static baseURL: string = import.meta.env.VITE_BASE_URL;

  static async newPost(post: Post): Promise<Post> {
    try {
      let encodedTitle = encodeURIComponent(post.title ?? "");
      let encodedContent = encodeURIComponent(post.content ?? "");
      let url = `${this.baseURL}/blog/create?title=${encodedTitle}&content=${encodedContent}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CookiesFacade.readToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return postDTO(await response.json());
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  static async editPost(post: Post): Promise<Post> {
    try {
      let encodedTitle = encodeURIComponent(post.title ?? "");
      let encodedContent = encodeURIComponent(post.content ?? "");
      let url = `${this.baseURL}/blog/update/${post.id}?title=${encodedTitle}&content=${encodedContent}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CookiesFacade.readToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return postDTO(await response.json());
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  static async getPosts(): Promise<Post[]> {
    try {
      let url = `${this.baseURL}/blog/read`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  static async getPost(postId: string): Promise<Post> {
    try {
      let url = `${this.baseURL}/blog/read_by_id/${postId}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      let postData = await response.json();
      return postDTO(postData);
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  static async getKey(key: string): Promise<string> {
    try {
      let url = `${this.baseURL}/general/get-key?key=${encodeURIComponent(key)}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      let content = await response.json();
      // if (content.length && content[0] == '"') {
      //   content = content.slice(1, -1);
      // }
      return Promise.resolve(content);
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  static async setKey(key: string, value: string): Promise<boolean> {
    try {
      let url = `${this.baseURL}/general/set-key?key=${encodeURIComponent(key)}&text=${encodeURIComponent(value)}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CookiesFacade.readToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return Promise.resolve(true);
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  static async userInfo(): Promise<User> {
    try {
      let url = `${this.baseURL}/user/info`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CookiesFacade.readToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      let user = (await response.json()) as User;
      return Promise.resolve(user);
    } catch (error: any) {
      return Promise.reject(error);
    }
  }

  static async login(
    username: string,
    password: string,
  ): Promise<string | null> {
    const encodedUsername = encodeURIComponent(username);
    const encodedPassword = encodeURIComponent(password);
    const loginURL = `${APICall.baseURL}/auth/login?username=${encodedUsername}&password=${encodedPassword}`;
    try {
      const response = await fetch(loginURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return await response.text();
    } catch (error: any) {
      return null;
    }
  }
}

export default APICall;
