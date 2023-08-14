import React, { useState, Dispatch, SetStateAction } from "react";
import { IClientResponse } from "../../../Types/clientTypes";
import { Dropdown } from "semantic-ui-react";
import { customerDropDownFullTextSearchAPI } from "../../../actions/customer";
import { IPOANRA_FORM, IConsigneeSearch } from "../../../Types/poaNraTypes";
import { findConsigneeByCustomerId } from "../../../actions/poa_nra";
import { IBookingDropDownData } from "../../../Types/dockReceiptTypes";
import { findBookingByCustomerId } from "../../../actions/dockReceipts";

type IProps = {
  formValues: any;
  setFormValues: Dispatch<SetStateAction<any>>;
  customerData: IClientResponse[];
  setConsigneeIsVisible: Dispatch<SetStateAction<boolean>>;
  setConsigneeData: Dispatch<SetStateAction<IConsigneeSearch[]>>;
  setBookingData: Dispatch<SetStateAction<IBookingDropDownData[]>>;
};

const CustomerForm = ({
  formValues,
  setFormValues,
  customerData,
  setConsigneeIsVisible,
  setConsigneeData,
  setBookingData,
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
          search
          loading={isLoading}
          selection
          value={formValues.customer_id}
          options={customerOptions(customerData)}
          placeholder="Search by customer name"
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
              const bookingResponse: IBookingDropDownData[] =
                await findBookingByCustomerId(customerId);

              setConsigneeData(data);
              // setBookingData(bookingResponse);
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
