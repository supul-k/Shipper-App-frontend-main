export type IInvoice_Response = {
  id?: number;
  date_added: Date;
  customer_id: number;
  dock_receipt_id: number;
  invoice_total: number;
  balance_due: number;
  ocean_freight?: string;

  truck: string;
  ectn_besc: string;
  label_1: string;
  label_1_value: string;
  label_2: string;
  label_2_value: string;
  label_3: string;

  label_3_value: string;
  label_4: string;
  label_4_value: string;
  label_5: string;
  label_5_value: string;
  label_6: string;
  label_6_value: string;
};

export const invoice_form_values: IInvoice_Response = {
  id: 0,
  date_added: new Date(),
  customer_id: 0,
  dock_receipt_id: 0,
  invoice_total: 0,
  balance_due: 0,
  ocean_freight: "",

  truck: "",
  ectn_besc: "",
  label_1: "",
  label_1_value: "",
  label_2: "",
  label_2_value: "",
  label_3: "",

  label_3_value: "",
  label_4: "",
  label_4_value: "",
  label_5: "",
  label_5_value: "",
  label_6: "",
  label_6_value: "",
};
