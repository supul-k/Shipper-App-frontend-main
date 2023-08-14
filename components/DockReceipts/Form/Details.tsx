import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import DropDown from "./DropDown";
import { IAutoComplete, IRadioArray, IGenerateInput } from "../../../Types/poaNraTypes";
import { Radio, Input, TextArea, Form } from "semantic-ui-react";
import { fetchAutoCompleteAPI } from "../../../actions/poa_nra";

type IProps = {
  inputFunction: IGenerateInput[];
  setInputFunction: Dispatch<SetStateAction<IGenerateInput[]>>;
  setOptionData: Dispatch<SetStateAction<IAutoComplete[]>>;
  optionData: IAutoComplete[];
  formAction: string;
  tab: string;
};

const Details = ({ inputFunction, setInputFunction, setOptionData, optionData, formAction, tab }: IProps) => {
  useEffect(() => {
    fetchAutoCompleteAPI().then((data) => {
      setOptionData(data);
    });
  }, []);

  const handleInput = (index: number, value: string) => {
    const copy = [...inputFunction];
    copy[index].value = value.toUpperCase();
    setInputFunction(copy);
  };

  const renderRadioButton = (radioArray: IRadioArray[] | undefined, mainIndex: number) => {
    if (radioArray) {
      return radioArray.map((data, index) => (
        <Radio
          label={data.label}
          name={`radioGroup${data.label}`}
          value={data.label}
          checked={data.isChecked}
          onChange={(e, { value }) => {
            const copyRadioArray = [...radioArray];
            const copyInputFunction = [...inputFunction];
            for (let i = 0; i < radioArray.length; i++) {
              copyRadioArray[i].isChecked = false;
            }
            copyRadioArray[index].isChecked = true;
            copyInputFunction[mainIndex].radioArray = copyRadioArray;
            const val = value as string;
            copyInputFunction[mainIndex].value = val;
            setInputFunction(copyInputFunction);
          }}
          style={{ marginBottom: 10, marginLeft: 10, marginTop: 10 }}
          key={index}
        />
      ));
    }
  };

  const renderInputs = () => {
    return inputFunction.map((result, index) => {
      if (result.tab === tab) {
        if (result.type === "dropDown") {
          const filter = optionData.filter((value) => value.type === result.name);
          return (
            <div style={{ padding: 10 }} key={index}>
              <label>
                <strong>{result.label}</strong>
              </label>
              <DropDown
                result={result}
                setInputFunction={setInputFunction}
                optionData={filter}
                setOptionData={setOptionData}
                handleInput={handleInput}
                mainIndex={index}
                formAction={formAction}
              />
            </div>
          );
        } else if (result.type === "radio") {
          return (
            <div style={{ padding: 10 }} key={index}>
              <label>
                <strong>{result.label}</strong>
              </label>
              <br />
              {renderRadioButton(result.radioArray, index)}
            </div>
          );
        } else if (result.type === "textarea") {
          return (
            <div style={{ padding: 10 }} key={index}>
              <label>
                <strong>{result.label}</strong>
              </label>
              <br />
              <Form>
                <TextArea
                  name={result.name}
                  value={result.value as string}
                  onChange={(e, { value }) => handleInput(index, value as string)}
                  style={{ width: 400, height: 100 }}
                />
              </Form>
            </div>
          );
        } else {
          return (
            <div style={{ padding: 10 }} key={index}>
              <label>
                <strong>{result.label}</strong>
              </label>
              <br />
              <Input
                type={result.type}
                name={result.name}
                value={result.value}
                onChange={(e, { value }) => handleInput(index, value)}
                style={{ width: 400 }}
              />
            </div>
          );
        }
      }
    });
  };

  return <div style={{ display: "flex", flexWrap: "wrap" }}>{renderInputs()}</div>;
};

export default Details;
