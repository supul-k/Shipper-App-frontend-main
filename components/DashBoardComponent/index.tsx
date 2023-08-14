import React from "react";
import { Button } from "semantic-ui-react";

const DashBoardComponent = (): JSX.Element => {
  return (
    <div style={{ textAlign: "center", width: 600, margin: "auto", marginTop: 200 }}>
      <p style={{ fontSize: 30 }}>
        <strong>Welcome to OldSailor Ocean Shipping DB Base more to come on this page. Mean while let's get started by adding your client</strong>
      </p>
      <Button
        primary
        onClick={() => {
          window.location.href = "/clients";
        }}
      >
        Add Clients
      </Button>
    </div>
  );
};

export default DashBoardComponent;
