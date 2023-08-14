import React, { useState, Dispatch, SetStateAction } from "react";
import { IClientResponse } from "../../../Types/clientTypes";
import { Dropdown } from "semantic-ui-react";
import { customerDropDownFullTextSearchAPI } from "../../../actions/customer";
import { IPOANRA_FORM, IConsigneeSearch } from "../../../Types/poaNraTypes";
import { findConsigneeByCustomerId } from "../../../actions/poa_nra";

type IProps = {
  formValues: IPOANRA_FORM;
  setFormValues: Dispatch<SetStateAction<IPOANRA_FORM>>;
  customerData: IClientResponse[];
  setConsigneeIsVisible: Dispatch<SetStateAction<boolean>>;
  setConsigneeData: Dispatch<SetStateAction<IConsigneeSearch[]>>;
};

const CustomerForm = ({
  formValues,
  setFormValues,
  customerData,
  setConsigneeIsVisible,
  setConsigneeData,
}: IProps) => {
  const [searchData, setSearchData] = useState<IClientResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const responseData = customerData as any;

  const customerOptions = (customerData: IClientResponse[]) =>
    responseData.map((value: any, index: number) => ({
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
          search
          loading={isLoading}
          selection
          value={formValues.customer_id}
          options={customerOptions(customerData)}
          style={{ width: "100%" }}
          onChange={async (e, { value, name }) => {
            try {
              setConsigneeIsVisible(true);
              setFormValues((prev: any) => {
                return {
                  ...prev,
                  [name]: value,
                };
              });
              const customerId: number = value as number;
              setIsLoading(true);
              const data: IConsigneeSearch[] = await findConsigneeByCustomerId(
                customerId
              );
              setConsigneeData(data);
              setIsLoading(false);
            } catch (e) {
              setIsLoading(false);
              alert("Application Error");
            }
          }}
          name="customer_id"
          forceSelection={false}
          selectOnBlur={false}
        />
      </form>
    </div>
  );
};

export default CustomerForm;
