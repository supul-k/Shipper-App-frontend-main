import jwt from "jsonwebtoken";

const secret = "oldsailorsdbSecretKey";
const cookie = "1213123ewifhsirewurwr";

const jwtVerify = (token: string): boolean => {
  let isValid = false;
  jwt.verify(token, secret, function (err: any, decoded: any): void {
    if (err) {
      isValid = false;
    }
    isValid = true;
  });
  return isValid;
};

export const setCookie = (data: any) => {
  const date = new Date();
  date.setMonth(date.getMonth() + 24);
  document.cookie = `1213123ewifhsirewurwr=${data}; expires=${date}; path=/; Secure; SameSite=Strict`;
};

export const getCookie = () => {
  const cookieString = RegExp("[; ]" + cookie + "[^;]+").exec("; " + document.cookie);
  const token: string = unescape(!!cookieString ? cookieString.toString().replace(/^[^=]+./, "") : "");
  //check if cookie has expired
  if (jwtVerify(token)) {
    return token;
  }
  return "";
};

export const getServerCookie = (cookie: any) => {
  const cookieString = RegExp("[; ]" + cookie + "[^;]+").exec("; " + cookie);
  const token: string = unescape(!!cookieString ? cookieString.toString().replace(/^[^=]+./, "") : "");
  if (jwtVerify(token)) {
    return token;
  }
  return "";
};
