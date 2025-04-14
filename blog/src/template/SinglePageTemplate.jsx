import {Sidebar} from "../components/Sidebar.jsx";
import {Fragment, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {ModelLogin} from "../components/ModelLogin.jsx";

export const SinglePageTemplate = ({ content }) => {
  const {login, logout} = useAuth()
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    console.log("Login success:", userData);
    if (userData)
    {
      setUser(userData?.forename);
      login(userData, userData?.token)
    }
    setShowLogin(false);
  };

  const handleLogout = () => {
    setShowLogin(false);
    logout()
  };

  return (
    <Fragment>
      <h1 className="pl-1 mb-3 text-4xl font-bold">Justin Donohoe</h1>
      <div className="flex h-screen">
      <Sidebar asideClassName={"w-64 text-white"}
               user={user}
               onLogout={handleLogout}
               onLoginClick={()=>setShowLogin(true)}/>
      {content}
      </div>

    {showLogin && (
       <ModelLogin onClose={handleLoginSuccess}/>
    )}
    </Fragment>
  );
};
