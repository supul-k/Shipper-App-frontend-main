import { IGenerateInput } from "./poaNraTypes";

export type IBookingReceipt_Response = {
  id?: number;
  date_added: Date;
  customer_id: number;
  consignee_id: number;
  vessel_name: string;
  voyage_number: string;
  booking_number: string;
  equipment_size: string;
  total_no_of_containers: string;
  loading_terminal: string;
  carrier: string;
  cut_off_date: Date;
  sail_date: Date;
  arrival_date: Date | "";
  commodity: string;
  type_of_move: string;
  pickup_terminal: string;
  place_of_receipt: string;
  port_of_loading: string;
  port_of_discharge: string;
  place_of_delivery: string;
  rate: string;
  notes: string;
};

export const booking_receipt_form_values: IBookingReceipt_Response = {
  id: 0,
  date_added: new Date(),
  customer_id: 0,
  consignee_id: 0,
  vessel_name: "",
  voyage_number: "",
  booking_number: "",
  equipment_size: "",
  total_no_of_containers: "",
  loading_terminal: "",
  carrier: "",
  cut_off_date: new Date(),
  sail_date: new Date(),
  arrival_date: "",
  commodity: "",
  type_of_move: "",
  pickup_terminal: "",
  place_of_receipt: "",
  port_of_loading: "",
  port_of_discharge: "",
  place_of_delivery: "",
  rate: "",
  notes: "",
};

export type IBookingReceipt_FORM = {
  customer_id: number;
  consignee_id: number;
};

export enum EBOOKING_RECEIPTS_DATA {
  VESSEL_NAME = "vessel_name",
  VOYAGE_NUMBER = "voyage_number",
  BOOKING_NUMBER = "booking_number",
  EQUIPMENT_SIZE = "equipment_size",
  TOTAL_NO_OF_CONTAINERS = "total_no_of_containers",
  LOADING_TERMINAL = "loading_terminal",
  CARRIER = "carrier",
  CUT_OFF_DATE = "cut_off_date",
  SAIL_DATE = "sail_date",
  ARRIVAL_DATE = "arrival_date",
  COMMODITY = "commodity",
  TYPE_OF_MOVE = "type_of_move",
  PICKUP_TERMINAL = "pickup_terminal",
  PLACE_OF_RECEIPT = "place_of_receipt",
  PORT_OF_LOADING = "port_of_loading",
  PORT_OF_DISCHARGE = "port_of_discharge",
  PLACE_OF_DELIVERY = "place_of_delivery",
  RATE = "rate",
  NOTES = "notes",
}

export const generateInput = (
  data: IBookingReceipt_Response
): IGenerateInput[] => [
  {
    type: "text",
    value: data.vessel_name,
    name: EBOOKING_RECEIPTS_DATA.VESSEL_NAME,
    label: "Vessel Name",
    tab: "details",
    radioArray: [],
  },
  {
    type: "text",
    value: data.voyage_number,
    name: EBOOKING_RECEIPTS_DATA.VOYAGE_NUMBER,
    label: "Voyage Number",
    tab: "details",
    radioArray: [],
  },
  {
    type: "text",
    value: data.booking_number,
    label: "Booking Number",
    name: EBOOKING_RECEIPTS_DATA.BOOKING_NUMBER,
    tab: "details",
    radioArray: [],
  },
  {
    type: "dropDown",
    value: data.equipment_size,
    name: EBOOKING_RECEIPTS_DATA.EQUIPMENT_SIZE,
    label: "Equipment Size",
    tab: "details",
    radioArray: [],
  },

  {
    type: "dropDown",
    value: data.total_no_of_containers,
    name: EBOOKING_RECEIPTS_DATA.TOTAL_NO_OF_CONTAINERS,
    label: "Total No. of Containers",
    tab: "details",
    radioArray: [],
  },
  {
    type: "dropDown",
    value: data.loading_terminal,
    name: EBOOKING_RECEIPTS_DATA.LOADING_TERMINAL,
    label: "Loading Terminal",
    tab: "details",
    radioArray: [],
  },
  {
    type: "dropDown",
    value: data.carrier,
    label: "Carrier",
    name: EBOOKING_RECEIPTS_DATA.CARRIER,
    tab: "details",
    radioArray: [],
  },
  {
    type: "dropDown",
    value: data.commodity,
    label: "Commodity Description",
    name: EBOOKING_RECEIPTS_DATA.COMMODITY,
    tab: "details",
    radioArray: [],
  },
  {
    type: "date",
    value: data.cut_off_date,
    name: EBOOKING_RECEIPTS_DATA.CUT_OFF_DATE,
    label: "Cut off Date",
    tab: "others",
    radioArray: [],
  },
  {
    type: "date",
    value: data.sail_date,
    name: EBOOKING_RECEIPTS_DATA.SAIL_DATE,
    label: "Sail Date",
    tab: "others",
    radioArray: [],
  },
  {
    type: "date",
    value: data.arrival_date,
    name: EBOOKING_RECEIPTS_DATA.ARRIVAL_DATE,
    label: "Arrival Date",
    tab: "others",
    radioArray: [],
  },
  {
    type: "dropDown",
    value: data.type_of_move,
    name: EBOOKING_RECEIPTS_DATA.TYPE_OF_MOVE,
    label: "Type of Move",
    tab: "others",
    radioArray: [],
  },
  {
    type: "dropDown",
    value: data.pickup_terminal,
    name: EBOOKING_RECEIPTS_DATA.PICKUP_TERMINAL,
    label: "Pickup Terminal",
    tab: "others",
    radioArray: [],
  },
  {
    type: "dropDown",
    value: data.place_of_receipt,
    name: EBOOKING_RECEIPTS_DATA.PLACE_OF_RECEIPT,
    label: "Place of Receipt",
    tab: "others",
    radioArray: [],
  },
  {
    type: "dropDown",
    value: data.port_of_loading,
    name: EBOOKING_RECEIPTS_DATA.PORT_OF_LOADING,
    label: "Port of Loading",
    tab: "others",
    radioArray: [],
  },
  {
    type: "dropDown",
    value: data.port_of_discharge,
    name: EBOOKING_RECEIPTS_DATA.PORT_OF_DISCHARGE,
    label: "Port of Discharge",
    tab: "others",
    radioArray: [],
  },
  {
    type: "dropDown",
    value: data.place_of_delivery,
    name: EBOOKING_RECEIPTS_DATA.PLACE_OF_DELIVERY,
    label: "Place of Delivery",
    tab: "others",
    radioArray: [],
  },
  {
    type: "text",
    value: data.rate,
    name: EBOOKING_RECEIPTS_DATA.RATE,
    label: "Rate",
    tab: "others",
    radioArray: [],
  },
  {
    type: "textarea",
    value: data.notes,
    name: EBOOKING_RECEIPTS_DATA.NOTES,
    label: "Notes",
    tab: "others",
    radioArray: [],
  },
];
