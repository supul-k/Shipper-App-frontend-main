import React, { Dispatch, SetStateAction } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { Button } from "semantic-ui-react";
import { IConsigneeForm, IConsigneeResponse } from "../../Types/consigneeTypes";

const columns = [
  { id: "full_name", label: "Full name", minWidth: 170 },
  { id: "phone_number", label: "Tel", minWidth: 100 },
  {
    id: "email",
    label: "Email",
    minWidth: 170,
  },
  {
    id: "address",
    label: "Address",
    minWidth: 170,
  },
  {
    id: "city",
    label: "City",
    minWidth: 170,
  },
  {
    id: "state",
    label: "State",
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
    maxHeight: 640,
  },
});

type IProps = {
  rows: Array<IConsigneeResponse>;
  setRows: Dispatch<SetStateAction<IConsigneeResponse[]>>;
  setFormValues: Dispatch<SetStateAction<IConsigneeForm>>;
  setFormAction: Dispatch<SetStateAction<string>>;
  modalAction: (tittle: string, display: boolean, isDelete: boolean) => void;
  handleDelete: (indexId: number) => void;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  rowsPerPage: number;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
  setOffset: Dispatch<SetStateAction<number>>;
  rowCount: number;
};

const ClientComponent = ({
  rows,
  setRows,
  setFormValues,
  setFormAction,
  modalAction,
  handleDelete,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  setOffset,
  rowCount,
}: IProps) => {
  const classes = useStyles();

  const handleChangePage = (event: any, newPage: any) => {
    const value = rowsPerPage * newPage;
    setPage(newPage);
    setOffset(value);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (indexId: number) => {
    const newData: any = {
      ...rows[indexId],
      indexId: indexId,
    };
    setFormValues(newData);
    setFormAction("edit");
    modalAction("Edit " + rows[indexId].full_name, true, false);
  };

  const renderActionButtons = (indexId: number) => {
    return (
      <Button.Group>
        <Button onClick={(e) => handleEdit(indexId)} primary>
          Edit
        </Button>
        <Button color="red" onClick={() => handleDelete(indexId)}>
          Delete
        </Button>
      </Button.Group>
    );
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column: any, index) => (
                <TableCell key={`${index}-header`} align={column.align} style={{ minWidth: column.minWidth, backgroundColor: "#EDE7F6" }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any, indexId: number) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={`${indexId}-row1`}>
                  {columns.map((column: any, index: number) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={`${index}-row2`} align={column.align}>
                        {value}
                        {column.id === "actions" && renderActionButtons(indexId)}
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
  );
};

export default ClientComponent;
