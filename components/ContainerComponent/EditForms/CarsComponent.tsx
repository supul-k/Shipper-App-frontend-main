import React, {
  useState,
  SetStateAction,
  Dispatch,
  SyntheticEvent,
  ChangeEvent,
  useRef,
} from "react";
import { searchVIN, handleDeleteCarAPI } from "../../../actions/container";
import { Input, Button, Card, Message, Icon, Ref } from "semantic-ui-react";
import {
  ICarFormValues,
  createCarInputs,
  carFormValuesObj,
  IContainerForm,
  IContainerResponse,
} from "../../../Types/containerTypes";

type IProps = {
  carFormValues: ICarFormValues[];
  setCarsFormValues: Dispatch<SetStateAction<ICarFormValues[]>>;
  customerId: number;
  editFormValues: IContainerResponse;
};

const CarsComponent = ({
  carFormValues,
  setCarsFormValues,
  customerId,
  editFormValues,
}: IProps) => {
  const [vin, setVin] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    indexOuter: number
  ) => {
    const { name, value }: Record<string, any> = e.target;
    const array = [...carFormValues];
    // @ts-ignore
    array[indexOuter][name] = value;
    setCarsFormValues(array);
  };

  const removeCar = async (data: ICarFormValues, indexOuter: number) => {
    if (data.actionType !== "add") {
      setIsDeleting(true);
      await handleDeleteCarAPI(data.id);
      setIsDeleting(false);
    }
    const array = [...carFormValues];
    array.splice(indexOuter, 1);
    setCarsFormValues(array);
  };

  const renderCarInput = () =>
    carFormValues.map((data, indexOuter) =>
      createCarInputs(data).map((result, index) => (
        <div
          style={{ marginRight: 10, marginBottom: 50, width: 300 }}
          key={index}
        >
          <span>{result.label}</span>
          <br />
          <div style={{ display: "flex" }}>
            {result.label === "VIN:" ?(<Input
              focus
              onChange={(e) => handleChange(e, indexOuter)}
              name={result.name}
              value={result.value}
              style={{ width: "100%" }}
              maxLength="17"
            />):(<Input
              focus
              onChange={(e) => handleChange(e, indexOuter)}
              name={result.name}
              value={result.value}
              style={{ width: "100%" }}
            />)}

            {result.name === "value_for_aes" && (
              <div>
                <Button
                  loading={isDeleting}
                  color="red"
                  style={{ height: 40, marginLeft: 20 }}
                  onClick={() => removeCar(data, indexOuter)}
                  disabled={isDeleting ? true : false}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      ))
    );

  const handleAddMoreCars = () => {
    let error = false;
    if (editFormValues.container_type === "roro") {
      if (carFormValues.length >= 1) {
        //error
        setErrorMessage(
          "Operation not possible Roro containers have only one car"
        );
        setError(true);
        setTimeout(() => {
          setError(false);
          setErrorMessage("");
        }, 4000);
        return;
      }
    }
    for (let i = 0; i < carFormValues.length; i++) {
      if (carFormValues[i].vin === "" || carFormValues[i].details === "") {
        error = true;
      }
    }

    if (error) {
      setErrorMessage("Please add car vin and details before adding more cars");
      setError(true);
      setTimeout(() => {
        setError(false);
        setErrorMessage("");
      }, 3000);
      return;
    }
    setCarsFormValues((prev) => [
      ...prev,
      {
        date_added: new Date(),
        vin: "",
        details: "",
        value_for_aes: "",
        container_id: customerId,
        actionType: "add",
      },
    ]);
  };

  const handleVinSearch = () => {
    if (vin !== "") {
      if (editFormValues.container_type === "roro") {
        if (carFormValues.length >= 1) {
          //error
          setErrorMessage(
            "Operation not possible Roro containers have only one car"
          );
          setError(true);
          setTimeout(() => {
            setError(false);
            setErrorMessage("");
          }, 4000);
          return;
        }
      }

      if (carFormValues.filter((result) => result.vin === vin).length !== 0) {
        setErrorMessage("VIN already added try again with another VIN");
        setError(true);
        setTimeout(() => {
          setError(false);
          setErrorMessage("");
        }, 5000);
        return;
      }

      let canSearch = false;
      for (let i = 0; i < carFormValues.length; i++) {
        if (
          carFormValues[i].actionType === "add" &&
          carFormValues[i].details === ""
        ) {
          canSearch = true;
        }
      }

      if (canSearch) {
        setIsSearching(true);
        searchVIN(vin.toUpperCase()).then((result: any) => {
          if (result.data === "") {
            setErrorMessage("We're sorry that vin is not valid");
            setError(true);
            setTimeout(() => {
              setError(false);
              setErrorMessage("");
            }, 4000);
          } else {
            const copy = [...carFormValues];
            for (let i = 0; i < carFormValues.length; i++) {
              if (
                carFormValues[i].vin === "" ||
                carFormValues[i].details === ""
              ) {
                copy[
                  i
                ].details = `${result.data.year} ${result.data.make} ${result.data.model} ${result.data.trim}`;
                copy[i].vin = vin;
              }
            }
            setCarsFormValues(copy);
            setError(false);
            setVin("");
          }
          setIsSearching(false);
        });
      } else {
        setErrorMessage(
          "Search not possible when data is present in input field, add a new car or clear the added field and add again."
        );
        setError(true);
        setTimeout(() => {
          setError(false);
          setErrorMessage("");
        }, 4000);
      }
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      {error && (
        <Message negative>
          <Message.Header>{errorMessage}</Message.Header>
        </Message>
      )}
      <div style={{ display: "flex" }}>
        <div>
          <div>
            <Input
              focus
              placeholder="Search By VIN..."
              onChange={(e) => setVin(e.target.value)}
              value={vin}
              maxLength="17"
            />
            <Button
              style={{ marginLeft: 10 }}
              secondary={vin === "" ? false : true}
              loading={isSearching ? true : false}
              onClick={handleVinSearch}
            >
              Search
            </Button>
          </div>

          <div style={{ display: "flex", marginTop: 20, flexWrap: "wrap" }}>
            {renderCarInput()}
          </div>
          <div>
            <Button
              style={{ marginTop: 19 }}
              primary
              onClick={handleAddMoreCars}
            >
              Add more cars
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarsComponent;
