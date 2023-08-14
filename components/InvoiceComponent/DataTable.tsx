import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useState,
} from "react";
import {
  makeStyles,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from "@material-ui/core";
import { IInvoice_Response } from "../../Types/invoiceTypes";
import { Button } from "semantic-ui-react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { handleModal } from "../../store/actions/modal";
import ModalComponent from "../ModalComponent";
import { ISnackBar, handleSnackBar } from "../../store/actions/snackBar";
import { handleDeleteInvoice_API } from "../../actions/invoice";
import SnackBar from "../SnackBar";

const columns = [
  { id: "date_added", label: "Date Added", minWidth: 170 },
  { id: "customer_name", label: "Customer name", minWidth: 100 },
  {
    id: "container_number",
    label: "Container number",
    minWidth: 170,
  },
  {
    id: "booking_number",
    label: "Booking number",
    minWidth: 170,
  },
  {
    id: "actions",
    label: "",
    minWidth: 170,
  },
];
const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 570,
  },
});

type IProps = {
  rows: IInvoice_Response[];
  setRows: Dispatch<SetStateAction<IInvoice_Response[]>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  rowsPerPage: number;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
  setIndexToEdit: Dispatch<SetStateAction<number>>;
  setOffset: Dispatch<SetStateAction<number>>;
  setPageIsLoading: Dispatch<SetStateAction<boolean>>;
  setFormAction: Dispatch<SetStateAction<string>>;
  rowCount: number;
  openModalForm: (e: SyntheticEvent) => void;
  setFormValues: Dispatch<SetStateAction<IInvoice_Response>>;
  formValues: IInvoice_Response;
};

const DataTable = ({
  rows,
  page,
  setRows,
  rowsPerPage,
  setRowsPerPage,
  setPage,
  setOffset,
  rowCount,
  setPageIsLoading,
  openModalForm,
  setFormAction,
  setIndexToEdit,
  setFormValues,
  formValues,
}: IProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const modalState = useSelector((state: any) => state.modalReducer);
  const [indexToDelete, setIndexToDelete] = useState<number>(0);

  const handleChangePage = (event: any, newPage: any) => {
    const value = rowsPerPage * newPage;
    setPage(newPage);
    setOffset(value);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (e: SyntheticEvent, indexId: number) => {
    openModalForm(e);
    setFormAction("edit");
    setIndexToEdit(indexId);
  };

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

  const handleDelete = (indexId: number) => {
    setIndexToDelete(indexId);
    modalAction("Delete Data", true, true);
  };

  const renderActionButtons = (indexId: number) => {
    return (
      <Button.Group>
        <Button
          onClick={() => {
            const url = `/print_invoice?id=${rows[indexId].id}`;
            window.open(url, "_blank");
          }}
          secondary
        >
          Print
        </Button>
        <Button onClick={(e) => handleEdit(e, indexId)} primary>
          Edit
        </Button>
        <Button color="red" onClick={() => handleDelete(indexId)}>
          Delete
        </Button>
      </Button.Group>
    );
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
      setPageIsLoading(true);
      await handleDeleteInvoice_API(array[indexToDelete].id);
      setPageIsLoading(false);
      array.splice(indexToDelete, 1);
      setRows(array);
      modalAction("", false, false);
      snackObj.display_snackBar = true;
      snackObj.message = "Invoice deleted";
      dispatch(handleSnackBar(snackObj));
    } catch (e) {
      snackObj.display_snackBar = true;
      snackObj.message = "Error deleting Invoice";
      snackObj.isError = true;
      dispatch(handleSnackBar(snackObj));
      modalAction("", false, false);
    }
  };

  return (
    <div>
      {modalState.display_modal && (
        <ModalComponent confirmDelete={confirmDelete}></ModalComponent>
      )}
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column: any, index) => (
                  <TableCell
                    key={`${index}-header`}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      backgroundColor: "#EDE7F6",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row: any, indexId: number) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={`${indexId}-row1`}
                  >
                    {columns.map((column: any, index: number) => {
                      let value = row[column.id];

                      if (column.id === "date_added") {
                        value = moment(row[column.id]).format("MM/DD/YYYY");
                      }

                      return (
                        <TableCell key={`${index}-row2`} align={column.align}>
                          {value}
                          {column.id === "actions" &&
                            renderActionButtons(indexId)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rowCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <SnackBar />
    </div>
  );
};

export default DataTable;
