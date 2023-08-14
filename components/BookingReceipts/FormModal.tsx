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
} from "semantic-ui-react";
import {
  IBookingReceipt_FORM,
  IBookingReceipt_Response,
  generateInput,
  booking_receipt_form_values,
} from "../../Types/bookingReceiptTypes";

import {
  IConsigneeSearch,
  IGenerateInput,
  IAutoComplete,
} from "../../Types/poaNraTypes";
import { IClientResponse } from "../../Types/clientTypes";
import CustomerForm from "./Form/CustomerForm";
import ConsigneeForm from "./Form/ConsigneeForm";
import Details from "./Form/Details";
import { findConsigneeByCustomerId } from "../../actions/poa_nra";
import {
  createBookingReceipt_API,
  handleUpdateBooking_Receipt_API,
} from "../../actions/bookingReceipts";

type ModalProps = {
  size?: string | undefined;
  open?: boolean | undefined;
};

type IProps = {
  size?: any;
  open: boolean;
  closeModal: () => void;
  formValues: IBookingReceipt_FORM;
  rows: IBookingReceipt_Response[];
  setFormValues: Dispatch<SetStateAction<IBookingReceipt_FORM>>;
  setPageIsLoading: Dispatch<SetStateAction<boolean>>;
  customerData: IClientResponse[];
  setCustomerData: Dispatch<SetStateAction<IClientResponse[]>>;
  setOptionData: Dispatch<SetStateAction<IAutoComplete[]>>;
  optionData: IAutoComplete[];
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
  setOptionData,
  optionData,
  formAction,
  indexToEdit,
  rows,
}: IProps) => {
  const [consigneeData, setConsigneeData] = useState<IConsigneeSearch[]>([]);
  const [consigneeIsVisible, setConsigneeIsVisible] = useState<boolean>(false);
  const [inputFunction, setInputFunction] = useState<IGenerateInput[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (formAction === "new") {
      setInputFunction(generateInput(booking_receipt_form_values));
    } else {
      const copy: any = { ...rows[indexToEdit] };

      setFormValues({
        customer_id: copy?.customer_id ? copy.customer_id : 0,
        consignee_id: copy?.consignee_id ? copy.consignee_id : 0,
      });

      delete copy.consignee_id;
      delete copy.customer_id;

      const arr = generateInput(copy);

      setInputFunction(arr);
    }
  }, []);

  useEffect(() => {
    if (formAction === "edit") {
      const customer_id = rows[indexToEdit].customer_id as number;
      findConsigneeByCustomerId(customer_id).then((data) =>
        setConsigneeData(data)
      );
    }
  }, []);

  const renderConsigneeView = () => {
    const view = (
      <ConsigneeForm
        formValues={formValues}
        setFormValues={setFormValues}
        consigneeData={consigneeData}
      />
    );
    if (formAction === "edit") {
      return view;
    }

    return consigneeIsVisible && view;
  };

  const panes = [
    {
      menuItem: "Customer",
      render: () => (
        <Tab.Pane attached={false}>
          <div style={{ height: 460 }}>
            <CustomerForm
              formValues={formValues}
              setFormValues={setFormValues}
              customerData={customerData}
              setConsigneeIsVisible={setConsigneeIsVisible}
              setConsigneeData={setConsigneeData}
            />
            {renderConsigneeView()}
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Details",
      render: () => (
        <Tab.Pane attached={false}>
          <div style={{ height: 460 }}>
            <Details
              inputFunction={inputFunction}
              setInputFunction={setInputFunction}
              optionData={optionData}
              setOptionData={setOptionData}
              formAction={formAction}
              tab="details"
            />
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Others",
      render: () => (
        <Tab.Pane attached={false}>
          <Details
            inputFunction={inputFunction}
            setInputFunction={setInputFunction}
            optionData={optionData}
            setOptionData={setOptionData}
            formAction={formAction}
            tab="others"
          />
        </Tab.Pane>
      ),
    },
  ];

  const handleSubmit = async () => {
    try {
      const newObj: INewObj = {};
      for (let i = 0; i < inputFunction.length; i++) {
        const name = inputFunction[i].name as string;
        newObj[name] = inputFunction[i].value;
      }
      newObj["consignee_id"] = formValues.consignee_id;
      newObj["customer_id"] = formValues.customer_id;
      newObj["date_added"] = new Date();
      if (formAction === "edit") {
        newObj["id"] = rows[indexToEdit].id;
      }

      const data = newObj as IBookingReceipt_Response;

      if (formAction === "edit") {
        const id = newObj.id as number;
        setPageIsLoading(true);
        await handleUpdateBooking_Receipt_API(data, id);
        setPageIsLoading(false);
        closeModal();
      } else if (data.customer_id === 0) {
        setErrorMessage("Customer Name required");
        setError(true);
        setIsSaving(false);
        setPageIsLoading(false);
      } else if (data.consignee_id === 0) {
        setErrorMessage("Consignee Name required");
        setError(true);
        setIsSaving(false);
        setPageIsLoading(false);
      } else if (data.booking_number === "") {
        setErrorMessage("Booking Number required");
        setError(true);
        setIsSaving(false);
        setPageIsLoading(false);
      } else if (data.booking_number != "") {
        await createBookingReceipt_API(data);
        setIsSaving(true);
        setPageIsLoading(true);
        closeModal();
      }
    } catch (e) {
      if (e instanceof Error) {
        // ✅ TypeScript knows err is Error
        setErrorMessage(e.message);
        setError(true);
        setIsSaving(false);
        setPageIsLoading(false);
      } else {
        console.log("Unexpected error", e);
      }

      setTimeout(() => {
        setError(false);
      }, 4000);
    }
  };

  return (
    <Modal size={size} open={open} onClose={closeModal}>
      <Modal.Header>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p>{formAction === "edit" ? "Edit" : "New"} Booking Confirmation</p>
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
            {/* <p style={{ color: "red" }}>
              Customer Name and Consignee is required
            </p> */}
          </div>
        )}
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={handleSubmit} loading={isSaving}>
          {formAction === "edit" ? "Update" : "Submit"}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default FormModal;
