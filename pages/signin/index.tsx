import React, { useState, useEffect } from "react";
import AuthComponent from "../../components/AuthComponent";
import { useRouter } from "next/router";

export default function Home(): JSX.Element {
  const router: any = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { session }: any = router.query;

  useEffect(() => {
    setIsLoading(true);
  }, []);
  return <div className="container">{isLoading && <AuthComponent queryParam={session} />}</div>;
}
