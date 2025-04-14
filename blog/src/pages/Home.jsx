import {Fragment} from "react";
import {SinglePageTemplate} from "../template/SinglePageTemplate.jsx";
import {TruncatedBlogCard} from "../components/TruncatedBlogCard.jsx";

export const Home = () => {
  const elementBlogItems = () => {
    const cards = [
      { id: 0, title: "Post 1", content: "This is a test post" },
      { id: 1, title: "Post 2", content: "This is a test post" },
      { id: 2, title: "Post 3", content: "This is a test post" },
      { id: 3, title: "Post 4", content: "This is a test post" },
      { id: 4, title: "Post 5", content: "This is a test post" },
    ];
    return (
      <Fragment>
        {cards.map(item => (
          <TruncatedBlogCard key={item.id} title={item.title} content={item.content} />
        ))}
      </Fragment>
    )
  }
  const content = () => {
    return (
      <Fragment>
        <main className="flex-1 p-6 rounded-tl-3xl contentContainer">
          <h1 className="text-2xl font-bold">Welcome to my blog</h1>
          <p>This blog is cataloging my work and hobbies</p>

          {elementBlogItems()}
        </main>
      </Fragment>
    );
  };
  return <SinglePageTemplate content={content ()} />;
};
