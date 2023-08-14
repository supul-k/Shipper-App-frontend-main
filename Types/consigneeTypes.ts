export type IConsigneeForm = {
    id: number;
    full_name: string;
    phone_number: string;
    email: string;
    address: string;
    state: string;
    city: string;
    zipcode: string;
    care_of: string;
    country: string;
    customer_id: number;
  };

  export type IConsigneeResponse= {
    id: number;
    full_name: string;
    phone_number: string;
    email: string;
    address: string;
    state: string;
    city: string;
    zipcode: string;
    irs_tax_id: string;
    passport_number: string;
    fax: string;
    ssn: string;
  };
  
  export const consigneeFormObj: IConsigneeForm = {
    id: 0,
    full_name: "",
    phone_number: "",
    email: "",
    address: "",
    state: "",
    city: "",
    zipcode: "",
    care_of: "",
    country: "",
    customer_id: 0,
   };
  