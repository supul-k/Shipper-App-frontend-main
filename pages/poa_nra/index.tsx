import React, { useState, useEffect } from "react";
import SearchSection from "../../components/POANRA/SearchSection";
import {
  IPOANRA_Response,
  poa_nra_form_values,
  IPOANRA_FORM,
  IAutoComplete,
} from "../../Types/poaNraTypes";
import FormModal from "../../components/POANRA/FormModal";
import { useDispatch, useSelector } from "react-redux";
import { handleModal } from "../../store/actions/modal";
import { IClientResponse } from "../../Types/clientTypes";
import { fetchCustomers } from "../../actions/customer";
import DataTable from "../../components/POANRA/DataTable";
import ContainerForm from "../../components/POANRA/ContainerForm";
import BookingConfirmation from "../../components/POANRA/BookingConfirmationForm";
import DockReceiptForm from "../../components/POANRA/DockReceiptForm";
import InvoiceForm from "../../components/POANRA/InvoiceForm";
import {
  IDockReceipt_FORM,
  IDockReceipt_Response,
  IBookingDropDownData,
} from "../../Types/dockReceiptTypes";
import {
  IBookingReceipt_FORM,
  IBookingReceipt_Response,
} from "../../Types/bookingReceiptTypes";
import { fetchPONRA, fetchAutoCompleteAPI } from "../../actions/poa_nra";
import { IContainerForm, containerFormObj } from "../../Types/containerTypes";
import {
  IInvoice_Response,
  invoice_form_values,
} from "../../Types/invoiceTypes";

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

const formData = { customer_id: 0, consignee_id: 0 };

const POANRA = () => {
  const [state, dispatch] = React.useReducer(reducer, {
    open: false,
    size: undefined,
  });

  const dockReceiptFormData = {
    customer_id: 0,
    consignee_id: 0,
    container_id: 0,
    booking_id: 0,
    total_weight: 0,
    weight: 0,
    measurement: 0,
  };

  const [formAction, setFormAction] = useState<string>("");
  const [formValues, setFormValues] = useState<IPOANRA_FORM>(formData);
  const [bookingFormValues, setBookingFormValues] =
    useState<IBookingReceipt_FORM>(formData);
  const { open, size } = state;
  const [optionData, setOptionData] = useState<IAutoComplete[]>([]);
  const [containerId, setContainerId] = useState<number>(0);
  const [displayContainerForm, setDisplayContainerForm] =
    useState<boolean>(false);
  const [invoiceFormValues, setInvoiceFormValues] =
    useState<IInvoice_Response>(invoice_form_values);
  const [dockReceiptFormValues, setDockReceiptFormValues] =
    useState<IDockReceipt_FORM>(dockReceiptFormData);
  const [displayBookingConfirmation, setDisplayBookingConfirmation] =
    useState<boolean>(false);
  const [displayDockReceiptForm, setDisplayDockReceiptForm] =
    useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>("");
  const [consigneeName, setConsigneeName] = useState<string>("");
  const [customerId, setCustomerId] = useState<number>(0);
  const [consigneeId, setConsigneeId] = useState<number>(0);
  const [displayInvoiceForm, setDisplayInvoiceForm] = useState<boolean>(false);

  const [containerFormValues, setContainerFormValues] =
    useState<IContainerForm>(containerFormObj);

  const [customerData, setCustomerData] = useState<IClientResponse[]>([]);

  //Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [offset, setOffset] = useState<number>(0);
  const [rowCount, setRowCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rows, setRows] = useState<IPOANRA_Response[]>([]);
  const [pageIsLoading, setPageIsLoading] = useState<boolean>(false);
  const [indexToEdit, setIndexToEdit] = useState<number>(0);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const { data, count }: any = await fetchPONRA(offset, rowsPerPage);
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

  const openModalForm = () => {
    setFormAction("new");
    dispatch({ type: "open", size: "large" });
    setFormValues(formData);
  };

  const closeModal = () => {
    //  setOptionData([]);
    dispatch({ type: "close" });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>POA/NRA Contract ({rowCount})</h2>
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
      {open && !displayContainerForm ? (
        <FormModal
          open={open}
          size={size}
          rows={rows}
          closeModal={closeModal}
          formValues={formValues}
          setFormValues={setFormValues}
          setPageIsLoading={setPageIsLoading}
          customerData={customerData}
          setCustomerId={setCustomerId}
          setCustomerName={setCustomerName}
          setConsigneeName={setConsigneeName}
          setConsigneeId={setConsigneeId}
          setCustomerData={setCustomerData}
          optionData={optionData}
          setOptionData={setOptionData}
          setDisplayContainerForm={setDisplayContainerForm}
          formAction={formAction}
          indexToEdit={indexToEdit}
        />
      ) : !displayBookingConfirmation ? (
        <ContainerForm
          open={open}
          size={size}
          closeModal={closeModal}
          formValues={containerFormValues}
          setFormValues={setContainerFormValues}
          customerName={customerName}
          customerId={customerId}
          containerId={containerId}
          setContainerId={setContainerId}
          setDisplayContainerForm={setDisplayContainerForm}
          setDisplayBookingConfirmation={setDisplayBookingConfirmation}
          setPageIsLoading={setPageIsLoading}
        />
      ) : !displayDockReceiptForm ? (
        <BookingConfirmation
          open={open}
          size={size}
          closeModal={closeModal}
          consigneeName={consigneeName}
          customerName={customerName}
          customerId={customerId}
          formValues={bookingFormValues}
          setFormValues={setBookingFormValues}
          consigneeId={consigneeId}
          setDisplayContainerForm={setDisplayContainerForm}
          setDisplayBookingConfirmation={setDisplayBookingConfirmation}
          setDisplayDockReceiptForm={setDisplayDockReceiptForm}
          setPageIsLoading={setPageIsLoading}
        />
      ) : !displayInvoiceForm ? (
        <DockReceiptForm
          open={open}
          size={size}
          closeModal={closeModal}
          formValues={dockReceiptFormValues}
          setFormValues={setDockReceiptFormValues}
          customerName={customerName}
          customerId={customerId}
          consigneeId={consigneeId}
          consigneeName={consigneeName}
          setDisplayContainerForm={setDisplayContainerForm}
          setDisplayBookingConfirmation={setDisplayBookingConfirmation}
          setDisplayDockReceiptForm={setDisplayDockReceiptForm}
          setDisplayInvoiceForm={setDisplayInvoiceForm}
          setPageIsLoading={setPageIsLoading}
        />
      ) : (
        <InvoiceForm
          open={open}
          size={size}
          closeModal={closeModal}
          formValues={invoiceFormValues}
          setFormValues={setInvoiceFormValues}
          setDisplayContainerForm={setDisplayContainerForm}
          setDisplayBookingConfirmation={setDisplayBookingConfirmation}
          setDisplayDockReceiptForm={setDisplayDockReceiptForm}
          setDisplayInvoiceForm={setDisplayInvoiceForm}
          customerName={customerName}
          customerId={customerId}
          consigneeId={consigneeId}
          consigneeName={consigneeName}
          setPageIsLoading={setPageIsLoading}
        />
      )}
    </div>
  );
};

export default POANRA;
