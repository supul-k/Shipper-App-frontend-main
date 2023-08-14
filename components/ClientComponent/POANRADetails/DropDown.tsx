import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dropdown, Button, Icon, Input } from "semantic-ui-react";
import { IGenerateInput, IAutoComplete } from "../../../Types/poaNraTypes";
import {
  createAutoComplete_API,
  deleteAutoComplete_API,
  fetchAutoCompleteAPI,
} from "../../../actions/poa_nra";

type IProps = {
  result: IGenerateInput;
  setInputFunction: Dispatch<SetStateAction<IGenerateInput[]>>;
  setOptionData: Dispatch<SetStateAction<IAutoComplete[]>>;
  optionData: IAutoComplete[];
  handleInput: (index: number, value: string) => void;
  mainIndex: number;
  formAction: string;
};
function useForceUpdate(){
  const [value, setValue] = useState(0); 
  return () => setValue(value => value + 1); 
}
const DropDown = ({
  result,
  setInputFunction,
  optionData,
  setOptionData,
  handleInput,
  mainIndex,
  formAction,
}: IProps) => {
  const options = optionData.map((value, index: number) => ({
    key: index,
    text: value.text,
    value: value.text,
  }));

  const newValue: string = result.value as string;

  const [dropdown, setDropDown] = useState([]);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    fetchAutoCompleteAPI().then((data) => {
      //@ts-ignore
      setDropDown(data);
    });
  }, []);

  const handleAddOptions = async () => {
    forceUpdate();
    //@ts-ignore
    const val = document.getElementById("input_" + result.name).value;
    const value = val.toUpperCase();
    if (value !== "") {
      const data = { type: result.name, text: value };
      // setOptionData((prev) => [...prev, data]);

      //@ts-ignore
      document.getElementById("input_" + result.name).value = "";
      //send to db
      await createAutoComplete_API(data);
      await fetchAutoCompleteAPI().then((data) => {
        setOptionData(data);
        //@ts-ignore
        setDropDown(data);
      
        
      });
      forceUpdate();
      //then close
      handleClose();
    }
  };

  const handleClose = () => {
    forceUpdate();
    //@ts-ignore
    document.getElementById("dropDown" + result.name).style.display = "block";
    //@ts-ignore
    document.getElementById("inputDiv" + result.name).style.display = "none";
  };

  const handleCloseDiv = () => {
    forceUpdate();
    //@ts-ignore
    document.getElementById("dropDown" + result.name).style.display = "block";
    //@ts-ignore
    document.getElementById("removeDiv" + result.name).style.display = "none";
  };

  const handleRemove = async () => {
    for (let i = 0; i < indexes.length; i++) {
      await deleteAutoComplete_API(Number(indexes[i]));
    }
    handleCloseDiv();
    await fetchAutoCompleteAPI().then((data) => {
      setOptionData(data);
      //@ts-ignore
      setDropDown(data);
    });
  };

  let indexes: String[] = [];

  const getChangeValue = (index: number, value: string) => {
    for (let index = 0; index < dropdown.length; index++) {
      if (
        //@ts-ignore
        dropdown[index].type === result.name &&
        //@ts-ignore
        dropdown[index].text === value
      ) {
        //@ts-ignore
        indexes.push(dropdown[index].id as String);
      }
    }
  };

  return (
    <div>
      <div id={"dropDown" + result.name}>
        <Dropdown
          placeholder={result.label}
          search
          selection
          value={newValue}
          options={options}
          style={{ width: 250 }}
          name={result.name}
          clearable
          onChange={(e, { value, name }) => {
            const val = value as string;
            handleInput(mainIndex, val);
          }}
          forceSelection={false}
          selectOnBlur={false}
        />

        <Button
          icon
          style={{ marginLeft: 5 }}
          onClick={() => {
            //@ts-ignore
            document.getElementById("dropDown" + result.name).style.display =
              "none";
            //@ts-ignore
            document.getElementById("inputDiv" + result.name).style.display =
              "block";
          }}
        >
          <Icon name="add" />
        </Button>
        <Button
          icon
          onClick={() => {
            //@ts-ignore
            document.getElementById("dropDown" + result.name).style.display =
              "none";
            //@ts-ignore
            document.getElementById("removeDiv" + result.name).style.display =
              "block";
          }}
        >
          <Icon name="minus" />
        </Button>
      </div>
      <div id={"removeDiv" + result.name} style={{ display: "none" }}>
        <Dropdown
          options={options}
          search
          selection
          clearable
          placeholder="Select to remove"
          style={{ width: 200 }}
          id={`removeInput_${result.name}`}
          onChange={(e, { value, name }) => {
            const val = value as string;
            getChangeValue(mainIndex, val);
          }}
        />

        <Button
          secondary
          icon
          style={{ marginLeft: 5 }}
          onClick={handleRemove}
          color="red"
        >
          <Icon name="trash" />
        </Button>

        <Button
          icon
          style={{ marginLeft: 5 }}
          onClick={handleCloseDiv}
          color="yellow"
        >
          <Icon name="close" />
        </Button>
      </div>
      <div id={"inputDiv" + result.name} style={{ display: "none" }}>
        <Input placeholder="Enter text" id={`input_${result.name}`} />
        <Button secondary style={{ marginLeft: 5 }} onClick={handleAddOptions}>
          Save
        </Button>
        <Button
          icon
          style={{ marginLeft: 5 }}
          onClick={handleClose}
          color="red"
        >
          <Icon name="close" />
        </Button>
      </div>
    </div>
  );
};

export default DropDown;
