import React, { useEffect, useState } from "react";
import ClientComponent from "../../components/ClientComponent";
import ClientForm from "../../components/ClientComponent/ClientForm";
import SearchSection from "../../components/ClientComponent/SearchSection";
import ModalComponent from "../../components/ModalComponent";
import {
  IClientForm,
  clientFormObj,
  IClientResponse,
} from "../../Types/clientTypes";
import SnackBar from "../../components/SnackBar";
import {
  fetchCustomers,
  handleDeleteCustomerApi,
} from "../../actions/customer";
import CircularProgress from "../../components/SpinnerComponent/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { handleModal } from "../../store/actions/modal";
import { handleSnackBar, ISnackBar } from "../../store/actions/snackBar";
import ConsigneeForm from "../../components/ClientComponent/ConsigneeForm";
import POANRAForm from "../../components/ClientComponent/POANRAForm";
import ContainerForm from "../../components/ClientComponent/ContainerForm";
import BookingConfirmationForm from "../../components/ClientComponent/BookingConfirmationForm";
import DockReceiptForm from "../../components/ClientComponent/DockReceiptForm";
import InvoiceForm from "../../components/ClientComponent/InvoiceForm";
import {
  IDockReceipt_FORM,
  IDockReceipt_Response,
  IBookingDropDownData,
} from "../../Types/dockReceiptTypes";
import {
  IInvoice_Response,
  invoice_form_values,
} from "../../Types/invoiceTypes";
import {
  IBookingReceipt_FORM,
  IBookingReceipt_Response,
} from "../../Types/bookingReceiptTypes";
import { consigneeFormObj, IConsigneeForm } from "../../Types/consigneeTypes";
import {
  IPOANRA_FORM,
  IPOANRA_Response,
  poa_nra_form_values,
} from "../../Types/poaNraTypes";
import { IContainerForm, containerFormObj } from "../../Types/containerTypes";

