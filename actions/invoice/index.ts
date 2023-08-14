import { IInvoice_Response } from "../../Types/invoiceTypes";
import { getCookie } from "../../utils/cookie";
import axios from "axios";
import { IDockReceipt_Response } from "../../Types/dockReceiptTypes";
import { receiptsSrv } from "../../constants";

export const invoiceFullTextSearchAPI = async (inputValue: string) =>
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
        `${receiptsSrv}/api/receipt-srv/invoice/full-text-search`,
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

export const fetchtoPrintInvoice = async (id: Number): Promise<any[]> =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .get<any[]>(`${receiptsSrv}/api/receipt-srv/invoices/${id}`, { headers })
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

export const fetchInvoice = async (
  offset: number,
  limit: number
): Promise<IInvoice_Response[]> =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .get<IInvoice_Response[]>(
        `${receiptsSrv}/api/receipt-srv/invoices?offset=${offset}&limit=${limit}`,
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

export const createInvoice_API = async (formValues: any) => {
  return new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .post(`${receiptsSrv}/api/receipt-srv/invoice/create`, formValues, {
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

export const fetchDockReceiptByCustomerId = async (
  customerId: number
): Promise<IDockReceipt_Response[]> =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .get<IDockReceipt_Response[]>(
        `${receiptsSrv}/api/receipt-srv/dock_receipts/${customerId}`,
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

export const handleUpdateInvoice_Receipt_API = async (
  body: any,
  id: number
) => {
  return new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };

    axios
      .put(`${receiptsSrv}/api/receipt-srv/invoice/` + id + "/update", body, {
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

export const handleDeleteInvoice_API = async (id: number | undefined) => {
  return new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .delete(`${receiptsSrv}/api/receipt-srv/invoice/` + id + "/delete", {
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
