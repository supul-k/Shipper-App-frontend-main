import React, { SyntheticEvent, useState, ChangeEvent } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {
  Button,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from "@material-ui/core";
import { IPasswordChangeData } from "../../Types/authTypes";
import CircularProgress from "../SpinnerComponent/CircularProgress";
import { setCookie } from "../../utils/cookie";
import { changePassword } from "../../actions/changePassword";

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

const ProfileComponent = (): JSX.Element => {
  const classes = useStyles();

  const [formData, setFormData] = useState<IPasswordChangeData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setISubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState("");
  const [passwordData, setPasswordData] = useState({
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setPasswordData({
      ...passwordData,
      showPassword: !passwordData.showPassword,
    });
  };

  const handleSignIn = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      if (formData.oldPassword === "") {
        setFormError("Old password is empty");
        return false;
      } else if (formData.newPassword === "") {
        setFormError("New Password is empty");
        return false;
      } else if (formData.confirmPassword === "") {
        setFormError("Confirm Password is empty");
        return false;
      } else if (formData.newPassword !== formData.confirmPassword) {
        setFormError("New Password and Confirm Password are not same");
        return false;
      }
      setISubmitting(true);
      const result = await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      window.location.href = "/";
    } catch (e) {
      if (e instanceof Error) {
        // ✅ TypeScript knows err is Error
        setISubmitting(false);
        setFormError(e.message);
      } else {
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
      <Button
        variant="contained"
        color="primary"
        style={{ width: 450 }}
        type="submit"
      >
        Change Password
      </Button>
    );
  };

  // const renderExpired = () => {
  //   if(queryParam === "expired") {
  //     return <p style={{textAlign: "center", color: "red"}}>Session expired please login!!</p>
  //   }
  // }

  return (
    <div className="auth-container">
      <div>
        {/* {renderExpired()} */}
        <div className="center-content">
          <h2>Old Sailors Ocean Shipping(Change Password)</h2>
        </div>
        <div className="center-content">
          <p style={{ color: "red" }}>{formError}</p>
          <form
            className={classes.root}
            noValidate
            autoComplete="off"
            onSubmit={handleSignIn}
          >
            <TextField
              id="oldPassword"
              label="Old Password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      // onMouseDown={handleMouseDownPassword}
                    >
                      {passwordData.showPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              name="oldPassword"
              type={passwordData.showPassword ? "text" : "password"}
              onChange={handleChange}
            />
            <TextField
              id="newPassword"
              label="New Password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      // onMouseDown={handleMouseDownPassword}
                    >
                      {passwordData.showPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              name="newPassword"
              type={passwordData.showPassword ? "text" : "password"}
              onChange={handleChange}
            />
            <TextField
              id="confirmPassword"
              label="Confirm New Password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      // onMouseDown={handleMouseDownPassword}
                    >
                      {passwordData.showPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              name="confirmPassword"
              type={passwordData.showPassword ? "text" : "password"}
              onChange={handleChange}
            />
            {renderButton()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
