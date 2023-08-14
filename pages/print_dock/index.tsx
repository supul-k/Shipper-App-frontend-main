import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { IBookingReceipt_Response } from "../../Types/bookingReceiptTypes";
import moment from "moment";
import { fetchToDockPrint } from "../../actions/dockReceipts";
import { fetchCars } from "../../actions/container";
import BillOfLadingSection from "../../components/BillOfLadingSection";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ReactToPrint from "react-to-print";

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
  const [carRow, setCarRow] = useState<any[]>([]);
  const [displayBillOfLading, setDisplayBillOfLading] = useState(false);
  const [displayShipAsAgent, setDisplayShipAsAgent] = useState(false);
  const router = useRouter();
  const classes = useStyles();
  const componentRef = useRef<HTMLDivElement>(null);
  const [textToRender, setTextToRender] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const id = router.query.id as unknown;
      const containerId = router.query.containerId as unknown;
      const billOflading = router.query.billOflading;
      const shipAsAgent = router.query.shipAsAgent;
      const value = id as number;
      const containerValue = containerId as number;
      setIsLoading(true);
      const data: any = await fetchToDockPrint(value);
      const carData: any = await fetchCars(containerValue);
      if (billOflading === "true") {
        setTextToRender("BILL OF LADING");
        setDisplayBillOfLading(true);
      } else if (shipAsAgent === "true") {
        setTextToRender("Shipping Instruction");
      } else {
        setTextToRender(
          data.container_type === "container" ? " DOCK RECEIPT" : "RORO RECEIPT"
        );
      }
      if (shipAsAgent === "true") {
        setDisplayShipAsAgent(true);
      }
      setRow(data);
      setCarRow(carData);
      setIsLoading(false);
    };
    fetch();
  }, []);
  return (
    <div>
      <header>
        <title>
          {row.customer_name} ({textToRender})
        </title>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="/js/html2pdf.js"></script>
        <style jsx global>
          {`
            body {
              font-size: 18px;
            }
            .h_1 {
              width: 100%;
              float: left;
            }

            .h_2 {
              padding: 10px;
              width: 100%;
              border: 1px solid #000;
              float: right;
              height: 150px;
              margin-top: 10px;
            }
            table,
            th,
            td {
              border: 1px solid black;
              padding: 5px;
              border-collapse: collapse;
            }
            th,
            td {
              text-align: center;
            }
          `}
        </style>
      </header>

      <body>
        <br />
        {!isLoading && (
          <div>
            <div
              id="element-to-print"
              className="element-to-print"
              ref={componentRef}
            >
              <div className="container">
                <div style={{ display: "inline-block" }}></div>
                <div style={{ display: "inline-block", float: "right" }}>
                  <span style={{ fontSize: 20 }}>
                    <b> {textToRender}</b>
                  </span>
                  <br />
                  <span style={{ fontSize: 12 }}>
                    Date: {moment(row.date_added).format("l")}
                  </span>
                </div>
                <br />
                <div className="row" style={{ marginTop: 40 }}>
                  <div style={{ borderTop: "1px solid #000", width: "100%" }}>
                    <div className="row">
                      <div
                        className="col-md-6"
                        style={{ borderRight: "1px solid #000" }}
                      >
                        {!displayShipAsAgent ? (
                          <div>
                            <b style={{ fontSize: 16 }}>SHIPPER/EXPORTER</b>
                            <br />
                            {row.client_as_agent ? (
                              <span style={{ fontSize: 16 }}>
                                {row.client_as_agent
                                  ? row.customer_name +
                                    "\nAS AGENT FOR OLDSAILORS OCEAN SHIPPING\n"
                                  : "OLDSAILORS OCEAN SHIPPING AS AGENT FOR \n" +
                                    row.customer_name}
                              </span>
                            ) : (
                              <span style={{ fontSize: 18 }}>
                                {row.customer_name},
                              </span>
                            )}{" "}
                            <br />
                            <span style={{ fontSize: 18 }}>
                              <span>
                                {row.cus_address !== "" ? (
                                  <span>
                                    {row.cus_address + ","}
                                    <br />
                                  </span>
                                ) : (
                                  ""
                                )}
                              </span>
                            </span>
                            <span style={{ fontSize: 18 }}>
                              {row.cus_city !== null ? row.cus_city + ", " : ""}
                            </span>
                            <span style={{ fontSize: 18 }}>
                              {row.cus_state !== null
                                ? row.cus_state + ","
                                : ""}
                            </span>
                            <br />
                            <span style={{ fontSize: 18 }}>
                              {row.cus_zipcode}, USA,
                            </span>
                            &nbsp; <br />
                            <span style={{ fontSize: 18 }}>
                              Tel:{row.phone_number}
                            </span>
                            <br />
                            <span style={{ fontSize: 18 }}>
                              Email:{row.email}
                            </span>
                            &nbsp;
                          </div>
                        ) : (
                          <div>
                            <b style={{ fontSize: 16 }}>SHIPPER/EXPORTER</b>
                            <br />
                            <div>
                              <span>OLDSAILORS OCEAN SHIPPING LLC </span>
                              <br />
                              <span>
                                13903 CHADSWORTH TERRACE, Laurel, MD 20707, USA
                              </span>
                              <br />
                              <span>301-213-6961</span>
                              <br />
                              <span>301-281-4034</span>
                              <br />
                              <span>info@oldsailorsshippingonline.com</span>
                              <br />
                            </div>
                          </div>
                        )}
                        <div style={{ borderTop: "1px solid #000" }}>
                          <b style={{ fontSize: 16 }}>CONSIGNEE</b>
                          <br />
                          <span style={{ fontSize: 18 }}>{row.con_name}</span>
                          <br />
                          <span style={{ fontSize: 18 }}>
                            <span>
                              {row.con_address !== "" ? (
                                <span>
                                  {row.con_address + ","}
                                  <br />
                                </span>
                              ) : (
                                ""
                              )}
                            </span>
                          </span>
                          <span style={{ fontSize: 18 }}>
                            <span>
                              {row.con_email !== "" ? (
                                <span>
                                  {row.con_email + ","}
                                  <br />
                                </span>
                              ) : (
                                ""
                              )}
                            </span>
                          </span>
                          <span style={{ fontSize: 18 }}>
                            {row.con_city}, {row.con_state},
                          </span>
                          <br />
                          <span style={{ fontSize: 18 }}>
                            {row.con_country !== null ? row.con_country : ""},
                            Tel: {row.con_tel}
                          </span>
                        </div>
                        <div style={{ borderTop: "1px solid #000" }}>
                          <div className="row">
                            <div className="col-md-8">
                              <div style={{ borderRight: "1px solid #000" }}>
                                <div className="row">
                                  <div className="col-md-6">
                                    <span style={{ fontSize: 13 }}>
                                      <b>VESSEL</b>
                                    </span>
                                    <br />
                                    <span style={{ fontSize: 17 }}>
                                      {row.vessel_name !== ""
                                        ? row.vessel_name
                                        : ""}
                                    </span>
                                  </div>
                                  <div className="col-md-6">
                                    <span style={{ fontSize: 13 }}>
                                      <b>VOYAGE</b>
                                    </span>
                                    <br />
                                    <span style={{ fontSize: 17 }}>
                                      {row.voyage_number !== ""
                                        ? row.voyage_number
                                        : ""}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <span style={{ fontSize: 13 }}>
                                <b>PORT OF LOADING</b>
                              </span>
                              <br />
                              <span style={{ fontSize: 17 }}>
                                {row.port_of_loading !== ""
                                  ? row.port_of_loading
                                  : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div style={{ borderTop: "1px solid #000" }}>
                          <div className="row">
                            <div className="col-md-12">
                              <div className="row">
                                <div
                                  className="col-md-7"
                                  style={{ borderRight: "1px solid #000" }}
                                >
                                  <span style={{ fontSize: 13 }}>
                                    <b>PORT OF DISCHARGE</b>
                                  </span>
                                  <br />
                                  <span style={{ fontSize: 17 }}>
                                    {row.port_of_discharge !== ""
                                      ? row.port_of_discharge
                                      : ""}
                                  </span>
                                </div>
                                <div className="col-md-5">
                                  <span style={{ fontSize: 13 }}>
                                    <b>PRE-CARRIAGE BY</b>
                                  </span>
                                  <br />
                                  <span style={{ fontSize: 17 }}>
                                    {row.carrier}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div style={{ borderTop: "1px solid #000" }}>
                          <div className="row">
                            <div className="col-md-12">
                              <div className="row">
                                <div
                                  className="col-md-6"
                                  style={{ borderRight: "1px solid #000" }}
                                >
                                  <span style={{ fontSize: 13 }}>
                                    <b>LOADING TERMINAL</b>
                                  </span>
                                  <br />
                                  <span style={{ fontSize: 17 }}>
                                    {row.loading_terminal !== ""
                                      ? row.loading_terminal
                                      : ""}
                                  </span>
                                </div>
                                <div className="col-md-6">
                                  <span style={{ fontSize: 13 }}>
                                    <b>ORIGINAL (S) TO BE RELEASED</b>
                                  </span>
                                  <br />
                                  <span style={{ fontSize: 17 }}>
                                    {row.originals_to_be_released}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div style={{ borderBottom: "1px solid #000" }}>
                          <div className="row">
                            <div className="col-md-12">
                              <div className="row">
                                <div
                                  className="col-md-6"
                                  style={{ borderRight: "1px solid #000" }}
                                >
                                  <span style={{ fontSize: 13 }}>
                                    <b>BOOKING #</b>
                                  </span>
                                  <br />
                                  <span style={{ fontSize: 18 }}>
                                    {row.booking_number !== ""
                                      ? row.booking_number
                                      : ""}
                                  </span>
                                </div>
                                <div className="col-md-6">
                                  <span style={{ fontSize: 13 }}>
                                    <b>FILE NUMBER</b>
                                  </span>
                                  <br />
                                  <span style={{ fontSize: 17 }}>
                                    OLD-E{row.id}SN{row.seal_number}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={{ borderBottom: "1px solid #000" }}>
                          <div className="row">
                            <div className="col-md-12">
                              <div className="row">
                                <div className="col-md-12">
                                  <span style={{ fontSize: 13 }}>
                                    <b>EXPORTER REFERENCES</b>
                                  </span>
                                  <br />
                                  <span style={{ fontSize: 17 }}>
                                    OLD-E{row.id}SN{row.seal_number}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div style={{ borderBottom: "1px solid #000" }}>
                          <div className="row">
                            <div className="col-md-12">
                              <div className="row">
                                <div
                                  className="col-md-8"
                                  style={{ borderRight: "1px solid #000" }}
                                >
                                  <span style={{ fontSize: 13 }}>
                                    <b>FORWARDING AGENT REFERENCES</b>
                                  </span>
                                  <br />
                                  <span style={{ fontSize: 17 }}>
                                    {row.forwarding_agent_references}
                                  </span>
                                </div>
                                <div className="col-md-4">
                                  <span style={{ fontSize: 13 }}>
                                    <b>PICK UP TERMINAL</b>
                                  </span>
                                  <br />
                                  <span style={{ fontSize: 17 }}>
                                    {row.pickup_terminal}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div style={{ borderBottom: "1px solid #000" }}>
                          <div className="row">
                            <div className="col-md-8">
                              <div style={{ borderRight: "1px solid #000" }}>
                                <div className="row">
                                  <div className="col-md-6">
                                    <span style={{ fontSize: 13 }}>
                                      <b>FOR TRANSHIPMENT TO</b>
                                    </span>
                                    <br />
                                    <span style={{ fontSize: 17 }}>
                                      {row.for_transhipment_to}
                                    </span>
                                  </div>
                                  <div
                                    className="col-md-6"
                                    style={{ borderLeft: "1px solid #000" }}
                                  >
                                    <span style={{ fontSize: 13 }}>
                                      <b>PLACE OF RECEIPT</b>
                                    </span>
                                    <br />
                                    <span style={{ fontSize: 17 }}>
                                      {row.place_of_receipt}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4" style={{ padding: 0 }}>
                              <span style={{ fontSize: 13 }}>
                                <b>TYPE OF MOVE</b>
                              </span>
                              <br />
                              <span style={{ fontSize: 17 }}>
                                {row.type_of_move}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div style={{ fontSize: 14 }}>
                          <b>NOTIFY PARTY / INTERMEDIATE CONSIGNEE</b>
                          <br />
                          <span>{row.notify_party_name}</span>
                          <br />
                          <span>
                            {row.notify_party_address}
                            <br />
                            {row.notify_party_country}
                          </span>
                          <br />
                        </div>
                        <div style={{ borderTop: "1px solid #000" }}>
                          <b style={{ fontSize: 14 }}>
                            POINT AND COUNTRY OF ORIGIN
                          </b>
                          <br />
                          <span style={{ fontSize: 25 }}>
                            {" "}
                            {row.point_and_country_of_origin === null
                              ? "USA"
                              : row.point_and_country_of_origin}{" "}
                          </span>
                          <br />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="row">
                    <div
                      className="col-md-2"
                      style={{ border: "1px solid #000" }}
                    >
                      <span style={{ fontSize: 13, fontWeight: "bold" }}>
                        MARKS&nbsp;AND&nbsp;NUMBERS
                      </span>
                    </div>
                    <div
                      className="col-md-6"
                      style={{ border: "1px solid #000" }}
                    >
                      <span
                        style={{ fontSize: 13, fontWeight: "bold", padding: 7 }}
                      >
                        DESCRIPTION OF PACKAGES AND GOODS IN SCHEDULE
                      </span>
                    </div>
                    <div
                      className="col-md-2"
                      style={{ border: "1px solid #000" }}
                    >
                      <span
                        style={{ fontSize: 13, fontWeight: "bold", padding: 7 }}
                      >
                        WEIGHT
                      </span>
                    </div>
                    <div
                      className="col-md-2"
                      style={{ border: "1px solid #000" }}
                    >
                      <span style={{ fontSize: 13, fontWeight: "bold" }}>
                        AES Value
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row" style={{ fontSize: 18 }}>
                  <div
                    className="col-md-2"
                    style={{ border: "1px solid #000" }}
                  >
                    <div className="row">
                      <div style={{ padding: 7 }}>
                        <b>
                          {" "}
                          {row.container_type === "container"
                            ? "CONTAINER #:"
                            : "FREIGHT:"}
                        </b>
                        <br />
                        <span style={{ fontSize: 18 }}>
                          {" "}
                          {row.container_type === "container"
                            ? row.container_number
                            : row.freight}{" "}
                        </span>
                        <br />
                        <br />
                        <b>
                          {row.container_type === "container"
                            ? "SEAL #"
                            : "IN TRANSIT"}{" "}
                          :
                        </b>
                        <span style={{ fontSize: 18 }}>
                          {row.container_type === "container"
                            ? row.seal_number
                            : row.in_transit}
                        </span>
                        <br />
                        <br />
                        <b>CUT OFF DATE</b>
                        <br />
                        {row.cut_off_date !== null
                          ? moment(row.cut_off_date).format("l")
                          : ""}{" "}
                        <br />
                        <br />
                        {row.container_type === "container" && (
                          <div>
                            <b>SAILING DATE</b>
                            <br />
                            {row.sail_date !== null
                              ? moment(row.sail_date).format("l")
                              : ""}{" "}
                            <br />
                          </div>
                        )}
                        <br />
                        <b>ARRIVAL DATE</b>
                        <br />
                        {row.arrival_date !== null
                          ? moment(row.arrival_date).format("l")
                          : ""}{" "}
                        <br />
                        <br />
                        {row.container_type !== "container" && (
                          <div>
                            <b>Unit: </b>
                            <span style={{ fontSize: 18 }}> {row.unit}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md-6"
                    style={{ border: "1px solid #000" }}
                  >
                    <div className="row">
                      <div style={{ padding: 7 }}>
                        <span style={{ fontSize: 20 }}>
                          {row.container_type === "container"
                            ? row.equipment_size
                            : "RORO CAR"}
                        </span>
                        <br />
                        <div
                          style={{ height: 388, fontSize: 19}}
                        >
                          {carRow.map((result, index) => (
                            <div key={index}>
                            <span >
                              <span>{result.details} </span>
                              <br />
                              <span>VIN: {result.vin.toUpperCase()} </span>
                              <br />
                              <br />
                            </span>
                            </div>
                          ))}
                          <div>
                            <p id="text_field">
                              {row.personal_effect !== null &&
                              row.personal_effect !== ""
                                ? row.personal_effect.toUpperCase()
                                : ""}
                            </p>
                          </div>
                          <div>AES#: {row.aes_number}</div>
                        </div>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <span style={{ fontSize: 19 }}>{row.demurrage}</span>
                        <br/>
                        <br />
                        <div style={{ fontSize: 16, marginLeft: 350 }}>
                          <span>
                            <b> Total Weight</b>
                            <br/>
                          </span>
                        </div>
                        <div style={{ float: "left", fontSize: 13 }}>
                          <span>
                            <b>
                              SHIPPER ON THIS DOCK RECEIPT CONFIRMS THAT, GAS
                              TANK
                            </b>
                          </span>
                          <br />
                          <span>
                            <b>
                              HAS BEEN DRAINED OFF FUEL, BATTERIES DISCONNECTED,
                            </b>
                          </span>
                          <br />
                          <span>
                            <b>
                              VEHICLES HAVE BEEN BLOCKED AND BRACED, CONTAINER
                              LOADED{" "}
                            </b>
                          </span>
                          <span>
                            <b>
                              IN ACCORDANCE TO GENERAL INTO IMDG CODE PARAGRAPH
                              12.3.7 & 17.7.7
                            </b>
                          </span>
                          <br />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md-2"
                    style={{ border: "1px solid #000" }}
                  >
                    <div className="row">
                      <div style={{ padding: 7 }}>
                        <div
                          style={{ marginTop: 5, height: 424, fontSize: 20 }}
                        >
                          {carRow.map((result, index) => (
                            <div style={{ textAlign: "left" }} key={index}>
                              <span>
                                <br />{" "}
                                <span>
                                  {" "}
                                  {result.weight === null
                                    ? ""
                                    : result.weight}{" "}
                                </span>
                              </span>
                              <br />
                              <br />
                            </div>
                          ))}
                          <div style={{ marginTop: 26 }}>
                            <span>{row.weight === null ? "" : row.weight}</span>
                          </div>
                        </div>
                        <div style={{ fontSize: 16,marginTop:10 }}>
                          <br />
                          <span>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <b>
                              {row.total_weight === null
                                ? ""
                                : row.total_weight + "kg"}
                            </b>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md-2"
                    style={{ border: "1px solid #000" }}
                  >
                    <div className="row">
                      <div style={{ paddingLeft: 7,fontSize: 19}}>
                        <div>
                          <br/>
                          <br/>
                          {carRow.map((result, index) => (
                            <div style={{ textAlign: "left" }} key={index}>
                              <span>
                                <span>
                                  {result.value_for_aes === ''
                                    ? ""
                                    :<><span>${result.value_for_aes}</span></> }
                                </span>
                                <br/>
                                <span> </span>
                                <br />
                                <br />
                              </span>
                            </div>
                          ))}

                          <br />
                        </div>
                        <span>
                          {row.value_for_aes === null ? "" : row.value_for_aes}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-5" style={{ fontSize: 15 }}>
                    <span><b>LIGHTER TRUCK _________________</b></span>
                    <br />
                    <br />
                    <span><b>ARRIVED DATE____________ TIME_______</b></span>
                    <br />
                    <br />
                    <span><b>UNLOADED DATE_______ TIME_____</b></span>
                    <br />
                    <br />
                    <span><b>CHECKED BY: ___________</b></span>
                  </div>
                  <div
                    className="col-md-7"
                    style={{ borderLeft: "1px solid #000", fontSize: 13 }}
                  >
                    <span>
                      <b>
                        RECEIVED THE ABOVE DESCRIBED GOODS OR PACKAGES SUBJECTED
                        TO ALL THE TERMS OF THE UNDERSIGNED'S REGULAR FORMS OF
                        DOCK RECEIPT AND BILL OF LADING WHICH SHALL CONSTITUTE
                        THE CONTRACT UNDER WHICH THE GOODS ARE RECEIVED.COPIES
                        OF WHICH ARE AVAILABLE FROM THE CARRIER ON REQUEST AND
                        MAY BE INSPECTED AT ANY OF ITS OFFICES.
                      </b>
                    </span>
                    <br />
                    <div className="row">
                      <div className="col-md-6">
                        <b>FOR THE MASTER</b>
                        <hr style={{ backgroundColor: "#000" }} />
                      </div>
                      <div className="col-md-6">
                        <b>RECEIVING CLERK</b>
                        <hr style={{ backgroundColor: "#000" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {displayBillOfLading && <BillOfLadingSection />}
            </div>
            <br />
            <br />
            {/* {!displayBillOfLading && (
              <div className={classes.root}>
                <ReactToPrint
                  trigger={() => (
                    <Button
                      variant="contained"
                      style={{ background: "#17a2b8", color: "white" }}
                    >
                      Generate Document
                    </Button>
                  )}
                  content={() => componentRef.current}
                  onAfterPrint={() => setEmailButtonHidden(false)}
                  documentTitle={`${row.customer_name}(NRA)`}
                />
                <Button
                  variant="contained"
                  style={{ background: "#28a745" }}
                  hidden={emailButtonHidden}
                >
                  Send Email
                </Button>

                <Button
                  variant="contained"
                  style={{ background: "#ffc107" }}
                  onClick={() => window.close()}
                >
                  Cancel
                </Button>
              </div>
            )} */}
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
        )}

        <script
          defer
          src="https://use.fontawesome.com/releases/v5.0.9/js/all.js"
          integrity="sha384-8iPTk2s/jMVj81dnzb/iFR2sdA7u06vHJyyLlAd4snFpCl/SnyUjRrbdJsw1pGIl"
          crossOrigin="anonymous"
        ></script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>

        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
      </body>
    </div>
  );
};

export default PrintNra;
