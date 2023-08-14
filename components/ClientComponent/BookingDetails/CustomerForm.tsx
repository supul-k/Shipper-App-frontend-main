import React from "react";

import TextField from "@material-ui/core/TextField";

type IProps = {
  customerName: string;
  consigneeName: string;
};
const line = <div style={{ height: 2, border: "1px solid #E0E0E0", marginBottom: 15, marginTop: 5 }} />;

const CustomerForm = ({  customerName,consigneeName }: IProps) => {

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
        {line}
         <p style={{ fontSize: 16 }}>
          <strong>Consignee</strong>
        </p>
         <TextField
          label="Consignee Name"
          style={{ width: "100%" }}
          value={consigneeName}
          name="consignee"
          variant="outlined"
        />
      </form>
    </div>
  );
};

export default CustomerForm;
