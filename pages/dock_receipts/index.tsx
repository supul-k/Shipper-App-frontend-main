import React, { useState, useEffect } from "react";
import SearchSection from "../../components/DockReceipts/SearchSection";
import {
  IDockReceipt_FORM,
  IDockReceipt_Response,
  IBookingDropDownData,
} from "../../Types/dockReceiptTypes";
import { IAutoComplete } from "../../Types/poaNraTypes";
import { IClientResponse } from "../../Types/clientTypes";
import { fetchCustomers } from "../../actions/customer";
import { fetchDockReceipts } from "../../actions/dockReceipts";
import DataTable from "../../components/DockReceipts/DataTable";
import FormModal from "../../components/DockReceipts/FormModal";

function reducer(
  state: any,
  action: { type: string; size?: string | undefined }
) {
  switch (action.type) {
    case "close":
      return { open: false };
    case "open":
      return { open: true, size: action.size };
    default:
      throw new Error("Unsupported action...");
  }
}

const formData = {
  customer_id: 0,
  consignee_id: 0,
  container_id: 0,
  booking_id: 0,
  total_weight: 0,
  weight: 0,
  measurement: 0,
};

const DockReceipts = () => {
  const [formAction, setFormAction] = useState<string>("");
  const [formValues, setFormValues] = useState<IDockReceipt_FORM>(formData);
  const [state, dispatch] = React.useReducer(reducer, {
    open: false,
    size: undefined,
  });
  const { open, size } = state;
  const [optionData, setOptionData] = useState<IAutoComplete[]>([]);

  const [customerData, setCustomerData] = useState<IClientResponse[]>([]);

  //Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [offset, setOffset] = useState<number>(0);
  const [rowCount, setRowCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rows, setRows] = useState<IDockReceipt_Response[]>([]);
  const [pageIsLoading, setPageIsLoading] = useState<boolean>(false);
  const [indexToEdit, setIndexToEdit] = useState<number>(0);

  const openModalForm = () => {
    setFormAction("new");
    dispatch({ type: "open", size: "large" });
    setFormValues(formData);
  };

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const { data, count }: any = await fetchDockReceipts(offset, rowsPerPage);
      setIsLoading(false);
      setRowCount(count);

      setRows(data);
    };
    fetch();
  }, [rowsPerPage, offset, pageIsLoading]);

  useEffect(() => {
    const fetch = async () => {
      const { count }: any = await fetchCustomers(0, 5);
      const { data }: any = await fetchCustomers(0, count);
      setCustomerData(data);
    };
    fetch();
  }, []);

  const closeModal = () => {
    dispatch({ type: "close" });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Dock Receipts ({rowCount})</h2>
      <SearchSection
        openModalForm={openModalForm}
        setRows={setRows}
        setRowCount={setRowCount}
      />
      <div style={{ marginTop: 10 }}>
        <DataTable
          rows={rows}
          rowsPerPage={rowsPerPage}
          page={page}
          setRowsPerPage={setRowsPerPage}
          setPage={setPage}
          setOffset={setOffset}
          rowCount={rowCount}
          openModalForm={openModalForm}
          setRows={setRows}
          setPageIsLoading={setPageIsLoading}
          setFormAction={setFormAction}
          setIndexToEdit={setIndexToEdit}
        />
      </div>
      {open && (
        <FormModal
          open={open}
          size={size}
          rows={rows}
          closeModal={closeModal}
          formValues={formValues}
          setFormValues={setFormValues}
          setPageIsLoading={setPageIsLoading}
          customerData={customerData}
          setCustomerData={setCustomerData}
          optionData={optionData}
          setOptionData={setOptionData}
          formAction={formAction}
          indexToEdit={indexToEdit}
        />
      )}
    </div>
  );
};

export default DockReceipts;
