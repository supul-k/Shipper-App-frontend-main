import { getCookie } from "../../utils/cookie";
import axios from "axios";
import {
  IDockReceipt_Response,
  IBookingDropDownData,
} from "../../Types/dockReceiptTypes";
import { customerSrv, receiptsSrv, containerSrv } from "../../constants";

export const fetchToDockPrint = async (id: number): Promise<any[]> =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .get<any[]>(`${receiptsSrv}/api/receipt-srv/dock_receipt/${id}`, {
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

export const fetchContainerByCustomerId = async (
  id: number,
  offset: number,
  limit: number
) =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .get(
        `${containerSrv}/api/container-srv/containers/find-by-customer-id/${id}?offset=${offset}&limit=${limit}`,
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

export const findBookingByCustomerId = async (
  id: number
): Promise<IBookingDropDownData[]> =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .get<IBookingDropDownData[]>(
        `${receiptsSrv}/api/receipt-srv/booking_receipt/find-by-customerId/${id}`,
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

export const findBookingByConsigneeId = async (
  id: number
): Promise<IBookingDropDownData[]> =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .get<IBookingDropDownData[]>(
        `${receiptsSrv}/api/receipt-srv/booking_receipt/find-by-consigneeId/${id}`,
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

export const dockReceiptFullTextSearchAPI = async (inputValue: string) =>
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
        `${receiptsSrv}/api/receipt-srv/dock_receipt/full-text-search`,
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

export const fetchDockReceipts = async (
  offset: number,
  limit: number
): Promise<IDockReceipt_Response[]> =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .get<IDockReceipt_Response[]>(
        `${receiptsSrv}/api/receipt-srv/dock_receipts?offset=${offset}&limit=${limit}`,
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

export const handleDeleteDock_Receipt_API = async (id: number | undefined) => {
  return new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .delete(`${receiptsSrv}/api/receipt-srv/dock_receipt/` + id + "/delete", {
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

export const fetchContainerById = async (id: number): Promise<any> =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .get<any>(`${containerSrv}/api/container-srv/container/${id}`, {
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

export const createDockReceipt_API = async (
  body: any,
  dockReceiptBody: any
): Promise<any[]> => {
  const data = await fetchContainerById(dockReceiptBody.container_id);
  data.total_weight = body.container.total_weight;
  data.weight = body.container.weight;
  data.measurement = body.container.measurement;
  const newBody = {
    container: data,
    car: body.car,
  };

  return new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };

    axios
      .put<any[]>(
        `${containerSrv}/api/container-srv/container/${dockReceiptBody.container_id}/update`,
        newBody,
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
    axios
      .post<any[]>(
        `${receiptsSrv}/api/receipt-srv/dock_receipt/create`,
        dockReceiptBody,
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
};

export const handleUpdateDock_Receipt_API = async (
  body: IDockReceipt_Response,
  id: number,
  containerData: any
) => {
  const data = await fetchContainerById(body.container_id);
  data.total_weight = containerData.container.total_weight;
  data.weight = containerData.container.weight;
  data.measurement = containerData.container.measurement;
  const newBody = {
    container: data,
    car: containerData.car,
  };

  return new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };

    axios
      .put<any[]>(
        `${containerSrv}/api/container-srv/container/${body.container_id}/update`,
        newBody,
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

    axios
      .put(
        `${receiptsSrv}/api/receipt-srv/dock_receipt/` + id + "/update",
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
};
