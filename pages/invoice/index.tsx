import React, { useState, useEffect } from "react";
import SearchSection from "../../components/InvoiceComponent/SearchSection";
import {
  IInvoice_Response,
  invoice_form_values,
} from "../../Types/invoiceTypes";
import { IClientResponse } from "../../Types/clientTypes";
import { fetchCustomers } from "../../actions/customer";
import { fetchInvoice } from "../../actions/invoice";
import DataTable from "../../components/InvoiceComponent/DataTable";
import FormModal from "../../components/InvoiceComponent/FormModal";

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

const Invoice = () => {
  const [formAction, setFormAction] = useState<string>("");
  const [formValues, setFormValues] =
    useState<IInvoice_Response>(invoice_form_values);
  const [state, dispatch] = React.useReducer(reducer, {
    open: false,
    size: undefined,
  });
  const { open, size } = state;

  const [customerData, setCustomerData] = useState<IClientResponse[]>([]);

  //Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [offset, setOffset] = useState<number>(0);
  const [rowCount, setRowCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rows, setRows] = useState<IInvoice_Response[]>([]);
  const [pageIsLoading, setPageIsLoading] = useState<boolean>(false);
  const [indexToEdit, setIndexToEdit] = useState<number>(0);
  const [dockReceiptData, setDockReceiptData] = useState([]);

  const openModalForm = () => {
    setFormAction("new");
    dispatch({ type: "open", size: "large" });
    setFormValues(invoice_form_values);
  };

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const { data, count }: any = await fetchInvoice(offset, rowsPerPage);
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
      <h2>Invoice ({rowCount})</h2>
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
          formValues={formValues}
          setFormValues={setFormValues}
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
          formAction={formAction}
          indexToEdit={indexToEdit}
        />
      )}
    </div>
  );
};

export default Invoice;
