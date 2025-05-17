import {Fragment, useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {ButtonLoginLogout} from "./ButtonLoginLogout.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import {UserViewType} from "../enums/UserViewTypes.js";

export const Sidebar = ({asideClassName, onLoginClick, onLogout}) => {
  const location = useLocation();
  const [active, setActive] = useState(window.location.pathname)
  const {user} = useAuth()

  useEffect(() => {
    setActive(location.pathname)
  }, [location.pathname]);

  const sideBarItems = [
    {access: UserViewType.PublicView, name: "Home", path: "/"},
    {access: UserViewType.PublicView, name: "About", path: "/about"},
    {access: UserViewType.PublicView, name: "Contact", path: "/contact"},
    {access: UserViewType.AdminView, name: "Admin View", path: "/admin_view"},
    {access: UserViewType.AdminView, name: "Create Post", path: "/create_post"},
  ]

  const add_sidebar_item = (item) => {
    const isAdminAccess = item.access === UserViewType.AdminView;
    const hasUser = user !== undefined && user !== null;
    const hideItem = isAdminAccess && !hasUser;

    return (
      <li key={item.path} className={`sidebarItem ml-1 mb-2 hover:bg-gray-700 rounded ${hideItem ? "hidden" : ""}`}>
        <Link to={item.path}
              className={`block p-2 rounded transition ${
                active === item.path ? "bg-gray-700 text-white" : "hover:bg-gray-700"
              }`}>
          {item.name}
        </Link>
      </li>
    );
  }

  return (
    <Fragment>
      <aside className={`mt-0 pr-4 ${asideClassName}`}>
        <ul className={"w-full"}>
          {
            sideBarItems.map((item) => (add_sidebar_item(item)))
          }
        </ul>

        <ButtonLoginLogout user={user} onLogout={onLogout} onLoginClick={onLoginClick}/>

      </aside>
    </Fragment>
  )
}
