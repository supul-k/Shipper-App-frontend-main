import React, { Dispatch, SetStateAction, SyntheticEvent, useState, useEffect } from "react";
import { Button, Icon, Modal, TextArea, Form, Loader, Tab } from "semantic-ui-react";
import { ICarFormValues, IContainerResponse } from "../../Types/containerTypes";
import { fetchCars, handleUpdateContainerAPI } from "../../actions/container";
import EditContentForm from "./EditContentForm";
import { IClientResponse } from "../../Types/clientTypes";
import CarsComponent from "./EditForms/CarsComponent";

type IProps = {
  size?: any;
  open: boolean;
  closeModal: () => void;
  carsFormValues: ICarFormValues[];
  setCarsFormValues: Dispatch<SetStateAction<ICarFormValues[]>>;
  editFormValues: IContainerResponse;
  setEditFormValues: Dispatch<SetStateAction<IContainerResponse>>;
  customerData: IClientResponse[];
  setPageIsLoading: Dispatch<SetStateAction<boolean>>;
  pageIsLoading: boolean;
};

const EditContainerComponent = ({
  closeModal,
  size,
  open,
  carsFormValues,
  setCarsFormValues,
  editFormValues,
  setEditFormValues,
  customerData,
  setPageIsLoading,
  pageIsLoading,
}: IProps) => {
  useEffect(() => {
    const handleFetchCars = async () => {
      const result: any = await fetchCars(editFormValues.id);
      setCarsFormValues(result);
    };
    handleFetchCars();
  }, []);

  const panes = [
    {
      menuItem: "Container Details",
      render: () => (
        <Tab.Pane attached={false}>
          <EditContentForm editFormValues={editFormValues} setEditFormValues={setEditFormValues} customerData={customerData} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Cars",
      render: () => (
        <Tab.Pane attached={false}>
          <CarsComponent
            carFormValues={carsFormValues}
            setCarsFormValues={setCarsFormValues}
            customerId={editFormValues.id}
            editFormValues={editFormValues}
          />
        </Tab.Pane>
      ),
    },
  ];

  const handleSave = async () => {
    const copyCar: any = [...carsFormValues];
    const copyFormValues: any = { ...editFormValues };

    for (let i = 0; i < copyCar.length; i++) {
      delete copyCar[i].label;
      delete copyCar[i].actionType;
    }
    const containerId = copyFormValues.id;

    delete copyFormValues.full_name;
    delete copyFormValues.id;
    delete Object.assign(copyFormValues, { ["customer_id"]: copyFormValues["customerId"] })["customerId"];
    setPageIsLoading(true);
    await handleUpdateContainerAPI(copyCar, copyFormValues, containerId);
    setPageIsLoading(false);

    closeModal();
  };

  return (
    <Modal size={size} open={open} onClose={closeModal}>
      <Modal.Header>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p>Edit Container</p>
          </div>
          <div>
            <Icon name="close" style={{ cursor: "pointer" }} onClick={closeModal} />
          </div>
        </div>
      </Modal.Header>
      <Modal.Content scrolling>
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </Modal.Content>
      <Modal.Actions>
        <Button style={{ marginTop: 19 }} primary onClick={handleSave} loading={pageIsLoading}>
          Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default EditContainerComponent;
