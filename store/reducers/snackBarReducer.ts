import { HANDLE_DISPLAY_SNACKBAR } from "../types";
import InitialState from "./initialState";

 const snackBarReducer = (state = InitialState.snackBar, action: any) => {
  switch (action.type) {
    case HANDLE_DISPLAY_SNACKBAR:
      return action.payload;
    default:
      return state;
  }
};

export default snackBarReducer