import { IChangePassword } from "../../Types/authTypes";
import { getCookie } from "../../utils/cookie";
import axios from "axios";
import { authsrv } from "../../constants";

export const changePassword = (formData: IChangePassword): Promise<any> => {
  return new Promise((resolve, reject): any => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .post(authsrv + "/api/auth-srv/admin/change-password", formData, {
        headers,
      })
      .then(({ data }) => {
        resolve(data);
      })
      .catch(({ response }) => {
        if (response.status === 403) {
          window.location.href = "/signin?session=expired";
        } else {
          reject(new Error(response.data.message));
        }
      });
  });
};
