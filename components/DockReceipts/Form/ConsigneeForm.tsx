import React, { useState, Dispatch, SetStateAction } from "react";
import { Dropdown } from "semantic-ui-react";
import { findBookingByConsigneeId } from "../../../actions/dockReceipts";
import { IBookingDropDownData } from "../../../Types/dockReceiptTypes";
import { IPOANRA_FORM, IConsigneeSearch } from "../../../Types/poaNraTypes";

type IProps = {
  formValues: any;
  setFormValues: Dispatch<SetStateAction<any>>;
  consigneeData: IConsigneeSearch[];
  setBookingData: Dispatch<SetStateAction<IBookingDropDownData[]>>;
};

const ConsigneeForm = ({
  formValues,
  setFormValues,
  consigneeData,
  setBookingData,
}: IProps) => {
  const [isLoading, setIsLoading] = useState(false);

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
          value={formValues.consignee_id}
          options={options(consigneeData)}
          style={{ width: "100%" }}
          onChange={async (e, { value, name }) => {
            setFormValues((prev: any) => {
              return {
                ...prev,
                [name]: value,
              };
            });
            const consigneeId: number = value as number;
            setIsLoading(true);
            const bookingResponse: IBookingDropDownData[] =
              await findBookingByConsigneeId(consigneeId);

            setBookingData(bookingResponse);
            setIsLoading(false);
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
