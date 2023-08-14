import React, { useState, Dispatch, SetStateAction } from "react";
import { IClientResponse } from "../../../Types/clientTypes";
import TextField from "@material-ui/core/TextField";
import { Dropdown } from "semantic-ui-react";
import { customerDropDownFullTextSearchAPI } from "../../../actions/customer";
import { IContainerForm, IContainerResponse } from "../../../Types/containerTypes";

type IProps = {
  formValues: IContainerForm;
  setFormValues: Dispatch<SetStateAction<IContainerForm>>;
  customerName: string;
};

const CustomerForm = ({ formValues, customerName }: IProps) => {
  const [searchData, setSearchData] = useState<IClientResponse[]>([]);


  return (
    <div style={{ marginBottom: 20 }}>
    <form autoComplete="off">
      <p style={{ fontSize: 16 }}>
        <strong>Customer</strong>
      </p>
      <TextField
        label="Customer Name"
        style={{ width: "100%" }}
        value={customerName}
        name="customer"
        variant="outlined"
      />    
    </form>
  </div>
  );
};

export default CustomerForm;
