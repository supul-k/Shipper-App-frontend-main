import React, { useState, Dispatch, SetStateAction } from "react";
import { IClientResponse } from "../../Types/clientTypes";
import { Dropdown } from "semantic-ui-react";
import { customerDropDownFullTextSearchAPI } from "../../actions/customer";
import { IContainerForm, IContainerResponse } from "../../Types/containerTypes";

type IProps = {
  formValues: IContainerForm;
  setFormValues: Dispatch<SetStateAction<IContainerForm>>;
  customerData: IClientResponse[];
};

const CustomerForm = ({ formValues, setFormValues, customerData }: IProps) => {
  const [searchData, setSearchData] = useState<IClientResponse[]>([]);

  const customerOptions = (customerData: IClientResponse[]) =>
    customerData.map((value: any, index: number) => ({
      key: index,
      text: value.full_name,
      value: value.id,
    }));

  return (
    <div style={{ marginBottom: 50 }}>
      <form autoComplete="off">
        <p style={{ fontSize: 16 }}>
          <strong>Customer</strong>
        </p>
        <Dropdown
          placeholder="Search by customer name"
          search={(data, inputValues) => {
            customerDropDownFullTextSearchAPI(inputValues).then((result: any) => {
              setSearchData(result.data);
            });
            return customerOptions(searchData);
          }}
          selection
          value={formValues.customer_id}
          options={customerOptions(customerData)}
          style={{ width: "100%" }}
          onChange={(e, { value, name }) => {
            setFormValues((prev: any) => {
              return {
                ...prev,
                [name]: value,
              };
            });
          }}
          name="customer_id"
        />
      </form>
    </div>
  );
};

export default CustomerForm;
