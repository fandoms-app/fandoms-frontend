import { useContext, useEffect } from "react";
import App from "./App";
import AuthContext from "./context/AuthContext";
import { setAuthContextUserSetter } from "./api/api";

export default function Root() {
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (auth) {
      setAuthContextUserSetter(auth.setUser);
    }
  }, [auth]);

  return <App />;
}
