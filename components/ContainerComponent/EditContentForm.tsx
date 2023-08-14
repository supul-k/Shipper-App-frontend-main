import React, { Dispatch, SetStateAction } from "react";
import CustomerForm from "./EditForms/CutomerForm";
import { IContainerResponse } from "../../Types/containerTypes";
import { IClientResponse } from "../../Types/clientTypes";
import ContentForm from "./EditForms/ContentForm";
import ContainerType from "./EditForms/ContainerType";
import { Form, TextArea } from "semantic-ui-react";

type IProps = {
  editFormValues: IContainerResponse;
  setEditFormValues: Dispatch<SetStateAction<IContainerResponse>>;
  customerData: IClientResponse[];
};

const EditContentForm = ({ editFormValues, customerData, setEditFormValues }: IProps) => {
  return (
    <div style={{ padding: 20 }}>
      <CustomerForm formValues={editFormValues} setFormValues={setEditFormValues} customerData={customerData} />
      <p>
        <strong>Container Details</strong>
      </p>
      <div>
        <ContentForm setFormValues={setEditFormValues} editFormValues={editFormValues} />
        <ContainerType setFormValues={setEditFormValues} editFormValues={editFormValues} />
      </div>
      <Form style={{ marginTop: 20 }}>
        <span>Personal Effect</span>
        <TextArea
          placeholder="Personal effect content here"
          style={{ minHeight: 100 }}
          onChange={(e, data) => {
            setEditFormValues((prev: any) => {
              return {
                ...prev,
                ["personal_effect"]: data.value,
              };
            });
          }}
          value={editFormValues.personal_effect}
        />
      </Form>
    </div>
  );
};

export default EditContentForm;
