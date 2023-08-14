import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useState,
  useEffect,
} from "react";
import { Button, Icon, Modal, TextArea, Form, Loader } from "semantic-ui-react";

import ModalStep from "./ModalStep";
import {
  IStep,
  IContainerForm,
  ICarFormValues,
  carFormValuesObj,
  containerFormObj,
  IContainerResponse,
  IRadioBoxArray,
} from "../../Types/containerTypes";
import CustomerForm from "./CutomerForm";
import { IClientResponse } from "../../Types/clientTypes";
import { fetchCustomers } from "../../actions/customer";
import ContentForm from "./ContentForm";
import {
  handleSaveContainerAPI,
  handleSaveCarAPI,
} from "../../actions/container";
import CircularProgressComponent from "../SpinnerComponent/CircularProgress";
import CarsComponent from "./CarsComponent";
import ContainerType from "./ContainerType";
import { IAutoComplete, IRadioArray } from "../../Types/poaNraTypes";

type ModalProps = {
  size?: string | undefined;
  open?: boolean | undefined;
};

type IProps = {
  size?: any;
  open: boolean;
  closeModal: () => void;
  formValues: IContainerForm;
  setFormValues: Dispatch<SetStateAction<IContainerForm>>;
  setPageIsLoading: Dispatch<SetStateAction<boolean>>;
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
    title: "Description",
    description: "Is this roro or container",
    value: "description",
    active: false,
    disabled: true,
    display: true,
  },
  {
    title: "content",
    description: "Container contains car",
    value: "content",
    active: false,
    disabled: true,
    display: true,
  },
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
    description: "Add cars",
    value: "cars",
    active: false,
    disabled: true,
    display: false,
  },
];

