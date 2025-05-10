import {useAuth} from "../context/AuthContext.jsx";
import {Navigate} from "react-router-dom";

export const ProtectedRoute = ({children}) => {
  const {user} = useAuth();

  if (!user) {
    return <Navigate to={"/"} replace/>;
  }

  return children;
}
