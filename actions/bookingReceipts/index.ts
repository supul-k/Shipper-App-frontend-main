import { getCookie } from "../../utils/cookie";
import axios from "axios";
import { IBookingReceipt_Response } from "../../Types/bookingReceiptTypes";
import { receiptsSrv } from "../../constants";

export const fetchToPrintBooking = async (id: number): Promise<IBookingReceipt_Response[]> =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .get<IBookingReceipt_Response[]>(`${receiptsSrv}/api/receipt-srv/booking_receipt/${id}`, { headers })
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

export const bookingReceiptFullTextSearchAPI = async (inputValue: string) =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    const reqBody = {
      value: inputValue,
    };
    axios
      .post(`${receiptsSrv}/api/receipt-srv/booking_receipt/full-text-search`, reqBody, { headers })
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

export const fetchBookingReceipts = async (offset: number, limit: number): Promise<IBookingReceipt_Response[]> =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .get<IBookingReceipt_Response[]>(`${receiptsSrv}/api/receipt-srv/booking_receipts?offset=${offset}&limit=${limit}`, { headers })
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

export const createBookingReceipt_API = async (body: IBookingReceipt_Response): Promise<IBookingReceipt_Response[]> =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .post<IBookingReceipt_Response[]>(`${receiptsSrv}/api/receipt-srv/booking_receipt/create`, body, { headers })
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

export const handleUpdateBooking_Receipt_API = async (body: IBookingReceipt_Response, id: number) => {
  return new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };

    axios
      .put(`${receiptsSrv}/api/receipt-srv/booking_receipt/` + id + "/update", body, { headers })
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

export const handleDeleteBooking_Receipt_API = async (id: number | undefined) => {
  return new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .delete(`${receiptsSrv}/api/receipt-srv/booking_receipt/` + id + "/delete", { headers })
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
