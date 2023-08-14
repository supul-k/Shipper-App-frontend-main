export type IClientForm = {
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


  export type IClientResponse= {
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

  export type IClientSearchResponse= {
    id: number;
    full_name: string;
  };
  
  
  export const clientFormObj: IClientForm = {
    id: 0,
    full_name: "",
    phone_number: "",
    email: "",
    address: "",
    state: "",
    city: "",
    zipcode: "",
    irs_tax_id: "",
    passport_number: "",
    fax: "",
    ssn: "",
  };
  