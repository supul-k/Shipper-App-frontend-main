import { IClientForm } from "../../Types/clientTypes";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import { customerSrv } from "../../constants";

export const customerDropDownFullTextSearchAPI = async (inputValue: string) =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    const reqBody = {
      value: inputValue,
    };
    axios
      .post(`${customerSrv}/api/customer-srv/customer/full-text-search`, reqBody, { headers })
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

export const fetchCustomers = async (offset: number, limit: number) =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .get(`${customerSrv}/api/customer-srv/customer/?offset=${offset}&limit=${limit}`, { headers })
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

  export const handleSaveAPI = async (formValues: IClientForm) => {
    return new Promise((resolve, reject) => {
      const jwt = getCookie();
      const headers = {
        Authorization: `Bearer ${jwt}`,
      };
      axios
        .post(`${customerSrv}/api/customer-srv/customer/`, formValues, { headers })
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
  
export const handleUpdateAPI = async (objToSave: any) => {
  return new Promise((resolve, reject) => {
    const id = objToSave.id;
    delete objToSave.id;

    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .put(`${customerSrv}/api/customer-srv/customer/` + id, objToSave, { headers })
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

export const handleDeleteCustomerApi = async (customerId: number) => {
  return new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .delete(`${customerSrv}/api/customer-srv/customer/` + customerId, { headers })
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
