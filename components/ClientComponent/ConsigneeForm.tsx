import React, { useState, Dispatch, SetStateAction } from "react";
import { IConsigneeForm } from "../../Types/consigneeTypes";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Button } from "semantic-ui-react";
import { handleSaveAPI } from "../../actions/consignee";
import CircularProgress from "../SpinnerComponent/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { handleSnackBar, ISnackBar } from "../../store/actions/snackBar";
import "semantic-ui-css/semantic.min.css";
import countries from "../ConsigneeComponent/countries.json";

type IProps = {
  formValues: IConsigneeForm;
  setFormValues: Dispatch<SetStateAction<IConsigneeForm>>;
  modalAction: (tittle: string, display: boolean, isDelete: boolean) => void;
  customerName: string;
  customerId: number;
  setConsigneeId: Dispatch<SetStateAction<number>>;
  setDisplayPoaNraForm: Dispatch<SetStateAction<boolean>>;
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
  formControlCountry: {
    width: "50%",
    marginRight: 10,
  },
}));

const ConsigneeForm = ({
  formValues,
  setFormValues,
  modalAction,
  customerName,
  customerId,
  setConsigneeId,
  setDisplayPoaNraForm,
  setDisplayConsigneeForm,
  setPageIsLoading,
}: IProps): JSX.Element => {
  const classes = useStyles();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [other, setOther] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch();
  const snackBar = useSelector((state: any) => state.snackBarReducer);
  const countriesData: any = [...countries];

  const handleChange = (event: any) => {
    setName_Required(false);
    let { value, name } = event.target;
    if (value == "") {
      setOther(false);
    }

    if (value == "OTHER") {
      value = "";
      setOther(true);
    }

    setFormValues((prev: any) => {
      return {
        ...prev,
        [name]: value.toUpperCase(),
      };
    });
  };

  const handleSave = async (action: string) => {
    if (!Validate()) {
      try {
        const newValues = { ...formValues };
        newValues.customer_id = customerId;

        setIsSaving(true);
        const data: any = await handleSaveAPI(newValues);

        if (action === "saveANDclose") {
          setDisplayConsigneeForm(false);
          setPageIsLoading(true);
          modalAction("", false, false);
        } else {
          setConsigneeId(data.id);
          setDisplayPoaNraForm(true);
        }
      } catch (e) {
        if (e instanceof Error) {
          setIsSaving(false);
          setError(e.message);
        }
      }
    }
  };

  const renderButtons = () => (
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 30 }}>
      <Button
        color="grey"
        style={{ marginRight: 10 }}
        onClick={() => handleSave("saveANDfill")}
      >
        Save and fill poa/nra form
      </Button>
      <Button positive onClick={() => handleSave("saveANDclose")}>
        Save and close
      </Button>
    </div>
  );

  const renderCountry = () => {
    return (
      <FormControl variant="outlined" className={classes.formControlCountry}>
        {other ? (
          <TextField
            label="Country"
            style={{ width: "100%" }}
            onChange={handleChange}
            value={formValues.country}
            name="country"
            variant="outlined"
          />
        ) : (
          <Select
            native
            value={formValues.country}
            onChange={handleChange}
            label="Country"
            inputProps={{
              name: "country",
              id: "outlined-city-native-simple",
            }}
          >
            <option aria-label="None" value="">
              Select a country
            </option>
            {countriesData.map((result: any, index: number) => (
              <option aria-label="None" value={result.name} key={index}>
                {result.name}
              </option>
            ))}
          </Select>
        )}
      </FormControl>
    );
  };

  const [name_required, setName_Required] = useState(false);

  const Validate = () => {
    let isError = false;
    if (!formValues.full_name) {
      setName_Required(true);
      isError = true;
    }
    return isError;
  };

  return (
    <div style={{ width: 700, padding: 20 }}>
      <p style={{ color: "red" }}>{error}</p>
      <div>
        <p style={{ marginBottom: 5, fontSize: 20 }}>
          Adding Consignee for <strong>{customerName}</strong>
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
            label="Phone number"
            style={{ width: "50%", marginRight: 10 }}
            onChange={handleChange}
            value={formValues.phone_number}
            name="phone_number"
            variant="outlined"
          />
          <TextField
            label="Email"
            style={{ width: "50%" }}
            onChange={handleChange}
            value={formValues.email}
            name="email"
            variant="outlined"
          />
        </form>
        <TextField
          label="Care Of"
          style={{ width: "100%", marginTop: 15 }}
          onChange={handleChange}
          value={formValues.care_of}
          name="care_of"
          variant="outlined"
        />
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
          {renderCountry()}
          <TextField
            label="City"
            style={{ width: "48%" }}
            onChange={handleChange}
            value={formValues.city}
            name="city"
            variant="outlined"
          />
        </form>
        <div style={{ display: "flex", marginTop: 15 }}>
          <TextField
            label="State"
            style={{ width: "50%" }}
            onChange={handleChange}
            value={formValues.state}
            name="state"
            variant="outlined"
          />
          <TextField
            label="Postal Code"
            style={{ width: "48%", marginLeft: 20 }}
            onChange={handleChange}
            value={formValues.zipcode}
            name="zipcode"
            variant="outlined"
          />
        </div>
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

export default ConsigneeForm;
