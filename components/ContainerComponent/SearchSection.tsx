import React, { SyntheticEvent, Dispatch, SetStateAction, ChangeEvent } from "react";
import { IContainerResponse } from "../../Types/containerTypes";
import { Button, Input } from "semantic-ui-react";
import { fetchContainer, containerFullTextSearchAPI } from "../../actions/container";

type IProps = {
  openModalForm: (e: SyntheticEvent) => void;
  setRows: Dispatch<SetStateAction<IContainerResponse[]>>;
  setRowCount: Dispatch<SetStateAction<number>>;
};

const SearchSection = ({ openModalForm, setRows, setRowCount }: IProps) => {
  const handleSearch = async ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    if (value === "") {
      const { data, count }: any = await fetchContainer(0, 10);
      setRows(data);
      setRowCount(count);
    } else {
      containerFullTextSearchAPI(value).then(({ data, count }: any) => {
        setRows(data);
        setRowCount(count);
      });
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Input icon="search" placeholder="Search..." style={{ width: 400, marginRight: 10 }} onChange={handleSearch} />
      <Button primary onClick={openModalForm}>
        New Container
      </Button>
    </div>
  );
};

export default SearchSection;
