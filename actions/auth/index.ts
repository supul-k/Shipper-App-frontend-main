import { IFormData } from "../../Types/authTypes";
import axios from "axios";
import { authsrv } from "../../constants";

export const signIn = (formData: IFormData): Promise<any> => {
  return new Promise((resolve, reject): any => {
    axios
      .post(authsrv + "/api/auth-srv/admin/sign-in", formData)
      .then(({ data }) => {
        resolve(data);
      })
      .catch(
        ({
          response: {
            data: { message },
          },
        }) => {
          reject(new Error(message));
        }
      );
  });
};
