import React, { SyntheticEvent, useState, ChangeEvent } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import { signIn } from "../../actions/auth";
import { IFormData } from "../../Types/authTypes";
import CircularProgress from "../SpinnerComponent/CircularProgress";
import { setCookie } from "../../utils/cookie";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "45ch",
      marginTop: 20,
      textAlign: "center",
    },
  },
}));

type IProps = {
  queryParam: string;
};

const AuthComponent = ({ queryParam }: IProps): JSX.Element => {
  const classes = useStyles();
  const [formData, setFormData] = useState<IFormData>({ email: "", password: "" });
  const [isSubmitting, setISubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState("");

  const handleSignIn = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      if (formData.email === "") {
        setFormError("Email is not valid");
        return false;
      } else if (formData.password === "") {
        setFormError("Password is not valid");
        return false;
      }
      setISubmitting(true);
      const result = await signIn(formData);
      setCookie(result);
      window.location.href = "/";
    } catch (e) {
      if (e instanceof Error) {
        // ✅ TypeScript knows err is Error
        setISubmitting(false);
        setFormError(e.message);
      } else {
        console.log('Unexpected error', e);
      }
      setTimeout(() => {
        setFormError("");
      }, 5000);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = e.target;
    setFormError("");
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const renderButton = (): JSX.Element => {
    return isSubmitting ? (
      <div className="center-content" style={{ marginLeft: 100 }}>
        <CircularProgress />
      </div>
    ) : (
      <Button variant="contained" color="primary" style={{ width: 450 }} type="submit">
        Sign-in
      </Button>
    );
  };


  const renderExpired = () => {
    if(queryParam === "expired") {
      return <p style={{textAlign: "center", color: "red"}}>Session expired please login!!</p>
    }
  }

  return (
    <div className="auth-container">
      <div>
        {renderExpired()}
        <div className="center-content">
          <h2>Old Sailors Ocean Shipping(Sign-In)</h2>
        </div>
        <div className="center-content">
          <p style={{ color: "red" }}>{formError}</p>
          <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSignIn}>
            <TextField id="email" label="Email" variant="outlined" name="email" onChange={handleChange} value={formData.email} />
            <TextField id="password" label="Password" variant="outlined" name="password" type="password" onChange={handleChange} />
            {renderButton()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
