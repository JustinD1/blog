import { Fragment } from "react";
import { SinglePageTemplate } from "../SinglePageTemplate.jsx";

export const Home = () => {
  const content = () => {
    return (
      <Fragment>
        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-bold">Welcome to my blog</h1>
          <p>This blog is cataloging my work and hobbies</p>
        </main>
      </Fragment>
    );
  };
  return <SinglePageTemplate content={content()} />;
};
