import React, { useState, useEffect } from "react";
import Head from "next/head";
import DashBoardComponent from "../components/DashBoardComponent";
import { getCookie } from "../utils/cookie";

export default function Home(): JSX.Element {

  return (
    <div>
      <Head>
        <title>Old sailors ocean shipping</title>
        <meta name="description" content="Old sailors shipping app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <DashBoardComponent />
      </main>
    </div>
  );
}
