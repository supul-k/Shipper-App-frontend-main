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
import { makeStyles } from "@material-ui/core/styles";
import {
  IPOANRA_FORM,
  IGenerateInput,
  IPOANRA_Response,
  IAutoComplete,
  generateInput,
  poa_nra_form_values,
} from "../../Types/poaNraTypes";
import CircularProgress from "../SpinnerComponent/CircularProgress";
import CustomerForm from "./POANRADetails/CustomerForm";
import Details from "./POANRADetails/Details";
import {
  createPONRA_API,
  findConsigneeByCustomerId,
  handleUpdatePOA_NRA_API,
} from "../../actions/poa_nra";

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
// type ModalProps = {
//   size?: string | undefined;
//   open?: boolean | undefined;
// };

type IProps = {
  formValues: IPOANRA_FORM;
  setFormValues: Dispatch<SetStateAction<IPOANRA_FORM>>;
  modalAction: (tittle: string, display: boolean, isDelete: boolean) => void;
  customerName: string;
  customerId: number;
  consigneeId: number;
  consigneeName: string;
  setDisplayPoaNraForm: Dispatch<SetStateAction<boolean>>;
  setDisplayConsigneeForm: Dispatch<SetStateAction<boolean>>;
  setDisplayContainerForm: Dispatch<SetStateAction<boolean>>;
  setPageIsLoading: Dispatch<SetStateAction<boolean>>;
};

type INewObj = {
  [key: string]: string | boolean | Date | number | undefined;
};

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: "30%",
    marginRight: 10,
  },
  formControlCountry: {
    width: "50%",
    marginRight: 10,
  },
}));

const POANRAForm = ({
  formValues,
  setFormValues,
  modalAction,
  customerName,
  customerId,
  consigneeId,
  consigneeName,
  setDisplayPoaNraForm,
  setDisplayConsigneeForm,
  setDisplayContainerForm,
  setPageIsLoading,
}: IProps) => {
  const classes = useStyles();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [optionData, setOptionData] = useState<IAutoComplete[]>([]);
  const [inputFunction, setInputFunction] = useState<IGenerateInput[]>([]);
  const [formAction, setFormAction] = useState<string>("");
  const [error, setError] = useState<string>("");
  //const dispatch = useDispatch();
  // const snackBar = useSelector((state: any) => state.snackBarReducer);

  useEffect(() => {
    setInputFunction(generateInput(poa_nra_form_values));
  }, []);

  const handleSave = async (action: string) => {
    try {
      const newValues = { ...formValues };
      const newObj: INewObj = {};
      for (let i = 0; i < inputFunction.length; i++) {
        const name = inputFunction[i].name as string;
        newObj[name] = inputFunction[i].value;
      }
      newObj["consignee_id"] = consigneeId;
      newObj["customer_id"] = customerId;
      newObj["date_added"] = new Date();

      const data = newObj as IPOANRA_Response;
      data.insurance = newObj.insurance === "Yes" ? true : false;

      setIsSaving(true);
      await createPONRA_API(data);

      if (action === "saveANDclose") {
        modalAction("", false, false);
        setDisplayConsigneeForm(false);
        setDisplayPoaNraForm(false);
        setPageIsLoading(true);
      } else {
        setDisplayContainerForm(true);
      }
    } catch (e) {
      if (e instanceof Error) {
        setIsSaving(false);
        setError(e.message);
      }
    }
  };

  const renderButtons = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        paddingBottom: "20px",
      }}
    >
      <Button
        color="grey"
        style={{ marginRight: 10 }}
        onClick={() => handleSave("saveANDfill")}
      >
        Save and fill container form
      </Button>
      <Button positive onClick={() => handleSave("saveANDclose")}>
        Save and close
      </Button>
    </div>
  );

  const panes = [
    {
      menuItem: "Customer",
      render: () => (
        <Tab.Pane attached={false}>
          <div style={{ height: 660 }}>
            <CustomerForm
              customerName={customerName}
              consigneeName={consigneeName}
            />
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
              formAction={"new"}
            />
          </div>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <div style={{ width: 1000, padding: 20, height: 600 }}>
      <div>
        <p style={{ marginBottom: 5, fontSize: 20 }}>
          Adding POA/NRA Contract for <strong>{customerName}</strong>
        </p>
      </div>

      {line}
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      {line}
      {isSaving ? (
        <div style={{ marginTop: 100, float: "right", padding: 30 }}>
          <CircularProgress />
        </div>
      ) : (
        renderButtons()
      )}
    </div>
  );
};

export default POANRAForm;
