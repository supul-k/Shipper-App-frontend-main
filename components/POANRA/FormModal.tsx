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
  IPOANRA_FORM,
  IConsigneeSearch,
  IGenerateInput,
  IPOANRA_Response,
  IAutoComplete,
  generateInput,
  poa_nra_form_values,
  EPOA_NRA_DATA,
} from "../../Types/poaNraTypes";
import { IClientResponse } from "../../Types/clientTypes";
import CustomerForm from "./Form/CustomerForm";
import ConsigneeForm from "./Form/ConsigneeForm";
import Details from "./Form/Details";
import {
  createPONRA_API,
  findConsigneeByCustomerId,
  handleUpdatePOA_NRA_API,
} from "../../actions/poa_nra";

type ModalProps = {
  size?: string | undefined;
  open?: boolean | undefined;
};

type IProps = {
  size?: any;
  open: boolean;
  closeModal: () => void;
  formValues: IPOANRA_FORM;
  rows: IPOANRA_Response[];
  setFormValues: Dispatch<SetStateAction<IPOANRA_FORM>>;
  setPageIsLoading: Dispatch<SetStateAction<boolean>>;
  customerData: IClientResponse[];
  setCustomerData: Dispatch<SetStateAction<IClientResponse[]>>;
  setCustomerName: Dispatch<SetStateAction<string>>;
  setConsigneeName: Dispatch<SetStateAction<string>>;
  setCustomerId: Dispatch<SetStateAction<number>>;
  setConsigneeId: Dispatch<SetStateAction<number>>;
  setOptionData: Dispatch<SetStateAction<IAutoComplete[]>>;
  optionData: IAutoComplete[];
  formAction: string;
  indexToEdit: number;
  setDisplayContainerForm: Dispatch<SetStateAction<boolean>>;
};

type INewObj = {
  [key: string]: string | boolean | Date | number | undefined;
};

const FormModal = ({
  size,
  open,
  closeModal,
  setPageIsLoading,
  setConsigneeName,
  setCustomerId,
  setConsigneeId,
  setCustomerName,
  setFormValues,
  setDisplayContainerForm,
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
      setInputFunction(generateInput(poa_nra_form_values));
    } else {
      const copy = { ...rows[indexToEdit] };

      setFormValues({
        customer_id: copy?.customer_id ? copy.customer_id : 0,
        consignee_id: copy?.consignee_id ? copy.consignee_id : 0,
      });

      delete copy.consignee_id;
      delete copy.customer_id;
      copy.insurance = rows[indexToEdit].insurance === "true" ? "Yes" : "No";

      const arr = generateInput(copy);

      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].radioArray.length; j++) {
          arr[i].radioArray[j].isChecked =
            arr[i].radioArray[j].label === arr[i].value ? true : false;
        }
      }

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
        setConsigneeName={setConsigneeName}
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
          <div style={{ height: 660 }}>
            <CustomerForm
              setCustomerName={setCustomerName}
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
          <div style={{ height: 660 }}>
            <Details
              inputFunction={inputFunction}
              setInputFunction={setInputFunction}
              optionData={optionData}
              setOptionData={setOptionData}
              formAction={formAction}
            />
          </div>
        </Tab.Pane>
      ),
    },
  ];

  const renderButtons = () => {
    if (formAction === "new") {
      return (
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 30 }}
        >
          <Button
            color="grey"
            style={{ marginRight: 10 }}
            onClick={() => handleSubmit("saveANDfill")}
          >
            Save and fill container form
          </Button>
          <Button positive onClick={() => handleSubmit("saveANDclose")}>
            Save and close
          </Button>
        </div>
      );
    } else {
      return (
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 30 }}
        >
          <Button primary onClick={() => handleSubmit("edit")}>
            Update
          </Button>
        </div>
      );
    }
  };

  const handleSubmit = async (action: string) => {
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
      const data = newObj as IPOANRA_Response;
      data.insurance = newObj.insurance === "Yes" ? true : false;

      setIsSaving(true);
      setPageIsLoading(true);
      if (formAction === "edit") {
        const id = newObj.id as number;
        setPageIsLoading(true);
        await handleUpdatePOA_NRA_API(data, id);
        setPageIsLoading(false);
        closeModal();
      } else {
        await createPONRA_API(data);
        if (action === "saveANDclose") {
          setIsSaving(false);
          setPageIsLoading(false);
          closeModal();
        } else if (action === "saveANDfill") {
          setCustomerId(data.customer_id ?? 0);
          setConsigneeId(data.consignee_id ?? 0);
          setDisplayContainerForm(true);
        }
      }
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

  return (
    <Modal size={size} open={open} onClose={closeModal}>
      <Modal.Header>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p>{formAction === "edit" ? "Edit" : "New"} POA/NRA Contract</p>
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
            <p style={{ color: "red" }}>
              Customer Name and Consignee is required
            </p>
          </div>
        )}
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </Modal.Content>
      <Modal.Actions>{renderButtons()}</Modal.Actions>
    </Modal>
  );
};

export default FormModal;
