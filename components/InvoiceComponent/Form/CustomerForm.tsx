import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
import { IClientResponse } from "../../../Types/clientTypes";
import { Dropdown } from "semantic-ui-react";
import { customerDropDownFullTextSearchAPI } from "../../../actions/customer";
import { fetchDockReceiptByCustomerId } from "../../../actions/invoice";

type IProps = {
  formValues: any;
  setFormValues: Dispatch<SetStateAction<any>>;
  customerData: IClientResponse[];
  setDockReceiptData: Dispatch<SetStateAction<any[]>>;
  setViewIsVisible: Dispatch<SetStateAction<boolean>>;
};

const CustomerForm = ({
  formValues,
  setFormValues,
  customerData,
  setDockReceiptData,
  setViewIsVisible,
}: IProps) => {
  const [searchData, setSearchData] = useState<IClientResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const customerOptions = (customerData: IClientResponse[]) =>
    customerData.map((value: any, index: number) => ({
      key: index,
      text: value.full_name,
      value: value.id,
    }));

  return (
    <div style={{ marginBottom: 20 }}>
      <form autoComplete="off">
        <p style={{ fontSize: 16 }}>
          <strong>Customer</strong>
        </p>
        <Dropdown
          placeholder="Search by customer name"
          search={(data, inputValues) => {
            customerDropDownFullTextSearchAPI(inputValues).then(
              (result: any) => {
                setSearchData(result.data);
              }
            );
            return customerOptions(searchData);
          }}
          loading={isLoading}
          selection
          value={formValues.customer_id}
          options={customerOptions(customerData)}
          style={{ width: "100%" }}
          onChange={async (e, { value, name }) => {
            try {
              setFormValues((prev: any) => {
                return {
                  ...prev,
                  [name]: value,
                };
              });
              const customerId: number = value as number;
              setIsLoading(true);
              const data: any[] = await fetchDockReceiptByCustomerId(
                customerId
              );
              setDockReceiptData(data);
              setIsLoading(false);
              setViewIsVisible(true);
            } catch (e) {
              setIsLoading(false);
              alert("Application Error");
            }
          }}
          name="customer_id"
        />
      </form>
    </div>
  );
};

export default CustomerForm;
