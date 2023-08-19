import React, { useState, Dispatch, SetStateAction } from "react";
import { Dropdown } from "semantic-ui-react";
import { IPOANRA_FORM, IConsigneeSearch } from "../../../Types/poaNraTypes";

type IProps = {
  formValues: any;
  setFormValues: Dispatch<SetStateAction<any>>;
  consigneeData: IConsigneeSearch[];
};

const ConsigneeForm = ({
  formValues,
  setFormValues,
  consigneeData,
}: IProps) => {
  const options = (consigneeData: IConsigneeSearch[]) =>
    consigneeData.map((value, index: number) => ({
      key: index,
      text: value.full_name,
      value: value.id,
    }));

  return (
    <div style={{ marginBottom: 20 }}>
      <form autoComplete="off">
        <p style={{ fontSize: 16 }}>
          <strong>Consignee</strong>
        </p>
        <Dropdown
          placeholder="Search by consignee name"
          selection
          // value={formValues.consignee_id}
          value={consigneeData[0]?.id}
          options={options(consigneeData)}
          style={{ width: "100%" }}
          onChange={(e, { value, name }) => {
            setFormValues((prev: any) => {
              return {
                ...prev,
                [name]: value,
              };
            });
          }}
          name="consignee_id"
          forceSelection={false}
          selectOnBlur={false}
        />
      </form>
    </div>
  );
};

export default ConsigneeForm;