const stepObjRoro = [
  {
    title: "Customer",
    description: "Attach a customer",
    value: "customer",
    active: false,
    disabled: true,
    display: true,
  },
  {
    title: "Description",
    description: "Is this roro or container",
    value: "description",
    active: true,
    disabled: false,
    display: true,
  },
  // {
  //   title: "Personal Effect",
  //   description: "Personal or household items",
  //   value: "personal_effect",
  //   active: false,
  //   disabled: true,
  //   display: true,
  // },
  {
    title: "Cars",
    description: "Add cars",
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

const radioBoxArray: IRadioBoxArray[] = [
  {
    value: "roro",
    label: "roro",
    isChecked: false,
  },
  {
    value: "container",
    label: "container",
    isChecked: false,
  },
];

const ContainerModal = ({
  size,
  open,
  closeModal,
  formValues,
  setFormValues,
  setPageIsLoading,
}: IProps) => {
  const [step, setStep] = useState<IStep[]>(stepObj);
  const [stepForRoro, setStepForRoro] = useState<IStep[]>(stepObjRoro);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [section, setSection] = useState<string>("customer");
  const [customerData, setCustomerData] = useState<IClientResponse[]>([]);
  const [containerId, setContainerId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [carFormValues, setCarFormValues] =
    useState<ICarFormValues>(carFormValuesObj);
  const [carData, setCarData] = useState<ICarFormValues[]>([]);

  const [checkBox, setCheckBox] = useState<ICheckBox>(checkBoxArray);
  const [optionData, setOptionData] = useState<IAutoComplete[]>([]);
  const [displayCars, setDisplayCars] = useState<boolean>(false);
  const [radioArray, setRadioArray] = useState<IRadioBoxArray[]>(radioBoxArray);

  useEffect(() => {
    const fetch = async () => {
      const { count }: any = await fetchCustomers(0, 5);
      const { data }: any = await fetchCustomers(0, count);
      setCustomerData(data);
    };

    fetch();
  }, []);

  const resetStep = (array: IStep[]) => {
    for (let i = 0; i < step.length; i++) {
      array[i].active = false;
      array[i].disabled = true;
    }
    setStep(array);
  };

  const handleNext = async () => {
    try {
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
        closeModal();
      }

      if (array[tabIndex].value === "personal_effect") {
        if (arrayLength >= 4) {
          setIsLoading(true);
          const data: any = await handleSaveContainerAPI(formValues);
          setIsLoading(false);
          setContainerId(data.id);
        }
      } else {
        if (displayCars == true && section === "description") {
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
          onClick={handleNext}
        />
      );
    } else {
      return (
        <Button
          content="Submit"
          primary
          icon="right arrow"
          labelPosition="right"
          onClick={handleNext}
        />
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

  // const renderSection = () => {
  //   switch (section) {
  //     case "customer":
  //       return <CustomerForm formValues={formValues} setFormValues={setFormValues} customerData={customerData} />;
  //     case "content":
  //       return <ContentForm step={step} setStep={setStep} setFormValues={setFormValues} />;
  //     case "roro":
  //       return (
  //         <ContainerType
  //           setFormValues={setFormValues}
  //           formValues={formValues}
  //           checkBox={checkBox}
  //           setCheckBox={setCheckBox}
  //           optionData={optionData}
  //           setOptionData={setOptionData}
  //         />
  //       );
  //     case "personal_effect":
  //       return (
  //         <Form style={{ marginTop: 10 }}>
  //           <TextArea
  //             placeholder="Personal effect content here"
  //             style={{ minHeight: 100 }}
  //             onChange={(e, data) => {
  //               setFormValues((prev: any) => {
  //                 return {
  //                   ...prev,
  //                   ["personal_effect"]: data.value,
  //                 };
  //               });
  //             }}
  //             value={formValues.personal_effect.toUpperCase()}
  //           />
  //         </Form>
  //       );
  //     case "cars":
  //       return (
  //         <CarsComponent
  //           containerId={containerId}
  //           carFormValues={carFormValues}
  //           setCarFormValues={setCarFormValues}
  //           carData={carData}
  //           setCarData={setCarData}
  //           formValues={formValues}
  //         />
  //       );
  //     default:
  //       return "None to render";
  //   }
  // };
  const renderContainerSection = () => {
    switch (section) {
      case "customer":
        return (
          <CustomerForm
            formValues={formValues}
            setFormValues={setFormValues}
            customerData={customerData}
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
      case "description":
        return (
          <ContainerType
            setFormValues={setFormValues}
            formValues={formValues}
            radioArray={radioArray}
            setRadioArray={setRadioArray}
            optionData={optionData}
            setOptionData={setOptionData}
            stepForRoro={stepForRoro}
            setStepForRoro={setStepForRoro}
            step={step}
            stepObj={stepObj}
            setStep={setStep}
            setDisplayCars={setDisplayCars}
          />
        );
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

  const renderRoroSection = () => {
    switch (section) {
      case "customer":
        return (
          <CustomerForm
            formValues={formValues}
            setFormValues={setFormValues}
            customerData={customerData}
          />
        );
      case "content":
        return;
      case "description":
        return (
          <ContainerType
            setFormValues={setFormValues}
            formValues={formValues}
            radioArray={radioArray}
            setRadioArray={setRadioArray}
            optionData={optionData}
            setOptionData={setOptionData}
            step={step}
            stepObj={stepObj}
            stepForRoro={stepForRoro}
            setStepForRoro={setStepForRoro}
            setStep={setStep}
            setDisplayCars={setDisplayCars}
          />
        );
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
    <Modal size={size} open={open} onClose={closeModal}>
      <Modal.Header>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p>New Container</p>
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
        <ModalStep step={step} />
        {!displayCars ? renderContainerSection() : renderRoroSection()}
      </Modal.Content>
      <Modal.Actions>
        {isLoading ? (
          <CircularProgressComponent />
        ) : (
          <div>
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
        )}
      </Modal.Actions>
    </Modal>
  );
};

export default ContainerModal;
