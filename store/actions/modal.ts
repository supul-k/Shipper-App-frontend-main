import { HANDLE_DISPLAY_MODAL } from "../types";

export type IModal = {
  display_modal: boolean;
  isDelete: boolean;
  heading: string;
};

export const handleModal = (data: IModal) => {
  return (dispatch: any) => {
    dispatch({
      type: HANDLE_DISPLAY_MODAL,
      payload: data,
    });
  };
};
