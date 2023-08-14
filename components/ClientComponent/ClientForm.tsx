import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
import {
  IClientForm,
  clientFormObj,
  IClientResponse,
} from "../../Types/clientTypes";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Button } from "semantic-ui-react";
import USStates from "../../utils/states.json";
import { handleSaveAPI, handleUpdateAPI } from "../../actions/customer";
import CircularProgress from "../SpinnerComponent/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { handleSnackBar, ISnackBar } from "../../store/actions/snackBar";

type IProps = {
  formValues: IClientForm;
  formAction: string;
  setFormValues: Dispatch<SetStateAction<IClientForm>>;
  setRows: Dispatch<SetStateAction<IClientResponse[]>>;
  rows: Array<Object>;
  modalAction: (tittle: string, display: boolean, isDelete: boolean) => void;
  setCustomerId: Dispatch<SetStateAction<number>>;
  setCustomerName: Dispatch<SetStateAction<string>>;
  setDisplayConsigneeForm: Dispatch<SetStateAction<boolean>>;
  setPageIsLoading: Dispatch<SetStateAction<boolean>>;
};

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

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: "30%",
    marginRight: 10,
  },
}));

const ClientForm = ({
  formValues,
  formAction,
  setFormValues,
  setRows,
  rows,
  modalAction,
  setCustomerId,
  setCustomerName,
  setDisplayConsigneeForm,
  setPageIsLoading,
}: IProps): JSX.Element => {
  const classes = useStyles();
  const [disableCity, setDisableCity] = useState<boolean>(true);
  const [other, setOther] = useState<boolean>(false);
  const [cityOther, setCityOther] = useState<boolean>(false);
  const [cityData, setCityData] = useState<Array<[string]>>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch();
  const snackBar = useSelector((state: any) => state.snackBarReducer);
  const usStatesData: any = { ...USStates };

  const statesData = (): Array<string> => {
    const data = [];
    for (const property in usStatesData) {
      data.push(property);
    }
    return data;
  };

  const renderCityData = (value: string) => {
    const filtered = Object.keys(usStatesData)
      .filter((result) => {
        return result === value;
      })
      .reduce((obj: any, key: string) => {
        obj[key] = usStatesData[key];
        return obj;
      }, {});

    if (filtered[value]) {
      setCityData(filtered[value]);
      setDisableCity(false);
    }
  };

  //if edit handle city data
  useEffect(() => {
    if (formAction === "edit") {
      renderCityData(formValues.state);
    }
  }, []);

  const handleChange = (event: any) => {
    setName_Required(false);
    setPhone_Required(false);
    setEmail_Required(false);
    let { value, name } = event.target;
    if (name === "state") {
      if (value !== "") {
        setCityOther(false);
        renderCityData(value);
        setDisableCity(false);
      }
      if (value == "") {
        setOther(false);
      }
      if (value == "OTHER") {
        formValues.city = "";
        value = "";
        setOther(true);
      }
    }
    if (name === "city") {
      if (value === "OTHER") {
        formValues.city = "";
        value = "";
        setCityOther(true);
      }
    }
    setFormValues((prev: any) => {
      return {
        ...prev,
        [name]: value.toUpperCase(),
      };
    });
  };

  const renderState = () => {
    return (
      <FormControl variant="outlined" className={classes.formControl}>
        {other ? (
          <TextField
            label="State"
            style={{ width: "100%" }}
            onChange={handleChange}
            value={formValues.state}
            name="state"
            variant="outlined"
          />
        ) : (
          <Select
            native
            value={formValues.state}
            onChange={handleChange}
            label="State"
            inputProps={{
              name: "state",
              id: "outlined-state-native-simple",
            }}
          >
            <option aria-label="None" value="">
              Select a state
            </option>
            {statesData().map((result, index) => (
              <option aria-label="None" value={result} key={index}>
                {result}
              </option>
            ))}
          </Select>
        )}
      </FormControl>
    );
  };

  const renderCity = () => {
    return (
      <FormControl variant="outlined" className={classes.formControl}>
        {other || cityOther ? (
          <TextField
            label="City"
            style={{ width: "100%" }}
            onChange={handleChange}
            value={formValues.city}
            name="city"
            variant="outlined"
          />
        ) : (
          <Select
            native
            value={formValues.city}
            onChange={handleChange}
            label="City"
            inputProps={{
              name: "city",
              id: "outlined-city-native-simple",
            }}
            disabled={disableCity}
          >
            <option aria-label="None" value="">
              Select a city
            </option>
            {cityData.map((result, index) => (
              <option aria-label="None" value={result} key={index}>
                {result}
              </option>
            ))}
          </Select>
        )}
      </FormControl>
    );
  };

  const handleSaveAction = (data: any) => {
    setRows((prev: any) => [...prev, data]);
    setFormValues(clientFormObj);
  };

  const handleSave = async (action: string) => {
    if (!Validate()) {
      try {
        setIsSaving(true);
        const data: any = await handleSaveAPI(formValues);
        setIsSaving(false);

        const snackObj: ISnackBar = { ...snackBar };
        snackObj.display_snackBar = true;
        snackObj.message = "Customer added";
        dispatch(handleSnackBar(snackObj));

        if (action === "saveANDclose") {
          setDisplayConsigneeForm(false);
          handleSaveAction(data);
          setPageIsLoading(true);
          modalAction("", false, false);
        } else if (action === "saveANDnew") {
          setError("");

          handleSaveAction(data);
          setPageIsLoading(true);
        } else {
          handleSaveAction(data);
          setCustomerId(data.id);
          setCustomerName(data.full_name);
          setPageIsLoading(true);

          setDisplayConsigneeForm(true);
        }
      } catch (e) {
        if (e instanceof Error) {
          setIsSaving(false);
          setError(e.message);
        }
      }
    }
  };

  const handleUpdate = async () => {
    if (!Validate()) {
      try {
        const objToSave: any = { ...formValues };
        const indexId = objToSave.indexId;
        const dataId = objToSave.id;
        delete objToSave.indexId;

        setIsSaving(true);
        await handleUpdateAPI(objToSave);
        setIsSaving(false);
        //update table data
        let array: any = [...rows];
        array[indexId] = {
          ...objToSave,
          id: dataId,
        };
        const snackObj: ISnackBar = { ...snackBar };
        snackObj.display_snackBar = true;
        snackObj.message = "Customer updated";
        dispatch(handleSnackBar(snackObj));
        setRows(array);
        setPageIsLoading(true);
        modalAction("", false, false);
      } catch (e) {
        if (e instanceof Error) {
          setIsSaving(false);
          setError(e.message);
        }
      }
    }
  };

  const renderButtons = () => {
    if (formAction === "new") {
      return (
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 30 }}
        >
          <Button
            color="grey"
            style={{ marginRight: 10 }}
            onClick={() => handleSave("saveANDfill")}
          >
            Save and fill consignee
          </Button>
          <Button
            primary
            style={{ marginRight: 10 }}
            onClick={() => handleSave("saveANDnew")}
          >
            Save and new
          </Button>
          <Button positive onClick={() => handleSave("saveANDclose")}>
            Save and close
          </Button>
        </div>
      );
    } else {
      return (
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 30 }}
        >
          <Button primary onClick={handleUpdate}>
            Update
          </Button>
        </div>
      );
    }
  };
  const [name_required, setName_Required] = useState(false);
  const [phone_required, setPhone_Required] = useState(false);
  const [email_required, setEmail_Required] = useState(false);

  const Validate = () => {
    let isError = false;
    if (!formValues.full_name) {
      setName_Required(true);
      isError = true;
    }
    if (!formValues.phone_number) {
      setPhone_Required(true);
      isError = true;
    }
    if (!formValues.email) {
      setEmail_Required(true);
      isError = true;
    }
    return isError;
  };

  return (
    <div style={{ width: 700, padding: 20 }}>
      <p style={{ color: "red" }}>{error}</p>
      <div>
        <p style={{ fontWeight: 400 }}>
          <strong>Details</strong>
        </p>
        {line}
        <div>
          <TextField
            required
            error={name_required}
            label="Full name"
            style={{ width: "100%" }}
            onChange={handleChange}
            value={formValues.full_name}
            name="full_name"
            variant="outlined"
          />
        </div>
        <form autoComplete={"off"} style={{ display: "flex", marginTop: 15 }}>
          <TextField
            required
            error={phone_required}
            label="Phone number"
            style={{ width: "50%", marginRight: 10 }}
            onChange={handleChange}
            value={formValues.phone_number}
            name="phone_number"
            variant="outlined"
          />
          <TextField
            required
            error={email_required}
            label="Email"
            style={{ width: "50%" }}
            onChange={handleChange}
            value={formValues.email}
            name="email"
            variant="outlined"
          />
        </form>
      </div>
      <div style={{ marginTop: 20 }}>
        <p style={{ fontWeight: 400 }}>
          <strong>Address</strong>
        </p>
        {line}
        <TextField
          label="Address"
          style={{ width: "100%", marginRight: 10 }}
          onChange={handleChange}
          value={formValues.address}
          name="address"
          variant="outlined"
        />
        <form autoComplete={"off"} style={{ display: "flex", marginTop: 15 }}>
          {renderState()}
          {renderCity()}
          <TextField
            label="Zip Code"
            style={{ width: "40%" }}
            onChange={handleChange}
            value={formValues.zipcode}
            name="zipcode"
            variant="outlined"
          />
        </form>
      </div>
      <div style={{ marginTop: 20 }}>
        <p style={{ fontWeight: 400 }}>
          <strong>Others</strong>
        </p>
        {line}

        <form autoComplete={"off"} style={{ display: "flex", marginTop: 15 }}>
          <TextField
            label="IRS Tax ID"
            style={{ width: "35%", marginRight: 10 }}
            onChange={handleChange}
            value={formValues.irs_tax_id}
            name="irs_tax_id"
            variant="outlined"
          />
          <TextField
            label="Passport"
            style={{ width: "35%", marginRight: 10 }}
            onChange={handleChange}
            value={formValues.passport_number}
            name="passport_number"
            variant="outlined"
          />
          <TextField
            label="Social Security Number"
            style={{ width: "35%" }}
            onChange={handleChange}
            value={formValues.ssn}
            name="ssn"
            variant="outlined"
          />
        </form>
      </div>
      {isSaving ? (
        <div style={{ marginTop: 30, float: "right", padding: 30 }}>
          <CircularProgress />
        </div>
      ) : (
        renderButtons()
      )}
    </div>
  );
};

export default ClientForm;
