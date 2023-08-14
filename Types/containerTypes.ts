import { IEffectSection } from "./dockReceiptTypes";

export type IContainerResponse = {
  id: number;
  date_added: Date;
  full_name: string;
  container_content: string;
  personal_effect: string;
  container_type: string;
  customerId: number;
  weight?: number;
  measurement?: number;
  total_weight?: number;

  freight: string;
  unit: string;
  in_transit: string;
};

export type IRadioBoxArray = {
  label: string;
  value: string;
  isChecked: boolean;
};

export type IContainerForm = {
  date_added: Date;
  customer_id: number;
  container_content: string;
  personal_effect: string;
  container_type: string;

  freight: string;
  unit: string;
  in_transit: string;
};

export const containerFormObj: IContainerForm = {
  date_added: new Date(),
  customer_id: 0,
  container_content: "",
  personal_effect: "",
  container_type: "container",

  freight: "",
  unit: "",
  in_transit: "",
};

export type IStep = {
  title: string;
  description: string;
  value: string;
  active: boolean;
  display: boolean;
  disabled: boolean;
};

export type ICarFormValues = {
  date_added: Date;
  vin: string;
  details: string;
  value_for_aes?: string;
  container_id: number;
  label?: string;
  actionType?: string;
  id?: number;
  weight?: number;
  measurement?: number;
};

export const carFormValuesObj = {
  date_added: new Date(),
  vin: "",
  details: "",
  value_for_aes: "",
  container_id: 0,
};

export const createCarInputs = (data: ICarFormValues) => [
  {
    label: "Car Details:",
    value: data.details,
    name: "details",
  },
  {
    label: "VIN:",
    value: data.vin,
    name: "vin",
  },
  {
    label: "Value For AES:",
    value: data.value_for_aes,
    name: "value_for_aes",
  },
];

export type ICarData = {
  carDetails: string;
  weight: number;
  measurement: number;
};

export const createCarInputsPerContainer = (data: ICarData, index: number) => [
  {
    label: "Car Details:",
    value: data.carDetails,
    name: "details",
  },
  {
    label: "Weight",
    value: data.weight,
    name: "weight",
  },
  {
    label: "Measurement",
    value: data.measurement,
    name: "measurement",
  },
];

export const createEffectInputsPerContainer = (data: IEffectSection) => [
  {
    type: "textarea",
    label: "Personal Effect",
    value: data.personal_effect,
    name: "personal_effect",
  },
  {
    type: "text",
    label: "Weight",
    value: data.weight,
    name: "weight",
  },
  {
    type: "text",
    label: "Measurement",
    value: data.measurement,
    name: "measurement",
  },
];
