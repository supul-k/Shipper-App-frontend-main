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
import CircularProgress from "../SpinnerComponent/CircularProgress";
import { IClientResponse } from "../../Types/clientTypes";
import CustomerForm from "./DockReceiptDetails/CustomerForm";
import ConsigneeForm from "./DockReceiptDetails/ConsigneeForm";
import Details from "./DockReceiptDetails/Details";
import { findConsigneeByCustomerId } from "../../actions/poa_nra";
import {
  createDockReceipt_API,
  handleUpdateDock_Receipt_API,
  fetchContainerByCustomerId,
} from "../../actions/dockReceipts";
import { createInvoice_API } from "../../actions/invoice";
import BookingReceiptsDropDown from "./DockReceiptDetails/BookingReceiptsDropDown";
import Container from "./DockReceiptDetails/Container";
import {
  ICarFormValues,
  IContainerResponse,
  createEffectInputsPerContainer,
  ICarData,
} from "../../Types/containerTypes";
import CarsComponent from "./DockReceiptDetails/CarsComponent";

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

type IProps = {
  size?: any;
  open: boolean;
  closeModal: () => void;
  formValues: IDockReceipt_FORM;
  setFormValues: Dispatch<SetStateAction<IDockReceipt_FORM>>;
  setPageIsLoading: Dispatch<SetStateAction<boolean>>;
  customerName: string;
  customerId: number;
  consigneeId: number;
  consigneeName: string;
  setDisplayInvoiceForm: Dispatch<SetStateAction<boolean>>;
  setDisplayContainerForm: Dispatch<SetStateAction<boolean>>;
  setDisplayBookingConfirmation: Dispatch<SetStateAction<boolean>>;
  setDisplayDockReceiptForm: Dispatch<SetStateAction<boolean>>;
};

type INewObj = {
  [key: string]: string | boolean | Date | number | undefined;
};

const DockReceiptForm = ({
  size,
  open,
  closeModal,
  customerName,
  customerId,
  setDisplayContainerForm,
  setDisplayInvoiceForm,
  setDisplayBookingConfirmation,
  setDisplayDockReceiptForm,
  setPageIsLoading,
  setFormValues,
  formValues,
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
  const [optionData, setOptionData] = useState<IAutoComplete[]>([]);
  const [data, setData] = useState<ICarData[]>([]);
  const [isSelected, SetIsSelected] = useState<boolean>(false);

  useEffect(() => {
    setInputFunction(generateInput(dock_receipt_form_values));

    setFormValues({
      customer_id: customerId,
      consignee_id: formValues.consignee_id,
      container_id: formValues.container_id,
      booking_id: formValues.booking_id,
      total_weight: formValues.total_weight,
      weight: formValues.weight,
      measurement: formValues.measurement,
    });

    setEffectSection({
      personal_effect: "",
      weight: 0,
      measurement: 0,
    });
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
        />
        {renderBookingView()}
      </div>
    );

    return consigneeIsVisible && view;
  };

  const renderPersonalEffect = () => {
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
  };

  const renderButtons = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        paddingTop: "20px",
      }}
    >
      <Button
        color="grey"
        style={{ marginRight: 10 }}
        onClick={() => handleSubmit("saveANDfill")}
      >
        Save and fill invoice form
      </Button>
      <Button positive onClick={() => handleSubmit("saveANDclose")}>
        Save and close
      </Button>
    </div>
  );

  const panes = [
    {
      menuItem: "Customer",
      render: () => (
        <Tab.Pane attached={false}>
          <div style={{ height: 460 }}>
            <CustomerForm
              formValues={formValues}
              setFormValues={setFormValues}
              customerId={customerId}
              customerName={customerName}
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
                formAction={"new"}
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
                formAction={"new"}
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
                formAction={"new"}
                tab="marsk"
              />
            </div>
          </div>
        </Tab.Pane>
      ),
    },
  ];

  const handleSubmit = async (action: string) => {
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

      const data = newObj as IDockReceipt_Response;
      data.customer_id = customerId;
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

      // await createDockReceipt_API(requestBody, data);
      const obj: any = await createDockReceipt_API(requestBody, data);

      if (action === "saveANDclose") {
        setPageIsLoading(true);
        closeModal();
        setDisplayContainerForm(false);
        setDisplayBookingConfirmation(false);
        setDisplayDockReceiptForm(false);
        await createInvoice_API({
          id: 0,
          customer_id: obj.customer_id,
          dock_receipt_id: obj.id,
          date_added: new Date(),
        });
      } else {
        setDisplayInvoiceForm(true);
      }
      // setIsSaving(false);
      // setPageIsLoading(false);
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
    //     // <Modal size={size} open={open} onClose={closeModal}>
    //     //   <Modal.Header>
    //     //     <div style={{ display: "flex", justifyContent: "space-between" }}>
    //     //       <div>
    //     //         <p>{formAction === "edit" ? "Edit" : "New"} Dock Receipt</p>
    //     //       </div>
    //     //       <div>
    //     //         <Icon name="close" style={{ cursor: "pointer" }} onClick={closeModal} />
    //     //       </div>
    //     //     </div>
    //     //   </Modal.Header>
    //  {/* /     <Modal.Content scrolling> */}
    //         // {error && (
    //         //   <div>
    //         //     <p style={{ color: "red" }}>{errorMessage}</p>
    //         //     <p style={{ color: "red" }}>Customer Name and Consignee is required</p>
    //         //   </div>
    //         // )}
    //         <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    //     {/* //  </Modal.Content> */}
    //       {/* <Modal.Actions>
    //         <Button primary onClick={handleSubmit} loading={isSaving}>
    //           {formAction === "edit" ? "Update" : "Submit"}
    //         </Button>
    //       </Modal.Actions>
    //     </Modal> */}
    <Modal
      size={size}
      open={open}
      onClose={closeModal}
      style={{ padding: "10px" }}
    >
      <Modal.Header>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={{ marginBottom: 5, fontSize: 20 }}>
              <strong>New Dock Receipt Form</strong>
            </p>
          </div>
        </div>
        {line}
      </Modal.Header>
      <Modal.Content scrolling>
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </Modal.Content>
      {isSaving ? (
        <div style={{ marginTop: 30, float: "right", padding: 30 }}>
          <CircularProgress />
        </div>
      ) : (
        renderButtons()
      )}
    </Modal>
  );
};

export default DockReceiptForm;
