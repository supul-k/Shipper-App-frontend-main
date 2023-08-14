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
import {
  IDockReceipt_FORM,
  IDockReceipt_Response,
  generateInput,
  dock_receipt_form_values,
  IBookingDropDownData,
  IEffectSection,
} from "../../Types/dockReceiptTypes";

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
  createDockReceipt_API,
  handleUpdateDock_Receipt_API,
  fetchContainerByCustomerId,
} from "../../actions/dockReceipts";
import {
  fetchDockReceiptByCustomerId,
  createInvoice_API,
  handleUpdateInvoice_Receipt_API,
} from "../../actions/invoice";
import BookingReceiptsDropDown from "./Form/BookingReceiptsDropDown";
import Container from "./Form/Container";
import {
  ICarFormValues,
  IContainerResponse,
  createEffectInputsPerContainer,
  ICarData,
} from "../../Types/containerTypes";
import CarsComponent from "./Form/CarsComponent";

type ModalProps = {
  size?: string | undefined;
  open?: boolean | undefined;
};

type IProps = {
  size?: any;
  open: boolean;
  closeModal: () => void;
  formValues: IDockReceipt_FORM;
  rows: IDockReceipt_Response[];
  setFormValues: Dispatch<SetStateAction<IDockReceipt_FORM>>;
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
  const [bookingData, setBookingData] = useState<IBookingDropDownData[]>([]);
  const [carsFormValues, setCarsFormValues] = useState<ICarFormValues[]>([]);
  const [viewIsLoading, setViewIsLoading] = useState(false);
  const [containerRows, setContainerRows] = useState<IContainerResponse[]>([]);
  const [effectSection, setEffectSection] = useState<IEffectSection>(
    {} as IEffectSection
  );
  const [data, setData] = useState<ICarData[]>([]);
  const [isSelected, SetIsSelected] = useState<boolean>(false);

  useEffect(() => {
    if (formAction === "new") {
      setInputFunction(generateInput(dock_receipt_form_values));
    } else {
      const copy: any = { ...rows[indexToEdit] };

      setFormValues({
        customer_id: copy?.customer_id ? copy.customer_id : 0,
        consignee_id: copy?.consignee_id ? copy.consignee_id : 0,
        container_id: copy?.container_id ? copy.container_id : 0,
        booking_id: copy?.booking_id ? copy.booking_id : 0,
        total_weight: copy?.total_weight ? copy.total_weight : 0,
        weight: copy?.weight ? copy.weight : 0,
        measurement: copy?.measurement ? copy.measurement : 0,
      });

      delete copy.consignee_id;
      delete copy.customer_id;

      const arr = generateInput(copy);
      setEffectSection({
        personal_effect: copy.personal_effect ? copy.personal_effect : "",
        weight: copy.weight,
        measurement: copy.weight,
      });

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

  const renderBookingView = () => {
    return (
      <BookingReceiptsDropDown
        formValues={formValues}
        setFormValues={setFormValues}
        bookingData={bookingData}
      />
    );
  };

  const renderConsigneeView = () => {
    const view = (
      <div>
        <ConsigneeForm
          formValues={formValues}
          setFormValues={setFormValues}
          consigneeData={consigneeData}
          setBookingData={setBookingData}
        />
        {renderBookingView()}
      </div>
    );

    if (formAction === "edit") {
      return view;
    }

    return consigneeIsVisible && view;
  };

  const renderPersonalEffect = () => {
    if (formAction !== "edit") {
      if (isSelected) {
        return createEffectInputsPerContainer(effectSection).map(
          (result, index) => (
            <div
              style={{ marginRight: 10, marginBottom: 50, width: 300 }}
              key={index}
            >
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {result.type === "text" ? (
                  <div>
                    <span style={{ marginLeft: 100 }}>{result.label}</span>
                    <br />
                    <Input
                      focus
                      onChange={(e, { name, value }) => {
                        setEffectSection((prev: any) => {
                          return {
                            ...prev,
                            [name]: value,
                          };
                        });
                      }}
                      value={result.value}
                      name={result.name}
                      style={{ width: 200, marginLeft: 100 }}
                    />
                  </div>
                ) : (
                  <Form style={{ marginTop: 10 }}>
                    <span>{result.label}</span>
                    <br />
                    <TextArea
                      placeholder="Personal effect content here"
                      style={{ minHeight: 300, width: 400 }}
                      disabled
                      value={result.value}
                    />
                  </Form>
                )}
              </div>
            </div>
          )
        );
      }
    } else {
      if (effectSection.personal_effect !== "") {
        return createEffectInputsPerContainer(effectSection).map(
          (result, index) => (
            <div
              style={{ marginRight: 10, marginBottom: 50, width: 300 }}
              key={index}
            >
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {result.type === "text" ? (
                  <div>
                    <span style={{ marginLeft: 100 }}>{result.label}</span>
                    <br />
                    <Input
                      focus
                      onChange={(e, { name, value }) => {
                        setEffectSection((prev: any) => {
                          return {
                            ...prev,
                            [name]: value,
                          };
                        });
                      }}
                      value={result.value}
                      name={result.name}
                      style={{ width: 200, marginLeft: 100 }}
                    />
                  </div>
                ) : (
                  <Form style={{ marginTop: 10 }}>
                    <span>{result.label}</span>
                    <br />
                    <TextArea
                      placeholder="Personal effect content here"
                      style={{ minHeight: 300, width: 400 }}
                      disabled
                      value={result.value}
                    />
                  </Form>
                )}
              </div>
            </div>
          )
        );
      }
    }
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
              setBookingData={setBookingData}
            />
            {renderConsigneeView()}
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Container",
      render: () => (
        <Tab.Pane attached={false}>
          <div style={{ height: 1260 }}>
            <div>
              <Container
                formValues={formValues}
                setFormValues={setFormValues}
                setCarsFormValues={setCarsFormValues}
                setViewIsLoading={setViewIsLoading}
                rows={containerRows}
                setEffectSection={setEffectSection}
                setRows={setContainerRows}
                data={data}
                setData={setData}
                carFormValues={carsFormValues}
                formAction={formAction}
                SetIsSelected={SetIsSelected}
              />
              <CarsComponent
                carFormValues={carsFormValues}
                setCarsFormValues={setCarsFormValues}
                data={data}
                setData={setData}
              />
              <div style={{ display: "flex", marginTop: 20 }}>
                {effectSection.personal_effect !== "" && renderPersonalEffect()}
              </div>
              <div style={{ marginTop: 10 }}>
                <span>
                  <strong>Total Weight</strong>
                </span>
                <Input
                  focus
                  onChange={(e, { name, value }) => {
                    setFormValues((prev: any) => {
                      return {
                        ...prev,
                        [name]: value,
                      };
                    });
                  }}
                  name="total_weight"
                  value={formValues.total_weight}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Details",
      render: () => (
        <Tab.Pane attached={false}>
          <div style={{ height: 750 }}>
            <div style={{ border: "1px solid #000", padding: 10 }}>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <h3>Notify Party</h3>
              </div>
              <Details
                inputFunction={inputFunction}
                setInputFunction={setInputFunction}
                optionData={optionData}
                setOptionData={setOptionData}
                formAction={formAction}
                tab="notify_party"
              />
            </div>
            <div style={{ border: "1px solid #000", padding: 10 }}>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <h3>Marsk</h3>
              </div>
              <Details
                inputFunction={inputFunction}
                setInputFunction={setInputFunction}
                optionData={optionData}
                setOptionData={setOptionData}
                formAction={formAction}
                tab="marsk"
              />
            </div>
          </div>
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
      newObj["booking_id"] = formValues.booking_id;
      newObj["container_id"] = formValues.container_id;
      newObj["date_added"] = new Date();
      if (formAction === "edit") {
        newObj["id"] = rows[indexToEdit].id;
      }

      const data = newObj as IDockReceipt_Response;

      const newContainerData = {
        ...effectSection,
        date_added: new Date(),
        total_weight: formValues.total_weight,
        customer_id: formValues.customer_id,
      };
      const requestBody = {
        container: newContainerData,
        car: carsFormValues,
      };
      setIsSaving(true);
      setPageIsLoading(true);
      if (formAction === "edit") {
        const id = newObj.id as number;
        await handleUpdateDock_Receipt_API(data, id, requestBody);
      } else {
        const obj: any = await createDockReceipt_API(requestBody, data);
        await createInvoice_API({
          id: 0,
          customer_id: obj.customer_id,
          dock_receipt_id: obj.id,
          date_added: new Date(),
        });
      }
      setIsSaving(false);
      setPageIsLoading(false);
      closeModal();
    } catch (e) {
      if (formValues.customer_id === 0) {
        setErrorMessage("Customer name is required");
        setError(true);
        setIsSaving(false);
        setPageIsLoading(false);
      } else if (formValues.consignee_id === 0) {
        setErrorMessage("Consignee name is required");
        setError(true);
        setIsSaving(false);
        setPageIsLoading(false);
      } else if (formValues.container_id === 0) {
        setErrorMessage("Need to select a container");
        setError(true);
        setIsSaving(false);
        setPageIsLoading(false);
      } else if (e instanceof Error) {
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
            <p>{formAction === "edit" ? "Edit" : "New"} Dock Receipt</p>
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
