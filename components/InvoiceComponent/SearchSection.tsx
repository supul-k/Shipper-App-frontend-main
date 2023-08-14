import React, { SyntheticEvent, Dispatch, SetStateAction, ChangeEvent } from "react";
import { Button, Input } from "semantic-ui-react";
import { IInvoice_Response } from "../../Types/invoiceTypes";
import { fetchInvoice, invoiceFullTextSearchAPI } from "../../actions/invoice";

type IProps = {
  openModalForm: (e: SyntheticEvent) => void;
  setRows: Dispatch<SetStateAction<IInvoice_Response[]>>;
  setRowCount: Dispatch<SetStateAction<number>>;
};

const SearchSection = ({ openModalForm, setRows, setRowCount }: IProps) => {
  const handleSearch = async ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    if (value === "") {
      const { data, count }: any = await fetchInvoice(0, 10);
      setRows(data);
      setRowCount(count);
    } else {
      invoiceFullTextSearchAPI(value).then(({ data, count }: any) => {
        setRows(data);
        setRowCount(count);
      });
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Input icon="search" placeholder="Search..." style={{ width: 400, marginRight: 10 }} onChange={handleSearch} />
      <Button primary onClick={openModalForm}>
        New Invoice
      </Button>
    </div>
  );
};

export default SearchSection;
