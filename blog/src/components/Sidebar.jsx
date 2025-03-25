import {Fragment} from "react";

export const Sidebar = ({asideClassName}) => {

  return (
    <Fragment>
      <aside className={asideClassName}>
        <h2 className="text-lg font-bold">Justin Donohoe</h2>
        <ul>
          <li className="mt-2 hover:bg-gray-700 p-2 rounded">Home</li>
          <li className="mt-2 hover:bg-gray-700 p-2 rounded">About</li>
          <li className="mt-2 hover:bg-gray-700 p-2 rounded">Contact</li>
        </ul>
      </aside>
    </Fragment>
  )
}
