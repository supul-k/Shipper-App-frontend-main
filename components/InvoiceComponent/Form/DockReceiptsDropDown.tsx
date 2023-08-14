import React, { useState, Dispatch, SetStateAction } from "react";
import { Dropdown } from "semantic-ui-react";

type IProps = {
  formValues: any;
  setFormValues: Dispatch<SetStateAction<any>>;
  dockReceiptData: any;
};

const DockReceiptsDropDown = ({ formValues, setFormValues, dockReceiptData }: IProps) => {
  const options = (data: any[]) =>
    data.map((value, index: number) => ({
      key: index,
      text: "Container number - " + value.container_number,
      value: value.id,
    }));

  return (
    <div style={{ marginBottom: 20 }}>
      <form autoComplete="off">
        <p style={{ fontSize: 16 }}>
          <strong>Dock Receipt</strong>
        </p>
        <Dropdown
          placeholder="Search by container number"
          selection
          search
          clearable
          value={formValues.dock_receipt_id}
          options={options(dockReceiptData)}
          style={{ width: "100%" }}
          onChange={(e, { value, name }) => {
            setFormValues((prev: any) => {
              return {
                ...prev,
                [name]: value,
              };
            });
          }}
          name="dock_receipt_id"
        />
      </form>
    </div>
  );
};

export default DockReceiptsDropDown;
