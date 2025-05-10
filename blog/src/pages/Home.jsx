import {Fragment, useState} from "react";
import {SinglePageTemplate} from "../template/SinglePageTemplate.jsx";
import {TruncatedBlogCard} from "../components/TruncatedBlogCard.jsx";
import {usePosts} from "../hooks/posts.js";
import {PostDisplayModal} from "../modals/PostDisplayModal.jsx";

export const Home = () => {
  const [selectedPost, setSelectedPost] = useState(null)
  const [offset, setOffset] = useState(0)
  const limit = 10;
  const {
    data,
    isLoading,
    error
  } = usePosts({limit: limit, offset: offset});

  const handleNext = () => setOffset(prev => prev + limit);
  const handlePrev = () => setOffset(prev => Math.max(0, prev - limit));

  const posts = data?.posts;

  const content = () => {
    return (
      <Fragment>
        <main className="flex-1 p-6 rounded-tl-3xl h-auto min-h-fit contentContainer">
          <h1 className="text-2xl font-bold">Welcome to my blog</h1>
          <p>This blog is cataloging my work and hobbies</p>

          {isLoading && (<p>Loading...</p>)}
          {error && (<p>Error loading posts!</p>)}

          {posts?.length > 0 && (
            <div className={"w-full flex flex-col items-center"}>
              <div className={"w-full"}>
                {posts?.map(post => (
                  <button key={post.id}
                          onClick={() => setSelectedPost(post)}
                          className={"w-full text-left"}>
                    <TruncatedBlogCard
                      key={post.id}
                      title={post.title}
                      content={post.content}
                    />
                  </button>
                ))}
              </div>

              <div className={"w-1/2 inline-flex items-center justify-between"}>
                <button className={"bg-gray-400 rounded-md m-2 w-1/4 min-h-10"} type={"button"} onClick={handlePrev}
                        disabled={offset === 0}>Previous
                </button>
                <button className={"bg-gray-400 rounded-md m-2 w-1/4 min-h-10"} type={"button"} onClick={handleNext}
                        disabled={data?.posts.length < limit}>Next
                </button>
              </div>
            </div>
          )}
        </main>

        {selectedPost !== null && (
          <PostDisplayModal
            post={selectedPost}
            onClose={() => {
              setSelectedPost(null)
            }}
          />
        )}
      </Fragment>
    );
  };
  return <SinglePageTemplate content={content()}/>;
};
