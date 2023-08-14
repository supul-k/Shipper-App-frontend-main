import { getCookie } from "../../utils/cookie";
import axios from "axios";
import {
  IConsigneeSearch,
  IPOANRA_Response,
  IAutoComplete,
} from "../../Types/poaNraTypes";
import { customerSrv, receiptsSrv } from "../../constants";

export const fetchToPrintNra = async (id: number): Promise<any[]> =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .get<any[]>(`${receiptsSrv}/api/receipt-srv/poa_nra/${id}`, { headers })
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

export const poa_nraFullTextSearchAPI = async (inputValue: string) =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    const reqBody = {
      value: inputValue,
    };
    axios
      .post(
        `${receiptsSrv}/api/receipt-srv/poa_nra/full-text-search`,
        reqBody,
        { headers }
      )
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

export const createAutoComplete_API = async (
  body: IAutoComplete
): Promise<IAutoComplete[]> =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .post<IAutoComplete[]>(
        `${receiptsSrv}/api/receipt-srv/receipt_auto_complete/create`,
        body,
        { headers }
      )
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

export const deleteAutoComplete_API = async (id: number | undefined) => {
  return new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .delete(
        `${receiptsSrv}/api/receipt-srv/receipt_auto_complete/delete/` + id,
        {
          headers,
        }
      )
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

export const fetchAutoCompleteAPI = async (): Promise<IAutoComplete[]> =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .get<IAutoComplete[]>(
        `${receiptsSrv}/api/receipt-srv/receipt_auto_complete`,
        { headers }
      )
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

export const createPONRA_API = async (
  body: IPOANRA_Response
): Promise<IPOANRA_Response[]> =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .post<IPOANRA_Response[]>(
        `${receiptsSrv}/api/receipt-srv/poa_nra/create`,
        body,
        { headers }
      )
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

export const handleUpdatePOA_NRA_API = async (
  body: IPOANRA_Response,
  id: number
) => {
  return new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };

    axios
      .put(`${receiptsSrv}/api/receipt-srv/poa_nra/` + id + "/update", body, {
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

export const fetchPONRA = async (
  offset: number,
  limit: number
): Promise<IPOANRA_Response[]> =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .get(
        `${receiptsSrv}/api/receipt-srv/poa_nra?offset=${offset}&limit=${limit}`,
        { headers }
      )
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

export const findConsigneeByCustomerId = async (
  customerId: number
): Promise<IConsigneeSearch[]> =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .get(
        `${customerSrv}/api/customer-srv/consignee/find-by-customerId/${customerId}`,
        { headers }
      )
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

export const handleDeletePOA_NRA_API = async (id: number | undefined) => {
  return new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .delete(`${receiptsSrv}/api/receipt-srv/poa_nra/` + id + "/delete", {
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
