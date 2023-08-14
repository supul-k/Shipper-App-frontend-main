import React, {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  SyntheticEvent,
} from "react";
import {
  Button,
  Icon,
  Modal,
  TextArea,
  Form,
  Loader,
  Tab,
  Input,
} from "semantic-ui-react";
import { IInvoice_Response } from "../../Types/invoiceTypes";

import { IClientResponse } from "../../Types/clientTypes";
import CustomerForm from "./InvoiceDetails/CustomerForm";
import Details from "./InvoiceDetails/Details";
import {
  fetchDockReceiptByCustomerId,
  createInvoice_API,
  handleUpdateInvoice_Receipt_API,
} from "../../actions/invoice";
import DockReceiptsDropDown from "./InvoiceDetails/DockReceiptsDropDown";

const line = (
  <div
    style={{
      height: 2,
      border: "1px solid #E0E0E0",
      marginBottom: 15,
      marginTop: 5,
    }}
  />
);

type ModalProps = {
  size?: string | undefined;
  open?: boolean | undefined;
};

type IProps = {
  formValues: IInvoice_Response;
  setFormValues: Dispatch<SetStateAction<IInvoice_Response>>;
  setPageIsLoading: Dispatch<SetStateAction<boolean>>;
  modalAction: (tittle: string, display: boolean, isDelete: boolean) => void;
  setDisplayConsigneeForm: Dispatch<SetStateAction<boolean>>;
  setDisplayPoaNraForm: Dispatch<SetStateAction<boolean>>;
  setDisplayContainerForm: Dispatch<SetStateAction<boolean>>;
  setDisplayBookingConfirmation: Dispatch<SetStateAction<boolean>>;
  setDisplayDockReceiptForm: Dispatch<SetStateAction<boolean>>;
  setDisplayInvoiceForm: Dispatch<SetStateAction<boolean>>;
  customerName: string;
  customerId: number;
  consigneeId: number;
  consigneeName: string;
};

type INewObj = {
  [key: string]: string | boolean | Date | number | undefined;
};

const InvoiceForm = ({
  setPageIsLoading,
  setFormValues,
  formValues,
  customerId,
  customerName,
  modalAction,
  setDisplayConsigneeForm,
  setDisplayPoaNraForm,
  setDisplayContainerForm,
  setDisplayBookingConfirmation,
  setDisplayDockReceiptForm,
  setDisplayInvoiceForm,
}: IProps) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dockReceiptData, setDockReceiptData] = useState<any[]>([]);
  const [viewIsVisible, setViewIsVisible] = useState<boolean>(false);
  const [viewIsVisibleButton, setViewIsVisibleButton] = useState<boolean>(true);

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      setPageIsLoading(true);

      let newRequest: any = {};
      formValues.customer_id = customerId;
      if (formValues.dock_receipt_id === null) {
        newRequest = {
          ...formValues,
        };
        delete newRequest.dock_receipt_id;
      } else {
        newRequest = {
          ...formValues,
        };
      }

      await createInvoice_API(newRequest);
      setPageIsLoading(false);
      setDisplayConsigneeForm(false);
      setDisplayPoaNraForm(false);
      setDisplayContainerForm(false);
      setDisplayBookingConfirmation(false);
      setDisplayDockReceiptForm(false);
      setDisplayInvoiceForm(false);
      setPageIsLoading(true);
      modalAction("", false, false);
    } catch (e) {
      if (e instanceof Error) {
        setErrorMessage(e.message);
        setError(true);
        setIsSaving(false);
        setPageIsLoading(false);
      }
      setTimeout(() => {
        setError(false);
      }, 4000);
    }
  };

  useEffect(() => {}, []);

  const renderView = () => {
    const view = (
      <div>
        <DockReceiptsDropDown
          formValues={formValues}
          setFormValues={setFormValues}
          dockReceiptData={dockReceiptData}
        />
      </div>
    );

    return viewIsVisible && view;
  };

  return (
    <div style={{ width: 1000, padding: 20, height: 600 }}>
      <div>
        <p style={{ marginBottom: 5, fontSize: 20 }}>
          Adding Invoice for <strong>{customerName}</strong>
        </p>
      </div>
      {line}
      <Modal.Content scrolling>
        {error && (
          <div>
            <p style={{ color: "red" }}>{errorMessage}</p>
            <p style={{ color: "red" }}>
              Customer Name and Consignee is required
            </p>
          </div>
        )}
        <CustomerForm
          formValues={formValues}
          setFormValues={setFormValues}
          customerId={customerId}
          customerName={customerName}
          setDockReceiptData={setDockReceiptData}
          setViewIsVisible={setViewIsVisible}
        />
        {renderView()}
        <Details
          formAction={"new"}
          formValues={formValues}
          setFormValues={setFormValues}
          setViewIsVisibleButton={setViewIsVisibleButton}
        />
      </Modal.Content>
      {/* <Modal.Actions>
        <Button primary onClick={handleSubmit} loading={isSaving}>
          {"Submit"}
        </Button>
      </Modal.Actions> */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: "20px",
        }}
      >
        <Button
          color="blue"
          disabled={viewIsVisibleButton}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default InvoiceForm;
