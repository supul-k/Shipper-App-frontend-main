import React, { useEffect, useState, useRef } from "react";
import { fetchToPrintNra } from "../../actions/poa_nra";
import { useRouter } from "next/router";
import { IPOANRA_Response } from "../../Types/poaNraTypes";
import Head from "next/head";
import moment from "moment";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ReactToPrint from "react-to-print";
import Link from "next/link";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginLeft: 194,
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  })
);
const PrintNra = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [row, setRow] = useState<any>({} as any);
  const router = useRouter();
  const classes = useStyles();
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetch = async () => {
      const id = router.query.id as unknown;
      const value = id as number;
      setIsLoading(true);
      const data: any = await fetchToPrintNra(value);
      setIsLoading(false);
      setRow(data);
    };
    fetch();
  }, []);
  return (
    <div>
      <header>
        <title>{row.customer_name}(NRA)</title>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="/js/html2pdf.js"></script>
        <style jsx>
          {`
            body {
              font-size: 17px;
            }
          `}
        </style>

        <style media="print" jsx>
          {`
            #d {
              display: none;
            }
          `}
        </style>
      </header>

      <body>
        <br />
        <div id="element-to-print">
          <div className="container" ref={componentRef}>
            <div className="i_1">
              <p>
                <b>From:</b>OLDSAILORS OCEAN SHIPPING LLC
              </p>
              <p>
                <b>To:</b> {row.customer_name}
              </p>
              <p>
                <b>Attn:</b> {row.customer_name}
              </p>
              <p>
                <b>
                  To accept this NRA:
                  <br />
                  1. REPLY &nbsp; ALL &nbsp; to this original email message.
                  <br />
                  2. Add the word "ACCEPT" to the SUBJECT &nbsp; LINE &nbsp; or
                  to the first line of your REPLY &nbsp;ALL&nbsp;message.
                  <br />
                  We are pleased to offer the following NVOCC Negotiated Rate
                  Arrangement (NRA).
                  <br />
                  <br />A confirmation email will be sent to you promptly. If
                  this NRA Offer is not accepted before the container is
                  delivered to the port, then the offer is deemed to be
                  withdrawn. This NRA Offer cannot be accepted if this message
                  is forwarded or modified in any way. Due to FMC regulations,
                  once accepted, the terms of the resulting NRA may not be
                  amended. Please reference the following NRA number on all
                  documents for the shipment(s) moved under this NRA.
                </b>
              </p>
            </div>
            <div className="i_2">
              <div className="row">
                <div className="col-md-12">
                  <p style={{ fontSize: 20 }}>
                    {" "}
                    <br />
                    <b>NRA No: WPOCNG_{row.id}</b>
                    <br />
                  </p>
                  <p>Effective: {moment(row.effective_date).format("l")}</p>
                  <p>Expiration: {moment(row.expiration_date).format("l")}</p>
                  <p>Reference: DJNHNI_{row.customer_id}</p>
                  <br />
                  <p style={{ fontSize: 17 }}>
                    <b>Company Name: OLDSAILORS OCEAN SHIPPING LLC</b>
                    <br />
                  </p>
                  <p>Carrier Rep: {row.carrier_rep}</p>
                  <p>Email: info@oldsailorsshippingonline.com</p>
                  <p>Phone: 301-213-6961</p>
                  <p>Fax: 415-795-4544</p>
                  <p>
                    Address: 13903 CHADSWORTH TERRACE, Laurel, MD 20707, USA{" "}
                  </p>
                  <p>FMC-OTI No: 026435N </p>
                  <br />
                  <p>
                    <b>SHIPPER: {row.customer_name}</b>
                  </p>
                  <p>Email: {row.email}</p>
                  <p>Contact: {row.phone_number}</p>
                  <p>Tax ID/EIN #: {row.irs_tax_id}</p>
                </div>
              </div>
            </div>

            <div className="i_3 ">
              <br />
              <br />
              <p>
                <b>Origin and Destination Locations</b>
              </p>
              <div className="row">
                <div
                  className="col-md-12"
                  style={{ border: "1px solid #bdbdbd  " }}
                >
                  <p>
                    <b>Bill of Lading Origin(s): </b>
                    {row.bill_of_lading_origin}
                  </p>
                  <hr />
                  <p>
                    <b>Ocean Port (s) of Loading (Origin VIA):</b>{" "}
                    {row.ocean_port_of_loading}
                  </p>
                  <hr />
                  <p>
                    <b>Bill of Lading Destination:</b>{" "}
                    {row.bill_of_lading_destination}
                  </p>
                  <hr />
                  <br />
                  <p>
                    <b>Ocean Port (s) of Discharge (Destination VIA):</b>{" "}
                    {row.ocean_port_of_discharge}
                  </p>
                </div>
                <p style={{ fontSize: 17 }}>
                  <b>Origin and Destination Locations</b>
                </p>
                <div
                  className="col-md-12"
                  style={{ border: "1px solid #bdbdbd  " }}
                >
                  <p>
                    <b>Rate:</b> {row.rate}
                  </p>
                  <hr />
                  <p>
                    <b>Rate Basis:</b> {row.rate_basis}
                  </p>
                  <hr />
                  <p>
                    <b>Cargo Quantity:</b> {row.cargo_qty}
                  </p>
                  <hr />
                  <p>
                    <b>Minimum:</b> {row.minimum}
                  </p>
                  <hr />
                  <p>
                    <b>Maximum:</b> {row.maximum}
                  </p>
                  <hr />
                  <p>
                    <b>Origin Service:</b> {row.origin_service}
                  </p>
                  <hr />
                  <p>
                    <b>Destination Service:</b> {row.destination_service}
                  </p>
                </div>
              </div>
              <br />
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Commodity </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Applicable Rules / Surcharges </td>
                    <td>
                      <span>Rule 2-150 - DOCUMENTATION FEES</span> <br />
                      <span>Rule 2-16 0 - AMS CHARGES</span> <br />
                      <span>Rule 2-18 0 - AES/SED HANDLING FEE</span> <br />
                      <span>
                        Rule 2-19 0 - EU ENTRY SUMMARY DECLARATION CHARGE (ENS)
                      </span>{" "}
                      <br />
                      <span>
                        Rule 2-20 0 - JAPAN ADVANCE MANIFEST FILING RULES FEE
                        (AFR)
                      </span>{" "}
                      <br />
                      <span>Rule 10 -0 10 - NON-RUNNER SURCHARGE</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="html2pdf__page-break"></div>
              <p>
                <b>Special Conditions</b>
              </p>
              <div style={{ border: "1px solid #bdbdbd", padding: 10 }}>
                <p>{row.special_conditions}</p>
              </div>
              <br />
              <p>
                <b>Basic Conditions</b>
              </p>
              <br />
              <div style={{ border: "1px solid #bdbdbd", padding: 10 }}>
                <p>
                  1. Service provided pursuant to this NRA is subject to
                  Carrier's governing rules tariff, which is accessible at at
                  www.oldsailorsshipping.com/tariff in compliance with FMC
                  Regulations as provided in 46 CFR 532.7.
                </p>
                <p>
                  2. This NRA is assigned a unique NRA number which is shown
                  above .
                </p>
                <p>
                  3. Except as otherwise provided in this NRA, all rates agreed
                  in this NRA are subject to surcharges and assesso rials as
                  published in Carrier's governing tariff rules. The surcharges
                  and assessorials that will be applied to each NRA are those
                  that are in effect as of the date the first shipment under
                  each NRA is received by Carrier, and such surcharges and
                  assessorials shall remain fixed at that level for the period
                  the NRA is in effect.
                </p>
                <p>
                  4. The NRA shipper and Carrier agree that the shipper's
                  identity, the rates, charges, terms and conditions offered and
                  /or agreed in an NRA shall be kept confidential from any other
                  shipper carrier. Any breach of this confidentiality agreement
                  may give rise to a cause of action for actual damages proven
                  to result from such breach of confidentiality.
                </p>
                <p>
                  5. This Negotiated Rate Arrangement (NRA) is made and
                  concluded between the NVOCC named here in, here
                  inafterreferred to as " NVOCC", and the NRA Shipper named here
                  in, where by the parties mutually agree asset forth in this
                  NRA. The parties have executed this NRA through their
                  responsible representatives duly authorized as of the dates
                  noted in this NRA. By executing this NRA, the shipper's
                  representative as named here in here by certifies he /she is
                  duly authorized by the NRA Shipper to authorize NRA Shipper's
                  agreement to this NRA.
                </p>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className={classes.root}>
            <ReactToPrint
              trigger={() => (
                <Button
                  variant="contained"
                  style={{
                    margin: "10px",
                    padding: "8px",
                    borderRadius: "5px",
                    backgroundColor: "#17a2b8",
                    borderColor: "#17a2b8",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Generate Document
                </Button>
              )}
              content={() => componentRef.current}
              //onAfterPrint={() => setEmailButtonHidden(false)}
              documentTitle={`${row.customer_name}(NRA)`}
              pageStyle={
                "@media print { body { -webkit-print-color-adjust: exact; } @page { size: A4; margin: 200mm !important }}"
              }
            />
            <Button
              variant="contained"
              style={{
                margin: "10px",
                padding: "8px 20px",
                borderRadius: "5px",
                backgroundColor: "#28a745",
                borderColor: "#28a745",
                color: "white",
                fontWeight: "bold",
              }}
              //hidden={emailButtonHidden}
              href={`mailto:${row.email}`}
            >
              Send Email
            </Button>

            <Button
              variant="contained"
              style={{
                margin: "10px",
                padding: "8px",
                borderRadius: "5px",
                backgroundColor: "#ffc107",
                borderColor: "#ffc107",
                color: "black",
                fontWeight: "bold",
              }}
              onClick={() => window.close()}
            >
              Cancel
            </Button>
          </div>
          <br />
          <br />
          <br />
        </div>

        <script
          defer
          src="https://use.fontawesome.com/releases/v5.0.9/js/all.js"
          integrity="sha384-8iPTk2s/jMVj81dnzb/iFR2sdA7u06vHJyyLlAd4snFpCl/SnyUjRrbdJsw1pGIl"
          crossOrigin="anonymous"
        ></script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>

        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
        <script src="/js/cargo.js"></script>
      </body>
    </div>
  );
};

export default PrintNra;
