import { IGenerateInput } from "./poaNraTypes";

export type IBookingDropDownData = {
  id: number;
  booking_number: string;
};

export type IEffectSection = {
  personal_effect: string;
  weight?: number;
  measurement?: number;
};

export type IDockReceipt_Response = {
  id?: number;
  date_added: Date;
  customer_id: number;
  consignee_id: number;
  container_id: number;
  booking_id: number;
  total_weight: number;
  weight: number;
  measurement: number;
  personal_effect?: string;

  notify_party_name: string;
  notify_party_address: string;
  notify_party_country: string;
  notify_party_phone_number: string;
  seal_number: string;
  demurrage: string;
  container_number: string;

  aes_number: string;
  originals_to_be_released: string;
  client_as_agent: boolean;
  forwarding_agent_references: string;
  for_transhipment_to: string;
  point_and_country_of_origin: string;
};

export const dock_receipt_form_values: IDockReceipt_Response = {
  id: 0,
  date_added: new Date(),
  customer_id: 0,
  consignee_id: 0,
  container_id: 0,
  booking_id: 0,
  total_weight: 0,
  weight: 0,
  measurement: 0,

  notify_party_name: "",
  notify_party_address: "",
  notify_party_country: "",
  notify_party_phone_number: "",
  seal_number: "",
  demurrage: "",
  container_number: "",

  aes_number: "",
  originals_to_be_released: "",
  client_as_agent: false,
  forwarding_agent_references: "OLDSAILORS OCEAN SHIPPING LLC, 13903 CHADSWORTH TERRACE LAUREL, MD, 20707, USA, Tel:301-213-6961",
  for_transhipment_to: "",
  point_and_country_of_origin: "",
};

export type IDockReceipt_FORM = {
  customer_id: number;
  consignee_id: number;
  container_id: number;
  booking_id: number;
  total_weight: number;
  weight: number;
  measurement: number;
};

export enum EDOCK_RECEIPTS_DATA {
  NOTIFY_PARTY_NAME = "notify_party_name",
  NOTIFY_PARTY_ADDRESS = "notify_party_address",
  NOTIFY_PARTY_COUNTRY = "notify_party_country",
  NOTIFY_PARTY_PHONE_NUMBER = "notify_party_phone_number",
  SEAL_NUMBER = "seal_number",
  DEMURRAGE = "demurrage",
  CONTAINER_NUMBER = "container_number",
  AES_NUMBER = "aes_number",
  ORIGINALS_TO_BE_RELEASED = "originals_to_be_released",
  CLIENT_AS_AGENT = "client_as_agent",
  FORWARDING_AGENT_REFERENCES = "forwarding_agent_references",
  FOR_TRANSHIPMENT = "for_transhipment_to",
  POINT_AND_COUNTRY_OF_ORIGIN = "point_and_country_of_origin",
}

export const generateInput = (data: IDockReceipt_Response): IGenerateInput[] => [
  {
    type: "text",
    value: data.notify_party_name,
    name: EDOCK_RECEIPTS_DATA.NOTIFY_PARTY_NAME,
    label: "Notify party name",
    tab: "notify_party",
    radioArray: [],
  },
  {
    type: "text",
    value: data.notify_party_address,
    name: EDOCK_RECEIPTS_DATA.NOTIFY_PARTY_ADDRESS,
    label: "Notify party address",
    tab: "notify_party",
    radioArray: [],
  },
  {
    type: "text",
    value: data.notify_party_country,
    name: EDOCK_RECEIPTS_DATA.NOTIFY_PARTY_COUNTRY,
    label: "Notify party country",
    tab: "notify_party",
    radioArray: [],
  },
  {
    type: "text",
    value: data.notify_party_phone_number,
    name: EDOCK_RECEIPTS_DATA.NOTIFY_PARTY_PHONE_NUMBER,
    label: "Notify party phone number",
    tab: "notify_party",
    radioArray: [],
  },
  {
    type: "text",
    value: data.seal_number,
    name: EDOCK_RECEIPTS_DATA.SEAL_NUMBER,
    label: "Seal number",
    tab: "marsk",
    radioArray: [],
  },
  {
    type: "dropDown",
    value: data.demurrage,
    name: EDOCK_RECEIPTS_DATA.DEMURRAGE,
    label: "Demurrage",
    tab: "marsk",
    radioArray: [],
  },
  {
    type: "text",
    value: data.container_number,
    name: EDOCK_RECEIPTS_DATA.CONTAINER_NUMBER,
    label: "Container number",
    tab: "marsk",
    radioArray: [],
  },
  {
    type: "text",
    value: data.aes_number,
    name: EDOCK_RECEIPTS_DATA.AES_NUMBER,
    label: "AES number",
    tab: "marsk",
    radioArray: [],
  },

  {
    type: "dropDown",
    value: data.originals_to_be_released,
    name: EDOCK_RECEIPTS_DATA.ORIGINALS_TO_BE_RELEASED,
    label: "Originals to be released",
    tab: "marsk",
    radioArray: [],
  },

  {
    type: "textarea",
    value: data.forwarding_agent_references,
    name: EDOCK_RECEIPTS_DATA.FORWARDING_AGENT_REFERENCES,
    label: "Forwarding Agent references",
    tab: "marsk",
    radioArray: [],
  },
  {
    type: "text",
    value: data.for_transhipment_to,
    name: EDOCK_RECEIPTS_DATA.FOR_TRANSHIPMENT,
    label: "For Transhipment to",
    tab: "marsk",
    radioArray: [],
  },
  {
    type: "dropDown",
    value: data.point_and_country_of_origin,
    name: EDOCK_RECEIPTS_DATA.POINT_AND_COUNTRY_OF_ORIGIN,
    label: "Point and country of origin",
    tab: "marsk",
    radioArray: [],
  },
];
