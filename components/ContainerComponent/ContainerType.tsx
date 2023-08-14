import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Radio } from "semantic-ui-react";
import {
  IContainerForm,
  IRadioBoxArray,
  IStep,
} from "../../Types/containerTypes";
import {
  fetchAutoCompleteAPI,
  createAutoComplete_API,
} from "../../actions/poa_nra";
import { IAutoComplete } from "../../Types/poaNraTypes";

type IProps = {
  setFormValues: Dispatch<SetStateAction<IContainerForm>>;
  radioArray: IRadioBoxArray[];
  setRadioArray: Dispatch<SetStateAction<IRadioBoxArray[]>>;
  optionData: IAutoComplete[];
  formValues: IContainerForm;
  setOptionData: Dispatch<SetStateAction<IAutoComplete[]>>;
  setDisplayCars: Dispatch<SetStateAction<boolean>>;
  stepForRoro: IStep[];
  setStepForRoro: Dispatch<SetStateAction<IStep[]>>;
  step: IStep[];
  setStep: Dispatch<SetStateAction<IStep[]>>;
  stepObj: IStep[];
};

const ContainerType = ({
  setFormValues,
  formValues,
  stepObj,
  radioArray,
  step,
  setStep,
  setDisplayCars,
  stepForRoro,
  setStepForRoro,
  setRadioArray,
  optionData,
  setOptionData,
}: IProps) => {
  useEffect(() => {
    fetchAutoCompleteAPI().then((data) => {
      setOptionData(data);
    });
  }, []);

  const options = (name: string) => {
    const filter = optionData.filter((value) => value.type === name);
    return filter.map((value, index: number) => ({
      key: index,
      text: value.text,
      value: value.text,
    }));
  };

  const handleAddOptions = async (name: string) => {
    //@ts-ignore
    const value = document.getElementById("input_" + name).value;
    if (value !== "") {
      const data = { type: name, text: value };
      setOptionData((prev) => [...prev, data]);
      //@ts-ignore
      document.getElementById("input_" + name).value = "";
      //send to db
      createAutoComplete_API(data);
      //then close
      handleClose(name);
    }
  };

  const handleClose = (name: string) => {
    //@ts-ignore
    document.getElementById("dropDown" + name).style.display = "block";
    //@ts-ignore
    document.getElementById("inputDiv" + name).style.display = "none";
  };

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      {radioArray.map((data: IRadioBoxArray, index: number) => (
        <Radio
          label={data.label}
          style={{ marginRight: 20 }}
          name={data.value}
          checked={data.isChecked}
          onChange={(e, data) => {
            const copyRadioArray = [...radioArray];
            for (let i = 0; i < radioArray.length; i++) {
              copyRadioArray[i].isChecked = false;
            }
            copyRadioArray[index].isChecked = data.checked ? true : false;
            // checkCopyArray.isChecked = data.checked ? true : false;
            setFormValues((prev: any) => {
              return {
                ...prev,
                ["container_type"]: data.value,
              };
            });
            setRadioArray(copyRadioArray);
            if (data.value === "roro") {
              setDisplayCars(true);
              let array = [...stepForRoro];
              array[2].display = true;
              setStep(array);
            } else {
              let array = [...stepObj];
              setDisplayCars(false);
              setStep(array);
            }
          }}
          value={data.value}
        />
      ))}
      {/* <Radio
        label={checkBox.label}
        style={{ marginRight: 20 }}
        name={checkBox.value}
        checked={checkBox.isChecked}
        onChange={(e, data) => {
          const checkCopyArray = { ...checkBox };
          checkCopyArray.isChecked = data.checked ? true : false;
          setFormValues((prev: any) => {
            return {
              ...prev,
              ["container_type"]: data.checked ? "roro" : "container",
            };
          });
          setCheckBox(checkCopyArray);
        }}
        value={checkBox.value}
      /> */}

      {/* {checkBox.isChecked && (
        <div style={{ height: 400, marginTop: 20 }}>
          <div style={{ display: "flex" }}>
            {renderInput1()}
            {renderInput2()}
            {renderInput3()}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ContainerType;
