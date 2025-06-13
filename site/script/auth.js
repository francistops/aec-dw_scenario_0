// recevoir le token and le storer in the client
console.log('in auth.js')
let currentUser = null;

async function hashPassword(password) {
  let hashHex = "";
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  } catch (error) {
    console.log(`error: ${error}`);
  }
  return hashHex;
}

async function call(resource, method, auth, obj) {
  //TODO test it
  console.log('in auth.js call fn')
  console.log(resource, method, auth, obj)
  const BASE_URL = "https://www.amelieroussin.com/";
  const apiUrl = `${BASE_URL}${resource}`;
  let reqJson = {}
  const reqBodyJson = obj || {};
  console.log(reqBodyJson)

  if (resource == "subscribe" || resource == "login" || obj == undefined) {
    if ("password" in obj) {
      obj.passHash = hashPassword(obj.password);
      console.log(obj.password)
    } else {
      throw new Error("Empty password while required...");
    }
  }

  if (method == "GET") {
    reqJson = {
        method: `${method}`,
        headers: `${buildHeaders(auth)}`
    };
  } else {
    reqJson = {
        method: `${method}`,
        headers: `${buildHeaders(auth)}`,
        body: JSON.stringify(reqBodyJson),
    };
  }

  console.log('end of call fn before fetch: ', reqJson, reqBodyJson, apiUrl)
  const reqObjJson = await fetch(apiUrl, reqJson);
  console.log('end of call fn return: ', reqObjJson)
  return reqObjJson;
}

function buildHeaders(auth) {
  let headers = {
    "Content-type": "application/json",
    Accept: "application/json",
  };
  if (auth) {
    if (!isIdentified()) {
      throw new Error("Empty token while required...");
    }
    headers["Authorization"] = `Bearer ${getConnectedUser().token}`;
  }

  return headers;
}

export function getConnectedUser() {
  return JSON.parse(localStorage.getItem("user"));
}

export function isIdentified() {
  return getConnectedUser() !== null;
}

export async function subscribe(user) {
  let result = false;

  const subscribeJson = await call("subscribe", "POST", false, user);

  if (subscribeJson.errorCode == 0) {
    result = subscribeJson.subscribed;

    const event = new CustomEvent("auth-subscribed", {});
    this.dispatchEvent(event);
  } else {
    // TODO
    console.error("unhandle error in auth.js subscribeJson");
  }

  return result;
}

export async function login(user) {
  console.log("in auth.js login");
  // currentUser = loginJson.user;

  let result = false;
  const loginJson = await call("login", "POST", false, user);

  if (loginJson.errorCode == 0) {
    result = true;
    localStorage.setItem("user", JSON.stringify(loginJson.user));

    const event = new CustomEvent("auth-logedin", {});
    this.dispatchEvent(event);
  }

  return result;
}

export async function logout() {
  console.log("in auth.js logout");
  let result = false;

  const logoutJson = await call("logout", "POST", true);

  if (logoutJson.errorCode == 0) {
    result = logoutJson.revoked;
    localStorage.clear();

    // todo understand this better
    const event = new CustomEvent("auth-logedout", {});
    this.dispatchEvent(event);
  }

  return result;
}

export async function getAllPosts() {
  console.log("in auth.js getAllPosts");
  let result = [];
  const allPostsJson = await call("posts", "GET", false);

  if (allPostsJson.errorCode == 0) {
    result = allPostsJson.posts;
  }

  return result;
}

export async function getNextPost(postId) {
  let result = null;
  let resource = "posts/next";
  if (postId != null) {
    resource += `/${postId}`;
  }
  const nextPostJson = await call(resource, "GET", false);

  if (nextPostJson.errorCode == 0) {
    result = nextPostJson.post;
  }

  return result;
}
