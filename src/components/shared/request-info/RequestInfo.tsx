import { useEffect, useState } from "react";
import { tesloApi } from "../../../api/tesloApi";

export const RequestInfo = () => {
  const [requestInfo, setRequestInfo] = useState<unknown>();

  useEffect(() => {
    tesloApi
      .get("/auth/private")
      .then((response) => {
        setRequestInfo(response.data);
      })
      .catch((error) => {
        setRequestInfo(error.response.data);
      });
  }, []);

  return (
    <>
      <h2>Informacion</h2>
      <pre>{JSON.stringify(requestInfo, null, 2)}</pre>
    </>
  );
};
