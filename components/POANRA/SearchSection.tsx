import React, { SyntheticEvent, Dispatch, SetStateAction, ChangeEvent } from "react";
import { Button, Input } from "semantic-ui-react";
import { IPOANRA_Response } from "../../Types/poaNraTypes";
import { poa_nraFullTextSearchAPI, fetchPONRA } from "../../actions/poa_nra";

type IProps = {
  openModalForm: (e: SyntheticEvent) => void;
  setRows: Dispatch<SetStateAction<IPOANRA_Response[]>>;
  setRowCount: Dispatch<SetStateAction<number>>;
};

const SearchSection = ({ openModalForm, setRows, setRowCount }: IProps) => {
  const handleSearch = async ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    if (value === "") {
      const { data, count }: any = await fetchPONRA(0, 10);
      setRows(data);
      setRowCount(count);
    } else {
      poa_nraFullTextSearchAPI(value).then(({ data, count }: any) => {
        setRows(data);
        setRowCount(count);
      });
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Input icon="search" placeholder="Search..." style={{ width: 400, marginRight: 10 }} onChange={handleSearch} />
      <Button primary onClick={openModalForm}>
        New POA/NRA
      </Button>
    </div>
  );
};

export default SearchSection;
