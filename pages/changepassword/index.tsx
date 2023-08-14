import React, { useState, useEffect } from "react";
import ProfileComponent from "../../components/ProfileComponent";
import { useRouter } from "next/router";

export default function Home(): JSX.Element {
  const router: any = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { session }: any = router.query;

  useEffect(() => {
    setIsLoading(true);
  }, []);
  return <div className="container">{isLoading && <ProfileComponent />}</div>;
}
