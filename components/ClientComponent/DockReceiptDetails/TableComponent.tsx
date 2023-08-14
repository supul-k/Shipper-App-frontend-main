import React, { Dispatch, SetStateAction, useState, useEffect, SyntheticEvent } from "react";
import { IContainerResponse, ICarFormValues, ICarData } from "../../../Types/containerTypes";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "semantic-ui-react";
import { fetchCars } from "../../../actions/container";
import { IDockReceipt_FORM, IEffectSection } from "../../../Types/dockReceiptTypes";

type IProps = {
  rows: IContainerResponse[];
  setRows: Dispatch<SetStateAction<IContainerResponse[]>>;
  page: number;
  rowsPerPage: number;
  rowCount: number;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
  setPage: Dispatch<SetStateAction<number>>;
  setOffset: Dispatch<SetStateAction<number>>;
  setCarsFormValues: Dispatch<SetStateAction<ICarFormValues[]>>;
  carFormValues: ICarFormValues[];
  setViewIsLoading: Dispatch<SetStateAction<boolean>>;
  SetIsSelected: Dispatch<SetStateAction<boolean>>;
  setFormValues: Dispatch<SetStateAction<IDockReceipt_FORM>>;
  setEffectSection: Dispatch<SetStateAction<IEffectSection>>;
  data: ICarData[];
  setData: Dispatch<SetStateAction<ICarData[]>>;
};

const columns = [
  {
    id: "actions",
    label: "",
    minWidth: 170,
  },
  { id: "date_added", label: "Date", minWidth: 170 },
  { id: "full_name", label: "Customer Name", minWidth: 100 },
  {
    id: "personal_effect",
    label: "Personal Effect",
    minWidth: 190,
  },
  {
    id: "container_content",
    label: "Container Content",
    minWidth: 190,
  },
  {
    id: "container_type",
    label: "Container Type",
    minWidth: 170,
  },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 340,
  },
});

const TableComponent = ({
  rows,
  page,
  setRows,
  rowsPerPage,
  setRowsPerPage,
  setPage,
  setOffset,
  rowCount,
  setCarsFormValues,
  setViewIsLoading,
  setFormValues,
  setEffectSection,
  carFormValues,
  data,
  setData,
  SetIsSelected,
}: IProps) => {
  const classes = useStyles();
  const [serverHasSeveredPage, setServerHasSeveredPage] = useState(false);

  useEffect(() => {
    setServerHasSeveredPage(true);
  }, []);

  const handleContainerContent = (personalEffect: string, content: string) => {
    if (personalEffect === "" && content === "cars") {
      return <span style={{ color: "#fff", backgroundColor: "brown", borderRadius: 10, padding: 5 }}>Cars</span>;
    } else if (personalEffect !== "" && content === "cars") {
      return <span style={{ color: "#fff", backgroundColor: "#000", borderRadius: 10, padding: 5 }}>Personal Effect and Cars</span>;
    } else if (content === "" && personalEffect !== "") {
      return <span style={{ color: "#fff", backgroundColor: "blue", borderRadius: 10, padding: 5 }}>Personal Effect</span>;
    }
  };

  const handleContainerType = (value: string) => {
    if (value === "roro") {
      return <span style={{ color: "#000", backgroundColor: "pink", borderRadius: 10, padding: 5 }}>Roro</span>;
    } else {
      return <span style={{ color: "#fff", backgroundColor: "green", borderRadius: 10, padding: 5 }}>Regular</span>;
    }
  };

  const handleView = async (e: SyntheticEvent, indexId: number) => {
    const rowCopy = { ...rows[indexId] };
    const copy = {} as IEffectSection;
    copy["measurement"] = rowCopy.measurement;
    copy["weight"] = rowCopy.weight;
    copy["personal_effect"] = rowCopy.personal_effect;
    setEffectSection(copy);
    setViewIsLoading(true);
    const result: any = await fetchCars(rowCopy.id);
    setViewIsLoading(false);
    setFormValues((prev: any) => {
      return { ...prev, ["container_id"]: rowCopy.id, ["total_weight"]: rowCopy.total_weight };
    });
    setCarsFormValues(result);

    const copyData = [];
    for (let i = 0; i < result.length; i++) {
      copyData.push({
        carDetails: result[i].details,
        weight: result[i].weight as number,
        measurement: result[i].measurement as number,
      });
    }
    SetIsSelected(true);
    setData(copyData);
  };

  const renderActionButtons = (indexId: number) => {
    return (
      <Button.Group>
        <Button onClick={(e) => handleView(e, indexId)} primary>
          View cars
        </Button>
      </Button.Group>
    );
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event: any, newPage: any) => {
    const value = rowsPerPage * newPage;
    setPage(newPage);
    setOffset(value);
  };

  const renderData = (column: any, row: any) => {
    if (column === "container_content") {
      return handleContainerContent(row["personal_effect"], row["container_content"]);
    } else if (column === "personal_effect") {
      return <div style={{ width: 400 }}>{row[column]}</div>;
    } else if (column === "container_type") {
      return handleContainerType(row[column]);
    } else if (column === "date_added") {
      return moment(row[column]).format("MM/DD/YYYY");
    } else {
      return row[column];
    }
  };

  return (
    <div>
      {serverHasSeveredPage && (
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
                        return (
                          <TableCell key={`${index}-row2`} align={column.align}>
                            {renderData(column.id, row)}
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
      )}
    </div>
  );
};

export default TableComponent;
