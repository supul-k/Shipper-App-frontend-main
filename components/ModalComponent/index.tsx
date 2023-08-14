import React, { useState } from "react";
import ReactModal from "react-modal";
import CloseIcon from "@material-ui/icons/Close";
import { useSelector, useDispatch } from "react-redux";
import { handleModal } from "../../store/actions/modal";
import CircularProgress from "../SpinnerComponent/CircularProgress";
import { Button } from "semantic-ui-react";

const ModalComponent = ({ children, confirmDelete }: any) => {
  const { display_modal, heading, isDelete, isDeleting } = useSelector((state: any) => state.modalReducer);

  const dispatch = useDispatch();
  ReactModal.setAppElement("body"); //react modal body

  const handleClose = () => {
    const data = {
      display_modal: false,
      heading: "",
      isDelete: false,
    };
    dispatch(handleModal(data));
  };

  const renderView = () => {
    if (isDelete) {
      return (
        <div style={{ padding: 17, textAlign: "center" }}>
          <p>Are you sure you want to delete this data?</p>
          <div style={{ marginTop: 20 }}>
            <Button
              loading={isDeleting}
              color="red"
              style={{ height: 40, marginLeft: 20, marginTop: 10 }}
              onClick={confirmDelete}
              disabled={isDeleting ? true : false}
            >
              Confirm
            </Button>
            <Button style={{ height: 40, marginLeft: 20, marginTop: 10 }} onClick={handleClose} secondary>
              Cancel
            </Button>
          </div>
        </div>
      );
    } else {
      return children;
    }
  };

  return (
    <ReactModal
      shouldFocusAfterRender={true}
      isOpen={display_modal}
      role="dialog"
      className={isDelete ? "delete-modal" : "modal"}
      style={{
        overlay: {
          backgroundColor: "rgba(18, 18, 18, 0.3)",
          zIndex: 10010,
        },
      }}
    >
      <div className="i-03">
        <div style={{ padding: 10 }}>
          <p style={{ fontWeight: 500, fontSize: 20, marginLeft: 8 }}>{heading}</p>
        </div>
        <div>
          <button onClick={handleClose} className="btn-single-01">
            <CloseIcon />
          </button>
        </div>
      </div>
      {renderView()}
    </ReactModal>
  );
};

export default ModalComponent;
