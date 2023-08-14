import { IContainerForm, ICarFormValues, IContainerResponse } from "../../Types/containerTypes";
import { getCookie } from "../../utils/cookie";
import axios from "axios";
import { containerSrv } from "../../constants";

export const containerFullTextSearchAPI = async (inputValue: string) =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    const reqBody = {
      value: inputValue,
    };
    axios
      .post(`${containerSrv}/api/container-srv/container/full-text-search`, reqBody, { headers })
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

export const fetchContainer = async (offset: number, limit: number) =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .get(`${containerSrv}/api/container-srv/containers?offset=${offset}&limit=${limit}`, { headers })
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

export const fetchCars = async (containerId: number) =>
  new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .get(`${containerSrv}/api/container-srv/cars/${containerId}`, { headers })
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

export const handleSaveContainerAPI = async (formValues: IContainerForm) => {
  return new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .post(`${containerSrv}/api/container-srv/container/create`, formValues, { headers })
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

export const searchVIN = async (vin: string) => {
  return new Promise((resolve, reject) => {
    const headers = {
      authorization: "Basic Mjk4ZmRiZWMtMzM5OC00MzA0LTg3ZGEtYmIzYTg4ZDBlYTEw",
      "partner-token": "630da851c61c401c9bf3879c68ab6109",
    };
    axios
      .get("https://api.carmd.com/v3.0/decode?vin=" + vin, { headers })
      .then((data) => {
        resolve(data.data);
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

export const handleSaveCarAPI = async (carFormValue: ICarFormValues[]) => {
  return new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };

    axios
      .post(`${containerSrv}/api/container-srv/car/create`, carFormValue, { headers })
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

export const handleUpdateContainerAPI = async (carFormValues: ICarFormValues[], editFormValues: IContainerResponse, containerId: number) => {
  return new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };

    axios
      .put(`${containerSrv}/api/container-srv/container/` + containerId + "/update", { car: carFormValues, container: editFormValues }, { headers })
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

export const handleDeleteContainerAPI = async (containerId: number) => {
  return new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .delete(`${containerSrv}/api/container-srv/container/` + containerId + "/delete", { headers })
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

export const handleDeleteCarAPI = async (carId: number | undefined) => {
  return new Promise((resolve, reject) => {
    const jwt = getCookie();
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    axios
      .delete(`${containerSrv}/api/container-srv/car/` + carId + "/delete", { headers })
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
