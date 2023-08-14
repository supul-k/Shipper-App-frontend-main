import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { IBookingReceipt_Response } from "../../Types/bookingReceiptTypes";
import moment from "moment";
import { fetchToPrintBooking } from "../../actions/bookingReceipts";
import Head from "next/head";
import { Link } from "@material-ui/core";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { fetchtoPrintInvoice } from "../../actions/invoice";

const PrintInvoice = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [row, setRow] = useState<any>({} as any);
  const router = useRouter();
  const componentRef = useRef<HTMLDivElement>(null);
  //Print the Document

  const cancelTab = () => {
    window.open("about:blank", "_self");
    window.close();
  };
  useEffect(() => {
    const fetch = async () => {
      const id = router.query.id as unknown;
      const value = id as number;
      setIsLoading(true);
      const data: any = await fetchtoPrintInvoice(value);
      setIsLoading(false);
      setRow(data[0]);
    };
    fetch();
  }, []);
  return (
    <>
      <>
        <header>
          <title>{row.customer_name}(INVOICE)</title>
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
          <div id="element-to-print">
            <div className="container" ref={componentRef}>
              <div style={{ display: "inline-block" }}></div>
              <div style={{ display: "inline-block", float: "right" }}>
                <span style={{ fontSize: 30 }}>
                  <b> Invoice</b>
                </span>
                <br />
                <span style={{ fontSize: 12 }}>
                  Date: {moment(row.date_added).format("l")}
                </span>
              </div>

              <div className="header">
                <div className="row">
                  <div className="col-md-6">
                    <br />
                    <div className="h_2" style={{ fontSize: 16 }}>
                      <span>OLDSAILORS OCEAN SHIPPING LLC</span>
                      <br />
                      <span>
                        13903 CHADSWORTH TERRACE,
                        <br />
                        Laurel, MD 20707, USA
                      </span>
                      <br />
                      <span>
                        <b>Tel:</b> 301-213-6961
                      </span>
                      <br />
                      <span>
                        <b>Fax:</b> 301-281-4034
                      </span>
                      <br />
                      <span>
                        <b>Email:</b> info@oldsailorsshippingonline.com
                      </span>
                      <br />
                    </div>
                  </div>
                  <hr />
                </div>
              </div>

              <div className="row" style={{ marginTop: 20 }}>
                <div style={{ borderTop: "1px solid #000", width: "100%" }}>
                  <div className="row">
                    <div
                      className="col-md-6"
                      style={{ borderRight: "1px solid #000" }}
                    >
                      <div>
                        <b style={{ fontSize: 18 }}>SHIPPER/EXPORTER</b>
                        <br />
                        <div style={{ fontSize: 16 }}>
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

                      <div style={{ borderTop: "1px solid #000" }}>
                        <b style={{ fontSize: 16 }}>CLIENT</b>
                        <br />
                        <span style={{ fontSize: 17 }}>
                          {row.customer_name}
                        </span>
                        <br />
                        <span style={{ fontSize: 17 }}>
                          <span>
                            {row.address !== null ? row.address + "," : ""}
                          </span>
                        </span>
                        <span style={{ fontSize: 17 }}>
                          {row.city !== null ? row.city + "," : ""}
                          <span></span>
                        </span>
                        <span style={{ fontSize: 17 }}>
                          {row.state !== null ? row.state : ""}
                          <span></span>
                        </span>
                        <span style={{ fontSize: 17 }}>
                          <>
                            <br />
                            <span>
                              {row.zipcode !== null ? row.zipcode : ""}
                            </span>
                            <br />
                            Tel:
                            {row.phone_number !== null ? row.phone_number : ""}
                          </>
                        </span>
                        <br />
                        <span style={{ fontSize: 17 }}>Email:{row.email}</span>
                      </div>
                      <div
                        style={{ borderTop: "1px solid #000", marginTop: 20 }}
                      >
                        <div className="row">
                          <div className="col-md-6">
                            <div style={{ borderRight: "1px solid #000" }}>
                              <span style={{ fontSize: 17 }}>
                                <b>BILL OF LADING</b>
                              </span>
                              <br />
                              <span style={{ fontSize: 17 }}>
                                <b>BOOKING NUMBER</b>
                              </span>
                              <br />
                              <span style={{ fontSize: 17 }}>
                                <b>Container</b>
                              </span>

                              <br />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <span style={{ fontSize: 17 }}>
                              {row.booking_number !== null
                                ? row.booking_number
                                : ""}
                            </span>
                            <br />
                            <span style={{ fontSize: 17 }}>
                              {row.booking_number !== null
                                ? row.booking_number
                                : ""}
                            </span>
                            <br />
                            <span style={{ fontSize: 17 }}>
                              {row.container_number !== null
                                ? row.container_number
                                : ""}
                            </span>
                            <br />
                          </div>
                        </div>

                        <div
                          className="row"
                          style={{ borderTop: "1px solid #000" }}
                        >
                          <div className="col-md-6">
                            <div style={{ borderRight: "1px solid #000" }}>
                              <span style={{ fontSize: 17 }}>
                                <b>PORT OF DISCHARGE</b>
                              </span>
                              <br />
                              <span style={{ fontSize: 17 }}>
                                {row.port_of_discharge !== null
                                  ? row.port_of_discharge
                                  : ""}
                              </span>
                              <br />
                              <br />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <span style={{ fontSize: 17 }}>
                              <b>PORT OF LOADING</b>
                            </span>
                            <br />
                            <span style={{ fontSize: 17 }}>
                              {row.port_of_loading !== null
                                ? row.port_of_loading
                                : ""}
                            </span>
                            <br />
                          </div>
                        </div>

                        <div
                          className="row"
                          style={{ borderTop: "1px solid #000" }}
                        >
                          <div className="col-md-6">
                            <div style={{ borderRight: "1px solid #000" }}>
                              <span style={{ fontSize: 17 }}>
                                <b>OCEAN FREIGHT</b>
                              </span>
                              <br />
                              <span style={{ fontSize: 17 }}>
                                <b>TRUCKING</b>
                              </span>
                              <br />
                              <span style={{ fontSize: 17 }}>
                                <b>ECTN/BESC</b>
                              </span>
                              <br />
                              <br />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <span style={{ fontSize: 17 }}>
                              {row.ocean_freight !== "" &&
                              row.ocean_freight !== null ? (
                                <>
                                  {" "}
                                  <span>${row.ocean_freight}</span>
                                  <br />
                                </>
                              ) : (
                                <><br/></>
                              )}
                            </span>

                            <span style={{ fontSize: 17 }}>
                              {row.truck !== "" && row.truck !== null ? (
                                <>
                                  {" "}
                                  <span>${row.truck}</span>
                                  <br />
                                </>
                              ) : (
                                <><br/></>
                              )}
                            </span>

                            <span style={{ fontSize: 17 }}>
                              {row.ectn_besc !== "" &&
                              row.ectn_besc !== null ? (
                                <>
                                  {" "}
                                  <span>${row.ectn_besc}</span>
                                  <br />
                                </>
                              ) : (
                                ""
                              )}
                            </span>
                            <br />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <div style={{ borderRight: "1px solid #000" }}>
                              <span>
                                <b></b>
                              </span>
                              <br />
                              <span style={{ fontSize: 17 }}>
                                {row.label_1 !== "" && row.label_1 !== null ? (
                                  <>
                                    <b>{row.label_1}</b>
                                    <br />
                                  </>
                                ) : (
                                  ""
                                )}
                              </span>

                              <span style={{ fontSize: 17 }}>
                                {row.label_2 !== "" && row.label_2 !== null ? (
                                  <>
                                    <b>{row.label_2}</b>
                                    <br />
                                  </>
                                ) : (
                                  ""
                                )}
                              </span>
                              <span style={{ fontSize: 17 }}>
                                {row.label_3 !== "" && row.label_3 !== null ? (
                                  <>
                                    <b>{row.label_3}</b>
                                    <br />
                                  </>
                                ) : (
                                  ""
                                )}
                              </span>
                              <span style={{ fontSize: 17 }}>
                                {row.label_4 !== "" && row.label_4 !== null ? (
                                  <>
                                    <b>{row.label_4}</b>
                                    <br />
                                  </>
                                ) : (
                                  ""
                                )}
                              </span>
                              <span style={{ fontSize: 17 }}>
                                {row.label_5 !== "" && row.label_5 !== null ? (
                                  <>
                                    <b>{row.label_5}</b>
                                    <br />
                                  </>
                                ) : (
                                  ""
                                )}
                              </span>
                              <span style={{ fontSize: 17 }}>
                                {row.label_6 !== "" && row.label_6 !== null ? (
                                  <>
                                    <b>{row.label_6}</b>
                                    <br />
                                  </>
                                ) : (
                                  ""
                                )}
                              </span>
                              <br />
                              <span style={{ fontSize: 17 }}>
                                <b>INVOICE TOTAL</b>
                              </span>
                              <br />
                              <span style={{ fontSize: 17 }}>
                                <b>BALANCE DUE</b>
                              </span>
                              <br />
                              <br />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <span></span>
                            <br />
                            <span style={{ fontSize: 17 }}>
                              {row.label_1_value !== "" &&
                              row.label_1_value !== null ? (
                                <>
                                  {" "}
                                  <span>${row.label_1_value}</span>
                                  <br />
                                </>
                              ) : (
                                ""
                              )}
                            </span>
                            <span style={{ fontSize: 17 }}>
                              {row.label_2_value !== "" &&
                              row.label_2_value !== null ? (
                                <>
                                  {" "}
                                  <span>${row.label_2_value}</span>
                                  <br />
                                </>
                              ) : (
                                ""
                              )}
                            </span>
                            <span style={{ fontSize: 17 }}>
                              {row.label_3_value !== "" &&
                              row.label_3_value !== null ? (
                                <>
                                  {" "}
                                  <span>${row.label_3_value}</span>
                                  <br />
                                </>
                              ) : (
                                ""
                              )}
                            </span>

                            <span style={{ fontSize: 17 }}>
                              {row.label_4_value !== "" &&
                              row.label_4_value !== null ? (
                                <>
                                  {" "}
                                  <span>${row.label_4_value}</span>
                                  <br />
                                </>
                              ) : (
                                ""
                              )}
                            </span>

                            <span style={{ fontSize: 17 }}>
                              {row.label_5_value !== "" &&
                              row.label_5_value !== null ? (
                                <>
                                  {" "}
                                  <span>${row.label_5_value}</span>
                                  <br />
                                </>
                              ) : (
                                ""
                              )}
                            </span>

                            <span style={{ fontSize: 17 }}>
                              {row.label_6_value !== "" &&
                              row.label_6_value !== null ? (
                                <>
                                  {" "}
                                  <span>${row.label_6_value}</span>
                                  <br />
                                </>
                              ) : (
                                ""
                              )}
                            </span>
                            <br />
                            <span style={{ fontSize: 17 }}>
                              $
                              {row.invoice_total !== null
                                ? row.invoice_total
                                : "0"}
                            </span>
                            <br />
                            <span style={{ fontSize: 17 }}>
                              $
                              {row.balance_due !== null ? row.balance_due : "0"}
                            </span>
                            <br />
                          </div>
                        </div>
                      </div>
                      <div style={{ borderTop: "1px solid #000" }}>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="row"></div>
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
                                <span style={{ fontSize: 17 }}>
                                  <b>FILE NUMBER</b>
                                </span>
                                <br />
                                <span style={{ fontSize: 17 }}>
                                  OLD-C{row.customer_id}D{row.dock_receipt_id}IN
                                  {row.id}
                                </span>
                              </div>
                              <div className="col-md-6">
                                <span style={{ fontSize: 17 }}>
                                  <b>INVOICE NUMBER</b>
                                </span>
                                <br />
                                <span style={{ fontSize: 17 }}>
                                  OLD-C{row.customer_id}D{row.dock_receipt_id}IN
                                  {row.id}
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
                                <span style={{ fontSize: 16 }}>
                                  <b>POINT OF COUNTRY OF ORIGIN</b>
                                </span>
                                <br />
                                <span style={{ fontSize: 17 }}>
                                  {row.point_and_country_of_origin !== null
                                    ? row.point_and_country_of_origin
                                    : ""}
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
                                <span style={{ fontSize: 18, marginTop: 15 }}>
                                  <b>ACCOUNT INFO</b>
                                </span>
                                <br />
                                <div
                                  className="col-md-12"
                                  style={{
                                    justifyContent: "center",
                                    textAlign: "center",
                                  }}
                                >
                                  <span style={{ fontSize: 19 }}>
                                    <b>WELLS FARGO BANK</b>
                                  </span>
                                  <br />
                                  <br />
                                  <span style={{ fontSize: 17 }}>
                                    Routing# 055003201
                                  </span>
                                  <br />
                                  <span style={{ fontSize: 17 }}>
                                    Account#: 5804410420
                                  </span>
                                  <br />
                                  <span
                                    style={{ fontSize: 18, margin: "20px" }}
                                  >
                                    Please always send a picture of the deposit
                                    receipt or a scan copy to confirm your
                                    deposit.Thanks,and have a nice day.
                                  </span>
                                  <br />
                                  <br />
                                  <span style={{ fontSize: 17 }}>
                                    <b>Oldsailors Ocean shipping LLC</b>
                                  </span>
                                  <br />
                                  <span style={{ fontSize: 16 }}>
                                    <b>
                                      13903 CHADSWORTH TERRACE,LAUREL , MD
                                      20707, USA
                                    </b>
                                  </span>
                                  <br />
                                  <div
                                    style={{
                                      borderTop: "1px solid #000",
                                      margin: "20px",
                                    }}
                                  >
                                    <span>
                                      <b>
                                        UPON REQUEST, WE SHALL PROVIDE A
                                        DETAILED BREAKOUT OF THE COMPONENTS FOR
                                        ALL CHARGES ASSESSED AND A TRUE COPY OF
                                        EACH PERTINENT DOCUMENT RELATING TO THE
                                        CHARGES.
                                      </b>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-md-12"
                style={{ textAlign: "center", border: "3px solid #000" }}
              >
                <span>NOTE</span>
              </div>
              <div
                className="col-md-12"
                style={{ textAlign: "center", fontSize: 17 }}
              >
                <span>
                  An Original Version Of This Image, which Can Always Be
                  Generated Upon Request, Sets Forth Terms And Conditions Of
                  Service On The Reverse Side Of This Page. All Services
                  Provided Are Subject To These Terms And Conditions.
                </span>
              </div>
              <div
                style={{
                  marginTop: "20px",
                  border: "1px solid #000",
                  textAlign: "center",
                }}
              >
                <span>TERMS AND CONDITIONS</span>
              </div>
              <div className="row" style={{ lineHeight: 1.5 }}>
                <div
                  className="col-md-4"
                  style={{ textAlign: "center", border: "1px solid #000" }}
                >
                  <span>
                    <b>
                      MERCHANDISE RELEASED BY CUSTOMS IS DONE UNDER BOND AND
                      SUBJECT TO REDELIVERY TO CUSTOMS ON DEMAND FAILURE TO
                      RETURN MERCHANDISE MAKES THE IMPORTEE SUBJECT TO PENALTY
                      FOR FULL AMOUNT OF BOND
                    </b>
                  </span>
                </div>
                <div
                  className="col-md-4"
                  style={{ textAlign: "center", border: "1px solid #000" }}
                >
                  <span>
                    <b>
                      MERCHANDISE RELEASED BY CUSTOMS IS DONE UNDER BOND AND
                      SUBJECT TO REDELIVERY TO CUSTOMS ON DEMAND FAILURE TO
                      RETURN MERCHANDISE MAKES THE IMPORTEE SUBJECT TO PENALTY
                      FOR FULL AMOUNT OF BOND
                    </b>
                  </span>
                </div>
                <div
                  className="col-md-4"
                  style={{ textAlign: "center", border: "1px solid #000" }}
                >
                  <span>
                    <b>
                      FULL PAYMENT IS EXPECTED 5 DAYS AFTER VESSEL HAS
                      SAILED.ONLY THEN DOCUMENTS WILL BE RELEASED. FORM OF
                      PAYMENTS:CASH MONEY ORDER & BANK CERTIFIED CHECKS,WIRE
                      TRANSFERS
                    </b>
                  </span>
                </div>
              </div>
            </div>
            <div style={{ margin: "40px 200px" }}>
              <ReactToPrint
                trigger={() => (
                  <button
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
                  </button>
                )}
                pageStyle={
                  "@media print { body { -webkit-print-color-adjust: exact; } @page { size: A4; margin: 200mm !important }}"
                }
                content={() => componentRef.current}
              />
              {/* <button style={{margin:"10px",padding:"8px",borderRadius:"5px",backgroundColor:"#17a2b8",borderColor:"#17a2b8",color:"white",fontWeight:"bold"}} onClick={handlePrint}>Generate Document</button> */}
              <button
                style={{
                  margin: "10px",
                  padding: "8px 20px",
                  borderRadius: "5px",
                  backgroundColor: "#28a745",
                  borderColor: "#28a745",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  href={`mailto:tharindu@gmail.com`}
                >
                  E-mail
                </Link>
              </button>
              <button
                style={{
                  margin: "10px",
                  padding: "8px",
                  borderRadius: "5px",
                  backgroundColor: "#ffc107",
                  borderColor: "#ffc107",
                  color: "black",
                  fontWeight: "bold",
                }}
                onClick={cancelTab}
              >
                Cancel
              </button>
            </div>
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
      </>
    </>
  );
};

export default PrintInvoice;
