import React, {  SyntheticEvent } from "react";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import { useSelector, useDispatch } from "react-redux";
import { handleSnackBar, ISnackBar } from "../store/actions/snackBar";

const Alert = (props: any) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const SnackBar = () => {
  const snackBar = useSelector((state: any) => state.snackBarReducer);
  const dispatch = useDispatch();

  const handleCloseSnack = (event: SyntheticEvent, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    const snackObj: ISnackBar = { ...snackBar };
    snackObj.display_snackBar = false;
    dispatch(handleSnackBar(snackObj));
  };
  return (
    <Snackbar open={snackBar.display_snackBar} autoHideDuration={6000} onClose={handleCloseSnack}>
      <Alert onClose={handleCloseSnack} severity={snackBar.isError ? "error" : "success"}>
        {snackBar.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;
