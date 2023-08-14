export type IPOANRA_Response = {
  id?: number;
  date_added?: Date;
  customer_id?: number;
  consignee_id?: number;
  port_of_destination: string;
  carrier: string;
  insurance: boolean | string;
  type_of_shipment: string;
  type_of_payment: string;
  effective_date: Date;
  expiration_date: Date;
  carrier_rep: string;
  bill_of_lading_origin: string;
  ocean_port_of_loading: string;
  bill_of_lading_destination: string;
  ocean_port_of_discharge: string;
  rate: string;
  rate_basis: string;
  cargo_qty: string;
  minimum: number;
  maximum: number;
  origin_service: string;
  destination_service: string;
  special_conditions: string;
  commodity: string;
};

export type IPOANRA_FORM = {
  customer_id: number;
  consignee_id: number;
};

export type IAutoComplete = {
  type: string;
  text: string;
};

export const poa_nra_form_values: IPOANRA_Response = {
  customer_id: 0,
  consignee_id: 0,
  port_of_destination: "",
  carrier: "",
  insurance: false,
  type_of_shipment: "",
  type_of_payment: "",
  effective_date: new Date(),
  expiration_date: new Date(),
  carrier_rep: "",
  bill_of_lading_origin: "",
  ocean_port_of_loading: "",
  bill_of_lading_destination: "",
  ocean_port_of_discharge: "",
  rate: "",
  rate_basis: "",
  cargo_qty: "",
  maximum: 0,
  minimum: 0,
  origin_service: "",
  destination_service: "",
  special_conditions: "RATE IS FOR 40 FT HIGH CUBE CONTAINER  PORT TO PORT",
  commodity: "",
};

export type IConsigneeSearch = {
  full_name: string;
  id: number;
};

export enum EPOA_NRA_DATA {
  PORT_OF_DESTINATION = "port_of_destination",
  CARRIER = "carrier",
  CARRIER_REP = "carrier_rep",
  BILL_OF_LADING_ORIGIN = "bill_of_lading_origin",
  OCEAN_PORT_OF_LOADING = "ocean_port_of_loading",
  BILL_OF_LADING_DESTINATION = "bill_of_lading_destination",
  OCEAN_PORT_OF_DISCHARGE = "ocean_port_of_discharge",
  RATE_BASIS = "rate_basis",
  RATE = "rate",
  ORIGIN_SERVICE = "origin_service",
  DESTINATION_SERVICE = "destination_service",
  SPECIAL_CONDITIONS = "special_conditions",
  COMMODITY = "commodity",
  INSURANCE = "insurance",
  TYPE_OF_PAYMENT = "type_of_payment",
  EFFECTIVE_DATE = "effective_date",
  EXPIRATION_DATE = "expiration_date",
  CARGO_QTY = "cargo_qty",
  MINIMUM = "minimum",
  MAXIMUM = "maximum",
  TYPE_OF_SHIPMENT = "type_of_shipment",
}

export type IGenerateInput = {
  type: string;
  value: string | boolean | Date | number;
  name: string;
  label: string;
  radioArray: IRadioArray[];
  tab: string;
};

export type IRadioArray = { label: string; isChecked: boolean };

export const generateInput = (data: IPOANRA_Response): IGenerateInput[] => [
  {
    type: "dropDown",
    value: data.port_of_destination,
    name: EPOA_NRA_DATA.PORT_OF_DESTINATION,
    label: "Port Of Destination",
    tab: "details",
    radioArray: [],
  },
  {
    type: "dropDown",
    value: data.carrier,
    name: EPOA_NRA_DATA.CARRIER,
    label: "Carrier",
    tab: "details",
    radioArray: [],
  },
  {
    type: "radio",
    value: data.insurance,
    label: "Insurance",
    name: EPOA_NRA_DATA.INSURANCE,
    tab: "details",
    radioArray: [
      { label: "Yes", isChecked: false },
      { label: "No", isChecked: false },
    ],
  },
  {
    type: "radio",
    value: data.type_of_payment,
    label: "Type Of Payment",
    name: EPOA_NRA_DATA.TYPE_OF_PAYMENT,
    tab: "details",
    radioArray: [
      { label: "Cash", isChecked: false },
      { label: "Bank Check", isChecked: false },
      { label: "Bank Wire", isChecked: false },
      { label: "Bank Deposit", isChecked: false },
    ],
  },

  {
    type: "date",
    value: data.effective_date,
    name: EPOA_NRA_DATA.EFFECTIVE_DATE,
    label: "Effective",
    tab: "details",
    radioArray: [],
  },
  {
    type: "date",
    value: data.expiration_date,
    name: EPOA_NRA_DATA.EXPIRATION_DATE,
    label: "Expiration",
    tab: "details",
    radioArray: [],
  },
  {
    type: "radio",
    value: data.type_of_shipment,
    label: "Type Of Shipment",
    name: EPOA_NRA_DATA.TYPE_OF_SHIPMENT,
    tab: "details",
    radioArray: [
      { label: "RORO", isChecked: false },
      { label: "Container", isChecked: false },
      { label: "Consolidation", isChecked: false },
    ],
  },
  {
    type: "dropDown",
    value: data.carrier_rep,
    name: EPOA_NRA_DATA.CARRIER_REP,
    label: "Carrier Rep",
    tab: "details",
    radioArray: [],
  },
  {
    type: "dropDown",
    value: data.bill_of_lading_origin,
    name: EPOA_NRA_DATA.BILL_OF_LADING_ORIGIN,
    label: "Bill of lading origin(s)",
    tab: "others",
    radioArray: [],
  },
  {
    type: "dropDown",
    value: data.bill_of_lading_destination,
    name: EPOA_NRA_DATA.BILL_OF_LADING_DESTINATION,
    label: "Bill of lading destination",
    tab: "others",
    radioArray: [],
  },
  {
    type: "text",
    value: data.rate,
    name: EPOA_NRA_DATA.RATE,
    label: "Rate",
    tab: "others",
    radioArray: [],
  },
  {
    type: "dropDown",
    value: data.rate_basis,
    name: EPOA_NRA_DATA.RATE_BASIS,
    label: "Rate Basis",
    tab: "others",
    radioArray: [],
  },
  {
    type: "dropDown",
    value: data.cargo_qty,
    name: EPOA_NRA_DATA.CARGO_QTY,
    label: "Cargo Quantity",
    tab: "others",
    radioArray: [],
  },
  {
    type: "text",
    value: data.minimum,
    name: EPOA_NRA_DATA.MINIMUM,
    label: "Minimum",
    tab: "others",
    radioArray: [],
  },
  {
    type: "text",
    value: data.maximum,
    name: EPOA_NRA_DATA.MAXIMUM,
    label: "Maximum",
    tab: "others",
    radioArray: [],
  },
  {
    type: "dropDown",
    value: data.origin_service,
    name: EPOA_NRA_DATA.ORIGIN_SERVICE,
    label: "Origin Service",
    tab: "others",
    radioArray: [],
  },
  {
    type: "dropDown",
    value: data.destination_service,
    name: EPOA_NRA_DATA.DESTINATION_SERVICE,
    label: "Destination Service",
    tab: "others",
    radioArray: [],
  },
  {
    type: "textarea",
    value: data.special_conditions,
    name: EPOA_NRA_DATA.SPECIAL_CONDITIONS,
    label: "Special Conditions",
    tab: "others",
    radioArray: [],
  },
  {
    type: "dropDown",
    value: data.commodity,
    name: EPOA_NRA_DATA.COMMODITY,
    label: "Commodity Description",
    tab: "others",
    radioArray: [],
  },
];
