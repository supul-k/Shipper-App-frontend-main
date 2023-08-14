import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useState,
  useEffect,
} from "react";
import { Button, Icon, Modal, TextArea, Form, Loader } from "semantic-ui-react";

import ModalStep from "./ContainerDetails/ModalStep";
import {
  IStep,
  IContainerForm,
  ICarFormValues,
  carFormValuesObj,
  containerFormObj,
  IContainerResponse,
} from "../../Types/containerTypes";
import CustomerForm from "./ContainerDetails/CutomerForm";
import { IClientResponse } from "../../Types/clientTypes";
import ContentForm from "./ContainerDetails/ContentForm";
import {
  handleSaveContainerAPI,
  handleSaveCarAPI,
} from "../../actions/container";
import CircularProgressComponent from "../SpinnerComponent/CircularProgress";
import CarsComponent from "./ContainerDetails/CarsComponent";
import ContainerType from "./ContainerDetails/ContainerType";
import { IAutoComplete } from "../../Types/poaNraTypes";

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
  formValues: IContainerForm;
  setFormValues: Dispatch<SetStateAction<IContainerForm>>;
  modalAction: (tittle: string, display: boolean, isDelete: boolean) => void;
  customerName: string;
  customerId: number;
  containerId: number;
  setContainerId: Dispatch<SetStateAction<number>>;
  setPageIsLoading: Dispatch<SetStateAction<boolean>>;
  setDisplayConsigneeForm: Dispatch<SetStateAction<boolean>>;
  setDisplayContainerForm: Dispatch<SetStateAction<boolean>>;
  setDisplayPoaNraForm: Dispatch<SetStateAction<boolean>>;
  setDisplayBookingConfirmation: Dispatch<SetStateAction<boolean>>;
};

const stepObj = [
  {
    title: "Customer",
    description: "Attach a customer",
    value: "customer",
    active: true,
    disabled: false,
    display: true,
  },
  {
    title: "Content",
    description: "Type of content this container has",
    value: "content",
    active: false,
    disabled: true,
    display: true,
  },
  // {
  //   title: "Roro",
  //   description: "Roro container",
  //   value: "roro",
  //   active: false,
  //   disabled: true,
  //   display: true,
  // },
  {
    title: "Personal Effect",
    description: "Personal or household items",
    value: "personal_effect",
    active: false,
    disabled: true,
    display: true,
  },
  {
    title: "Cars",
    description: "Add as many cars as you want",
    value: "cars",
    active: false,
    disabled: true,
    display: false,
  },
];

type ICheckBox = {
  value: string;
  label: string;
  isChecked: boolean;
};

