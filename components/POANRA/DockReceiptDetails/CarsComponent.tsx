import React, { useState, SetStateAction, Dispatch, SyntheticEvent, ChangeEvent, useEffect } from "react";
import { searchVIN, handleDeleteCarAPI } from "../../../actions/container";
import { Input, Button, Card, Message, Icon, Ref } from "semantic-ui-react";
import {
  ICarFormValues,
  createCarInputsPerContainer,
  carFormValuesObj,
  IContainerForm,
  IContainerResponse,
  ICarData,
} from "../../../Types/containerTypes";

type IProps = {
  carFormValues: ICarFormValues[];
  setCarsFormValues: Dispatch<SetStateAction<ICarFormValues[]>>;
  setData: Dispatch<SetStateAction<ICarData[]>>;
  data: ICarData[];
};

const CarsComponent = ({ carFormValues, setCarsFormValues, setData, data }: IProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>, indexOuter: number) => {
    const { name, value }: Record<string, any> = e.target;
    const array = [...carFormValues];
    // @ts-ignore
    array[indexOuter][name] = parseInt(value);
    setCarsFormValues(array);
  };

  const renderCarInput = () =>
    data.map((data, indexOuter) =>
      createCarInputsPerContainer(data, indexOuter).map((result, index) => (
        <div style={{ marginRight: 10, marginBottom: 50, width: 300 }} key={index}>
          <span>{result.label}</span>
          <br />
          <div style={{ display: "flex" }}>
            <Input
              focus
              onChange={(e) => handleChange(e, indexOuter)}
              name={result.name}
              value={result.value}
              style={{ width: "100%" }}
              disabled={result.name === "details" ? true : false}
            />
          </div>
        </div>
      ))
    );

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: "flex" }}>
        <div>
          <div style={{ display: "flex", marginTop: 20, flexWrap: "wrap" }}>{renderCarInput()}</div>
        </div>
      </div>
    </div>
  );
};

export default CarsComponent;
