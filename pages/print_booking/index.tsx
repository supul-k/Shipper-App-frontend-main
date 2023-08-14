import React, { useEffect, useState, useRef } from "react";
import { fetchToPrintBooking } from "../../actions/bookingReceipts";
import { useRouter } from "next/router";
import { IBookingReceipt_Response } from "../../Types/bookingReceiptTypes";
import Head from "next/head";
import moment from "moment";
import { Button } from "semantic-ui-react";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { Link } from "@material-ui/core";

const PrintNra = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [row, setRow] = useState<any>({} as any);
  const router = useRouter();
  const componentRef = useRef<HTMLDivElement>(null);

  const cancelTab = () => {
    window.open("about:blank", "_self");
    window.close();
  };

  useEffect(() => {
    const fetch = async () => {
      const id = router.query.id as unknown;
      const value = id as number;
      setIsLoading(true);
      const data: any = await fetchToPrintBooking(value);
      setIsLoading(false);
      setRow(data);
    };
    fetch();
  }, []);
  return (
    <div>
      <div ref={componentRef}>
        <header>
          <title>{row.customer_name}(BC)</title>
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
          <div id="element-to-print">
            <div className="container">
              <div className="header">
                <div className="row">
                  <div className="col-md-6">
                    <div className="h_1">
                      <h4 style={{ paddingLeft: 5 }}>
                        <b>Booking Confirmation</b>
                      </h4>
                      <table style={{ width: "100%" }}>
                        <tr>
                          <td>
                            <b>File Number</b>
                          </td>
                          <td>FILFDH-{row.id}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Date</b>
                          </td>
                          <td>{moment(row.date_added).format("l")}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Carrier</b>
                          </td>
                          <td>{row.carrier}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Carrier Booking N.</b>
                          </td>
                          <td>{row.booking_number}</td>
                        </tr>
                      </table>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <br />
                    <div className="h_2">
                      <span>
                        <b>Company Name:</b> OLDSAILORS OCEAN SHIPPING LLC{" "}
                      </span>
                      <br />
                      <span>
                        <b>Company address:</b> 13903 CHADSWORTH
                        TERRACE,\nLaurel, MD 20707, USA
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
                </div>
              </div>
              <table style={{ width: "100%" }}>
                <tr>
                  <td>
                    <h5>
                      <b>SHIPPER</b>
                    </h5>
                    <span>{row.customer_name}</span>
                    <br />
                    <span>{row.cus_address},</span>
                    <span>{row.cus_city !== null ? row.cus_city : ""},</span>
                    <span>{row.cus_state !== null ? row.cus_state : ""},</span>
                    <span>{row.cus_zipcode},</span>
                    <span>United States</span>
                    <br />
                    <span>{row.phone_number}</span>
                    <br />
                    <span>{row.email}</span>
                    <br />
                  </td>
                  <td colSpan={6}>
                    <span>
                      <b>
                        SERVICE PROVIDER FOR
                        <br />
                        PRECARRIAGE
                      </b>
                    </span>
                    <br />
                    <br />
                    <span style={{ fontSize: 25, fontWeight: "lighter" }}>
                      {row.carrier}
                    </span>
                  </td>
                </tr>
              </table>

              <table style={{ width: "100%" }}>
                <tr>
                  <td>
                    <b>Cut Off Date</b>
                  </td>
                  <td>{moment(row.cut_off_date).format("l")}</td>
                  <td>
                    <b>Sailing/ETD</b>
                  </td>
                  <td>
                    {row.sail_date !== null
                      ? moment(row.sail_date).format("l")
                      : ""}
                  </td>
                  <td>
                    <b>Arrival/ETA</b>
                  </td>
                  <td>
                    {row.arrival_date !== null
                      ? moment(row.arrival_date).format("l")
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Pickup Terminal</b>
                  </td>
                  <td>{row.pickup_terminal}</td>
                  <td>
                    <b>Type of Move</b>
                  </td>
                  <td colSpan={3}>{row.type_of_move}</td>
                </tr>
                <tr>
                  <td>
                    <b>Place of Receipt</b>
                  </td>
                  <td>{row.place_of_receipt}</td>
                  <td>
                    <b>Port of Loading</b>
                  </td>
                  <td colSpan={3}>{row.port_of_loading}</td>
                </tr>
                <tr>
                  <td>
                    <b>Port of Discharge</b>
                  </td>
                  <td>{row.port_of_discharge}</td>
                  <td>
                    <b>Place of Delivery</b>
                  </td>
                  <td colSpan={3}>{row.place_of_delivery}</td>
                </tr>
                <tr>
                  <td>
                    <b>Vessel</b>
                  </td>
                  <td>{row.vessel_name}</td>
                  <td style={{ textAlign: "center" }}>
                    <b>Voyage</b>
                  </td>
                  <td colSpan={3}>{row.voyage_number}</td>
                </tr>
                <tr>
                  <td>
                    <b>
                      Total N. Of Container <br /> & Equiqment size
                    </b>
                  </td>
                  <td>
                    {row.total_no_of_containers},<br />
                    {row.equipment_size}
                  </td>
                  <td>
                    <b>
                      Commodity <br />& Description of Goods
                    </b>
                  </td>
                  <td colSpan={3}>{row.commodity}</td>
                </tr>
                <tr>
                  <td>
                    <b>RATE</b>
                  </td>
                  <td>{row.rate}</td>
                  <td>
                    <b>Notes</b>
                  </td>
                  <td colSpan={3}>{row.notes}</td>
                </tr>
              </table>
              <span>
                Container Needs To Return To The Port 5 Days From Delivery,after
                Per Diem Charges Of $135/ Day Applies. Once The Container Is
                Loaded Please Provide Us With Container #, Seal #, Pieces Count
                & Weight
              </span>
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
          content={() => componentRef.current}
        />
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
            href={`mailto:${row.email}`}
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
  );
};

export default PrintNra;
