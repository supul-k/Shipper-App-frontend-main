import React, {
  useState,
  SetStateAction,
  Dispatch,
  SyntheticEvent,
  ChangeEvent,
} from "react";
import { searchVIN } from "../../../actions/container";
import { Input, Button, Card, Message, Icon } from "semantic-ui-react";
import {
  ICarFormValues,
  createCarInputs,
  carFormValuesObj,
  IContainerForm,
} from "../../../Types/containerTypes";

type IProps = {
  containerId: number;
  carFormValues: ICarFormValues;
  setCarFormValues: Dispatch<SetStateAction<ICarFormValues>>;
  carData: ICarFormValues[];
  setCarData: Dispatch<SetStateAction<ICarFormValues[]>>;
  formValues: IContainerForm;
};

const CarsComponent = ({
  containerId,
  carFormValues,
  setCarFormValues,
  carData,
  formValues,
  setCarData,
}: IProps) => {
  const [vin, setVin] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCarFormValues((prev: any) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const renderCarInput = () =>
    createCarInputs(carFormValues).map((result, index) => (
      <div style={{ marginRight: 10 }} key={index}>
        <span>{result.label}</span>
        <br />
        {result.label === "VIN:" ? (
          <Input
            focus
            onChange={handleChange}
            name={result.name}
            value={result.value}
            maxLength="17"
          />
        ) : (
          <Input
            focus
            onChange={handleChange}
            name={result.name}
            value={result.value}
          />
        )}
      </div>
    ));

  const renderCarData = () =>
    carData.map((result, index) => (
      <Card style={{ padding: 10 }} key={index}>
        <div>
          <Icon
            name="close"
            style={{ float: "right", marginBottom: 10, cursor: "pointer" }}
            onClick={() => {
              const copy = [...carData];
              const filter = copy.filter((value) => value.vin !== result.vin);
              setCarData(filter);
            }}
          />
        </div>
        <p>
          <strong>Details:</strong> {result.details}
        </p>
        <p>
          <strong>VIN:</strong> {result.vin}
        </p>
        <p>
          <strong>Value for AES:</strong>{" "}
          {result.value_for_aes === "" ? "-" : result.value_for_aes}
        </p>
      </Card>
    ));

  const handleAddCar = () => {
    const copy = { ...carFormValues };
    copy.container_id = containerId;

    if (formValues.container_type === "roro") {
      if (carData.length >= 1) {
        //error
        setErrorMessage(
          "Operation not possible Roro containers have only one car"
        );
        setError(true);
        setTimeout(() => {
          setError(false);
          setErrorMessage("");
        }, 4000);
      } else {
        setCarData((prev) => [...prev, copy]);
      }
    } else {
      setCarData((prev) => [...prev, copy]);
    }
    setCarFormValues(carFormValuesObj);
  };

  const handleVinSearch = () => {
    if (vin !== "") {
      if (formValues.container_type === "roro") {
        if (carData.length >= 1) {
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

      if (carData.filter((result) => result.vin === vin).length !== 0) {
        setErrorMessage("VIN already added try again with another VIN");
        setError(true);
        setTimeout(() => {
          setError(false);
          setErrorMessage("");
        }, 5000);
        return;
      } else {
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
            const copy = { ...carFormValues };
            copy.details = `${result.data.year} ${result.data.make} ${result.data.model} ${result.data.trim}`;
            copy.vin = vin;
            setCarFormValues(copy);
            setError(false);
            setVin("");
          }
          setIsSearching(false);
        });
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
          <div style={{ display: "flex", marginTop: 20 }}>
            {renderCarInput()}
            <div>
              <Button
                style={{ marginTop: 19 }}
                primary
                onClick={handleAddCar}
                secondary={carFormValues.vin === "" ? false : true}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
        <div style={{ marginLeft: 40 }}>{renderCarData()}</div>
      </div>
    </div>
  );
};

export default CarsComponent;
