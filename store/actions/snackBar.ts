import { HANDLE_DISPLAY_SNACKBAR } from "../types";

export type ISnackBar = {
  display_snackBar: boolean;
  message: string;
  isError: boolean;
};

export const handleSnackBar = (data: ISnackBar) => {
  return (dispatch: any) => {
    dispatch({
      type: HANDLE_DISPLAY_SNACKBAR,
      payload: data,
    });
  };
};
