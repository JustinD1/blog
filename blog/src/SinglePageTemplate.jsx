import { Sidebar } from "./components/Sidebar.jsx";

export const SinglePageTemplate = ({ content }) => {
  return (
    <div className="flex h-screen">
      <Sidebar asideClassName={"w-64 bg-gray-800 text-white p-4"} />
      {content}
    </div>
  );
};
