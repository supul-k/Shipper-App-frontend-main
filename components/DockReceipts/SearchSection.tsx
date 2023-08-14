import React, { SyntheticEvent, Dispatch, SetStateAction, ChangeEvent } from "react";
import { Button, Input } from "semantic-ui-react";
import { IDockReceipt_Response } from "../../Types/dockReceiptTypes";
import { fetchDockReceipts, dockReceiptFullTextSearchAPI } from "../../actions/dockReceipts";

type IProps = {
  openModalForm: (e: SyntheticEvent) => void;
  setRows: Dispatch<SetStateAction<IDockReceipt_Response[]>>;
  setRowCount: Dispatch<SetStateAction<number>>;
};

const SearchSection = ({ openModalForm, setRows, setRowCount }: IProps) => {
  const handleSearch = async ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    if (value === "") {
      const { data, count }: any = await fetchDockReceipts(0, 10);
      setRows(data);
      setRowCount(count);
    } else {
      dockReceiptFullTextSearchAPI(value).then(({ data, count }: any) => {
        setRows(data);
        setRowCount(count);
      });
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Input icon="search" placeholder="Search..." style={{ width: 400, marginRight: 10 }} onChange={handleSearch} />
      <Button primary onClick={openModalForm}>
        New Dock Receipts
      </Button>
    </div>
  );
};

export default SearchSection;
