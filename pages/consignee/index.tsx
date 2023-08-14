import React, { useEffect, useState } from "react";
import ConsigneeComponent from "../../components/ConsigneeComponent";
import ConsigneeForm from "../../components/ConsigneeComponent/ConsigneeForm";
import SearchSection from "../../components/ConsigneeComponent/SearchSection";
import ModalComponent from "../../components/ModalComponent";
import {
  IConsigneeForm,
  consigneeFormObj,
  IConsigneeResponse,
} from "../../Types/consigneeTypes";
import SnackBar from "../../components/SnackBar";
import {
  fetchConsignee,
  handleDeleteConsigneeApi,
} from "../../actions/consignee";
import CircularProgress from "../../components/SpinnerComponent/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { handleModal } from "../../store/actions/modal";
import { handleSnackBar, ISnackBar } from "../../store/actions/snackBar";
import { IClientResponse, clientFormObj } from "../../Types/clientTypes";
import { fetchCustomers } from "../../actions/customer";
import { max } from "moment";

const Consignee = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formAction, setFormAction] = useState<string>("");
  const [formValues, setFormValues] =
    useState<IConsigneeForm>(consigneeFormObj);
  const [rows, setRows] = useState<IConsigneeResponse[]>([]);
  const dispatch = useDispatch();
  const modalState = useSelector((state: any) => state.modalReducer);
  const [indexToDelete, setIndexToDelete] = useState<number>(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [offset, setOffset] = useState<number>(0);
  const [customerData, setCustomerData] = useState<IClientResponse[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [pageIsLoading, setPageIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetch = async () => {
      const { count }: any = await fetchCustomers(0,5);
      const { data }: any = await fetchCustomers(0,count);
      setCustomerData(data);
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const { data, count }: any = await fetchConsignee(offset, rowsPerPage);
      setIsLoading(false);
      setRows(data);
      setRowCount(count);
    };
    fetch();
  }, [rowsPerPage, offset, pageIsLoading]);

  const modalAction = (
    heading: string,
    display: boolean,
    isDelete: boolean,
    isDeleting: boolean = false
  ) => {
    const data = {
      display_modal: display,
      heading: heading,
      isDelete,
      isDeleting,
    };
    dispatch(handleModal(data));
  };

  const openModalForm = () => {
    setFormAction("new");
    modalAction("New Consignee", true, false);
    setFormValues(consigneeFormObj);
  };

  const handleDelete = (indexId: number) => {
    setIndexToDelete(indexId);
    modalAction("Delete Data", true, true);
  };

  const confirmDelete = async () => {
    //send to api then handle UI
    const snackObj: ISnackBar = {
      display_snackBar: false,
      message: "",
      isError: false,
    };

    try {
      modalAction("Delete Data", true, true, true);
      const array = [...rows];
      await handleDeleteConsigneeApi(array[indexToDelete].id);
      array.splice(indexToDelete, 1);
      setRows(array);
      modalAction("", false, false);
      snackObj.display_snackBar = true;
      snackObj.message = "Consignee deleted";
      dispatch(handleSnackBar(snackObj));
    } catch (e) {
      snackObj.display_snackBar = true;
      snackObj.message = "Error deleting consignee";
      snackObj.isError = true;
      dispatch(handleSnackBar(snackObj));
      modalAction("", false, false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Consignee ({rowCount})</h2>
      <div style={{ marginBottom: 20 }}>
        <SearchSection
          openModalForm={openModalForm}
          setRows={setRows}
          setRowCount={setRowCount}
        />
      </div>
      {modalState.display_modal && (
        <ModalComponent confirmDelete={confirmDelete}>
          <ConsigneeForm
            formValues={formValues}
            formAction={formAction}
            setFormValues={setFormValues}
            setRows={setRows}
            rows={rows}
            modalAction={modalAction}
            customerData={customerData}
            setPageIsLoading={setPageIsLoading}
          />
        </ModalComponent>
      )}

      {isLoading ? (
        <div
          style={{
            marginTop: 200,
            padding: 30,
            justifyContent: "center",
            display: "flex",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <ConsigneeComponent
          setRows={setRows}
          rows={rows}
          setFormValues={setFormValues}
          setFormAction={setFormAction}
          modalAction={modalAction}
          handleDelete={handleDelete}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setOffset={setOffset}
          rowCount={rowCount}
        />
      )}

      <SnackBar />
    </div>
  );
};

export default Consignee;
