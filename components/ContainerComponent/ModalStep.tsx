import React from "react";
import { Icon, Step } from "semantic-ui-react";
import { IStep } from "../../Types/containerTypes";

type IProps = {
  step: IStep[];
};

const ModalStep = ({ step }: IProps) => {
  const renderStep = () => (
    <Step.Group>
      {step.map(
        (result, index) =>
          result.display && (
            <Step disabled={result.disabled} key={index} active={result.active}>
              <Step.Content>
                <Step.Title>{result.title}</Step.Title>
                <Step.Description>{result.description}</Step.Description>
              </Step.Content>
            </Step>
          )
      )}
    </Step.Group>
  );
  return <div style={{ textAlign: "center" }}>{renderStep()}</div>;
};

export default ModalStep;
