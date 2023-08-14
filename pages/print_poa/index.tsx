import React, { useEffect, useState, useRef } from "react";
import { fetchToPrintNra } from "../../actions/poa_nra";
import { useRouter } from "next/router";
import { IPOANRA_Response } from "../../Types/poaNraTypes";
import moment from "moment";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ReactToPrint from "react-to-print";
import DraftsIcon from "@material-ui/icons/Drafts";
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
        <title>{row.customer_name}(POA)</title>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="/js/html2pdf.js"></script>
        <style jsx global>
          {`
            body {
              font-size: 17px;
            }
            .h_1 {
              width: 60%;

              float: left;
              font-size: 13px;
            }

            .h_2 {
              padding: 10px;
              width: 100%;

              border: 1px solid #000;
              float: right;
              font-size: 15px;
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
              text-align: left;
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
            <div className="header">
              <div className="row">
                <div className="col-md-6">
                  <div className="h_1">
                    <span style={{ paddingLeft: 5 }}>
                      - FILL OUT/LEGIBLE PRINT, SAVE AND THEN EMAIL OR PRINT/FAX
                    </span>
                    <table style={{ width: "100%" }}>
                      <tr>
                        <td>
                          <b>Date</b>
                        </td>
                        <td>{moment(row.date_added).format("l")}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Port Destination</b>
                        </td>
                        <td>{row.port_of_destination}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Carrier</b>
                        </td>
                        <td>{row.carrier}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Insurance</b>
                        </td>
                        <td>{row.insurance ? "Yes" : "No"}</td>
                      </tr>
                    </table>
                    <br />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="h_2">
                    <span>
                      <b>FMC/OTI LICENSE #:</b> 026435N
                    </span>
                    <br />
                    <span>
                      <b>Company Name:</b> OLDSAILORS OCEAN SHIPPING LLC
                    </span>
                    <br />
                    <span>
                      <b>Company address:</b> 13903 CHADSWORTH TERRACE, Laurel,
                      MD 20707, USA
                    </span>
                    <br />
                    <span>
                      <b>Tel:</b> 301-213-6961
                    </span>
                    <br />
                    <span>
                      <b>Fax:</b> 415-795-4544
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
            <p>
              <b>RESERVATION AND SHIPPING INSTRUCTIONS</b>
              <br />
              *If you select not to apply insurance, Oldsailors ocean Shipping
              will <b>NOT</b> be held responsible for any property damage or
              loss. To learn more about insuring your shipment, inquire in the
              office.
            </p>
            <table style={{ width: "100%" }}>
              <tr>
                <td colSpan={6}>
                  <b>FROM THE U.S. (YOU THE CUSTOMER)</b>
                </td>
              </tr>
              <tr>
                <td>
                  <b>SHIPPER'S NAME</b>
                </td>
                <td colSpan={6}>{row.customer_name}</td>
              </tr>
              <tr>
                <td>
                  <b>ADDRESS</b>
                </td>
                <td colSpan={6}>{row.cus_address}</td>
              </tr>
              <tr>
                <td>
                  <b>CITY</b>
                </td>

                <td> {row.cus_city !== null ? row.cus_city : ""}</td>
                <td style={{ textAlign: "center" }}>
                  <b>STATE</b>
                </td>
                <td>{row.cus_state !== null ? row.cus_state : ""}</td>
                <td style={{ textAlign: "center" }}>
                  <b>ZIP CODE</b>
                </td>
                <td>{row.cus_zipcode}</td>
              </tr>

              <tr>
                <td>
                  <b>TEL</b>
                </td>
                <td>{row.phone_number}</td>
                <td style={{ textAlign: "center" }}>
                  <b>Fax</b>
                </td>
                <td colSpan={6}></td>
              </tr>
              <tr>
                <td>
                  <b>E-MAIL</b>
                </td>
                <td colSpan={6}>{row.email}</td>
              </tr>
              <tr>
                <td>
                  <b>PASSPORT#</b>
                </td>
                <td colSpan={6}>{row.passport_number}</td>
              </tr>
              <tr>
                <td>
                  <b>Tax ID/EIN #</b>
                </td>
                <td colSpan={6}>{row.irs_tax_id}</td>
              </tr>
              <tr>
                <td>
                  <b>Type of shipment</b>
                </td>
                <td colSpan={6}>{row.type_of_shipment}</td>
              </tr>
              <tr>
                <td>
                  <b>Type of payment</b>
                </td>
                <td colSpan={6}>{row.type_of_payment}</td>
              </tr>
            </table>
            <p style={{ textAlign: "center", fontWeight: "bold" }}>
              I give my written authorization to OLDSAILORS OCEAN SHIPPING, LLC,
              to file aes on my behalf in connection with the described cargo
              herein
            </p>
            {row.con_name !== null && (
              <table style={{ width: "100%" }}>
                <tr>
                  <td colSpan={6}>
                    <b>
                      CONSIGNEE OVERSEAS (The person who shall be on the Bill of
                      Lading)
                    </b>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>NAME</b>
                  </td>
                  <td colSpan={6}>{row.con_name}</td>
                </tr>
                <tr>
                  <td>
                    <b>ADDRESS</b>
                  </td>
                  <td colSpan={6}>{row.con_address}</td>
                </tr>
                <tr>
                  <td>
                    <b>CITY</b>
                  </td>
                  <td>{row.con_city}</td>
                  <td style={{ textAlign: "center" }}>
                    <b>STATE/PROVINCE</b>
                  </td>
                  <td>{row.con_state}</td>
                  <td style={{ textAlign: "center" }}>
                    <b>ZIP CODE</b>
                  </td>
                  <td>{row.con_zip}</td>
                </tr>
                <tr>
                  <td>
                    <b>TEL</b>
                  </td>
                  <td colSpan={6}>{row.con_tel}</td>
                </tr>
                <tr>
                  <td>
                    <b>COUNTRY</b>
                  </td>
                  <td colSpan={6}>{row.con_country}</td>
                </tr>
                <tr>
                  <td>
                    <b>E-MAIL</b>
                  </td>
                  <td colSpan={6}>{row.con_email}</td>
                </tr>
              </table>
            )}
            <br />
            <h5 style={{ textAlign: "center" }}>EXPORT POWER OF ATTORNEY</h5>
            <p>
              <b>TO: UNITED STATES CUSTOMS & BORDER PROTECTION</b>
            </p>
            <p>
              <b>RE: EXPORTATION OF CARGO FROM THE UNITED STATES</b>
            </p>
            <p>
              <p>
                I{" "}
                <b>
                  <u>{row.customer_name}</u>
                </b>
                , authorize OLDSAILORS OCEAN SHIPPING LLC with FMC OTI
                number 026435N (Ocean Freight Forwarder Agent (hereafter Freight
                Forwarder)) having place of business at 13903 Chadsworth
                Terrace, Laurel, MD 20707, to act for and on his/her/its behalf
                as a true and lawful agent and attorney of the USPPI for and in
                the name, place and stead of the USPPI from this date, in
                writing, or electronically by email/attachment/text, fax,
                telephony, other standard/normal means to:
              </p>
              <p style={{ marginLeft: 40 }}>
                1.{" "}
                <span style={{ marginLeft: 20 }}>
                  Act as a Freight Forwarder for the purpose of booking and
                  facilitating the movement of cargo from inception to final
                  destination as provided per shipping instructions, booking
                  request, or routing plan.
                </span>
              </p>
              <p style={{ marginLeft: 40 }}>
                {" "}
                2.{" "}
                <span style={{ marginLeft: 20 }}>
                  Contract broker(s), insurance provider(s), freight
                  forwarder(s), non-vessel operating common carrier(s) (NVOCCs),
                  and/or carrier(s) to provide container(s) and/or move cargo
                  utilizing variety of shipping modes from seafaring ship(s),
                  airplane(s), railroad(s), truck(s), boat(s), delivery van(s),
                  and courier(s).
                </span>
              </p>
              <p style={{ marginLeft: 40 }}>
                3.{" "}
                <span style={{ marginLeft: 20 }}>
                  Prepare and/or file submitted documentation comprising of
                  commercial invoices, certificates, shipper's declaration,
                  shipping instructions, vehicle title(s), routing plan(s),
                  packing list(s), and other documents required by customs, port
                  and other regulatory bodies in country of export/ import
                  and/or transshipment, and carrier(s) to successfully deliver
                  cargo to final destination.
                </span>
              </p>
              <p style={{ marginLeft: 40 }}>
                4.{" "}
                <span style={{ marginLeft: 20 }}>
                  Facilitate the remittance of payment to/from and between all
                  broker(s), insurance providers, banks, NVOCCs, carrier(s),
                  transporter(s), government agencies and port authorities
                  relating to cargo.
                </span>
              </p>
              <p style={{ marginLeft: 40 }}>
                5.
                <span style={{ marginLeft: 20 }}>
                  {" "}
                  Receive compensation for providing consulting and/or Freight
                  Forwarding services.
                </span>
              </p>
              <p style={{ marginLeft: 40 }}>
                6.
                <span style={{ marginLeft: 20 }}>
                  {" "}
                  To prepare, sign, declare or swear to any shipper’s export
                  declaration required by law or regulations in connection with
                  the exportation of any commodity shipped by me.
                </span>
              </p>
              <p style={{ marginLeft: 40 }}>
                7.
                <span style={{ marginLeft: 20 }}>
                  {" "}
                  To do all the things necessary to ensure compliance with all
                  requirements pursuant to section 192 of the U.S. customs
                  regulations
                </span>
              </p>
              The USPPI hereby certifies that all information, statements, and
              instruments forming the documentation to be provided to Freight
              Forwarder pertinent to transactions will be true and correct.
              Furthermore, the USPPI understands that civil and criminal
              penalties may be imposed for making false or fraudulent statements
              or for the violation of any United States Law, regulations, or
              those of relevant countries. This POWER OF ATTORNEY will remain in
              full force and effect until revocation in writing is duly given by
              the USPPI and received by the Freight Forwarder.
            </p>
            <p>
              EXPORTER/SHIPPER NAME: <u>{row.customer_name}</u>
            </p>
            <p>
              ADDRESS:{" "}
              <u>
                {" "}
                {row.cus_address}, {row.cus_city !== null ? row.cus_city : ""},{" "}
                {row.cus_state !== null ? row.cus_state : ""}, {row.cus_zipcode}
              </u>
            </p>

            <p>
              <span style={{ float: "right" }}>
                Date: {moment(row.date_added).format("l")}
              </span>
              SHIPPER/EXPORTER SIGNATURE:
              <br /> <br />
              <hr style={{ border: "1px solid #000" }} />
            </p>

            <p style={{ textAlign: "center" }}>
              <b>OLDSAILORS OCEAN SHIPPING LLC, CUSTOMER’S AGREEMENT FORM</b>
            </p>
            <p>
              <b>ATTENTION:</b>{" "}
              <span style={{ textTransform: "lowercase" }}>
                IF YOUR CONTAINER ARRIVES AT ITS FINAL DESTINATION AND IT IS NOT
                PAID IN FULL, WE RESERVE THE RIGHT TO AUCTION THE CONTENTS TO
                PAY THE OCEAN FREIGHT.{" "}
              </span>
            </p>
            <p>
              <b>NOTICE TO SHIPPERS</b>
              <br />
            </p>
            <p>
              <b>
                Authorization to Prepare/Transmit Electronic Export Information
              </b>
              <br />
              <span>
                OLDSAILORS OCEAN SHIPPING LLC AND THEIR EMPLOYEES (“Agent”) is
                also to act as authorized Agent for US Census Bureau, CBP, and
                other regulatory purposes to prepare and transmit/file
                Electronic Export Information (“EEI”) that may be required by
                law or regulation in connection with the exportation or
                transportation of any goods on behalf of said U.S. Principal
                Party in Interest (“USPPI”). The USPPI certifies that necessary
                and proper documentation to accurately transmit the information
                electronically is and will be provided to said Agent. The USPPI
                further understands that civil and criminal penalties may be
                imposed for making false or fraudulent statements or the
                violation of any U.S. laws or regulations on exportation and
                agrees to be bound by all statements of said Agent based upon
                information or documentation provided by the USPPI to said Agent
                AND by so doing, agrees to indemnify and hold harmless the Agent
                of and from any and all claim(s), demand(s), loss(es),
                damage(s), cause(s) of action, lawsuit(s) whether direct or
                borne therefrom, judgment(s), fine(s) and/or penalty(ies),
                including attorneys’ fees and legal costs arising out of or
                relating to any violation of law, regulation, or injury to other
                party(ies) resulting from this authorization. This authorization
                shall remain in effect and applicable to future EEI preparations
                and filings associated with all export shipments from the date
                provided below that are either handled by, or arranged by Agent
                (through another Freight Forwarder, NVOCC, or Carrier) unless
                either party gives the other written notice of termination at
                least thirty (30) days prior to the date of such
                revocation/cancellation/annulment
              </span>
            </p>

            <p>
              <b>OTI Legal Disclaimer of Cargo Ownership</b>
              <br />
              <span>
                The shipper declare that I am/represent/act on behalf of the
                persons/entities owning all/portions of the cargo being shipped
                utilizing the services of OCEAN  SHIPPING  LLC   AND  THEIR
                 EMPLOYEES a licensed Ocean Transport Intermediary ( OTI ) I
                operating pursuant to the Shipping Act of 1984 as amended and
                all applicable United States laws, rules, and regulations. KNOW
                ALL MEN BY THESE PRESENTS that OTI is neither a business
                partner, stakeholder, shareholder, owner, possess any legal
                claim or title, vested or beneficial interest whatsoever to any
                portion of the cargo being shipped utilizing its professional
                services.
              </span>
            </p>

            <p>
              <b>Vehicle Stowage, Drain and Disconnect Attestation</b>
              <br />
              <span>
                I/(We) hereby certify that (1) the new/used vehicle(s) for the
                subject shipment have been properly stowed in the container in
                accordance with Title 49, US Code of Federal Regulations; and
                (2) the batteries have been disconnected, removed, or the
                battery terminals are insulated; and (3) the fuel tank(s) are
                completely drained and the used vehicles have been run until
                stalled for lack of fuel, unless the vehicle(s) use a fuel that
                has a flash point of 38 degrees Celsius or (100 degrees
                Fahrenheit) or higher (i.e. diesel), and have less than 5 liters
                (1.320 gal) of fuel in its tank(s) and there are no fuel leaks
                in any portion of the fuel system(s); and (4) US Customs must
                have access to physically verify VINS on autos; and (5) if your
                container is over packed, you run the risk of customs exam costs
                and will be responsible for any and all associated fees; and (6)
                you must allow space to access each auto's VIN plate. All VIN
                for all vehicles in the container have been disclosed above. US
                Law requires accurate description of hazardous shipments and
                violation of the hazardous materials regulations may result in
                civil and/or criminal liability. We agree to indemnify, defend
                and hold harmless, OLDSAILORS   OCEAN SHIPPING LLC   and LAND
                CARRIERS, their parent, predecessor, successors and affiliates
                and their officers, directors, shareholders, employees and
                agents from and against any damage, loss, fine, penalty, fee,
                expense, or liability of any type or kind whatsoever incurred or
                sustained by them, arising out of, based upon or relating to the
                carriage of the cargo set forth in this letter. It is our duty
                and responsibility to inform all of our customers Lloyds of
                London Insurance Company, who covers marine insurance, has
                established that 40” HC containers are designed to only suit 2
                vehicles. In their findings they concluded that should over two
                vehicles be loaded in a 40” HC container, such act shall be
                considered unsafe , unprofessional, and therefore not covered by
                the terms and conditions in case of claims for damage when
                reverse is case. As a consequence, oldsailors Ocean Shipping is
                likewise not responsible for any damage that may occur in cases
                where two or more vehicles are loaded in containers described
                herein. Oldsailors Ocean Shipping is bound by Lloyds of London
                Insurance Company’s policy and will only load more than two (2)
                vehicles in a container at the customer’s request and risk.
              </span>
            </p>
            <p>
              <b>RORO SHIPMENT</b>
              <br />
              <span>
                All RORO shipments should be delivered directly to the port of
                loading. Any RORO shipment that is delivered to the warehouse
                for customers own reason will be charged $35.00 handling and
                storage fee that may be in addition to flatbed service and ocean
                freight. oldsailors Ocean Shipping is not responsible for any
                damage or theft that may occur at the port of loading or port of
                destination.
              </span>
            </p>

            <p>
              <b>Freight payment Terms and Conditions</b>
              <br />
              <span>
                Freight payment must be paid in full at time of shipment or 50%
                of freight unless other agreements are reached. If payment is
                not received within 7 business days after cargo sailed, a late
                fee will be added to the freight payment depending on the
                shipping line, cargo may also be place on hold at port of
                destination. Should there be storage/demurrage charges accrued
                overseas because of non-payment or that payment wasn’t received
                timely as requested herein, Please be advised that Oldsailors
                Ocean Shipping may have no other alternative to exercise its
                lien rights to collect the ocean freight due on the cargo in any
                form it deems fit which may include the auction of cargo for the
                owed amount or take other lagal actions. Should Oldsailors
                Ocean, LLC collect more than the requested ocean freight,
                balance will be return to the shipper/consignee of record.In a
                situation where Oldsailors Ocean, LLC cannot auction the
                container to collect the ocean fright payment and other related
                charges, the shipper will be responsible for all this charges .
                Customers that fail to adhere to our payment terms stated herein
                are informed that should there arise cases that errors were
                discovered on their bill of laden after the vessel sails, any
                penalty that may occur at the country of destination will be the
                customer’s account. All customers are advised to proof read dock
                receipts, drafts and house bills of lading at the time of
                receipt to ensure accuracy.
              </span>
            </p>

            <p>
              <b>CONSOLIDATION CUSTOMERS</b>
              <br />
              <span>
                It is our policy that all consolidation payment (ocean freight
                and clearing fee) be fully paid at the time of shipment. If for
                any reason full payment could not be made during shipment, ocean
                freight from the US must be fully paid a week prior to the
                vessel estimated time of arrival at the country of destination.
                Customers are encouraged to adhere to this policy so we may
                better serve you. Failure to adhere to this policy may result in
                storage /demurrage fees been levy on those customers at the
                country of destination. As we intend to provide a better
                service, we also require our customer’s full cooperation to
                deliver that special service. Absence of our customer’s full
                cooperation may hinder our ability to better serve those
                customers.
              </span>
            </p>

            <p>
              <b>CUSTOMS CALL BACK</b>
              <br />
              <span>
                If you fail to provide accurate information or intentionally
                give any false information concerning your container or if you
                place any stolen property into your container you are liable for
                any charges, fees, fines and penalties associated. Furthermore,
                US Customs has the right to request an inspection of any
                container at any time. If customs for any reason requests an
                inspection of your container, you will be responsible for all
                charges including, but not limited to, storage fees, examination
                fees, fines, and penalties under United States laws and
                regulations.
              </span>
            </p>

            <p>
              <b>
                CARGO DESCRIPTION, WEIGHT, CARGO VALURE AND PIECES COUNT
                INCLUDING VALUES OF EACH CAR
              </b>
              <br />
              <span>
                The customer is required to provide Oldsailors Ocean Shipping
                with cargo description, weight, cargo value and pieces count
                including values of each car in the container for AES filling
                and customs purpose. We will provide the customer with a spread
                sheet of cargo description, weight, cargo value and piece count.
                If you fail to provide accurate information or intentionally
                give any false information concerning your container you are
                liable for any charges, fees, fines and penalties associated.
                Furthermore, US Customs has the right to request an inspection
                of any container at any time. If customs for any reason requests
                an inspection of your container, you will be responsible for all
                charges including, but not limited to, storage fees, examination
                fees, fines, and penalties under United States laws and
                regulations.
              </span>
            </p>

            <p>
              <b>POD REGULATIONS</b>
              <br />
              <span>
                Please note that you are responsible to fully understand the
                rules and regulations of the country to which you are shipping
                to. If you ship vehicles/goods that are not accepted by the
                country you will be held responsible for any and all charges,
                fees, fines and penalties associated.
              </span>
            </p>

            <p>
              I,{" "}
              <b>
                <u>{row.customer_name}</u>
              </b>
              ,have read, and understand the oldsailors Ocean Shipping, LLC
              customer agreement form. I accept all terms and conditions set
              forth herein and agree to adhere to all instructions By signing
              this document I am in agreement that if any charges in a monetary
              or legal matter present themselves in regards to my container, I
              will assume all liability
              <br />
            </p>

            <p>
              <span style={{ float: "right" }}>
                Date: {moment(row.date_added).format("l")}
              </span>
              SHIPPER/EXPORTER SIGNATURE:
              <br /> <br />
              <hr style={{ border: "1px solid #000" }} />
            </p>
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
              documentTitle={`${row.customer_name}(POA)`}
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