const Client = () => {
  const formData = { customer_id: 0, consignee_id: 0 };
  const dockReceiptFormData = {
    customer_id: 0,
    consignee_id: 0,
    container_id: 0,
    booking_id: 0,
    total_weight: 0,
    weight: 0,
    measurement: 0,
  };

  const [isLoading, setIsLoading] = useState(true);
  const [formAction, setFormAction] = useState<string>("");
  const [formValues, setFormValues] = useState<IClientForm>(clientFormObj);
  const [poanraFormValues, setPoaNraFormValues] =
    useState<IPOANRA_FORM>(formData);
  const [containerFormValues, setContainerFormValues] =
    useState<IContainerForm>(containerFormObj);
  const [bookingFormValues, setBookingFormValues] =
    useState<IBookingReceipt_FORM>(formData);
  const [dockReceiptFormValues, setDockReceiptFormValues] =
    useState<IDockReceipt_FORM>(dockReceiptFormData);
  const [invoiceFormValues, setInvoiceFormValues] =
    useState<IInvoice_Response>(invoice_form_values);
  const [rows, setRows] = useState<IClientResponse[]>([]);
  const dispatch = useDispatch();
  const modalState = useSelector((state: any) => state.modalReducer);
  const [indexToDelete, setIndexToDelete] = useState<number>(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [offset, setOffset] = useState<number>(0);
  const [displayConsigneeForm, setDisplayConsigneeForm] =
    useState<boolean>(false);
  const [displayPoaNraForm, setDisplayPoaNraForm] = useState<boolean>(false);
  const [displayContainerForm, setDisplayContainerForm] =
    useState<boolean>(false);
  const [displayBookingConfirmation, setDisplayBookingConfirmation] =
    useState<boolean>(false);
  const [displayDockReceiptForm, setDisplayDockReceiptForm] =
    useState<boolean>(false);
  const [displayInvoiceForm, setDisplayInvoiceForm] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<number>(0);
  const [consigneeId, setConsigneeId] = useState<number>(0);
  const [containerId, setContainerId] = useState<number>(0);
  const [customerName, setCustomerName] = useState<string>("");
  const [formValues_consignee, setFormValues_consignee] =
    useState<IConsigneeForm>(consigneeFormObj);
  const [rowCount, setRowCount] = useState<number>(0);
  const [pageIsLoading, setPageIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const { data, count }: any = await fetchCustomers(offset, rowsPerPage);
      setIsLoading(false);
      setRowCount(count);
      setRows(data);
    };
    fetch();
  }, [rowsPerPage, offset, pageIsLoading]);

  const modalAction = (
    heading: string,
    display: boolean,
    isDelete: boolean,
    isDeleting: boolean = false
  ) => {
    const data = {
      display_modal: display,
      heading: heading,
      isDelete,
      isDeleting,
    };
    dispatch(handleModal(data));
  };

  const openModalForm = () => {
    setFormAction("new");
    modalAction("New Customer", true, false);
    setFormValues(clientFormObj);
  };

  const handleDelete = (indexId: number) => {
    setIndexToDelete(indexId);
    modalAction("Delete Data", true, true);
  };

  const confirmDelete = async () => {
    //send to api then handle UI
    const snackObj: ISnackBar = {
      display_snackBar: false,
      message: "",
      isError: false,
    };

    try {
      modalAction("Delete Data", true, true, true);
      const array = [...rows];
      await handleDeleteCustomerApi(array[indexToDelete].id);
      array.splice(indexToDelete, 1);
      setRows(array);
      modalAction("", false, false);
      snackObj.display_snackBar = true;
      snackObj.message = "Customer deleted";
      dispatch(handleSnackBar(snackObj));
    } catch (e) {
      snackObj.display_snackBar = true;
      snackObj.message = "Error deleting customer";
      snackObj.isError = true;
      dispatch(handleSnackBar(snackObj));
      modalAction("", false, false);
    }
  };

  const renderForm = () =>
    !displayConsigneeForm ? (
      <ClientForm
        formValues={formValues}
        formAction={formAction}
        setFormValues={setFormValues}
        setRows={setRows}
        rows={rows}
        modalAction={modalAction}
        setCustomerId={setCustomerId}
        setCustomerName={setCustomerName}
        setDisplayConsigneeForm={setDisplayConsigneeForm}
        setPageIsLoading={setPageIsLoading}
      />
    ) : !displayPoaNraForm ? (
      <ConsigneeForm
        formValues={formValues_consignee}
        setFormValues={setFormValues_consignee}
        modalAction={modalAction}
        customerName={customerName}
        customerId={customerId}
        setConsigneeId={setConsigneeId}
        setDisplayConsigneeForm={setDisplayConsigneeForm}
        setDisplayPoaNraForm={setDisplayPoaNraForm}
        setPageIsLoading={setPageIsLoading}
      />
    ) : !displayContainerForm ? (
      <POANRAForm
        formValues={poanraFormValues}
        setFormValues={setPoaNraFormValues}
        modalAction={modalAction}
        customerName={customerName}
        customerId={customerId}
        consigneeId={consigneeId}
        consigneeName={formValues_consignee.full_name}
        setDisplayConsigneeForm={setDisplayConsigneeForm}
        setDisplayPoaNraForm={setDisplayPoaNraForm}
        setDisplayContainerForm={setDisplayContainerForm}
        setPageIsLoading={setPageIsLoading}
      />
    ) : !displayBookingConfirmation ? (
      <ContainerForm
        formValues={containerFormValues}
        setFormValues={setContainerFormValues}
        modalAction={modalAction}
        customerName={customerName}
        customerId={customerId}
        containerId={containerId}
        setContainerId={setContainerId}
        setDisplayConsigneeForm={setDisplayConsigneeForm}
        setDisplayPoaNraForm={setDisplayPoaNraForm}
        setDisplayContainerForm={setDisplayContainerForm}
        setDisplayBookingConfirmation={setDisplayBookingConfirmation}
        setPageIsLoading={setPageIsLoading}
      />
    ) : !displayDockReceiptForm ? (
      <BookingConfirmationForm
        formValues={bookingFormValues}
        setFormValues={setBookingFormValues}
        modalAction={modalAction}
        customerName={customerName}
        customerId={customerId}
        consigneeId={consigneeId}
        consigneeName={formValues_consignee.full_name}
        setDisplayConsigneeForm={setDisplayConsigneeForm}
        setDisplayPoaNraForm={setDisplayPoaNraForm}
        setDisplayContainerForm={setDisplayContainerForm}
        setDisplayBookingConfirmation={setDisplayBookingConfirmation}
        setDisplayDockReceiptForm={setDisplayDockReceiptForm}
        setPageIsLoading={setPageIsLoading}
      />
    ) : !displayInvoiceForm ? (
      <DockReceiptForm
        formValues={dockReceiptFormValues}
        setFormValues={setDockReceiptFormValues}
        modalAction={modalAction}
        customerName={customerName}
        customerId={customerId}
        consigneeId={consigneeId}
        consigneeName={formValues_consignee.full_name}
        setDisplayConsigneeForm={setDisplayConsigneeForm}
        setDisplayPoaNraForm={setDisplayPoaNraForm}
        setDisplayContainerForm={setDisplayContainerForm}
        setDisplayBookingConfirmation={setDisplayBookingConfirmation}
        setDisplayDockReceiptForm={setDisplayDockReceiptForm}
        setDisplayInvoiceForm={setDisplayInvoiceForm}
        setPageIsLoading={setPageIsLoading}
      />
    ) : (
      <InvoiceForm
        formValues={invoiceFormValues}
        setFormValues={setInvoiceFormValues}
        setDisplayConsigneeForm={setDisplayConsigneeForm}
        setDisplayPoaNraForm={setDisplayPoaNraForm}
        setDisplayContainerForm={setDisplayContainerForm}
        setDisplayBookingConfirmation={setDisplayBookingConfirmation}
        setDisplayDockReceiptForm={setDisplayDockReceiptForm}
        setDisplayInvoiceForm={setDisplayInvoiceForm}
        modalAction={modalAction}
        customerName={customerName}
        customerId={customerId}
        consigneeId={consigneeId}
        consigneeName={formValues_consignee.full_name}
        setPageIsLoading={setPageIsLoading}
      />
    );
  return (
    <div style={{ padding: 20 }}>
      <h2>Clients ({rowCount})</h2>
      <div style={{ marginBottom: 20 }}>
        <SearchSection
          openModalForm={openModalForm}
          setRows={setRows}
          setRowCount={setRowCount}
        />
      </div>
      {modalState.display_modal && (
        <ModalComponent confirmDelete={confirmDelete}>
          {renderForm()}
        </ModalComponent>
      )}

      {isLoading ? (
        <div
          style={{
            marginTop: 200,
            padding: 30,
            justifyContent: "center",
            display: "flex",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <ClientComponent
          setRows={setRows}
          rows={rows}
          setFormValues={setFormValues}
          setFormAction={setFormAction}
          modalAction={modalAction}
          handleDelete={handleDelete}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setOffset={setOffset}
          rowCount={rowCount}
        />
      )}

      <SnackBar />
    </div>
  );
};

export default Client;
