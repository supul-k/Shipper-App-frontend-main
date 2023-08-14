import React, { useState, Dispatch, SetStateAction } from "react";
import {
  IConsigneeForm,
  consigneeFormObj,
  IConsigneeResponse,
} from "../../Types/consigneeTypes";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Button } from "semantic-ui-react";
import { handleSaveAPI, handleUpdateAPI } from "../../actions/consignee";
import { customerDropDownFullTextSearchAPI } from "../../actions/customer";
import CircularProgress from "../SpinnerComponent/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { handleSnackBar, ISnackBar } from "../../store/actions/snackBar";
import { Dropdown } from "semantic-ui-react";
import { IClientResponse } from "../../Types/clientTypes";
import countries from "./countries.json";

type IProps = {
  formValues: IConsigneeForm;
  formAction: string;
  setFormValues: Dispatch<SetStateAction<IConsigneeForm>>;
  setRows: Dispatch<SetStateAction<IConsigneeResponse[]>>;
  rows: Array<IConsigneeResponse>;
  modalAction: (tittle: string, display: boolean, isDelete: boolean) => void;
  customerData: IClientResponse[];
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
  formAction,
  setFormValues,
  setRows,
  rows,
  modalAction,
  customerData,
  setPageIsLoading,
}: IProps): JSX.Element => {
  const classes = useStyles();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [other, setOther] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch();
  const snackBar = useSelector((state: any) => state.snackBarReducer);
  const countriesData: any = [...countries];
  const [searchData, setSearchData] = useState<IClientResponse[]>([]);

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

  const handleSaveAction = (data: any) => {
    setRows((prev: any) => [...prev, data]);
    setFormValues(consigneeFormObj);
  };

  const handleSave = async (action: string) => {
    if (!Validate()) {
      try {
        setIsSaving(true);
        const data: any = await handleSaveAPI(formValues);
        setIsSaving(false);

        const snackObj: ISnackBar = { ...snackBar };
        snackObj.display_snackBar = true;
        snackObj.message = "Consignee added";
        dispatch(handleSnackBar(snackObj));

        if (action === "saveANDclose") {
          handleSaveAction(data);
          setPageIsLoading(true);
          modalAction("", false, false);
        } else if (action === "saveANDnew") {
          setError("");
          setPageIsLoading(true);

          handleSaveAction(data);
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
        let array = [...rows];
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

  // function fullTextSearch(items: any, text: any) {
  //   text = text.split(' ');
  //   return items.filter(function(item: any) {
  //     return text.every(function(el: any) {
  //       return item.text.indexOf(el) > -1;
  //     });
  //   });
  // }

  const renderButtons = () => {
    if (formAction === "new") {
      return (
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 30 }}
        >
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

  // let objdata: any = customerData

  const customerOptions = (customerData: IClientResponse[]) =>
    customerData.map((value: any, index: number) => ({
      key: index,
      text: value.full_name,
      value: value.id,
    }));

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
        <p style={{ fontWeight: 400 }}>
          <strong>Details</strong>
        </p>
        {line}
        <div style={{ marginBottom: 20 }}>
          <form autoComplete="off">
            <span>
              <strong>Customer(Consignee belongs to)</strong>
            </span>
            <Dropdown
              placeholder="Search by customer name"
              search={(data, inputValues) => {
                customerDropDownFullTextSearchAPI(inputValues).then(
                  (result: any) => {
                    setSearchData(result.data);
                  }
                );
                return customerOptions(searchData);
              }}
              selection
              value={formValues.customer_id}
              options={customerOptions(customerData)}
              style={{ width: "100%" }}
              onChange={(e, { value, name }) => {
                setFormValues((prev: any) => {
                  return {
                    ...prev,
                    [name]: value,
                  };
                });
              }}
              name="customer_id"
              forceSelection={false}
              selectOnBlur={false}
            />
          </form>
        </div>
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
