import {Fragment, useEffect} from "react";
import {SinglePageTemplate} from "../template/SinglePageTemplate.jsx";
import {TruncatedBlogCard} from "../components/TruncatedBlogCard.jsx";
import {usePosts} from "../hooks/posts.js";

export const Home = () => {
    const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = usePosts({limit: 10});

  const posts = data?.pages?.flatMap(page => page.posts);

    useEffect(() => {
      console.log(data)
    }, [data])

  const content = () => {
    return (
      <Fragment>
        <main className="flex-1 p-6 rounded-tl-3xl contentContainer">
          <h1 className="text-2xl font-bold">Welcome to my blog</h1>
          <p>This blog is cataloging my work and hobbies</p>

          {isLoading && (<p>Loading...</p>)}
          {error && (<p>Error loading posts!</p>)}

          {posts?.length > 0 && (
            <div className={"w-full"}>
              {posts?.map(post => (
                <TruncatedBlogCard
                  key={post.id}
                  title={post.title}
                  content={post.content}
                />
              ))}
            </div>)}

          {hasNextPage && (
            <button
              onClick={() => fetchNextPage ()}
              disabled={isFetchingNextPage}
              className={"load-more-button"}>
              {isFetchingNextPage ? "Loading..." : "Next"}
            </button>
          )}
        </main>
      </Fragment>
    );
  };
  return <SinglePageTemplate content={content ()} />;
};
