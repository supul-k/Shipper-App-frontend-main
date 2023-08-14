import React, { Dispatch, SetStateAction, useState } from "react";
import { Checkbox } from "semantic-ui-react";
import { IContainerResponse } from "../../../Types/containerTypes";

type ICheckBox = {
  value: string;
  label: string;
  isChecked: boolean;
};

type IProps = {
  setFormValues: Dispatch<SetStateAction<IContainerResponse>>;
  editFormValues: IContainerResponse;
};

const ContentForm = ({ setFormValues, editFormValues }: IProps) => {
  const checkBoxArray: ICheckBox[] = [
    {
      value: "cars",
      label: "Container contains cars",
      isChecked: editFormValues.container_content === "cars" ? true : false,
    },
  ];
  const [checkBox, setCheckBox] = useState<ICheckBox[]>(checkBoxArray);

  return (
    <div>
      {checkBoxArray.map((result, index) => (
        <Checkbox
          label={result.label}
          key={index}
          style={{ marginRight: 20 }}
          name={result.value}
          checked={result.isChecked}
          onChange={(e, data) => {
            const checkCopyArray = [...checkBox];
            const checkIndex: number = checkCopyArray.findIndex((el, index) => (el.value === data.value ? true : false));
            checkCopyArray[checkIndex].isChecked = data.checked ? true : false;
            setFormValues((prev: any) => {
              return {
                ...prev,
                ["container_content"]: data.checked ? "cars" : "",
              };
            });
            setCheckBox(checkCopyArray);
          }}
          value={result.value}
        />
      ))}
    </div>
  );
};

export default ContentForm;
