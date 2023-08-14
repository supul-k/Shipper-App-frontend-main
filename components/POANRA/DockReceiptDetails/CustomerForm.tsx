import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
import {
  IClientResponse,
  IClientSearchResponse,
} from "../../../Types/clientTypes";
import { Dropdown } from "semantic-ui-react";
import { customerDropDownFullTextSearchAPI } from "../../../actions/customer";
import { IPOANRA_FORM, IConsigneeSearch } from "../../../Types/poaNraTypes";
import { findConsigneeByCustomerId } from "../../../actions/poa_nra";
import { IBookingDropDownData } from "../../../Types/dockReceiptTypes";
import { findBookingByCustomerId } from "../../../actions/dockReceipts";
import { TextField } from "@material-ui/core";
type IProps = {
  formValues: any;
  setFormValues: Dispatch<SetStateAction<any>>;
  customerId: number;
  customerName: string;
  setConsigneeIsVisible: Dispatch<SetStateAction<boolean>>;
  setConsigneeData: Dispatch<SetStateAction<IConsigneeSearch[]>>;
  setBookingData: Dispatch<SetStateAction<IBookingDropDownData[]>>;
};

const CustomerForm = ({
  formValues,
  setFormValues,
  customerId,
  customerName,
  setConsigneeIsVisible,
  setConsigneeData,
  setBookingData,
}: IProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [customerinfo, setCustomerInfo] = useState({
    id: customerId,
    full_name: customerName,
  });
  const [customerData, setCustomerData] = useState([
    { id: customerId, full_name: customerName },
  ]);

  const responseData = customerData as any;

  const customerOptions = (customerData: IClientSearchResponse[]) =>
    responseData.map((value: any, index: number) => ({
      key: index,
      text: customerName,
      value: customerId,
    }));

  useEffect(() => {
    setConsigneeIsVisible(true);
    const fetch = async () => {
      setIsLoading(true);
      const data: IConsigneeSearch[] = await findConsigneeByCustomerId(
        customerId
      );
      setConsigneeData(data);
      const bookingResponse: IBookingDropDownData[] =
        await findBookingByCustomerId(customerId);
      setBookingData(bookingResponse);
      setIsLoading(false);
    };
    fetch();
  }, []);

  return (
    <div style={{ marginBottom: 20 }}>
      <form autoComplete="off">
        <p style={{ fontSize: 16 }}>
          <strong>Customer</strong>
        </p>

        <Dropdown
          placeholder="Search by customer name"
          search={(data, inputValues) => {
            //     customerDropDownFullTextSearchAPI(inputValues).then((result: any) => {
            // //      setSearchData(result);
            //     });
            return customerOptions(customerData);
          }}
          loading={isLoading}
          selection
          value={customerId}
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
              const bookingResponse: IBookingDropDownData[] =
                await findBookingByCustomerId(customerId);
              setConsigneeData(data);
              setBookingData(bookingResponse);
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
