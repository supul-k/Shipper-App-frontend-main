import React, { useState, SyntheticEvent, useEffect } from "react";
import { useRouter } from "next/router";
import { getCookie } from "../../utils/cookie";
import { Input, Menu, Divider, Dropdown } from "semantic-ui-react";
import { fetchCustomers } from "../../actions/customer";

const onDownload = (action: number) => {
  const link = document.createElement("a");
  if (action == 1) {
    link.download = `AUTHORIZATION TO EXPORT VEHICLE customs.docx`;
    link.href = "../AUTHORIZATION TO EXPORT VEHICLE customs.docx";
    link.click();
  } else if (action == 2) {
    link.download = `AUTHORIZATION TO EXPORT VEHICLE own.docx`;
    link.href = "../AUTHORIZATION TO EXPORT VEHICLE own.docx";
    link.click();
  } else if (action == 3) {
    link.download = `Authorization to Prepare Electronic Export Information.docx`;
    link.href =
      "../Authorization to Prepare Electronic Export Information.docx";
    link.click();
  } else if (action == 4) {
    link.download = `Charleston_Letter_of_Intent.doc`;
    link.href = "../Charleston_Letter_of_Intent.doc";
    link.click();
  } else if (action == 5) {
    link.download = `Drain and Disconnect.docx`;
    link.href = "../Drain and Disconnect.docx";
    link.click();
  } else if (action == 6) {
    link.download = `Letterhead.docx`;
    link.href = "../Letterhead.docx";
    link.click();
  } else if (action == 7) {
    link.download = `values.pdf`;
    link.href = "../values.pdf";
    link.click();
  } else if (action == 8) {
    link.download = `sc.pdf`;
    link.href = "../sc.pdf";
    link.click();
  } else if (action == 9) {
    link.download = `oti.pdf`;
    link.href = "../oti.pdf";
    link.click();
  } else if (action == 10) {
    link.download = `OTI Legal Disclaimer of Cargo Ownership.docx`;
    link.href = "../OTI Legal Disclaimer of Cargo Ownership.docx";
    link.click();
  } else if (action == 11) {
    link.download = `OLDSAILORS  POWER OF ATTORNEY.docx`;
    link.href = "../OLDSAILORS  POWER OF ATTORNEY.docx";
    link.click();
  } else if (action == 12) {
    link.download = `SAMPLE DOC RECEITE.doc`;
    link.href = "../SAMPLE DOC RECEITE.doc";
    link.click();
  }
  else if (action == 13) {
    link.download = `Letterhead_Header_FooterNEW.docx`;
    link.href = "../Letterhead_Header_FooterNEW.docx";
    link.click();
  }
};

export default function HeaderComponent(this: any) {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("");

  const handleRouteChange = (route: string) => {
    if (getCookie() !== "") {
      // router.push(`/${route}`, undefined, { shallow: true });
      window.location.href = route;
    } else {
      window.location.href = "/signin?session=expired";
    }
  };

  const handleItemClick = (e: SyntheticEvent, { name }: any) => {
    if (name === "home") {
      setActiveItem(name);
      handleRouteChange("/");
    } else if (name === "POA/NRA Contract") {
      setActiveItem("poa_nra");
      handleRouteChange("poa_nra");
    } else if (name === "Booking Confirmation") {
      setActiveItem("booking_confirmation");
      handleRouteChange("booking_receipts");
    } else if (name === "Dock Receipts") {
      setActiveItem("dock_receipts");
      handleRouteChange("dock_receipts");
    } else if (name === "Invoice") {
      setActiveItem("invoice");
      handleRouteChange("invoice");
    } else if (name === "Change Password") {
      setActiveItem("changepassword");
      handleRouteChange("changepassword");
    } else {
      setActiveItem(name);
      handleRouteChange(name);
    }
  };

  return (
    <Menu secondary style={{ padding: 20 }}>
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
      />
      <Menu.Item
        name="clients"
        active={activeItem === "clients"}
        onClick={handleItemClick}
      />

      <Menu.Item
        name="consignee"
        active={activeItem === "consignee"}
        onClick={handleItemClick}
      />
      <Menu.Item
        name="POA/NRA Contract"
        active={activeItem === "poa_nra"}
        onClick={handleItemClick}
      >
        POA/NRA Contract
      </Menu.Item>

      <Menu.Item
        name="container"
        active={activeItem === "container"}
        onClick={handleItemClick}
      />
      <Menu.Item
        name="Booking Confirmation"
        active={activeItem === "booking_confirmation"}
        onClick={handleItemClick}
      />
      <Menu.Item
        name="Dock Receipts"
        active={activeItem === "dock_receipts"}
        onClick={handleItemClick}
      />
      <Menu.Item
        name="Invoice"
        active={activeItem === "invoice"}
        onClick={handleItemClick}
      />
      <Dropdown item text="Others">
        <Dropdown.Menu>
          <Dropdown.Item
            onClick={() => {
              onDownload(8);
            }}
          >
            Shipment Checklist
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              onDownload(9);
            }}
          >
            oti legal disclaime
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              onDownload(7);
            }}
          >
            values
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              onDownload(1);
            }}
          >
            AUTHORIZATION TO EXPORT VEHICLE customs
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              onDownload(2);
            }}
          >
            AUTHORIZATION TO EXPORT VEHICLE own
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              onDownload(3);
            }}
          >
            Authorization to Prepare Electronic Export Information
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              onDownload(4);
            }}
          >
            Charleston_Letter_of_Intent
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              onDownload(5);
            }}
          >
            Drain and Disconnect
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              onDownload(6);
            }}
          >
            Letterhead
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              onDownload(10);
            }}
          >
            OTI Legal Disclaimer of Cargo Ownership
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              onDownload(11);
            }}
          >
            OLDSAILORS POWER OF ATTORNEY
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              onDownload(12);
            }}
          >
            SAMPLE DOC RECEITE
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              onDownload(13);
            }}
          >
            NEW LETTERHEAD WITH FOOTER
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown item text="Profile">
        <Dropdown.Menu>
          <Dropdown.Item>
            <Menu.Item
              name="Change Password"
              active={activeItem === "changePassword"}
              onClick={handleItemClick}
            />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu>
  );
}
{
  /* <Menu.Menu position="right">
<Menu.Item>
  <Input icon="search" placeholder="Search..." />
</Menu.Item>
<Menu.Item name="logout" active={activeItem === "logout"} onClick={handleItemClick} />
</Menu.Menu> */
}
