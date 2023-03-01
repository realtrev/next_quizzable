import { BaseAuthStore } from "pocketbase";
import {
  setCookie,
  getCookie,
  deleteCookie,
  getCookies,
  CookieValueTypes,
} from "cookies-next";
import type { Record } from "pocketbase";

export default class CustomAuthStore extends BaseAuthStore {
  constructor() {
    super();

    // Get the token from the cookie
    const token = getCookie("token");
    this.loadToken(token);

    // Get the user from the cookie
    const model = getCookie("user");
    this.loadModel(model);
  }

  private loadToken = (token: CookieValueTypes) => {
    // console.log("token", token);
    if (typeof token === "string") {
      this.baseToken = token;
      // console.log("Token cookie found");
      return;
    }
    if (token !== undefined) {
      deleteCookie("token");
    }
    // console.log("No token cookie found");
  };

  private loadModel = (model: CookieValueTypes) => {
    if (typeof model === "string") {
      this.baseModel = JSON.parse(model) as Record;
      // console.log("User cookie found");
      return;
    }
    if (model !== undefined) {
      deleteCookie("user");
    }
    // console.log("No user cookie found");
  };

  public clear = () => {
    this.baseToken = "";
    this.baseModel = null;
    deleteCookie("token");
    deleteCookie("user");
  };

  public save = (token: string, model: Record | null) => {
    setCookie("token", token);
    setCookie("user", JSON.stringify(model));
    this.loadToken(token);
    this.loadModel(JSON.stringify(model));
  };
}