const checkBoxArray: ICheckBox = {
  value: "roro",
  label: "Is this a Roro?",
  isChecked: false,
};
const ContainerForm = ({
  formValues,
  setFormValues,
  modalAction,
  customerName,
  customerId,
  containerId,
  setDisplayConsigneeForm,
  setDisplayPoaNraForm,
  setDisplayContainerForm,
  setDisplayBookingConfirmation,
  setContainerId,
  setPageIsLoading,
}: IProps) => {
  const [step, setStep] = useState<IStep[]>(stepObj);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [section, setSection] = useState<string>("customer");
  const [customerData, setCustomerData] = useState<IClientResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [carFormValues, setCarFormValues] =
    useState<ICarFormValues>(carFormValuesObj);
  const [carData, setCarData] = useState<ICarFormValues[]>([]);

  const [checkBox, setCheckBox] = useState<ICheckBox>(checkBoxArray);
  const [optionData, setOptionData] = useState<IAutoComplete[]>([]);

  const resetStep = (array: IStep[]) => {
    for (let i = 0; i < step.length; i++) {
      array[i].active = false;
      array[i].disabled = true;
    }
    setStep(array);
  };

  const handleNext = async (action: string) => {
    try {
      formValues.customer_id = customerId;
      const array = [...step];
      resetStep(array);
      const arrayLength = array.filter((result) => result.display).length;
      if (tabIndex < arrayLength - 1) {
        setTabIndex((prev) => {
          prev++;
          array[prev].active = true;
          array[prev].disabled = false;

          return prev;
        });
        setSection(array[tabIndex + 1].value);
        setStep(array);
      } else {
        setIsLoading(true);
        await handleSaveCarAPI(carData);
        setIsLoading(false);
        setPageIsLoading((prev) => {
          return !prev;
        });
        setCarData([]);
        setCarFormValues(carFormValuesObj);
        setFormValues(containerFormObj);
        array[0].active = true;
        array[0].disabled = false;
        setTabIndex(0);
        setSection(array[0].value);
        setStep(array);
        if (action === "saveAndClose") {
          setPageIsLoading(true);
          modalAction("", false, false);
          setDisplayConsigneeForm(false);
          setDisplayPoaNraForm(false);
          setDisplayContainerForm(false);
        } else if (action === "saveAndFill") {
          setDisplayBookingConfirmation(true);
        }
      }

      if (array[tabIndex].value === "personal_effect") {
        if (arrayLength >= 4) {
          setIsLoading(true);
          const data: any = await handleSaveContainerAPI(formValues);
          setIsLoading(false);
          setContainerId(data.id);
        }
      }
    } catch (err) {
      setIsLoading(false);
    }
  };

  const renderNextButton = () => {
    const array = [...step];
    const arrayLength = array.filter((result) => result.display).length;
    if (tabIndex < arrayLength - 1) {
      return (
        <Button
          content="Next"
          primary
          icon="right arrow"
          labelPosition="right"
          onClick={() => handleNext("saveAndNext")}
        />
      );
    } else {
      return (
        <div>
          <Button
            color="grey"
            style={{ marginRight: 10 }}
            onClick={() => handleNext("saveAndFill")}
          >
            Save and fill booking confirmation
          </Button>
          <Button positive onClick={() => handleNext("saveAndClose")}>
            Save and close
          </Button>
        </div>
      );
    }
  };

  const handlePrevious = () => {
    const array = [...step];
    resetStep(array);
    if (tabIndex - 1 !== -1) {
      setTabIndex((prev) => {
        prev--;
        array[prev].active = true;
        array[prev].disabled = false;

        return prev;
      });
      setSection(array[tabIndex - 1].value);
      setStep(array);
    }
  };

  const renderSection = () => {
    switch (section) {
      case "customer":
        return (
          <CustomerForm
            formValues={formValues}
            setFormValues={setFormValues}
            customerName={customerName}
          />
        );
      case "content":
        return (
          <ContentForm
            step={step}
            setStep={setStep}
            setFormValues={setFormValues}
          />
        );
      // case "roro":
      //   return (
      //     <ContainerType
      //       setFormValues={setFormValues}
      //       formValues={formValues}
      //       checkBox={checkBox}
      //       setCheckBox={setCheckBox}
      //       optionData={optionData}
      //       setOptionData={setOptionData}
      //     />
      //   );
      case "personal_effect":
        return (
          <Form style={{ marginTop: 10 }}>
            <TextArea
              placeholder="Personal effect content here"
              style={{ minHeight: 100 }}
              onChange={(e, data) => {
                setFormValues((prev: any) => {
                  return {
                    ...prev,
                    ["personal_effect"]: data.value,
                  };
                });
              }}
              value={formValues.personal_effect.toUpperCase()}
            />
          </Form>
        );
      case "cars":
        return (
          <CarsComponent
            containerId={containerId}
            carFormValues={carFormValues}
            setCarFormValues={setCarFormValues}
            carData={carData}
            setCarData={setCarData}
            formValues={formValues}
          />
        );
      default:
        return "None to render";
    }
  };

  return (
    <div style={{ width: 1000, padding: 20 }}>
      <div>
        <p style={{ marginBottom: 5, fontSize: 20 }}>
          Adding Containers for <strong>{customerName}</strong>
        </p>
      </div>

      {line}
      <div>
        <div>
          <a
            style={{ fontSize: 15 }}
            href={"http://cube.hoegh.com"}
            target="_blank"
          >
            cube.hoegh.com,{" "}
          </a>
          <a
            style={{ fontSize: 15 }}
            href={"http://www.carfax.com"}
            target="_blank"
          >
            CarFax,{" "}
          </a>
          <a
            style={{ fontSize: 15 }}
            href={"https://www.net.grimaldi.co.uk/GNET45/"}
            target="_blank"
          >
            grimaldi.co.uk,{" "}
          </a>
          <a
            style={{ fontSize: 15 }}
            href={"https://www.msc.com/en/g"}
            target="_blank"
          >
            msc,{" "}
          </a>
          <a
            style={{ fontSize: 15 }}
            href={"https://www.maersk.com/tracking/#tracking"}
            target="_blank"
          >
            Maersk
          </a>
        </div>
        <Modal.Content scrolling>
          <ModalStep step={step} />
          {renderSection()}
        </Modal.Content>
        <Modal.Actions>
          {isLoading ? (
            <CircularProgressComponent />
          ) : (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 30,
                }}
              >
                {tabIndex !== 0 && (
                  <Button
                    content="Previous"
                    secondary
                    icon="left arrow"
                    labelPosition="left"
                    onClick={handlePrevious}
                  />
                )}
                {renderNextButton()}
              </div>
            </div>
          )}
        </Modal.Actions>
      </div>
    </div>
  );
};

export default ContainerForm;
