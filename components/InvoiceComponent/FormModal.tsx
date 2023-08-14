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
import CustomerForm from "./Form/CustomerForm";
import Details from "./Form/Details";
import {
  fetchDockReceiptByCustomerId,
  createInvoice_API,
  handleUpdateInvoice_Receipt_API,
} from "../../actions/invoice";
import DockReceiptsDropDown from "./Form/DockReceiptsDropDown";

type ModalProps = {
  size?: string | undefined;
  open?: boolean | undefined;
};

type IProps = {
  size?: any;
  open: boolean;
  closeModal: () => void;
  formValues: IInvoice_Response;
  rows: IInvoice_Response[];
  setFormValues: Dispatch<SetStateAction<IInvoice_Response>>;
  setPageIsLoading: Dispatch<SetStateAction<boolean>>;
  customerData: IClientResponse[];
  setCustomerData: Dispatch<SetStateAction<IClientResponse[]>>;
  formAction: string;
  indexToEdit: number;
};

type INewObj = {
  [key: string]: string | boolean | Date | number | undefined;
};

const FormModal = ({
  size,
  open,
  closeModal,
  setPageIsLoading,
  setCustomerData,
  setFormValues,
  customerData,
  formValues,
  formAction,
  indexToEdit,
  rows,
}: IProps) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [viewIsLoading, setViewIsLoading] = useState(false);
  const [isSelected, SetIsSelected] = useState<boolean>(false);
  const [dockReceiptData, setDockReceiptData] = useState<any[]>([]);
  const [viewIsVisible, setViewIsVisible] = useState<boolean>(false);
  const [viewIsVisibleButton, setViewIsVisibleButton] = useState<boolean>(true);

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      setPageIsLoading(true);

      let newRequest: any = {};
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

      if (formAction === "edit") {
        await handleUpdateInvoice_Receipt_API(
          formValues,
          formValues.customer_id
        );
      } else {
        await createInvoice_API(newRequest);
      }
      setIsSaving(false);
      setPageIsLoading(false);
      closeModal();
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

  useEffect(() => {
    if (formAction === "edit") {
      const customer_id = rows[indexToEdit].customer_id as number;
      fetchDockReceiptByCustomerId(customer_id).then((data) =>
        setDockReceiptData(data)
      );
      setFormValues(rows[indexToEdit]);

      if (rows[indexToEdit].dock_receipt_id === null) {
        setViewIsVisible(false);
      } else {
        setViewIsVisible(true);
      }
    }
  }, []);

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
    <Modal size={size} open={open} onClose={closeModal}>
      <Modal.Header>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p>{formAction === "edit" ? "Edit" : "New"} Invoice</p>
          </div>
          <div>
            <Icon
              name="close"
              style={{ cursor: "pointer" }}
              onClick={closeModal}
            />
          </div>
        </div>
      </Modal.Header>
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
          customerData={customerData}
          setDockReceiptData={setDockReceiptData}
          setViewIsVisible={setViewIsVisible}
        />
        {renderView()}
        <Details
          formAction={formAction}
          formValues={formValues}
          setFormValues={setFormValues}
          setViewIsVisibleButton={setViewIsVisibleButton}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          onClick={handleSubmit}
          disabled={viewIsVisibleButton}
          loading={isSaving}
        >
          {formAction === "edit" ? "Update" : "Submit"}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default FormModal;
