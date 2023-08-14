import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  IContainerResponse,
  ICarFormValues,
  ICarData,
} from "../../../Types/containerTypes";
import { fetchContainerByCustomerId } from "../../../actions/dockReceipts";
import {
  IDockReceipt_FORM,
  IDockReceipt_Response,
  IEffectSection,
} from "../../../Types/dockReceiptTypes";
import TableComponent from "./TableComponent";
import { fetchCars } from "../../../actions/container";

type IProps = {
  formValues: IDockReceipt_FORM;
  setFormValues: Dispatch<SetStateAction<IDockReceipt_FORM>>;
  setCarsFormValues: Dispatch<SetStateAction<ICarFormValues[]>>;
  carFormValues: ICarFormValues[];
  setViewIsLoading: Dispatch<SetStateAction<boolean>>;
  SetIsSelected: Dispatch<SetStateAction<boolean>>;
  setEffectSection: Dispatch<SetStateAction<IEffectSection>>;
  rows: IContainerResponse[];
  setRows: Dispatch<SetStateAction<IContainerResponse[]>>;
  data: ICarData[];
  setData: Dispatch<SetStateAction<ICarData[]>>;
  formAction: string;
};

const Container = ({
  formValues,
  setFormValues,
  setCarsFormValues,
  setViewIsLoading,
  setRows,
  rows,
  setEffectSection,
  data,
  setData,
  carFormValues,
  formAction,
  SetIsSelected,
}: IProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [offset, setOffset] = useState<number>(0);
  const [rowCount, setRowCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const { data, count }: any = await fetchContainerByCustomerId(
        formValues.customer_id,
        offset,
        rowsPerPage
      );

      setIsLoading(false);
      setRowCount(count);
      setRows(data);
    };
    formValues.customer_id !== 0 && fetch();
  }, [rowsPerPage, offset, formValues.customer_id]);

  useEffect(() => {
    const handleCarEditData = async () => {
      if (formAction === "edit") {
        const result: any = await fetchCars(formValues.container_id);
        setCarsFormValues(result);
        const copyData = [];
        for (let i = 0; i < result.length; i++) {
          copyData.push({
            carDetails: result[i].details,
            weight: result[i].weight as number,
            measurement: result[i].measurement as number,
          });
        }

        setData(copyData);
      }
    };
    handleCarEditData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <TableComponent
        rows={rows}
        rowsPerPage={rowsPerPage}
        page={page}
        setRowsPerPage={setRowsPerPage}
        setPage={setPage}
        setOffset={setOffset}
        rowCount={rowCount}
        setRows={setRows}
        setViewIsLoading={setViewIsLoading}
        setCarsFormValues={setCarsFormValues}
        setFormValues={setFormValues}
        setEffectSection={setEffectSection}
        data={data}
        setData={setData}
        carFormValues={carFormValues}
        SetIsSelected={SetIsSelected}
      />
    </div>
  );
};

export default Container;
