import { HANDLE_DISPLAY_MODAL } from "../types";
import InitialState from "./initialState";

const modalReducer = (state = InitialState.modal, action: any) => {
  switch (action.type) {
    case HANDLE_DISPLAY_MODAL:
      return action.payload;
    default:
      return state;
  }
};

export default modalReducer;
