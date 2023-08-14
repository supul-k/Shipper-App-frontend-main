import React, { useState, useEffect } from "react";
import SearchSection from "./SearchSection";
import { IContainerResponse, containerFormObj, IContainerForm, ICarFormValues } from "../../Types/containerTypes";
import ContainerModal from "./ContainerModal";
import TableComponent from "./TableComponent";
import { fetchContainer } from "../../actions/container";
import EditContainerComponent from "./EditContainerComponent";
import { IClientResponse } from "../../Types/clientTypes";
import { fetchCustomers } from "../../actions/customer";

function reducer(state: any, action: { type: string; size?: string | undefined }) {
  switch (action.type) {
    case "close":
      return { open: false };
    case "open":
      return { open: true, size: action.size };
    default:
      throw new Error("Unsupported action...");
  }
}

function editReducer(state: any, action: { type: string; sizeEdit?: string | undefined }) {
  switch (action.type) {
    case "close":
      return { openEdit: false };
    case "open":
      return { openEdit: true, sizeEdit: action.sizeEdit };
    default:
      throw new Error("Unsupported action...");
  }
}

const ContainerComponent = () => {
  const [state, dispatch] = React.useReducer(reducer, {
    open: false,
    size: undefined,
  });

  const [stateEdit, dispatchEdit] = React.useReducer(editReducer, {
    openEdit: false,
    sizeEdit: undefined,
  });
  const { open, size } = state;
  const { openEdit, sizeEdit } = stateEdit;
  const [formAction, setFormAction] = useState<string>("");
  const [formValues, setFormValues] = useState<IContainerForm>(containerFormObj);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [offset, setOffset] = useState<number>(0);
  const [rowCount, setRowCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rows, setRows] = useState<IContainerResponse[]>([]);
  const [pageIsLoading, setPageIsLoading] = useState<boolean>(false);
  const [editFormValues, setEditFormValues] = useState<IContainerResponse>({} as IContainerResponse);
  const [carsFormValues, setCarsFormValues] = useState<ICarFormValues[]>([]);
  const [customerData, setCustomerData] = useState<IClientResponse[]>([]);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const { data, count }: any = await fetchContainer(offset, rowsPerPage);
      setIsLoading(false);
      setRowCount(count);
      setRows(data);
    };
    fetch();
  }, [rowsPerPage, offset, pageIsLoading]);

  useEffect(() => {
    const fetch = async () => {
      const { data }: any = await fetchCustomers(0, 5000000);
      setCustomerData(data);
    };

    fetch();
  }, []);

  const openModalForm = () => {
    setFormAction("new");
    dispatch({ type: "open", size: "large" });
    setFormValues(containerFormObj);
  };

  const closeModal = () => {
    dispatch({ type: "close" });
  };

  const closeModalEdit = () => {
    dispatchEdit({ type: "close" });
  };

  const openEditForm = () => {
    dispatchEdit({ type: "open", sizeEdit: "large" });
  };

  return (
    <div>
      <h2>Containers ({rowCount})</h2>
      <SearchSection openModalForm={openModalForm} setRows={setRows} setRowCount={setRowCount} />
      {openEdit && (
        <EditContainerComponent
          open={openEdit}
          size={sizeEdit}
          closeModal={closeModalEdit}
          carsFormValues={carsFormValues}
          setCarsFormValues={setCarsFormValues}
          editFormValues={editFormValues}
          setEditFormValues={setEditFormValues}
          customerData={customerData}
          setPageIsLoading={setPageIsLoading}
          pageIsLoading={pageIsLoading}
        />
      )}
      <TableComponent
        rows={rows}
        rowsPerPage={rowsPerPage}
        page={page}
        setRowsPerPage={setRowsPerPage}
        setPage={setPage}
        setOffset={setOffset}
        rowCount={rowCount}
        openModalForm={openEditForm}
        setEditFormValues={setEditFormValues}
        setRows={setRows}
      />
      <ContainerModal
        open={open}
        size={size}
        closeModal={closeModal}
        formValues={formValues}
        setFormValues={setFormValues}
        setPageIsLoading={setPageIsLoading}
      />
    </div>
  );
};

export default ContainerComponent;
