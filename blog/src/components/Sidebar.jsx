import {Fragment, useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";

export const Sidebar = ({asideClassName}) => {
  const location = useLocation();
  const [active, setActive] = useState(window.location.pathname)

  useEffect(() => {
    setActive(location.pathname)
  }, [location.pathname]);

  const sideBarItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ]

  return (
    <Fragment>
      <aside className={asideClassName}>
        <h2 className="text-lg font-bold">Justin Donohoe</h2>
        <ul>
          {
            sideBarItems.map((item) => (
              <li key={item.path} className='mt-2 hover:bg-gray-700 p-2 rounded '>
                <Link to={item.path}
                className={`block mt-2 p-2 rounded transition ${
                  active === item.path ? "bg-gray-700 text-white" : "hover:bg-gray-700"
                }`}>
                  {item.name}
                </Link>
              </li>
            ))

          }
        </ul>
      </aside>
    </Fragment>
  )
}
