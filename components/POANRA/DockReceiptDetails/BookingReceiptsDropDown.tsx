import React, { useState, Dispatch, SetStateAction } from "react";
import { Dropdown } from "semantic-ui-react";
import { IBookingDropDownData } from "../../../Types/dockReceiptTypes";

type IProps = {
  formValues: any;
  setFormValues: Dispatch<SetStateAction<any>>;
  bookingData: IBookingDropDownData[];
};

const BookingReceiptsDropDown = ({ formValues, setFormValues, bookingData }: IProps) => {
  const options = (data: IBookingDropDownData[]) =>
    data.map((value, index: number) => ({
      key: index,
      text: value.booking_number,
      value: value.id,
    }));

  return (
    <div style={{ marginBottom: 20 }}>
      <form autoComplete="off">
        <p style={{ fontSize: 16 }}>
          <strong>Booking number</strong>
        </p>
        <Dropdown
          placeholder="Search by booking number"
          selection
          value={formValues.booking_id}
          options={options(bookingData)}
          style={{ width: "100%" }}
          onChange={(e, { value, name }) => {
            setFormValues((prev: any) => {
              return {
                ...prev,
                [name]: value,
              };
            });
          }}
          name="booking_id"
        />
      </form>
    </div>
  );
};

export default BookingReceiptsDropDown;
