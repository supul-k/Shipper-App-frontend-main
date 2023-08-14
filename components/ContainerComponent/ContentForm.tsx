import React, { Dispatch, SetStateAction, useState } from "react";
import { Checkbox } from "semantic-ui-react";
import { IStep, IContainerForm } from "../../Types/containerTypes";

type ICheckBox = {
  value: string;
  label: string;
  isChecked: boolean;
};

const checkBoxArray: ICheckBox[] = [
  {
    value: "cars",
    label: "Container contains cars",
    isChecked: false,
  },
];

type IProps = {
  step: IStep[];
  setStep: Dispatch<SetStateAction<IStep[]>>;
  setFormValues: Dispatch<SetStateAction<IContainerForm>>;
};

const ContentForm = ({ step, setStep, setFormValues }: IProps) => {
  const [checkBox, setCheckBox] = useState<ICheckBox[]>(checkBoxArray);
  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      {checkBoxArray.map((result, index) => (
        <Checkbox
          label={result.label}
          key={index}
          style={{ marginRight: 20 }}
          name={result.value}
          checked={result.isChecked}
          onChange={(e, data) => {
            const array = [...step];
            const checkCopyArray = [...checkBox];
            const checkIndex: number = checkCopyArray.findIndex((el, index) => (el.value === data.value ? true : false));
            const indexInner: number = array.findIndex((el, index) => (el.value === data.value ? true : false));
            array[indexInner].display = data.checked ? true : false;
            checkCopyArray[checkIndex].isChecked = data.checked ? true : false;
            setFormValues((prev: any) => {
              return {
                ...prev,
                ["container_content"]: data.checked ? "cars" : "",
              };
            });
            setStep(array);
            setCheckBox(checkCopyArray);
          }}
          value={result.value}
        />
      ))}
    </div>
  );
};

export default ContentForm;
