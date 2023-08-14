import React, { SyntheticEvent, SetStateAction, Dispatch, ChangeEvent } from "react";
import { Button, Input } from "semantic-ui-react";
import { IClientResponse } from "../../Types/clientTypes";
import { consigneeFullTextSearchAPI, fetchConsignee } from "../../actions/consignee";

type IProps = {
  openModalForm: (e: SyntheticEvent) => void;
  setRows: Dispatch<SetStateAction<IClientResponse[]>>;
  setRowCount: Dispatch<SetStateAction<number>>;
};

const SearchSection = ({ openModalForm, setRows, setRowCount }: IProps) => {
  const handleSearch = async ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    if (value === "") {
      const { data, count }: any = await fetchConsignee(0, 10);
      setRows(data);
      setRowCount(count);
    } else {
      consigneeFullTextSearchAPI(value).then(({ data, count }: any) => {
        setRows(data);
        setRowCount(count);
      });
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Input icon="search" placeholder="Search..." style={{ width: 400, marginRight: 10 }} onChange={handleSearch} />
      <Button primary onClick={openModalForm}>
        New Consignee
      </Button>
    </div>
  );
};

export default SearchSection;
